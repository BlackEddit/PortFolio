/**
 * ===================================
 * CHAT ASSISTANT - MAIN
 * Controlador principal del chat con IA
 * ===================================
 */

class ChatAssistant {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || null,
      containerId: config.containerId || 'chat-assistant',
      position: config.position || 'bottom-right',
      autoOpen: config.autoOpen || false,
      maxMessages: config.maxMessages || 50,
      ...config
    };

    this.isOpen = false;
    this.isLoading = false;
    this.conversation = [];
    this.groqAPI = null;
    this.raven = null;
    this.elements = {};

    this.quickActions = [
      "CV",
      "Contacto", 
      "Info"
    ];

    this.init();
  }

  /**
   * Inicializar el chat assistant
   */
  async init() {
    this.createElements();
    this.setupEventListeners();
    await this.initializeAPI();
    this.initializeRaven();
    this.addWelcomeMessage();
    
    if (this.config.autoOpen) {
      setTimeout(() => this.openChat(), 2000);
    }

    console.log('💬 Chat Assistant initialized');
  }

  /**
   * Crear elementos del chat (SIN BOTÓN - el cuervo es el botón)
   */
  createElements() {
    // VERIFICAR si ya existe para evitar duplicados
    const existingContainer = document.getElementById(this.config.containerId);
    if (existingContainer) {
      console.log('⚠️ Chat container already exists, removing old one');
      existingContainer.remove();
    }

    // Container principal
    const container = document.createElement('div');
    container.id = this.config.containerId;
    container.className = 'chat-assistant';

    // Solo la ventana de chat (SIN botón toggle)
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = this.getChatHTML();

    container.appendChild(chatWindow);
    document.body.appendChild(container);

    // Referencias a elementos
    this.elements = {
      container,
      chatWindow,
      messages: chatWindow.querySelector('.chat-messages'),
      input: chatWindow.querySelector('.chat-input'),
      sendBtn: chatWindow.querySelector('.chat-send-btn'),
      inputContainer: chatWindow.querySelector('.chat-input-container'),
      quickActions: chatWindow.querySelector('.chat-quick-actions'),
      closeBtn: chatWindow.querySelector('.chat-close-btn')
    };

    // 🔍 DEBUG: Verificar elementos creados
    console.log('🔍 DEBUG - Elementos creados:', {
      container: container.id,
      inputContainer: this.elements.inputContainer ? 'EXISTS' : 'NOT FOUND',
      input: this.elements.input ? 'EXISTS' : 'NOT FOUND',
      sendBtn: this.elements.sendBtn ? 'EXISTS' : 'NOT FOUND',
      inputContainerChildren: this.elements.inputContainer ? this.elements.inputContainer.children.length : 0
    });

    // 🔍 DEBUG: Verificar posición de elementos
    setTimeout(() => {
      const allInputContainers = document.querySelectorAll('.chat-input-container');
      const allInputs = document.querySelectorAll('.chat-input');
      const allSendBtns = document.querySelectorAll('.chat-send-btn');
      
      console.log('🔍 DEBUG - Elementos en DOM:', {
        inputContainers: allInputContainers.length,
        inputs: allInputs.length,
        sendBtns: allSendBtns.length
      });

      // Mostrar posición de cada elemento
      allInputs.forEach((input, i) => {
        const rect = input.getBoundingClientRect();
        console.log(`🔍 Input ${i}:`, { top: rect.top, left: rect.left, parent: input.parentElement?.className });
      });

      allSendBtns.forEach((btn, i) => {
        const rect = btn.getBoundingClientRect();
        console.log(`🔍 SendBtn ${i}:`, { top: rect.top, left: rect.left, parent: btn.parentElement?.className });
      });
    }, 500);
  }

  /**
   * Obtener HTML del chat
   */
  getChatHTML() {
    return `
      <div class="chat-header">
        <div class="chat-avatar">🐦‍⬛</div>
        <div class="chat-info">
          <h3>Edgar AI</h3>
          <p>Asistente de BI & Data Science</p>
        </div>
        <div class="chat-status"></div>
        <button class="chat-close-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18"></path>
            <path d="M6 6L18 18"></path>
          </svg>
        </button>
      </div>

      <div class="chat-quick-actions">
        ${this.quickActions.map(action => 
          `<button class="quick-action-btn" data-action="${action}">${action}</button>`
        ).join('')}
      </div>

      <div class="chat-messages">
      </div>

      <div class="chat-input-container">
        <textarea class="chat-input" placeholder="Escribe tu pregunta..." rows="1"></textarea>
        <button class="chat-send-btn" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13"></path>
            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botón de cerrar
    this.elements.closeBtn.addEventListener('click', () => this.closeChat());

    // Enviar mensaje
    this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Enter para enviar
    this.elements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.elements.input.addEventListener('input', () => {
      this.autoResizeTextarea();
    });

    // Quick actions - Llamar funciones directamente
    this.elements.quickActions.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        const action = e.target.dataset.action;
        
        // Agregar mensaje del usuario
        this.addMessage(action, 'user');
        
        // Ejecutar acción específica
        let response;
        if (action === 'CV') {
          response = this.handleCVDownload();
        } else if (action === 'Contacto') {
          response = this.handleContactInfo();
        } else if (action === 'Info') {
          response = this.handleEdgarInfo();
        } else {
          // Fallback para otras acciones
          response = this.getFallbackResponse(action);
        }
        
        // Mostrar respuesta
        this.addMessage(response, 'assistant');
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  /**
   * Inicializar API de Groq
   */
  async initializeAPI() {
    console.log('🔧 Inicializando API...');
    
    // Obtener API key (puede ser asíncrona)
    const apiKey = await getAPIKey();
    
    console.log('🔍 API Key check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      hasGroqAPI: !!window.GroqAPI
    });
    
    if (apiKey && window.GroqAPI) {
      this.config.apiKey = apiKey;
      this.groqAPI = new window.GroqAPI(apiKey);
      console.log('✅ Groq API initialized con key:', apiKey.substring(0, 10) + '...');
    } else {
      console.warn('⚠️ Groq API key not provided or GroqAPI not loaded', {
        apiKey: !!apiKey,
        GroqAPI: !!window.GroqAPI
      });
    }
  }

  /**
   * Agregar mensaje de bienvenida mejorado
   */
  addWelcomeMessage() {
    const welcomeMessage = "¡Hola! 👋 Soy Edgar AI, ¿en qué te puedo ayudar?\n\n❓ Preguntas frecuentes:\n• ¿Qué proyectos has hecho?\n• ¿Cuánto cobras por un dashboard?\n• ¿Estás disponible para trabajar?\n• ¿Qué experiencia tienes en Power BI?";
    this.addMessage(welcomeMessage, 'assistant');
  }

  /**
   * Inicializar cuervo compañero
   */
  initializeRaven() {
    if (window.RavenCompanion) {
      this.raven = new window.RavenCompanion();
      console.log('🐦‍⬛ Raven Companion initialized');
    } else {
      console.warn('⚠️ RavenCompanion not loaded');
    }
  }

  /**
   * Abrir/cerrar chat
   */
  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  /**
   * Abrir chat
   */
  openChat() {
    this.isOpen = true;
    this.elements.chatWindow.classList.add('active');
    this.elements.input.focus();
    
    // Notificar al cuervo
    if (this.raven) {
      this.raven.onChatEvent('chat_opened');
    }
  }

  /**
   * Cerrar chat
   */
  closeChat() {
    this.isOpen = false;
    this.elements.chatWindow.classList.remove('active');
    
    // Notificar al cuervo
    if (this.raven) {
      this.raven.onChatEvent('chat_closed');
    }
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(text = null) {
    const message = text || this.elements.input.value.trim();
    
    if (!message || this.isLoading) return;

    // Limpiar input
    this.elements.input.value = '';
    this.autoResizeTextarea();

    // Agregar mensaje del usuario
    this.addMessage(message, 'user');

    // Las opciones se mantienen visibles siempre (comentado)
    // this.elements.quickActions.style.display = 'none';

    // Mostrar typing indicator
    this.showTypingIndicator();
    this.setLoading(true);

    // Notificar al cuervo
    if (this.raven) {
      this.raven.onChatEvent('message_sent');
    }

    try {
      let response;
      
      console.log('🚀 Enviando mensaje...', {
        hasGroqAPI: !!this.groqAPI,
        isConfigured: this.groqAPI?.isConfigured(),
        message: message.substring(0, 50)
      });
      
      if (this.groqAPI && this.groqAPI.isConfigured()) {
        // Usar Groq API
        console.log('🤖 Usando Groq API...');
        const result = await this.groqAPI.sendMessage(message, this.getConversationHistory());
        
        if (result.success) {
          response = result.message;
          console.log('✅ Respuesta de Groq recibida');
        } else {
          console.error('❌ Error de Groq:', result.error);
          throw new Error(result.error);
        }
      } else {
        // Fallback a respuestas predefinidas
        console.log('📝 Usando respuestas fallback');
        response = this.getFallbackResponse(message);
      }

      this.hideTypingIndicator();
      this.addMessage(response, 'assistant');

      // Notificar al cuervo
      if (this.raven) {
        this.raven.onChatEvent('response_received');
      }

    } catch (error) {
      console.error('Chat error:', error);
      this.hideTypingIndicator();
      this.addMessage(
        'Lo siento, hay un problema técnico. Puedes contactar directamente a Edgar para ayuda. 😅',
        'assistant',
        true
      );

      // Notificar al cuervo
      if (this.raven) {
        this.raven.onChatEvent('error');
      }
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Agregar mensaje al chat
   */
  addMessage(content, type, isError = false) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} ${isError ? 'error' : ''}`;
    
    // Convertir markdown básico a HTML
    const formattedContent = this.formatMessage(content);
    
    messageEl.innerHTML = `
      <div class="message-content">${formattedContent}</div>
      <div class="message-time">${this.getCurrentTime()}</div>
    `;

    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();

    // Guardar en conversación
    if (!isError) {
      this.conversation.push({ role: type === 'user' ? 'user' : 'assistant', content });
      
      // Limitar historial
      if (this.conversation.length > this.config.maxMessages) {
        this.conversation = this.conversation.slice(-this.config.maxMessages);
      }
    }
  }

  /**
   * Mostrar indicador de escritura
   */
  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.id = 'typing-indicator';
    
    typingEl.innerHTML = `
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <span>Edgar AI está escribiendo...</span>
    `;

    this.elements.messages.appendChild(typingEl);
    this.scrollToBottom();
  }

  /**
   * Ocultar indicador de escritura
   */
  hideTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  /**
   * Configurar estado de carga
   */
  setLoading(loading) {
    this.isLoading = loading;
    this.elements.sendBtn.disabled = loading;
    this.elements.input.disabled = loading;
    this.elements.inputContainer.classList.toggle('sending', loading);
  }

  /**
   * Auto-resize del textarea
   */
  autoResizeTextarea() {
    const textarea = this.elements.input;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 60) + 'px';
  }

  /**
   * Scroll al final del chat
   */
  scrollToBottom() {
    setTimeout(() => {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }, 100);
  }

  /**
   * Obtener historial de conversación
   */
  getConversationHistory() {
    return this.conversation.slice(-10); // Últimos 10 mensajes
  }

  /**
   * Respuesta de fallback cuando no hay API - VERSIÓN MEJORADA
   */
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // ACCIONES PRINCIPALES CON FUNCIONALIDAD REAL
    if (lowerMessage.includes('descargar cv') || lowerMessage.includes('📋 descargar cv') || 
        lowerMessage.includes('curriculum') || lowerMessage.includes('cv')) {
      return this.handleCVDownload();
    }
    
    if (lowerMessage.includes('contacto directo') || lowerMessage.includes('📧 contacto directo') || 
        lowerMessage.includes('contacto') || lowerMessage.includes('email') || lowerMessage.includes('contactar')) {
      return this.handleContactInfo();
    }
    
    if (lowerMessage.includes('qué hace edgar') || lowerMessage.includes('💡 qué hace edgar') || 
        lowerMessage.includes('que hace') || lowerMessage.includes('edgar')) {
      return this.handleEdgarInfo();
    }
    
    // RESPUESTAS TÉCNICAS MEJORADAS
    const responses = {
      'hola': '¡Hola! 👋 Soy Edgar AI, tu asistente personal.\n\n🎯 **Opciones rápidas:**\n📋 **Descargar CV** - CV completo de Edgar\n📧 **Contacto directo** - Info para contactarlo\n💡 **Qué hace Edgar** - Su especialidad y experiencia\n\n¿Qué necesitas?',
      
      'power bi': '📊 **Edgar es EXPERTO en Power BI:**\n\n🔥 **Skills avanzados:**\n• DAX complejo y optimizado\n• Modelado dimensional\n• Visualizaciones custom\n• Performance tuning\n• Row Level Security\n\n🏆 **Proyectos destacados:**\n• Dashboard Ford 2025 (15+ KPIs)\n• Análisis DENUE León (106K registros)\n• Indicadores en tiempo real\n\n💰 Tarifa: $800-1,200 MXN/hora\n📧 ¿Te interesa? Usa "Contacto directo"',
      
      'proyectos': '🚀 **Portfolio de Edgar - Proyectos Reales:**\n\n🚗 **Dashboard Ford 2025**\n• Power BI con 15+ visualizaciones\n• KPIs de ventas en tiempo real\n• DAX avanzado para métricas complejas\n• ROI: +40% eficiencia en reportes\n\n🏛️ **DENUE León - Big Data**\n• 106,844 registros analizados\n• Streamlit web app interactiva\n• Análisis geoespacial completo\n• Mapas dinámicos con filtros\n\n🧠 **Red Neuronal MNIST**\n• TensorFlow.js en navegador\n• 99.2% accuracy\n• Interface web interactiva\n• Demo funcional en el portafolio\n\n📋 ¿Quieres más detalles? Descarga su CV completo',
      
      'disponible': '📅 **Edgar está DISPONIBLE:**\n\n✅ **Para nuevos proyectos**\n⚡ **Inicio inmediato**\n🕐 **Respuesta < 24 horas**\n\n💼 **Modalidades:**\n• Remoto (preferido)\n• Híbrido (León, Guanajuato)\n• Presencial (proyectos especiales)\n\n💰 **Tarifas competitivas**\n📧 Usa "Contacto directo" para cotizar'
    };
    
    // Buscar coincidencias exactas en respuestas técnicas
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Respuestas por categorías
    if (lowerMessage.match(/(quien|who|quién)/)) {
      return '¡Soy Edgar AI! 🤖 Hablo sobre Edgar Sánchez, especialista en BI y Data Science. Pregúntame sobre sus proyectos, experiencia o habilidades técnicas.';
    }
    
    if (lowerMessage.match(/(trabajo|job|empleo)/)) {
      return 'Edgar busca oportunidades en Business Intelligence, Data Science y desarrollo de dashboards. ¡Perfecto para proyectos de análisis de datos! 💼';
    }

    return '🤔 **Pregunta interesante!**\n\nPuedo ayudarte con:\n📋 **"Descargar CV"** - CV completo de Edgar\n📧 **"Contacto directo"** - Información de contacto\n💡 **"Qué hace Edgar"** - Su especialidad y experiencia\n\n¿Qué necesitas específicamente?';
  }

  /**
   * MANEJAR DESCARGA DE CV
   */
  handleCVDownload() {
    // Crear y ejecutar descarga inmediata del CV
    const link = document.createElement('a');
    link.href = 'assets/cvs/CV_EdgarSanchez.pdf';
    link.download = 'CV_Edgar_Sanchez_BI_DataScience.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return '📋 **¡CV descargado exitosamente!** ✅\n\n📄 **Edgar Sánchez - BI & Data Science Expert**\n• 3+ años de experiencia\n• Especialista en Power BI y Python\n• Proyectos con ROI promedio 300%\n• Disponible para nuevos proyectos\n\n💡 **El archivo se guardó en tu carpeta de Descargas**\n📧 ¿Te interesa contactarlo? Usa "Contacto directo"';
  }

  /**
   * MANEJAR INFORMACIÓN DE CONTACTO
   */
  handleContactInfo() {
    // Email simple y directo
    const subject = encodeURIComponent('Contacto desde tu portafolio');
    const body = encodeURIComponent(`Hola Edgar,

Vi tu portafolio y me interesa contactarte.

Mi mensaje:
[Escribe aquí tu mensaje]

Saludos`);
    
    // Abrir email automáticamente
    const mailtoLink = `mailto:edgar.sanchez.bi@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    return '📧 **¡Email abierto!** ✅\n\n📬 **Destinatario:** edgar.sanchez.bi@gmail.com\n⚡ **Responde en:** < 24 horas\n� **WhatsApp:** +52 477 123 4567\n\n💡 **Solo escribe tu mensaje y envía**';
  }

  /**
   * MANEJAR INFORMACIÓN SOBRE EDGAR
   */
  handleEdgarInfo() {
    return '👨‍💻 **Edgar Sánchez - Business Intelligence Expert**\n\n🎯 **¿Qué hace?**\nTransforma datos complejos en insights accionables. Especialista en crear dashboards que impactan ROI y toma de decisiones.\n\n🛠️ **Especialidades:**\n• **Power BI Master:** DAX avanzado, modelado, performance\n• **Python Expert:** Pandas, ML, automatización\n• **Data Science:** TensorFlow, análisis predictivo\n• **Full Stack:** JavaScript, APIs, desarrollo web\n\n💼 **Experiencia:**\n• 3+ años en BI y análisis\n• 25+ dashboards entregados\n• ROI promedio: 300% en 6 meses\n• Clientes satisfechos en múltiples industrias\n\n💰 **Disponibilidad:**\n• Empleado: $25K-35K MXN/mes\n• Freelance: $15K-50K MXN/proyecto\n• Por hora: $800-1,200 MXN/hr\n\n🚀 **¿Te interesa su perfil?**\n📋 Descarga su CV completo\n📧 Contacto directo para cotizar';
  }

  /**
   * Formatear mensaje con markdown básico
   */
  formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **texto** -> <strong>texto</strong>
      .replace(/\n/g, '<br>') // Saltos de línea
      .replace(/• /g, '<br>• '); // Viñetas con salto de línea
  }

  /**
   * Obtener hora actual
   */
  getCurrentTime() {
    return new Date().toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Configurar API key
   */
  setAPIKey(apiKey) {
    this.config.apiKey = apiKey;
    this.initializeAPI();
  }

  /**
   * Destruir el chat
   */
  destroy() {
    if (this.elements.container && this.elements.container.parentNode) {
      this.elements.container.parentNode.removeChild(this.elements.container);
    }
    
    if (this.raven) {
      this.raven.destroy();
    }
  }
}

// Exportar para uso global
window.ChatAssistant = ChatAssistant;