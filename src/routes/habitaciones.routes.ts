import { Router } from 'express';
import type { Request, Response } from 'express';
import { getHabitacionRepository, getRegistroRepository } from '../database/data-source';

const router = Router();

// GET - Listar todas las habitaciones
router.get('/', async (req: Request, res: Response) => {
    try {
        const habitacionRepo = getHabitacionRepository();
        const habitaciones = await habitacionRepo.find();
        res.json(habitaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar habitaciones' });
    }
});

// GET - Obtener una habitación por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const habitacionRepo = getHabitacionRepository();
        const habitacion = await habitacionRepo.findOneBy({ id });

        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        res.json(habitacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener habitación' });
    }
});

// POST - Crear una nueva habitación
router.post('/', async (req: Request, res: Response) => {
    try {
        const { tipo_habitacion, piso } = req.body;

        if (!tipo_habitacion || piso === undefined) {
            return res.status(400).json({ error: 'tipo_habitacion y piso son requeridos' });
        }

        const tipos = ['simple', 'doble', 'ejecutiva'];

        if (!tipos.includes(tipo_habitacion.toLowerCase())) {
            return res.status(400).json({
                error: `tipo_habitacion inválido. Valores permitidos: ${tipos.join(', ')}`,
            });
        }

        const habitacionRepo = getHabitacionRepository();

        // Validar máximo 8 habitaciones por piso
        const habitacionesPiso = await habitacionRepo.countBy({ piso });

        if (habitacionesPiso >= 8) {
            return res.status(400).json({
                error: 'No se pueden crear más de 8 habitaciones por piso',
            });
        }

        const habitacion = habitacionRepo.create({ tipo_habitacion, piso });
        const resultado = await habitacionRepo.save(habitacion);

        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear habitación' });
    }
});

// PUT - Actualizar una habitación
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const { tipo_habitacion, piso } = req.body;

        if (!tipo_habitacion || piso === undefined) {
            return res.status(400).json({ error: 'tipo_habitacion y piso son requeridos' });
        }

        const habitacionRepo = getHabitacionRepository();

        // Verificar si existe
        const existe = await habitacionRepo.findOneBy({ id });
        if (!existe) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Si cambia de piso, validar máximo 8 habitaciones en el nuevo piso
        if (existe.piso !== piso) {
            const habitacionesPiso = await habitacionRepo.countBy({ piso });

            if (habitacionesPiso >= 8) {
                return res.status(400).json({
                    error: 'No se pueden tener más de 8 habitaciones por piso',
                });
            }
        }

        existe.tipo_habitacion = tipo_habitacion;
        existe.piso = piso;
        const habitacion = await habitacionRepo.save(existe);

        res.json(habitacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar habitación' });
    }
});

// DELETE - Eliminar una habitación
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const habitacionRepo = getHabitacionRepository();
        const registroRepo = getRegistroRepository();

        const existe = await habitacionRepo.findOneBy({ id });
        if (!existe) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Eliminar el registro asociado si existe
        const registroAsociado = await registroRepo.findOneBy({ habitacion_id: id });
        if (registroAsociado) {
            await registroRepo.remove(registroAsociado);
        }

        await habitacionRepo.remove(existe);
        res.json({ message: 'Habitación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar habitación' });
    }
});

export default router;
