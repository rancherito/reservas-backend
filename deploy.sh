#!/bin/bash

# Script de despliegue automático para reservas-backend
# Se ejecuta cada minuto via cron

echo "$(date): Iniciando verificación de actualizaciones..."

# Cambiar al directorio del proyecto
cd /root/reservas-backend

# Verificar si hay cambios remotos
git fetch origin

# Comparar con rama main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "$(date): Cambios detectados. Actualizando..."

    # Hacer pull de los cambios
    git pull origin main

    # Instalar dependencias si package.json cambió
    if git diff --name-only HEAD~1 | grep -q "package.json"; then
        echo "$(date): package.json cambió, instalando dependencias..."
        bun install
    fi

    # Reiniciar la aplicación con PM2
    echo "$(date): Reiniciando aplicación..."
    pm2 restart reservas-backend

    echo "$(date): ✅ Despliegue completado exitosamente"
else
    echo "$(date): No hay cambios nuevos"
fi

echo "$(date): Verificación completada"