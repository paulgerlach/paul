import {pino} from 'pino'
import fs from 'fs'
import path from 'path'

const targets = [];

if (process.env.NODE_ENV === 'production') {
  const logDir = './logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  targets.push({ target: 'pino/file', options: { destination: path.join(logDir, 'app.log') } });
} else {
  targets.push({ target: 'pino-pretty' });
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
}, pino.transport({ targets }));

export default logger;