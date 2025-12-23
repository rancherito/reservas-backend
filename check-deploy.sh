#!/bin/bash

# Script para verificar el estado del despliegue automático

echo "🔍 Verificando estado del despliegue automático..."
echo ""

# Verificar si el script existe y es ejecutable
if [ -x "/root/reservas-backend/deploy.sh" ]; then
    echo "✅ Script de despliegue existe y es ejecutable"
else
    echo "❌ Script de despliegue no encontrado o no ejecutable"
fi

# Verificar cron job
if crontab -l 2>/dev/null | grep -q "deploy.sh"; then
    echo "✅ Cron job configurado"
    echo "   $(crontab -l | grep deploy.sh)"
else
    echo "❌ Cron job no configurado"
fi

# Verificar PM2
if pm2 list | grep -q "reservas-backend"; then
    echo "✅ Aplicación corriendo en PM2"
    pm2 status reservas-backend
else
    echo "❌ Aplicación no encontrada en PM2"
fi

# Verificar log
if [ -f "/root/reservas-backend/deploy.log" ]; then
    echo "✅ Archivo de log existe"
    echo "   Últimas 5 líneas del log:"
    tail -5 /root/reservas-backend/deploy.log | sed 's/^/     /'
else
    echo "❌ Archivo de log no encontrado"
fi

echo ""
echo "📋 Comandos útiles:"
echo "  Ver logs en tiempo real: tail -f /root/reservas-backend/deploy.log"
echo "  Ver logs de PM2: pm2 logs reservas-backend"
echo "  Ver cron jobs: crontab -l"