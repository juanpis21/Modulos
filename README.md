# Clinic Pet API - NestJS

API para gestión de clínica veterinaria desarrollada con NestJS, PostgreSQL, autenticación JWT y documentación Swagger.

## Características

- ✅ **NestJS Framework** - Backend moderno y escalable
- ✅ **PostgreSQL** - Base de datos robusta y relacional
- ✅ **Autenticación JWT** - Sistema de autenticación seguro
- ✅ **CRUD Completo** - Operaciones completas para usuarios y roles
- ✅ **Relación Muchos a Muchos** - Usuarios pueden tener múltiples roles
- ✅ **Swagger Documentation** - Documentación API interactiva
- ✅ **Validación de Datos** - Validación automática con class-validator
- ✅ **Encriptación de Contraseñas** - Seguridad con bcrypt

## Tecnologías

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator & class-transformer
- **Seguridad**: bcrypt

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd clinic-pet-nestjs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos PostgreSQL**
```sql
CREATE DATABASE clinic_pet;
CREATE USER clinic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE clinic_pet TO clinic_user;
```

5. **Iniciar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Configuración de Variables de Entorno

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=clinic_pet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

## Documentación de la API

Una vez iniciada la aplicación, puedes acceder a la documentación interactiva en:

- **Swagger UI**: http://localhost:3000/api/docs
- **JSON Schema**: http://localhost:3000/api/docs-json

## Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Roles
- `GET /roles` - Obtener todos los roles
- `GET /roles/:id` - Obtener rol por ID
- `POST /roles` - Crear nuevo rol
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

## Ejemplos de Uso

### 1. Crear un rol
```bash
curl -X POST http://localhost:3000/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "admin",
    "description": "Administrador del sistema"
  }'
```

### 2. Crear un usuario con roles
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanp",
    "email": "juan@example.com",
    "password": "password123",
    "fullName": "Juan Pérez",
    "roles": [{"id": 1}]
  }'
```

### 3. Iniciar sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanp",
    "password": "password123"
  }'
```

### 4. Acceder a endpoints protegidos
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── decorators/       # Decoradores personalizados
│   ├── guards/          # Guards de autenticación
│   ├── strategies/      # Estrategias Passport
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/               # Módulo de usuarios
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # Entidades de base de datos
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── roles/               # Módulo de roles
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # Entidades de base de datos
│   ├── roles.controller.ts
│   ├── roles.module.ts
│   └── roles.service.ts
├── app.module.ts        # Módulo principal
└── main.ts             # Punto de entrada
```

## Base de Datos

### Relaciones
- **Users** ↔ **Roles** (Muchos a Muchos)
- Tabla intermedia: `user_roles`

### Esquema
```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Iniciar con hot-reload
npm run start:debug      # Iniciar en modo debug

# Producción
npm run build           # Compilar TypeScript
npm run start:prod      # Iniciar versión compilada

# Calidad
npm run lint           # Ejecutar ESLint
npm run format         # Formatear código con Prettier

# Testing
npm run test           # Ejecutar tests
npm run test:cov       # Ejecutar tests con cobertura
npm run test:e2e       # Ejecutar tests e2e
```

## Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit de cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
