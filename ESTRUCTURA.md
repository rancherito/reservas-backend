# Estructura del Proyecto

## 📂 Organización Modular

```
reservas-backend/
│
├── 📁 src/                                  # Código fuente principal
│   │
│   ├── 📄 index.ts                          # Punto de entrada de la aplicación
│   │                                        # - Configuración de Express
│   │                                        # - Middleware (CORS, JSON)
│   │                                        # - Registro de rutas
│   │                                        # - Inicio del servidor
│   │
│   ├── 📁 database/                         # Capa de base de datos
│   │   └── 📄 database.ts                   # - Conexión SQLite
│   │                                        # - Inicialización de tablas
│   │                                        # - Exportación de instancia DB
│   │
│   ├── 📁 routes/                           # Rutas y controladores
│   │   ├── 📄 habitaciones.routes.ts        # - Endpoints de habitaciones
│   │   │                                    # - Validaciones de negocio
│   │   │                                    # - Control de 8 hab/piso
│   │   │
│   │   └── 📄 usuarios.routes.ts            # - Endpoints de usuarios
│   │                                        # - Validación de DNI único
│   │                                        # - CRUD completo
│   │
│   └── 📁 types/                            # Definiciones TypeScript
│       └── 📄 types.ts                      # - Interfaces
│                                            # - Tipos compartidos
│
├── 📄 CODICORE.postman_collection.json      # Colección de Postman
├── 📄 package.json                          # Dependencias del proyecto
├── 📄 tsconfig.json                         # Configuración TypeScript
├── 📄 README.md                             # Documentación principal
├── 📄 index.ts.old                          # Backup del código anterior
└── 📄 reservas.db                           # Base de datos SQLite
```

## 🔄 Flujo de la Aplicación

```
1. Cliente hace request
        ↓
2. Express recibe en src/index.ts
        ↓
3. Middleware procesa (CORS, JSON)
        ↓
4. Router dirige a habitaciones.routes.ts o usuarios.routes.ts
        ↓
5. Route handler procesa request
        ↓
6. Interactúa con database.ts
        ↓
7. Retorna response al cliente
```

## 📝 Responsabilidades por Archivo

### `src/index.ts`
- Inicialización de Express
- Configuración de middleware global
- Registro de todas las rutas
- Inicio del servidor HTTP
- Logs de inicio

### `src/database/database.ts`
- Conexión con SQLite
- Creación de tablas (habitaciones, usuarios)
- Exportación de instancia `db`
- Función `initDatabase()`

### `src/routes/habitaciones.routes.ts`
- `GET /habitaciones` - Listar
- `GET /habitaciones/:id` - Obtener por ID
- `POST /habitaciones` - Crear (validar 8 max/piso)
- `PUT /habitaciones/:id` - Actualizar
- `DELETE /habitaciones/:id` - Eliminar

### `src/routes/usuarios.routes.ts`
- `GET /usuarios` - Listar
- `GET /usuarios/:id` - Obtener por ID
- `POST /usuarios` - Crear (validar DNI único)
- `PUT /usuarios/:id` - Actualizar (validar DNI)
- `DELETE /usuarios/:id` - Eliminar

### `src/types/types.ts`
- Interface `Habitacion`
- Interface `Usuario`
- Tipos compartidos entre módulos

## ✨ Ventajas de esta Estructura

✅ **Separación de responsabilidades**: Cada archivo tiene un propósito claro

✅ **Escalabilidad**: Fácil agregar nuevas entidades (reservas, pagos, etc.)

✅ **Mantenibilidad**: Código organizado y fácil de encontrar

✅ **Reutilización**: Tipos e interfaces compartidas

✅ **Testing**: Módulos independientes facilitan las pruebas

✅ **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos
