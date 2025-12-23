module.exports = {
  apps: [
    {
      name: 'reservas-backend',
      script: 'bun',
      args: 'src/index.ts',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3022
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3022
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3022
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true
    }
  ]
};
