import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/database";
import type { Habitacion } from "../types/types";

const router = Router();

// GET - Listar todas las habitaciones
router.get("/", (req: Request, res: Response) => {
  try {
    const habitaciones = db.query("SELECT * FROM habitaciones").all();
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al listar habitaciones" });
  }
});

// GET - Obtener una habitación por ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");
    const habitacion = db
      .query("SELECT * FROM habitaciones WHERE id = ?")
      .get(id);

    if (!habitacion) {
      return res.status(404).json({ error: "Habitación no encontrada" });
    }

    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener habitación" });
  }
});

// POST - Crear una nueva habitación
router.post("/", (req: Request, res: Response) => {
  try {
    const { tipo_habitacion, piso } = req.body;

    if (!tipo_habitacion || piso === undefined) {
      return res
        .status(400)
        .json({ error: "tipo_habitacion y piso son requeridos" });
    }
    const tipos = ["simple", "doble", "ejecutiva"];

    if (!tipos.includes(tipo_habitacion.toLowerCase())) {
      return res.status(400).json({
        error: `tipo_habitacion inválido. Valores permitidos: ${tipos.join(", ")}`,
      });
    }

    // Validar máximo 8 habitaciones por piso
    const habitacionesPiso = db.query(
      "SELECT COUNT(*) as total FROM habitaciones WHERE piso = ?"
    ).get(piso) as { total: number };

    if (habitacionesPiso.total >= 8) {
      return res.status(400).json({
        error: "No se pueden crear más de 8 habitaciones por piso"
      });
    }

    const query = db.query(
      "INSERT INTO habitaciones (tipo_habitacion, piso) VALUES (?, ?) RETURNING *",
    );
    const habitacion = query.get(tipo_habitacion, piso);

    res.status(201).json(habitacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear habitación" });
  }
});

// PUT - Actualizar una habitación
router.put("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");
    const { tipo_habitacion, piso } = req.body;

    if (!tipo_habitacion || piso === undefined) {
      return res
        .status(400)
        .json({ error: "tipo_habitacion y piso son requeridos" });
    }

    // Verificar si existe
    const existe = db.query("SELECT * FROM habitaciones WHERE id = ?").get(id) as Habitacion | undefined;
    if (!existe) {
      return res.status(404).json({ error: "Habitación no encontrada" });
    }

    // Si cambia de piso, validar máximo 8 habitaciones en el nuevo piso
    if (existe.piso !== piso) {
      const habitacionesPiso = db.query(
        "SELECT COUNT(*) as total FROM habitaciones WHERE piso = ?"
      ).get(piso) as { total: number };

      if (habitacionesPiso.total >= 8) {
        return res.status(400).json({
          error: "No se pueden tener más de 8 habitaciones por piso"
        });
      }
    }

    db.query(
      "UPDATE habitaciones SET tipo_habitacion = ?, piso = ? WHERE id = ?",
    ).run(tipo_habitacion, piso, id);

    const habitacion = db
      .query("SELECT * FROM habitaciones WHERE id = ?")
      .get(id);
    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar habitación" });
  }
});

// DELETE - Eliminar una habitación
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || "0");

    const existe = db.query("SELECT * FROM habitaciones WHERE id = ?").get(id);
    if (!existe) {
      return res.status(404).json({ error: "Habitación no encontrada" });
    }

    db.query("DELETE FROM habitaciones WHERE id = ?").run(id);
    res.json({ message: "Habitación eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar habitación" });
  }
});

export default router;
