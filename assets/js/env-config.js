/**
 * ===================================
 * CONFIGURACIÓN DE ENTORNO
 * Manejo de API keys para desarrollo y producción
 * ===================================
 */

// Para desarrollo local, usar config.js
// Para producción (Netlify), usar variables de entorno inyectadas durante el build
window.getAPIKey = function() {
  // Desarrollo local - config.js
  if (window.CONFIG && window.CONFIG.GROQ_API_KEY) {
    return window.CONFIG.GROQ_API_KEY;
  }
  
  // Producción - API key inyectada por Netlify durante el build
  // Esta variable se reemplaza automáticamente durante el despliegue
  const netlifyApiKey = '%%GROQ_API_KEY%%';
  if (netlifyApiKey && netlifyApiKey !== '%%GROQ_API_KEY%%') {
    return netlifyApiKey;
  }
  
  console.log('⚠️ API key no encontrada. Usando respuestas fallback.');
  return null;
};