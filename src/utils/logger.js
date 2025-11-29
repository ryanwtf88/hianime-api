import config from '../config/config.js';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLevel = LOG_LEVELS[config.logLevel] ?? LOG_LEVELS.INFO;

const formatMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
  }

  return `${prefix} ${message}`;
};

export const logger = {
  error: (message, data = null) => {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, data));
    }
  },

  warn: (message, data = null) => {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, data));
    }
  },

  info: (message, data = null) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', message, data));
    }
  },

  debug: (message, data = null) => {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message, data));
    }
  },

  request: (method, url, params = null) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', `${method} ${url}`, params));
    }
  },

  response: (status, url, duration = null) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      const msg = duration
        ? `Response ${status} for ${url} (${duration}ms)`
        : `Response ${status} for ${url}`;
      console.log(formatMessage('INFO', msg));
    }
  },
};

export default logger;
