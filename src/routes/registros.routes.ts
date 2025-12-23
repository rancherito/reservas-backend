import { Router } from 'express';
import type { Request, Response } from 'express';
import { getHabitacionRepository, getUsuarioRepository, getRegistroRepository } from '../database/data-source';

const router = Router();

// GET - Listar todos los registros con LEFT JOIN
router.get('/', async (req: Request, res: Response) => {
    try {
        const habitacionRepo = getHabitacionRepository();
        const registroRepo = getRegistroRepository();

        // Obtener todas las habitaciones
        const habitaciones = await habitacionRepo.find();

        if (habitaciones.length === 0) return res.status(200).json([]);

        // Obtener todos los registros con relaciones
        const registros = await registroRepo.find({
            relations: ['habitacion', 'usuario'],
        });

        // Crear un mapa de registros por habitacion_id
        const registroMap = new Map(registros.map(r => [r.habitacion_id, r]));

        // Construir respuesta con emulación de registros libres
        const resultado = habitaciones.map(hab => {
            const registro = registroMap.get(hab.id);

            if (!registro) {
                // No hay registro, emular estado libre
                return {
                    id: null,
                    habitacion_id: hab.id,
                    usuario_id: null,
                    estado: 0,
                    fecha_registro: null,
                    habitacion: {
                        id: hab.id,
                        tipo_habitacion: hab.tipo_habitacion,
                        piso: hab.piso,
                    },
                    usuario: null,
                };
            } else {
                // Hay registro
                return {
                    id: registro.id,
                    habitacion_id: registro.habitacion_id,
                    usuario_id: registro.usuario_id,
                    estado: registro.estado,
                    fecha_registro: registro.fecha_registro,
                    habitacion: {
                        id: hab.id,
                        tipo_habitacion: hab.tipo_habitacion,
                        piso: hab.piso,
                    },
                    usuario: registro.usuario
                        ? {
                              id: registro.usuario.id,
                              nombres: registro.usuario.nombres,
                              primer_apellido: registro.usuario.primer_apellido,
                              segundo_apellido: registro.usuario.segundo_apellido,
                              dni: registro.usuario.dni,
                          }
                        : null,
                };
            }
        });

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al listar registros' });
    }
});

// GET - Obtener un registro por ID de habitación con LEFT JOIN
router.get('/habitacion/:habitacionId', async (req: Request, res: Response) => {
    try {
        const habitacionId = parseInt(req.params.habitacionId || '0');
        const habitacionRepo = getHabitacionRepository();
        const registroRepo = getRegistroRepository();

        // Verificar que la habitación existe
        const habitacion = await habitacionRepo.findOneBy({ id: habitacionId });

        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Buscar el registro con relaciones
        const registro = await registroRepo.findOne({
            where: { habitacion_id: habitacionId },
            relations: ['usuario'],
        });

        if (!registro) {
            // No hay registro, emular estado libre
            const resultado = {
                id: null,
                habitacion_id: habitacion.id,
                usuario_id: null,
                estado: 0,
                fecha_registro: null,
                habitacion: {
                    id: habitacion.id,
                    tipo_habitacion: habitacion.tipo_habitacion,
                    piso: habitacion.piso,
                },
                usuario: null,
            };
            return res.json(resultado);
        } else {
            // Hay registro
            const resultado = {
                id: registro.id,
                habitacion_id: registro.habitacion_id,
                usuario_id: registro.usuario_id,
                estado: registro.estado,
                fecha_registro: registro.fecha_registro,
                habitacion: {
                    id: habitacion.id,
                    tipo_habitacion: habitacion.tipo_habitacion,
                    piso: habitacion.piso,
                },
                usuario: registro.usuario
                    ? {
                          id: registro.usuario.id,
                          nombres: registro.usuario.nombres,
                          primer_apellido: registro.usuario.primer_apellido,
                          segundo_apellido: registro.usuario.segundo_apellido,
                          dni: registro.usuario.dni,
                      }
                    : null,
            };
            return res.json(resultado);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener registro' });
    }
});

// POST - Crear un nuevo registro
router.post('/', async (req: Request, res: Response) => {
    try {
        const { habitacion_id, usuario_id, estado } = req.body;

        // Validaciones
        if (!habitacion_id || estado === undefined) {
            return res.status(400).json({
                error: 'habitacion_id y estado son requeridos',
            });
        }

        // Validar estado (0, 1, 2)
        if (![0, 1, 2].includes(estado)) {
            return res.status(400).json({
                error: 'Estado inválido. Valores permitidos: 0 (libre), 1 (reservado), 2 (ocupado)',
            });
        }

        const habitacionRepo = getHabitacionRepository();
        const usuarioRepo = getUsuarioRepository();
        const registroRepo = getRegistroRepository();

        // Validar que la habitación existe
        const habitacion = await habitacionRepo.findOneBy({ id: habitacion_id });
        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Validar que no exista ya un registro para esta habitación
        const registroExiste = await registroRepo.findOneBy({ habitacion_id });
        if (registroExiste) {
            return res.status(400).json({
                error: 'Ya existe un registro para esta habitación. Use PUT para actualizar.',
            });
        }

        // Si hay usuario_id, validar que existe
        if (usuario_id !== null && usuario_id !== undefined) {
            const usuario = await usuarioRepo.findOneBy({ id: usuario_id });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        }

        // Crear registro con fecha actual en UTC
        const fecha_registro = new Date().toISOString();
        const registro = registroRepo.create({
            habitacion_id,
            usuario_id: usuario_id || null,
            estado,
            fecha_registro,
        });
        const resultado = await registroRepo.save(registro);

        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear registro' });
    }
});

// PUT - Actualizar un registro
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || '0');
        const { usuario_id, estado } = req.body;

        if (estado === undefined) {
            return res.status(400).json({ error: 'estado es requerido' });
        }

        // Validar estado (0, 1, 2)
        if (![0, 1, 2].includes(estado)) {
            return res.status(400).json({
                error: 'Estado inválido. Valores permitidos: 0 (libre), 1 (reservado), 2 (ocupado)',
            });
        }

        const usuarioRepo = getUsuarioRepository();
        const registroRepo = getRegistroRepository();

        // Verificar que el registro existe
        const existe = await registroRepo.findOneBy({ id });
        if (!existe) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        // Si hay usuario_id, validar que existe
        if (usuario_id !== null && usuario_id !== undefined) {
            const usuario = await usuarioRepo.findOneBy({ id: usuario_id });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        }

        // Actualizar registro con nueva fecha
        existe.usuario_id = usuario_id || null;
        existe.estado = estado;
        existe.fecha_registro = new Date().toISOString();
        const registro = await registroRepo.save(existe);

        res.json(registro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar registro' });
    }
});

export default router;
