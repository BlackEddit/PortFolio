#!/bin/bash

# Script de build para Netlify
# Reemplaza las variables de entorno en los archivos JS

echo "🔧 Iniciando build personalizado..."

# Reemplazar la API key en env-config.js
if [ ! -z "$GROQ_API_KEY" ]; then
    echo "🔑 Configurando API key para producción..."
    sed -i "s/%%GROQ_API_KEY%%/$GROQ_API_KEY/g" assets/js/env-config.js
    echo "✅ API key configurada correctamente"
else
    echo "⚠️ GROQ_API_KEY no encontrada en variables de entorno"
fi

echo "🏗️ Build completado"