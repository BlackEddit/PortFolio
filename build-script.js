const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando build personalizado...');
console.log('🌍 Variables de entorno:', Object.keys(process.env).filter(key => key.includes('GROQ')));

// Archivo a modificar
const envConfigPath = path.join(__dirname, 'assets', 'js', 'env-config.js');

// Verificar si existe el archivo
if (!fs.existsSync(envConfigPath)) {
  console.error('❌ No se encontró env-config.js');
  process.exit(1);
}

// Leer el archivo
let content = fs.readFileSync(envConfigPath, 'utf8');

// Reemplazar la API key si existe
if (process.env.GROQ_API_KEY) {
  console.log('🔑 Configurando API key para producción...');
  content = content.replace(/%%GROQ_API_KEY%%/g, process.env.GROQ_API_KEY);
  
  // Escribir el archivo modificado
  fs.writeFileSync(envConfigPath, content);
  console.log('✅ API key inyectada correctamente en env-config.js');
} else {
  console.log('⚠️ GROQ_API_KEY no encontrada en variables de entorno');
  console.log('📝 Variables disponibles:', Object.keys(process.env).join(', '));
}

console.log('🏗️ Build completado');