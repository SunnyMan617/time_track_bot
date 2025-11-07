module.exports = {
  apps: [
    {
      name: 'time-tracker-bot',
      script: 'npm',
      args: 'run bot',
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/bot-error.log',
      out_file: './logs/bot-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};