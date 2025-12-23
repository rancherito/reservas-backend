# Sistema de Reservas - Backend

API REST para gestión de habitaciones y usuarios.

## 📁 Estructura del Proyecto

```
reservas-backend/
│
├── src/
│   ├── index.ts                    # Punto de entrada principal
│   ├── database/
│   │   └── database.ts             # Configuración y conexión a BD
│   ├── routes/
│   │   ├── habitaciones.routes.ts  # Endpoints de habitaciones
│   │   └── usuarios.routes.ts      # Endpoints de usuarios
│   └── types/
│       └── types.ts                # Interfaces y tipos TypeScript
│
├── CODICORE.postman_collection.json
├── package.json
├── tsconfig.json
└── reservas.db                     # Base de datos SQLite
```

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev

# Ejecutar en producción con PM2
bun run pm2:start
```

## 🔄 Despliegue Automático

El sistema incluye despliegue automático que verifica cambios en Git cada minuto.

### Configuración Inicial

```bash
# Configurar despliegue automático
bun run deploy:setup

# Ver logs del despliegue
bun run deploy:logs

# Probar el script de despliegue manualmente
bun run deploy:test
```

### Cómo Funciona

1. **Cada minuto** se ejecuta un cron job que:
   - Verifica si hay cambios en `origin/main`
   - Si hay cambios: hace `git pull`, instala dependencias si es necesario, y reinicia PM2
   - Registra todas las acciones en `deploy.log`

2. **Archivos relacionados**:
   - `deploy.sh` - Script principal de despliegue
   - `setup-deploy.sh` - Configura el cron job
   - `deploy.log` - Log de todas las operaciones

### Comandos de Gestión

```bash
# Ver estado del despliegue automático
bun run deploy:status

# Ver logs de despliegue
bun run deploy:logs

# Ver estado de PM2
bun run pm2:logs

# Reiniciar aplicación
bun run pm2:restart
```

## 📝 Endpoints Disponibles

### Habitaciones
- `GET /habitaciones` - Listar todas las habitaciones
- `GET /habitaciones/:id` - Obtener una habitación específica
- `POST /habitaciones` - Crear una habitación (máximo 8 por piso)
- `PUT /habitaciones/:id` - Actualizar una habitación
- `DELETE /habitaciones/:id` - Eliminar una habitación

### Usuarios
- `GET /usuarios` - Listar todos los usuarios
- `GET /usuarios/:id` - Obtener un usuario específico
- `POST /usuarios` - Crear un usuario (valida DNI único)
- `PUT /usuarios/:id` - Actualizar un usuario
- `DELETE /usuarios/:id` - Eliminar un usuario

## 📋 Modelos de Datos

### Habitación
```typescript
{
  id: number
  tipo_habitacion: string  // "simple", "doble", "ejecutiva"
  piso: number
}
```

### Usuario
```typescript
{
  id: number
  nombres: string
  primer_apellido: string
  segundo_apellido: string
  dni: string  // Único
}
```

## ✨ Características

- ✅ Validación de DNI único para usuarios
- ✅ Límite de 8 habitaciones por piso
- ✅ Validación de tipos de habitación
- ✅ Manejo de errores centralizado
- ✅ Base de datos SQLite
- ✅ CORS habilitado
- ✅ Arquitectura modular y escalable

## 🛠️ Tecnologías

- **Runtime:** Bun
- **Framework:** Express.js
- **Base de Datos:** SQLite (bun:sqlite)
- **Lenguaje:** TypeScript

---

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
