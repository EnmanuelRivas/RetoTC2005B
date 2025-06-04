# RetoTC2005B

Este proyecto es una aplicación web que incluye un backend en Node.js/Express y un frontend con HTML, CSS y JavaScript.

## Requisitos Previos

- Node.js (versión 14.x o superior)
- MySQL (versión 5.7 o superior)
- npm (incluido con Node.js)

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd RetoTC2005B
```

### 2. Instalar Dependencias

Instalar dependencias del proyecto principal:
```bash
npm install
```

Instalar dependencias del backend:
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

#### Crear archivo `.env` en el directorio `/backend`:
- Node.js (versión 14.x o superior)
- MySQL (versión 5.7 o superior)
- npm (incluido con Node.js)

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd RetoTC2005B
```
### 2. Instalar Dependencias

Instalar dependencias del proyecto principal:
```bash
npm install
```
Instalar dependencias del backend:
```bash
cd backend
npm install
```
## Ejecución del Proyecto

### Iniciar el Servidor Backend

```bash
cd backend
npm run dev  # Para desarrollo (con nodemon para reinicio automático)
```

o

```bash
cd backend
npm start    # Para producción
```

### Acceder a la Aplicación

Una vez que el servidor esté en funcionamiento:

1. Abre tu navegador web
2. Accede a la URL: `http://localhost:4000/awaq`
3. Serás dirigido a la página de inicio de sesión

## Rutas Principales

- **Login**: `http://localhost:4000/awaq`
- **Registro**: `http://localhost:4000/awaq/registro`
- **Home** (requiere autenticación): `http://localhost:4000/awaq/home`
- **Dashboard Admin** (requiere permisos de administrador): `http://localhost:4000/awaq/dashboard`

## Credenciales de Prueba

Para probar la aplicación, puedes crear un usuario desde la página de registro o usar el siguiente usuario administrador si está configurado en tu base de datos:

- **Usuario**: admin@example.com
- **Contraseña**: admin123

## Solución de Problemas

- **Error de conexión a la base de datos**: Verifica que MySQL esté ejecutándose y que las credenciales en el archivo `.env` sean correctas.
- **Error de puertos**: Si el puerto 4000 está en uso, puedes cambiar el puerto en el archivo `backend/constants.js`.
- **Problemas con las dependencias**: Asegúrate de tener la versión correcta de Node.js y ejecuta `npm install` nuevamente.

## Estructura del Proyecto

```
RetoTC2005B/
├── backend/           # Servidor y API
├── frontend/          # Archivos de la interfaz de usuario
├── uploads/           # Archivos subidos por los usuarios
├── .gitignore
├── package.json
└── README.md
```
Para más detalles sobre el backend, consulta el archivo `backend/README.md`. 
