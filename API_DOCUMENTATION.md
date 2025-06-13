# 🌿 AWAQ - API Documentation & Presentation Guide

## 📋 Resumen del Proyecto

**AWAQ** es una plataforma web integral para la gestión y monitoreo de biodiversidad y proyectos ambientales. La plataforma incluye funcionalidades de:

- 🔐 **Gestión de usuarios** con autenticación JWT
- 📊 **Monitoreo de biodiversidad** con formularios especializados
- 🎯 **Sistema de anteproyectos** y convocatorias
- 🎮 **Juego educativo** integrado de Unity
- 📈 **Dashboard administrativo** con métricas
- 🤖 **Chatbot** de asistencia
- 📱 **API RESTful** completa

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Backend**: Node.js + Express.js
- **Base de Datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Juego**: Unity WebGL
- **Seguridad**: bcrypt para hash de contraseñas

### Estructura del Proyecto
```
RetoTC2005B/
├── backend/                    # API Server
│   ├── API/                   # Controladores REST
│   ├── Service/               # Lógica de negocio
│   ├── Data/                  # Conexión MySQL
│   ├── middleware/            # Autenticación y uploads
│   ├── routes/                # Rutas de la aplicación
│   └── Templates/             # Renderizado de páginas
├── frontend/                   # Interfaz de usuario
│   ├── pages/                 # Páginas HTML
│   ├── scripts/               # JavaScript del cliente
│   ├── styles/                # CSS
│   └── assets/                # Imágenes y recursos
├── game/                      # Juego Unity WebGL
└── game-api/                  # API específica del juego
```

---

## 🚀 Configuración e Instalación

### Requisitos Previos
- Node.js v14+
- MySQL v5.7+
- npm

### Variables de Entorno (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SQLBenchMark!05
DB_NAME=db_awaq_oficial
DB_PORT=3306

# JWT Configuration
SECRET=awaq_secret_key

# Email Configuration
EMAIL_USER=mack73@ethereal.email
EMAIL_PASS=rspfsVcW4KGKJyDu3Y

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Instalación
```bash
# Clonar repositorio
git clone [repository-url]
cd RetoTC2005B

# Instalar dependencias del backend
cd backend
npm install

# Iniciar servidor
npm start
# o para desarrollo:
npm run dev
```

---

## 🔗 API Endpoints

### Base URL: `http://localhost:5000/awaq/api`

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/login` | Iniciar sesión | ❌ |
| `POST` | `/usuarios` | Registrar usuario | ❌ |
| `POST` | `/recuperar` | Recuperar contraseña | ❌ |
| `POST` | `/verificar-token` | Verificar token de recuperación | ❌ |
| `POST` | `/restablecer-password` | Restablecer contraseña | ❌ |

#### Ejemplo Login:
```json
POST /awaq/api/login
{
  "correo": "usuario@ejemplo.com",
  "contraseña": "mipassword"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 👥 Gestión de Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/usuarios` | Obtener todos los usuarios | 🔒 Admin |
| `GET` | `/usuarios/:id` | Obtener usuario específico | 🔒 User |
| `PUT` | `/usuarios/:id` | Actualizar usuario | 🔒 User |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | 🔒 Admin |
| `PUT` | `/usuarios/:id/aprobar` | Aprobar usuario pendiente | 🔒 Admin |

### 📋 Anteproyectos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/anteproyectos` | Listar anteproyectos | ❌ |
| `POST` | `/anteproyectos` | Crear anteproyecto | 🔒 User |
| `GET` | `/anteproyectos/:id` | Obtener anteproyecto | 🔒 User |
| `PUT` | `/anteproyectos/:id` | Actualizar anteproyecto | 🔒 User |
| `DELETE` | `/anteproyectos/:id` | Eliminar anteproyecto | 🔒 Admin |

### 📊 Formularios de Biodiversidad

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/registro/subirVariableClimatica` | Variables climáticas | 🔒 User |
| `POST` | `/registro/subirParcelaVegetacion` | Datos de vegetación | 🔒 User |
| `POST` | `/registro/subirCamarasTrampa` | Cámaras trampa | 🔒 User |
| `POST` | `/registro/subirValidacionCobertura` | Validación de cobertura | 🔒 User |
| `POST` | `/registro/subirFaunaTransecto` | Fauna en transecto | 🔒 User |
| `POST` | `/registro/subirFaunaPuntoConteo` | Fauna punto de conteo | 🔒 User |
| `POST` | `/registro/subirFaunaBusquedaLibre` | Fauna búsqueda libre | 🔒 User |

### 📢 Convocatorias

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/convocatorias` | Listar convocatorias | ❌ |
| `POST` | `/convocatorias` | Crear convocatoria | 🔒 Admin |
| `PUT` | `/convocatorias/:id` | Actualizar convocatoria | 🔒 Admin |
| `DELETE` | `/convocatorias/:id` | Eliminar convocatoria | 🔒 Admin |

### 🎯 Soporte

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/soporte` | Crear ticket de soporte | 🔒 User |
| `GET` | `/soporte` | Listar tickets | 🔒 Admin |
| `PUT` | `/soporte/:id` | Actualizar ticket | 🔒 Admin |

### 📈 Métricas (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/metricas/usuarios` | Métricas de usuarios | 🔒 Admin |
| `GET` | `/metricas/anteproyectos` | Métricas de anteproyectos | 🔒 Admin |
| `GET` | `/metricas/registros` | Métricas de registros | 🔒 Admin |

### 🖼️ Gestión de Imágenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/upload` | Subir imagen | 🔒 User |
| `GET` | `/images/:filename` | Obtener imagen | ❌ |

---

## 🔒 Sistema de Autenticación

### Tipos de Usuario
1. **Administrador** (`role_id: 1`) - Acceso completo
2. **Usuario** (`role_id: 2`) - Acceso limitado
3. **Pendiente** (`role_id: 3`) - Sin acceso hasta aprobación

### Middleware de Autenticación
- `authenticateToken`: Valida JWT token
- `requireUser`: Requiere usuario autenticado
- `requireAdmin`: Requiere permisos de administrador

### Headers de Autenticación
```javascript
Authorization: Bearer <jwt_token>
```

---

## 🎮 Funcionalidades Especiales

### 1. Juego Unity Integrado
- **Ubicación**: `/awaq/juego`
- **Tecnología**: Unity WebGL
- **API del Juego**: Puerto 3000
- **Propósito**: Educación ambiental interactiva

### 2. Chatbot de Asistencia
- **Ubicación**: `/awaq/chatbot`
- **Funcionalidad**: Ayuda contextual a usuarios

### 3. Dashboard Administrativo
- **Ubicación**: `/awaq/dashboard`
- **Métricas**: Usuarios, proyectos, registros de biodiversidad
- **Gestión**: CRUD completo de entidades

---

## 📱 Frontend - Páginas Principales

### Públicas (Sin autenticación)
- `/awaq` - Login
- `/awaq/registro` - Registro de usuarios
- `/awaq/recuperar` - Recuperación de contraseña

### Usuarios Autenticados
- `/awaq/home` - Página principal
- `/awaq/perfil` - Perfil de usuario
- `/awaq/convocatorias` - Ver convocatorias
- `/awaq/AsistenteBiomo` - Asistente de biodiversidad
- `/awaq/chatbot` - Chatbot de ayuda
- `/awaq/juego` - Juego educativo

### Solo Administradores
- `/awaq/dashboard` - Panel administrativo
- `/awaq/gestion_usuario` - Gestión de usuarios
- `/awaq/gestion_ap` - Gestión de anteproyectos
- `/awaq/metricas` - Métricas del sistema

---

## 📊 Base de Datos

### Tablas Principales
- `usuarios` - Gestión de usuarios y autenticación
- `anteproyectos` - Proyectos de investigación
- `convocatorias` - Convocatorias públicas
- `soporte` - Tickets de soporte
- `registros_*` - Diversos tipos de registros de biodiversidad

---

## 🛠️ Dependencias Principales

```json
{
  "express": "^5.1.0",           // Framework web
  "mysql2": "^3.14.1",          // Driver MySQL
  "jsonwebtoken": "^9.0.2",     // Autenticación JWT
  "bcrypt": "^5.1.1",           // Hash de contraseñas
  "multer": "^1.4.5-lts.2",     // Upload de archivos
  "nodemailer": "^7.0.3",       // Envío de emails
  "cors": "^2.8.5",             // CORS policy
  "dotenv": "^16.5.0"           // Variables de entorno
}
```

---

## 🚀 Comandos de Ejecución

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Acceso a la aplicación
http://localhost:5000/awaq
```

---

## 🔍 Testing de la API

### Herramientas Recomendadas
- **Postman** - Testing de endpoints
- **cURL** - Comandos de terminal
- **Thunder Client** - Extensión de VS Code

### Ejemplo de Test
```bash
# Test de login
curl -X POST http://localhost:5000/awaq/api/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@ejemplo.com","contraseña":"password123"}'
```

---

## 📈 Puntos Clave para la Presentación

### 🎯 Fortalezas del Proyecto
1. **Arquitectura robusta** con separación clara de responsabilidades
2. **Seguridad implementada** con JWT y bcrypt
3. **API RESTful completa** siguiendo mejores prácticas
4. **Sistema de roles** flexible y escalable
5. **Integración multimedia** (Unity WebGL)
6. **Interface intuitiva** y responsive

### 🔧 Características Técnicas Destacadas
- Middleware personalizado para autenticación
- Conexión pool de MySQL para optimización
- Upload seguro de archivos con validación
- Sistema de emails para recuperación de contraseñas
- Logs detallados para debugging
- Manejo robusto de errores

### 📊 Métricas del Sistema
- API endpoints: **30+**
- Tipos de formularios: **7**
- Niveles de usuario: **3**
- Páginas frontend: **20+**

---

## 🤝 Equipo y Contacto

**Proyecto**: RetoTC2005B - AWAQ  
**Tecnologías**: Node.js, Express, MySQL, Unity  
**Estado**: Desarrollo activo  

---

*Este documento proporciona una visión completa de la API AWAQ para fines de presentación y documentación técnica.*
