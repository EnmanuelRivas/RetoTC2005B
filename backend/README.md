# Backend de RetoTC2005B

Este directorio contiene el servidor backend de la aplicación RetoTC2005B, desarrollado con Node.js y Express.

## Estructura del Backend

```
backend/
├── API/           # Controladores y lógica de negocio
├── Data/          # Modelos y acceso a datos
├── Service/       # Servicios de la aplicación
├── middleware/    # Middleware personalizado
├── routes/        # Definición de rutas
├── Templates/     # Plantillas
├── uploads/       # Archivos subidos por los usuarios
├── docs/          # Documentación del backend
├── webserver.js   # Configuración del servidor web
├── constants.js   # Constantes de la aplicación
└── main.js        # Punto de entrada de la aplicación
```

## Dependencias Principales

- **Express (v5.1.0)**: Framework web para Node.js
- **MySQL2 (v3.14.1)**: Cliente MySQL para Node.js
- **bcrypt (v5.1.1)**: Biblioteca para el hash de contraseñas
- **jsonwebtoken (v9.0.2)**: Implementación de JSON Web Tokens
- **multer (v1.4.5-lts.2)**: Middleware para manejo de subida de archivos
- **nodemailer (v7.0.3)**: Módulo para envío de correos electrónicos
- **sharp (v0.33.2)**: Procesamiento de imágenes
- **dotenv (v16.5.0)**: Carga de variables de entorno
- **cors (v2.8.5)**: Middleware para habilitar CORS

## Instalación

```bash
cd backend
npm install
```

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en el directorio `/backend` con la siguiente estructura:

```
# Database configuration
HOST=localhost
DB_USER=youruser
PASSWORD=yourpassword
DATABASE=yourdatabase

# JWT Secret
SECRET=your_jwt_secret_key
```

Reemplaza los valores con tu configuración actual:
- `HOST`: Dirección del servidor de base de datos (generalmente localhost)
- `DB_USER`: Usuario de MySQL con permisos en la base de datos
- `PASSWORD`: Contraseña del usuario de MySQL
- `DATABASE`: Nombre de la base de datos (debes crearla previamente)
- `SECRET`: Clave secreta para generar tokens JWT (usa una cadena aleatoria segura)

> **Nota**: El archivo `.env` está excluido de git en `.gitignore` para mantener segura la información sensible. Nunca subas tu archivo `.env` al control de versiones.

### 2. Configurar Base de Datos

1. Crea una base de datos MySQL con el nombre especificado en tu archivo `.env`
2. El esquema de la base de datos se creará automáticamente al iniciar la aplicación por primera vez

## Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Este comando utiliza nodemon para reiniciar automáticamente el servidor cuando se detectan cambios en los archivos.

### Modo Producción

```bash
npm start
```

## API Endpoints

### Autenticación

- **POST /api/auth/login**: Iniciar sesión
- **POST /api/auth/register**: Registrar nuevo usuario
- **GET /api/auth/logout**: Cerrar sesión
- **GET /api/auth/verify**: Verificar token JWT

### Usuarios

- **GET /api/users**: Obtener todos los usuarios (requiere permisos de administrador)
- **GET /api/users/:id**: Obtener usuario por ID
- **PUT /api/users/:id**: Actualizar usuario
- **DELETE /api/users/:id**: Eliminar usuario (requiere permisos de administrador)

## Middleware

El backend utiliza varios middleware para procesar las solicitudes:

- **authMiddleware**: Verifica la autenticación mediante tokens JWT
- **adminMiddleware**: Verifica si el usuario tiene permisos de administrador
- **uploadMiddleware**: Gestiona la subida de archivos con multer

## Configuración del Servidor

El archivo `constants.js` contiene la configuración básica del servidor:

```javascript
const port = 4000;
const indexURL = '/';
const apiURL = '/api';
const contextURL = '/awaq';
```

Puedes modificar estas constantes según tus necesidades, por ejemplo, cambiar el puerto si el 4000 está en uso.

## Solución de Problemas

### Error de Conexión a la Base de Datos

Verifica:
- Que el servidor MySQL esté en ejecución
- Que las credenciales en el archivo `.env` sean correctas
- Que la base de datos especificada exista

### Error de CORS

Si experimentas problemas de CORS al hacer solicitudes desde el frontend:
- Verifica la configuración de CORS en `webserver.js`
- Asegúrate de que el origen de las solicitudes esté permitido

### Problemas con la Subida de Archivos

- Verifica que el directorio `uploads` tenga permisos de escritura
- Comprueba la configuración de multer en el middleware correspondiente

## Contribución

Para contribuir al desarrollo del backend:

1. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
2. Realiza tus cambios
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Envía tu rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request 