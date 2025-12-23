import { Router } from 'express';
import type { Request, Response } from 'express';
import { Not } from 'typeorm';
import { getUsuarioRepository } from '../database/data-source';

const router = Router();

// GET - Listar todos los usuarios
router.get('/', async (req: Request, res: Response) => {
    try {
        const usuarioRepo = getUsuarioRepository();
        const usuarios = await usuarioRepo.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar usuarios' });
    }
});

// GET - Obtener un usuario por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const usuarioRepo = getUsuarioRepository();
        const usuario = await usuarioRepo.findOneBy({ id });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// POST - Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombres, primer_apellido, segundo_apellido, dni } = req.body;

        // Validar campos requeridos
        if (!nombres || !primer_apellido || !segundo_apellido || !dni) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos: nombres, primer_apellido, segundo_apellido, dni',
            });
        }

        const usuarioRepo = getUsuarioRepository();

        // Validar si el DNI ya existe
        const usuarioExiste = await usuarioRepo.findOneBy({ dni });

        if (usuarioExiste) {
            return res.status(400).json({
                error: 'Ya existe un usuario registrado con este DNI',
            });
        }

        // Crear el usuario
        const usuario = usuarioRepo.create({
            nombres,
            primer_apellido,
            segundo_apellido,
            dni,
        });
        const resultado = await usuarioRepo.save(usuario);

        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// PUT - Actualizar un usuario
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const { nombres, primer_apellido, segundo_apellido, dni } = req.body;

        // Validar campos requeridos
        if (!nombres || !primer_apellido || !segundo_apellido || !dni) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos: nombres, primer_apellido, segundo_apellido, dni',
            });
        }

        const usuarioRepo = getUsuarioRepository();

        // Verificar si el usuario existe
        const existe = await usuarioRepo.findOneBy({ id });
        if (!existe) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Validar si el DNI ya existe en otro usuario
        const dniExiste = await usuarioRepo.findOneBy({
            dni,
            id: Not(id),
        });

        if (dniExiste) {
            return res.status(400).json({
                error: 'Ya existe otro usuario registrado con este DNI',
            });
        }

        // Actualizar el usuario
        existe.nombres = nombres;
        existe.primer_apellido = primer_apellido;
        existe.segundo_apellido = segundo_apellido;
        existe.dni = dni;
        const usuario = await usuarioRepo.save(existe);

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE - Eliminar un usuario
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const usuarioRepo = getUsuarioRepository();

        const existe = await usuarioRepo.findOneBy({ id });
        if (!existe) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuarioRepo.remove(existe);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

export default router;
