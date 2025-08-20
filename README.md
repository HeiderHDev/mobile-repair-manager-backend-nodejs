# Mobile Repair Manager Backend

## 📋 Descripción

Backend desarrollado en **Node.js con TypeScript** para gestionar una empresa de reparación de teléfonos móviles. Esta API REST proporciona todas las funcionalidades necesarias para manejar clientes, teléfonos y reparaciones con un sistema completo de autenticación y autorización.

### 🎯 Prueba Técnica - INNPACTIA

Este proyecto fue desarrollado como parte de una prueba técnica que incluye:
- Sistema de autenticación con JWT
- Gestión completa de clientes
- Registro y seguimiento de teléfonos
- Control detallado de reparaciones
- Dashboard con estadísticas

## 🛠️ Tecnologías Utilizadas

### Backend Stack
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático para JavaScript
- **Express.js** - Framework web minimalista
- **TypeORM** - ORM para TypeScript y JavaScript
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **Docker** - Containerización de la base de datos
- **Nodemailer** - Envío de emails (validación)

### Arquitectura
- **Clean Architecture** - Separación de responsabilidades
- **Domain-Driven Design** - Enfoque en el dominio del negocio
- **Repository Pattern** - Abstracción de acceso a datos
- **DTOs** - Validación y transferencia de datos
- **Middleware Pattern** - Autenticación y validaciones

## 📁 Estructura del Proyecto

```
src/
├── config/                 # Configuración global
│   ├── bcrypt.adapter.ts   # Adaptador para encriptación
│   ├── envs.ts            # Variables de entorno
│   ├── jwt.adapter.ts     # Adaptador para JWT
│   ├── validators.ts      # Validadores comunes
│   └── uuid.adapter.ts    # Generador de UUIDs
│
├── data/                   # Capa de datos
│   ├── mysql/             # Configuración MySQL
│   │   ├── entities/      # Entidades TypeORM
│   │   │   ├── user.entity.ts
│   │   │   ├── customer.entity.ts
│   │   │   ├── phone.entity.ts
│   │   │   └── repair.entity.ts
│   │   └── mysql-database.ts
│   └── seed/              # Datos de prueba
│       └── seed.ts        # Script de poblado
│
├── domain/                 # Lógica de dominio
│   ├── dtos/              # Data Transfer Objects
│   │   ├── auth/          # DTOs de autenticación
│   │   ├── customers/     # DTOs de clientes
│   │   ├── phones/        # DTOs de teléfonos
│   │   ├── repair/        # DTOs de reparaciones
│   │   └── shared/        # DTOs compartidos
│   ├── entities/          # Entidades de dominio
│   └── errors/            # Manejo de errores
│
└── presentation/           # Capa de presentación
    ├── auth/              # Autenticación
    ├── customers/         # Gestión de clientes
    ├── phones/            # Gestión de teléfonos
    ├── repairs/           # Gestión de reparaciones
    ├── users/             # Gestión de usuarios
    ├── file-upload/       # Subida de archivos
    ├── images/            # Servicio de imágenes
    ├── middlewares/       # Middlewares
    ├── services/          # Servicios de negocio
    └── server.ts          # Configuración del servidor
```

## ⚡ Instalación y Configuración

### Prerequisitos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Docker** y **Docker Compose**
- **Git**

### 🚀 Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/mobile-repair-manager-backend-nodejs.git
cd mobile-repair-manager-backend-nodejs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.template .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000

# Database MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=phone_repair_user
DB_PASSWORD=password123
DB_DATABASE=phone_repair_db

# Root credentials for admin tasks
DB_ROOT_PASSWORD=rootpassword123

JWT_SEED=tu_secret_key_aqui

SEND_EMAIL=false
MAILER_SERVICE=gmail
MAILER_EMAIL=tu_email@gmail.com
MAILER_SECRET_KEY=tu_password_app

WEBSERVICE_URL=http://localhost:3000
```

4. **Levantar la base de datos con Docker**
```bash
docker-compose up -d
```

5. **Poblar la base de datos con datos de prueba**
```bash
npm run seed
```

6. **Ejecutar el proyecto en modo desarrollo**
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### 🐳 Servicios Docker

El proyecto incluye los siguientes servicios:

- **MySQL 8.0** - Puerto 3306
- **phpMyAdmin** - Puerto 8080 (http://localhost:8080)

## 🔐 Credenciales de Acceso

Después de ejecutar el seed, puedes usar estas credenciales:

### Super Administrador
- **Usuario:** `superadmin`
- **Contraseña:** `admin123`

### Administrador
- **Usuario:** `admin1`
- **Contraseña:** `admin123`

## 📚 API Endpoints

### 🔒 Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
GET  /api/auth/validate-email/:token  # Validar email
```

### 👥 Usuarios
```
GET    /api/users             # Listar usuarios
GET    /api/users/:id         # Obtener usuario
POST   /api/users             # Crear usuario
PUT    /api/users/:id         # Actualizar usuario
PATCH  /api/users/:id/toggle-status  # Cambiar estado
DELETE /api/users/:id         # Eliminar usuario
```

### 👤 Clientes
```
GET    /api/customers         # Listar clientes (paginado)
GET    /api/customers/:id     # Obtener cliente
POST   /api/customers         # Crear cliente
PUT    /api/customers/:id     # Actualizar cliente
PATCH  /api/customers/:id/toggle-status  # Cambiar estado
DELETE /api/customers/:id     # Eliminar cliente
```

### 📱 Teléfonos
```
GET    /api/phones            # Listar todos los teléfonos
GET    /api/phones/customer/:customerId  # Teléfonos por cliente
GET    /api/phones/:id        # Obtener teléfono
POST   /api/phones            # Crear teléfono
PUT    /api/phones/:id        # Actualizar teléfono
DELETE /api/phones/:id        # Eliminar teléfono
```

### 🔧 Reparaciones
```
GET    /api/repairs           # Listar reparaciones (paginado)
GET    /api/repairs/statistics  # Estadísticas de reparaciones
GET    /api/repairs/phone/:phoneId  # Reparaciones por teléfono
GET    /api/repairs/customer/:customerId  # Reparaciones por cliente
GET    /api/repairs/:id       # Obtener reparación
POST   /api/repairs           # Crear reparación
PUT    /api/repairs/:id       # Actualizar reparación
DELETE /api/repairs/:id       # Eliminar reparación
```

### 📤 Subida de Archivos
```
POST /api/upload/single/:type    # Subir archivo único
POST /api/upload/multiple/:type  # Subir múltiples archivos
GET  /api/images/:type/:img      # Obtener imagen
```

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas

1. **Sistema de Autenticación Completo**
   - Login con usuario y contraseña
   - Registro de nuevos usuarios administradores
   - JWT para autenticación stateless
   - Middleware de autorización

2. **Gestión de Clientes**
   - Listar clientes con paginación
   - Crear, editar y eliminar clientes
   - Validación de documentos únicos
   - Activar/desactivar clientes

3. **Gestión de Teléfonos**
   - Listar teléfonos por cliente
   - Registrar nuevos teléfonos
   - Validación de IMEI único
   - Historial de reparaciones por teléfono

4. **Gestión de Reparaciones**
   - Listar todas las reparaciones ordenadas por fecha
   - Crear nuevas reparaciones
   - Estados de reparación (Pendiente, En Progreso, Completada, etc.)
   - Prioridades (Baja, Media, Alta, Urgente)
   - Estadísticas de reparaciones

5. **Sistema de Archivos**
   - Subida de imágenes
   - Validación de tipos de archivo
   - Organización por categorías

### 🔒 Seguridad Implementada

- **Encriptación de contraseñas** con bcrypt
- **Tokens JWT** con expiración
- **Validación de datos** con DTOs
- **Middleware de autenticación** en rutas protegidas
- **Manejo de errores** personalizado
- **Validación de permisos** por rol de usuario

### 📊 Datos de Prueba

El seed incluye:
- **2 usuarios** (Super Admin y Admin)
- **5 clientes** con diferentes tipos de documento
- **7 teléfonos** de diversas marcas
- **8 reparaciones** con estados realistas
- **Historial completo** de reparaciones

## 🚀 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo con recarga automática
npm run build    # Compilar TypeScript a JavaScript
npm run start    # Ejecutar en producción
npm run seed     # Poblar base de datos con datos de prueba
```

## 🔄 Próximas Mejoras

### 🎯 Funcionalidades Planificadas

1. **Deployment y CI/CD**
   - **CI/CD** con GitHub Actions
   - **Deployment** en AWS

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a MySQL**
   ```bash
   # Verificar que Docker esté ejecutándose
   docker ps
   
   # Reiniciar contenedores
   docker-compose down
   docker-compose up -d
   ```

2. **Error en el seed**
   ```bash
   # Verificar conexión a BD y ejecutar nuevamente
   npm run seed
   ```

3. **Puerto 3000 ocupado**
   ```bash
   # Cambiar puerto en .env
   PORT=3001
   ```

## 👨‍💻 Autor

**Heider Rey Hernández** - Desarrollo Full Stack