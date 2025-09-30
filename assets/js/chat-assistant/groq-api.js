/**
 * ===================================
 * GROQ API CLIENT
 * Manejo de la API de Groq para IA
 * ===================================
 */

class GroqAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.1-8b-instant'; // Modelo actualizado y más rápido
    this.maxRetries = 3;
    this.timeout = 30000; // 30 segundos
  }

  /**
   * Configurar el contexto del asistente
   */
  getSystemPrompt() {
    return `Eres Edgar AI, el asistente inteligente del portafolio de Edgar Sánchez.

INFORMACIÓN SOBRE EDGAR:
- Especialista en Business Intelligence y Data Science
- Experto en Power BI, DAX, Python, TensorFlow.js
- Desarrolla dashboards interactivos y modelos de ML
- Trabaja con análisis de datos y visualizaciones
- Proyectos: DENUE León (Streamlit), dashboards de Ford, indicadores institucionales
- Tecnologías: Power BI, Python, Pandas, Plotly, Streamlit, TensorFlow.js, DAX

PERSONALIDAD:
- Amigable pero profesional
- Respuestas concisas y útiles
- Enfocado en BI, datos y tecnología
- Usa emojis ocasionalmente
- Habla en español principalmente

CAPACIDADES:
1. Responder preguntas sobre Edgar y su trabajo
2. Explicar conceptos de BI y Data Science
3. Dar consejos sobre Power BI, DAX, Python
4. Ayudar con preguntas técnicas
5. Conectar visitantes con Edgar para proyectos

INSTRUCCIONES:
- Respuestas máximo 150 palabras
- Sé conversacional y útil
- Si no sabes algo, dilo honestamente
- Sugiere contactar a Edgar para proyectos específicos
- Mantente en el tema de datos/BI/tecnología`;
  }

  /**
   * Enviar mensaje a Groq API
   */
  async sendMessage(message, conversationHistory = []) {
    const availableModels = [
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma-7b-it'
    ];
    
    for (let i = 0; i < availableModels.length; i++) {
      try {
        const currentModel = availableModels[i];
        console.log(`🔄 Intentando modelo: ${currentModel}`);
        
        const messages = [
          { role: 'system', content: this.getSystemPrompt() },
          ...conversationHistory,
          { role: 'user', content: message }
        ];

        const response = await this.makeRequest({
          model: currentModel,
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        });

        return {
          success: true,
          message: response.choices[0].message.content,
          usage: response.usage
        };

      } catch (error) {
        console.warn(`❌ Modelo ${availableModels[i]} falló:`, error.message);
        
        // Si es el último modelo, devolver error
        if (i === availableModels.length - 1) {
          console.error('💥 Todos los modelos fallaron');
          return {
            success: false,
            error: error.message,
            message: this.getErrorMessage(error)
          };
        }
        
        // Continuar con el siguiente modelo
        continue;
      }
    }
  }

  /**
   * Hacer petición HTTP a Groq API
   */
  async makeRequest(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  }

  /**
   * Obtener mensaje de error amigable
   */
  getErrorMessage(error) {
    const errorResponses = {
      'rate_limit': '🚫 Demasiadas consultas. Espera un momento e intenta de nuevo.',
      'invalid_api_key': '🔑 Problema de configuración. Por favor contacta a Edgar.',
      'timeout': '⏰ La respuesta tardó mucho. Intenta con una pregunta más corta.',
      'network': '🌐 Problema de conexión. Verifica tu internet.',
      'default': '❌ Algo salió mal. Puedes contactar a Edgar directamente para ayuda.'
    };

    const message = error.message.toLowerCase();
    
    if (message.includes('rate') || message.includes('limit')) {
      return errorResponses.rate_limit;
    }
    if (message.includes('api') || message.includes('key')) {
      return errorResponses.invalid_api_key;
    }
    if (message.includes('timeout') || message.includes('abort')) {
      return errorResponses.timeout;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return errorResponses.network;
    }
    
    return errorResponses.default;
  }

  /**
   * Validar configuración
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Obtener información de rate limits (si está disponible)
   */
  getRateLimitInfo() {
    return {
      requestsPerMinute: 30,
      tokensPerMinute: 6000,
      recommendation: 'Usa preguntas concisas para mejor rendimiento'
    };
  }
}

// Exportar para uso en otros módulos
window.GroqAPI = GroqAPI;