#!/bin/bash

# Script de despliegue automático para reservas-backend
# Se ejecuta cada minuto via cron

# Cargar variables de entorno
export HOME="/root"
export NVM_DIR="$HOME/.nvm"

# Cargar NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Cargar Bun
export PATH="/root/.bun/bin:$PATH"

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

    bun install    

    # Reiniciar la aplicación con PM2
    if [ -f "/root/.bun/bin/pm2" ]; then
        /root/.bun/bin/pm2 restart reservas-backend
    elif [ -f "/usr/local/bin/pm2" ]; then
        /usr/local/bin/pm2 restart reservas-backend
    else
        echo "$(date): ❌ Error: PM2 no encontrado"
        exit 1
    fi

    echo "$(date): ✅ Despliegue completado exitosamente"
else
    echo "$(date): No hay cambios nuevos"
fi

echo "$(date): Verificación completada"