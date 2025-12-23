import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../database/database';
import type { Habitacion, Usuario, Registro } from '../types/types';

const router = Router();

// GET - Listar todos los registros con LEFT JOIN
router.get('/', (req: Request, res: Response) => {
    try {
        // Obtener todas las habitaciones
        const habitaciones = db.query('SELECT * FROM habitaciones').all() as Habitacion[];

        if (habitaciones.length === 0) return res.status(200).json([]); // No hay habitaciones, retornar arreglo vacío

        // Obtener todos los registros con LEFT JOIN
        const registros = db
            .query(
                `
      SELECT 
        h.id as habitacion_id,
        h.tipo_habitacion,
        h.piso,
        r.id as registro_id,
        r.usuario_id,
        r.estado,
        r.fecha_registro,
        u.id as usuario_id_full,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.dni
      FROM habitaciones h
      LEFT JOIN registros r ON h.id = r.habitacion_id
      LEFT JOIN usuarios u ON r.usuario_id = u.id
    `
            )
            .all() as any[];

        // Construir respuesta con emulación de registros libres
        const resultado = registros.map(row => {
            if (row.registro_id === null) {
                // No hay registro, emular estado libre
                return {
                    id: null,
                    habitacion_id: row.habitacion_id,
                    usuario_id: null,
                    estado: 0, // libre
                    fecha_registro: null,
                    habitacion: {
                        id: row.habitacion_id,
                        tipo_habitacion: row.tipo_habitacion,
                        piso: row.piso,
                    },
                    usuario: null,
                };
            } else {
                // Hay registro
                return {
                    id: row.registro_id,
                    habitacion_id: row.habitacion_id,
                    usuario_id: row.usuario_id,
                    estado: row.estado,
                    fecha_registro: row.fecha_registro,
                    habitacion: {
                        id: row.habitacion_id,
                        tipo_habitacion: row.tipo_habitacion,
                        piso: row.piso,
                    },
                    usuario: row.usuario_id
                        ? {
                              id: row.usuario_id_full,
                              nombres: row.nombres,
                              primer_apellido: row.primer_apellido,
                              segundo_apellido: row.segundo_apellido,
                              dni: row.dni,
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
router.get('/habitacion/:habitacionId', (req: Request, res: Response) => {
    try {
        const habitacionId = parseInt(req.params.habitacionId || '0');

        // Verificar que la habitación existe
        const habitacion = db.query('SELECT * FROM habitaciones WHERE id = ?').get(habitacionId) as Habitacion | undefined;

        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Buscar el registro con LEFT JOIN
        const row = db
            .query(
                `
      SELECT 
        h.id as habitacion_id,
        h.tipo_habitacion,
        h.piso,
        r.id as registro_id,
        r.usuario_id,
        r.estado,
        r.fecha_registro,
        u.id as usuario_id_full,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.dni
      FROM habitaciones h
      LEFT JOIN registros r ON h.id = r.habitacion_id
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE h.id = ?
    `
            )
            .get(habitacionId) as any;

        if (row.registro_id === null) {
            // No hay registro, emular estado libre
            const resultado = {
                id: null,
                habitacion_id: row.habitacion_id,
                usuario_id: null,
                estado: 0, // libre
                fecha_registro: null,
                habitacion: {
                    id: row.habitacion_id,
                    tipo_habitacion: row.tipo_habitacion,
                    piso: row.piso,
                },
                usuario: null,
            };
            return res.json(resultado);
        } else {
            // Hay registro
            const resultado = {
                id: row.registro_id,
                habitacion_id: row.habitacion_id,
                usuario_id: row.usuario_id,
                estado: row.estado,
                fecha_registro: row.fecha_registro,
                habitacion: {
                    id: row.habitacion_id,
                    tipo_habitacion: row.tipo_habitacion,
                    piso: row.piso,
                },
                usuario: row.usuario_id
                    ? {
                          id: row.usuario_id_full,
                          nombres: row.nombres,
                          primer_apellido: row.primer_apellido,
                          segundo_apellido: row.segundo_apellido,
                          dni: row.dni,
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
router.post('/', (req: Request, res: Response) => {
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

        // Validar que la habitación existe
        const habitacion = db.query('SELECT * FROM habitaciones WHERE id = ?').get(habitacion_id);
        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Validar que no exista ya un registro para esta habitación
        const registroExiste = db.query('SELECT * FROM registros WHERE habitacion_id = ?').get(habitacion_id);
        if (registroExiste) {
            return res.status(400).json({
                error: 'Ya existe un registro para esta habitación. Use PUT para actualizar.',
            });
        }

        // Si hay usuario_id, validar que existe
        if (usuario_id !== null && usuario_id !== undefined) {
            const usuario = db.query('SELECT * FROM usuarios WHERE id = ?').get(usuario_id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        }

        // Crear registro con fecha actual en UTC
        const fecha_registro = new Date().toISOString();
        const query = db.query('INSERT INTO registros (habitacion_id, usuario_id, estado, fecha_registro) VALUES (?, ?, ?, ?) RETURNING *');
        const registro = query.get(habitacion_id, usuario_id || null, estado, fecha_registro);

        res.status(201).json(registro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear registro' });
    }
});

// PUT - Actualizar un registro
router.put('/:id', (req: Request, res: Response) => {
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

        // Verificar que el registro existe
        const existe = db.query('SELECT * FROM registros WHERE id = ?').get(id);
        if (!existe) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        // Si hay usuario_id, validar que existe
        if (usuario_id !== null && usuario_id !== undefined) {
            const usuario = db.query('SELECT * FROM usuarios WHERE id = ?').get(usuario_id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        }

        // Actualizar registro con nueva fecha
        const fecha_registro = new Date().toISOString();
        const query = db.query('UPDATE registros SET usuario_id = ?, estado = ?, fecha_registro = ? WHERE id = ? RETURNING *');
        const registro = query.get(usuario_id || null, estado, fecha_registro, id);

        res.json(registro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar registro' });
    }
});

export default router;
