# AWAQ - Deployment Guide

Este proyecto tiene dos servicios independientes que deben desplegarse por separado en Render:

## 🌐 Servicios

### 1. Backend Principal (`/backend`)
- **Descripción**: Servidor web principal con frontend estático
- **Puerto**: 5000
- **URL de deploy**: Para ser configurada en Render

### 2. Game API (`/game-api`)
- **Descripción**: API específica para el videojuego Unity
- **Puerto**: 3000  
- **URL de deploy**: Para ser configurada en Render

## 🚀 Configuración en Render

### Backend Principal
1. **New Web Service**
2. **Name**: `awaq-backend`
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   DB_HOST=mysql-3ad0d03e-tec-78de.b.aivencloud.com
   DB_USER=your_aiven_username
   DB_PASSWORD=your_aiven_password
   DB_NAME=db_awaq_oficial
   DB_PORT=19098
   JWT_SECRET=awaq_secret_key
   PORT=5000
   NODE_ENV=production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

### Game API
1. **New Web Service**
2. **Name**: `awaq-game-api`
3. **Root Directory**: `game-api`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   DB_HOST=mysql-3ad0d03e-tec-78de.b.aivencloud.com
   DB_USER=your_aiven_username
   DB_PASSWORD=your_aiven_password
   DB_NAME=db_awaq_oficial
   DB_PORT=19098
   PORT=3000
   NODE_ENV=production
   ```

## 🎮 Actualizar Unity

Después del deploy, actualiza la URL en Unity para que apunte a:
`https://awaq-game-api.onrender.com`

## 🔧 Testing Local

```bash
# Backend Principal
cd backend && npm start

# Game API (en otra terminal)
cd game-api && npm start
```
