import express from "express";
import cors from "cors";
import { initDatabase } from "./database/database";
import habitacionesRoutes from "./routes/habitaciones.routes";
import usuariosRoutes from "./routes/usuarios.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initDatabase();

// Rutas
app.use("/habitaciones", habitacionesRoutes);
app.use("/usuarios", usuariosRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "API de Reservas - CODICORE",
    endpoints: {
      habitaciones: {
        "GET /habitaciones": "Listar todas las habitaciones",
        "GET /habitaciones/:id": "Obtener una habitación",
        "POST /habitaciones": "Crear una habitación (máx 8 por piso)",
        "PUT /habitaciones/:id": "Actualizar una habitación",
        "DELETE /habitaciones/:id": "Eliminar una habitación"
      },
      usuarios: {
        "GET /usuarios": "Listar todos los usuarios",
        "GET /usuarios/:id": "Obtener un usuario",
        "POST /usuarios": "Crear un usuario",
        "PUT /usuarios/:id": "Actualizar un usuario",
        "DELETE /usuarios/:id": "Eliminar un usuario"
      }
    }
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
});
