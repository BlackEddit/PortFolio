/**
 * ===================================
 * CONFIGURACIÓN DE ENTORNO
 * Manejo de API keys para desarrollo y producción
 * ===================================
 */

// Para desarrollo local, usar config.js
// Para producción (Netlify), usar variables de entorno
window.getAPIKey = function() {
  // Desarrollo local - config.js
  if (window.CONFIG && window.CONFIG.GROQ_API_KEY) {
    return window.CONFIG.GROQ_API_KEY;
  }
  
  // Producción - variable de entorno de Netlify
  if (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) {
    return process.env.GROQ_API_KEY;
  }
  
  // Netlify - variable de entorno del build
  if (window.NETLIFY_ENV && window.NETLIFY_ENV.GROQ_API_KEY) {
    return window.NETLIFY_ENV.GROQ_API_KEY;
  }
  
  return null;
};