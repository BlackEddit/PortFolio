/**
 * ===================================
 * CONFIGURACIÓN DE ENTORNO
 * Manejo de API keys para desarrollo y producción
 * ===================================
 */

// Para desarrollo local, usar config.js
// Para producción (Netlify), usar variables de entorno inyectadas durante el build
window.getAPIKey = function() {
  console.log('🔍 Checking API Key sources...');
  
  // Desarrollo local - config.js
  if (window.CONFIG && window.CONFIG.GROQ_API_KEY) {
    console.log('✅ API Key found in CONFIG');
    return window.CONFIG.GROQ_API_KEY;
  }
  
  // Producción - API key inyectada por Netlify durante el build
  // Esta variable se reemplaza automáticamente durante el despliegue
  const netlifyApiKey = '%%GROQ_API_KEY%%';
  console.log('🔍 Netlify API Key placeholder:', netlifyApiKey === '%%GROQ_API_KEY%%' ? 'NOT_REPLACED' : 'REPLACED');
  
  if (netlifyApiKey && netlifyApiKey !== '%%GROQ_API_KEY%%') {
    console.log('✅ API Key found from Netlify build');
    return netlifyApiKey;
  }
  
  console.log('⚠️ API key no encontrada en ninguna fuente. Usando respuestas fallback.');
  console.log('🔍 Sources checked: window.CONFIG, netlify build injection');
  return null;
};