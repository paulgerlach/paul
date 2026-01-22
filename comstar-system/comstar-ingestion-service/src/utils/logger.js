// Simple logger implementation for temporary use
// Logs messages to console with appropriate levels

const logger = {
  info: (...args) => {
    console.log('[INFO]', ...args);
  },
  debug: (...args) => {
    console.log('[DEBUG]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  }
};

export default logger;