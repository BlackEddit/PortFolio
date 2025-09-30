/**
 * ===================================
 * CONFIGURACIÓN DE ENTORNO
 * Manejo de API keys para desarrollo y producción
 * ===================================
 */

// Para desarrollo local, usar config.js
// Para producción (Netlify), usar función serverless
window.getAPIKey = async function() {
  console.log('🔍 Checking API Key sources...');
  
  // Desarrollo local - config.js
  if (window.CONFIG && window.CONFIG.GROQ_API_KEY) {
    console.log('✅ API Key found in CONFIG');
    return window.CONFIG.GROQ_API_KEY;
  }
  
  // Producción - Función de Netlify
  try {
    console.log('🌐 Fetching API key from Netlify function...');
    const response = await fetch('/.netlify/functions/get-api-key');
    const data = await response.json();
    
    if (data.hasApiKey && data.apiKey) {
      console.log('✅ API Key found from Netlify function');
      return data.apiKey;
    }
  } catch (error) {
    console.log('❌ Error fetching from Netlify function:', error.message);
  }
  
  console.log('⚠️ API key no encontrada en ninguna fuente. Usando respuestas fallback.');
  console.log('🔍 Sources checked: window.CONFIG, Netlify function');
  return null;
};