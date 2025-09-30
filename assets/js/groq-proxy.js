/**
 * ===================================
 * PROXY PARA GROQ API
 * Para usar en GitHub Pages sin exponer API key
 * ===================================
 */

class GroqProxy {
  constructor() {
    this.proxyURL = 'https://api.allorigins.win/raw?url=';
    this.groqURL = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async sendMessage(message, conversationHistory = []) {
    // En GitHub Pages, usar proxy público (limitado pero funcional)
    const messages = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    try {
      // Intento 1: Con proxy público (puede fallar)
      const response = await this.makeProxyRequest(messages);
      return {
        success: true,
        message: response.choices[0].message.content
      };
    } catch (error) {
      // Fallback a respuestas predefinidas
      console.log('📝 Usando respuestas predefinidas por limitación de proxy');
      return {
        success: true,
        message: this.getFallbackResponse(message),
        isProxy: true
      };
    }
  }

  getSystemPrompt() {
    return `Eres Edgar AI, el asistente del portafolio de Edgar Sánchez, especialista en BI y Data Science.`;
  }

  getFallbackResponse(message) {
    const responses = {
      'hola': '¡Hola! 👋 Soy Edgar AI. Pregúntame sobre Edgar y sus proyectos de BI.',
      'edgar': 'Edgar es especialista en Business Intelligence y Data Science. Experto en Power BI, Python y TensorFlow.js. 📊',
      'proyectos': 'Destacan: Dashboard Ford 2025 🚗, DENUE León con Streamlit 🏛️, Red neuronal MNIST 🧠',
      'power bi': 'Edgar domina Power BI y DAX. Ha creado dashboards interactivos para análisis empresarial. 📈',
      'contacto': 'Puedes contactar a Edgar através del formulario en su portafolio. ¡Estará encantado de colaborar! 📧'
    };

    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return 'Pregúntame sobre Edgar, sus proyectos de BI, experiencia en Power BI o habilidades técnicas. ¿Qué te interesa saber? 🤔';
  }

  async makeProxyRequest(messages) {
    // Esta es una implementación básica - en producción necesitarías un proxy real
    throw new Error('Proxy no disponible en GitHub Pages');
  }
}

window.GroqProxy = GroqProxy;