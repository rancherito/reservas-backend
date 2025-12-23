import express from 'express';
import cors from 'cors';
import { initDatabase } from './database/database';
import habitacionesRoutes from './routes/habitaciones.routes';
import usuariosRoutes from './routes/usuarios.routes';
import registrosRoutes from './routes/registros.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS - Permitir todos los orígenes
app.use(
    cors({
        origin: true, // Permite cualquier origen
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        credentials: false,
        optionsSuccessStatus: 200, // Para algunos navegadores antiguos
    })
);
app.use(express.json());

// Inicializar base de datos
initDatabase();

// Rutas
app.use('/habitaciones', habitacionesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/registros', registrosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Reservas - CODICORE',
        endpoints: {
            habitaciones: {
                'GET /habitaciones': 'Listar todas las habitaciones',
                'GET /habitaciones/:id': 'Obtener una habitación',
                'POST /habitaciones': 'Crear una habitación (máx 8 por piso)',
                'PUT /habitaciones/:id': 'Actualizar una habitación',
                'DELETE /habitaciones/:id': 'Eliminar una habitación',
            },
            usuarios: {
                'GET /usuarios': 'Listar todos los usuarios',
                'GET /usuarios/:id': 'Obtener un usuario',
                'POST /usuarios': 'Crear un usuario',
                'PUT /usuarios/:id': 'Actualizar un usuario',
                'DELETE /usuarios/:id': 'Eliminar un usuario',
            },
            registros: {
                'GET /registros': 'Listar todos los registros (LEFT JOIN con habitaciones)',
                'GET /registros/:id': 'Obtener un registro por ID',
                'GET /registros/habitacion/:habitacionId': 'Obtener registro por ID de habitación',
                'POST /registros': 'Crear un registro (0=libre, 1=reservado, 2=ocupado)',
                'PUT /registros/:id': 'Actualizar un registro',
            },
        },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 Documentación API: http://localhost:${PORT}`);
    console.log(`📝 Endpoints disponibles:`);
    console.log(`\n   HABITACIONES:`);
    console.log(`   GET    /habitaciones      - Listar todas las habitaciones`);
    console.log(`   GET    /habitaciones/:id  - Obtener una habitación`);
    console.log(`   POST   /habitaciones      - Crear una habitación (máx 8 por piso)`);
    console.log(`   PUT    /habitaciones/:id  - Actualizar una habitación`);
    console.log(`   DELETE /habitaciones/:id  - Eliminar una habitación`);
    console.log(`\n   USUARIOS:`);
    console.log(`   GET    /usuarios          - Listar todos los usuarios`);
    console.log(`   GET    /usuarios/:id      - Obtener un usuario`);
    console.log(`   POST   /usuarios          - Crear un usuario`);
    console.log(`   PUT    /usuarios/:id      - Actualizar un usuario`);
    console.log(`   DELETE /usuarios/:id      - Eliminar un usuario`);
    console.log(`\n   REGISTROS:`);
    console.log(`   GET    /registros                      - Listar todos los registros (LEFT JOIN)`);
    console.log(`   GET    /registros/:id                  - Obtener un registro por ID`);
    console.log(`   GET    /registros/habitacion/:habitacionId - Obtener registro por ID de habitación`);
    console.log(`   POST   /registros                      - Crear un registro (0=libre, 1=reservado, 2=ocupado)`);
    console.log(`   PUT    /registros/:id                  - Actualizar un registro`);
});
