#!/bin/bash

# Script de configuración del despliegue automático
echo "🔧 Configurando despliegue automático..."

# Hacer ejecutable el script de despliegue
chmod +x /root/reservas-backend/deploy.sh

# Configurar cron job para ejecutar cada minuto
CRON_JOB="* * * * * /root/reservas-backend/deploy.sh >> /root/reservas-backend/deploy.log 2>&1"

# Verificar si el cron job ya existe
(crontab -l 2>/dev/null | grep -q "deploy.sh") || {
    # Agregar el cron job
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job configurado para ejecutar cada minuto"
}

# Crear archivo de log
touch /root/reservas-backend/deploy.log

echo "✅ Configuración completada!"
echo ""
echo "📋 Resumen:"
echo "  - Script de despliegue: /root/reservas-backend/deploy.sh"
echo "  - Log de despliegues: /root/reservas-backend/deploy.log"
echo "  - Cron job: Se ejecuta cada minuto"
echo ""
echo "Para ver los logs en tiempo real:"
echo "  tail -f /root/reservas-backend/deploy.log"