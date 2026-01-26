const transports = [];

if (process.env.NODE_ENV === 'production') {
  transports.push({ target: 'pino/file', options: { destination: './logs/app.log' } });
} else {
  transports.push({ target: 'pino-pretty' });
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
}, { pipeline: transports });
