#!/bin/bash
# Script para instalar dependencias de ambos servicios

echo "🚀 Instalando dependencias del Backend Principal..."
cd backend && npm install
cd ..

echo "🎮 Instalando dependencias del Game API..."
cd game-api && npm install
cd ..

echo "✅ Todas las dependencias instaladas correctamente!"
