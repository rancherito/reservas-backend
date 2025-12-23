import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/database";
import type { Usuario } from "../types/types";

const router = Router();

// GET - Listar todos los usuarios
router.get("/", (req: Request, res: Response) => {
  try {
    const usuarios = db.query("SELECT * FROM usuarios").all();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
});

// GET - Obtener un usuario por ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");
    const usuario = db
      .query("SELECT * FROM usuarios WHERE id = ?")
      .get(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// POST - Crear un nuevo usuario
router.post("/", (req: Request, res: Response) => {
  try {
    const { nombres, primer_apellido, segundo_apellido, dni } = req.body;

    // Validar campos requeridos
    if (!nombres || !primer_apellido || !segundo_apellido || !dni) {
      return res.status(400).json({
        error: "Todos los campos son requeridos: nombres, primer_apellido, segundo_apellido, dni"
      });
    }

    // Validar si el DNI ya existe
    const usuarioExiste = db.query(
      "SELECT * FROM usuarios WHERE dni = ?"
    ).get(dni);

    if (usuarioExiste) {
      return res.status(400).json({
        error: "Ya existe un usuario registrado con este DNI"
      });
    }

    // Crear el usuario
    const query = db.query(
      "INSERT INTO usuarios (nombres, primer_apellido, segundo_apellido, dni) VALUES (?, ?, ?, ?) RETURNING *"
    );
    const usuario = query.get(nombres, primer_apellido, segundo_apellido, dni);

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// PUT - Actualizar un usuario
router.put("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");
    const { nombres, primer_apellido, segundo_apellido, dni } = req.body;

    // Validar campos requeridos
    if (!nombres || !primer_apellido || !segundo_apellido || !dni) {
      return res.status(400).json({
        error: "Todos los campos son requeridos: nombres, primer_apellido, segundo_apellido, dni"
      });
    }

    // Verificar si el usuario existe
    const existe = db.query("SELECT * FROM usuarios WHERE id = ?").get(id);
    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validar si el DNI ya existe en otro usuario
    const dniExiste = db.query(
      "SELECT * FROM usuarios WHERE dni = ? AND id != ?"
    ).get(dni, id);

    if (dniExiste) {
      return res.status(400).json({
        error: "Ya existe otro usuario registrado con este DNI"
      });
    }

    // Actualizar el usuario
    db.query(
      "UPDATE usuarios SET nombres = ?, primer_apellido = ?, segundo_apellido = ?, dni = ? WHERE id = ?"
    ).run(nombres, primer_apellido, segundo_apellido, dni, id);

    const usuario = db.query("SELECT * FROM usuarios WHERE id = ?").get(id);
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// DELETE - Eliminar un usuario
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");

    const existe = db.query("SELECT * FROM usuarios WHERE id = ?").get(id);
    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    db.query("DELETE FROM usuarios WHERE id = ?").run(id);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
