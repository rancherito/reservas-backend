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
bun run src/index.ts
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
