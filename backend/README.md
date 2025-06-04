# Backend - RetoTC2005B

Este documento proporciona información detallada sobre la estructura, configuración y uso del backend del proyecto RetoTC2005B.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework web para crear APIs RESTful
- **MySQL**: Sistema de gestión de base de datos
- **JWT**: JSON Web Tokens para autenticación
- **Bcrypt**: Librería para el hash de contraseñas
- **Multer**: Middleware para manejo de subida de archivos
- **Nodemailer**: Para envío de correos electrónicos
- **Sharp**: Procesamiento de imágenes

## Estructura del Proyecto

```
backend/
├── API/                   # Controladores REST
│   ├── formsRestController.js
│   ├── imageRestController.js
│   └── usersRestController.js
├── Data/                  # Capa de acceso a datos
├── middleware/            # Middlewares
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── routes/                # Definición de rutas
│   └── router.js
├── Service/               # Lógica de negocio
├── Templates/             # Controladores de vistas
│   └── templates.js
├── uploads/               # Directorio para archivos subidos
├── constants.js           # Constantes de la aplicación
├── main.js                # Punto de entrada
├── package.json           # Dependencias y scripts
└── webserver.js           # Configuración del servidor
```

## Configuración del Entorno

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` en el directorio `/backend` con las siguientes variables:
```
# Database configuration
HOST=localhost
DB_USER=youruser
PASSWORD=yourpassword
DATABASE=yourdatabase

# JWT Secret
SECRET=your_jwt_secret_key
```

## API Endpoints

### Autenticación

- **POST** `/awaq/api/login`: Iniciar sesión
- **POST** `/awaq/api/register`: Registrar nuevo usuario
- **POST** `/awaq/api/recuperar`: Solicitar recuperación de contraseña
- **POST** `/awaq/api/verificar-token`: Verificar token de recuperación
- **POST** `/awaq/api/restablecer-password`: Cambiar contraseña

### Usuarios

- **GET** `/awaq/api/getUsers`: Obtener todos los usuarios (admin)
- **POST** `/awaq/api/findUser`: Buscar usuario específico
- **POST** `/awaq/api/insertUser`: Crear nuevo usuario (admin)
- **PUT** `/awaq/api/updateUser`: Actualizar información de usuario
- **DELETE** `/awaq/api/deleteUser`: Eliminar usuario (admin)

### Formularios y Registros

- **GET/POST** `/registro`: Obtener/crear registros generales
- **GET/POST** `/registro/getVariableClimatica`: Manejo de variables climáticas
- **GET/POST** `/registro/ParcelaVegetacion`: Manejo de parcelas de vegetación
- **GET/POST** `/registro/CamarasTrampa`: Manejo de cámaras trampa
- **GET/POST** `/registro/ValidacionCobertura`: Validación de cobertura
- **GET/POST** `/registro/FaunaTransecto`: Registros de fauna por transecto
- **GET/POST** `/registro/FaunaPuntoConteo`: Registros de fauna por punto de conteo
- **GET/POST** `/registro/FaunaBusquedaLibre`: Registros de fauna por búsqueda libre

### Imágenes

- **POST** `/registro/subirImagen`: Subir imágenes (máximo 5)

## Middlewares

### Autenticación

El sistema implementa varios niveles de autenticación:

- `requireUser`: Verifica que el usuario esté autenticado
- `requireAdmin`: Verifica que el usuario sea administrador
- `requireAuthForPage`: Redirige a login si no hay autenticación

### Manejo de Archivos

- `upload.middleware.js`: Configura Multer para la subida de archivos e imágenes

## Ejecución del Servidor

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

Para iniciar el servidor en modo producción:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:4000` por defecto.

## Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación mediante JWT
- Validación de datos en endpoints
- Manejo de archivos seguros con Multer 