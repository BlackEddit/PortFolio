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
      "¿Qué hace Edgar?",
      "Ayuda con Power BI",
      "Proyectos de datos",
      "Contactar a Edgar",
      "Consejos de BI"
    ];

    this.init();
  }

  /**
   * Inicializar el chat assistant
   */
  init() {
    this.createElements();
    this.setupEventListeners();
    this.initializeAPI();
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

      <div class="chat-messages">
        <div class="message assistant">
          <div class="message-content">
            ¡Hola! 👋 Soy Edgar AI, el asistente del portafolio de Edgar. 
            Puedo ayudarte con preguntas sobre Business Intelligence, 
            Data Science, sus proyectos y experiencia. ¿En qué te puedo ayudar?
          </div>
          <div class="message-time">${this.getCurrentTime()}</div>
        </div>
        
        <div class="chat-quick-actions">
          ${this.quickActions.map(action => 
            `<button class="quick-action-btn" data-action="${action}">${action}</button>`
          ).join('')}
        </div>
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

    // Quick actions
    this.elements.quickActions.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        const action = e.target.dataset.action;
        this.sendMessage(action);
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
  initializeAPI() {
    console.log('🔧 Inicializando API...', {
      hasApiKey: !!this.config.apiKey,
      apiKeyLength: this.config.apiKey?.length,
      hasGroqAPI: !!window.GroqAPI
    });
    
    if (this.config.apiKey && window.GroqAPI) {
      this.groqAPI = new window.GroqAPI(this.config.apiKey);
      console.log('✅ Groq API initialized con key:', this.config.apiKey.substring(0, 10) + '...');
    } else {
      console.warn('⚠️ Groq API key not provided or GroqAPI not loaded', {
        apiKey: this.config.apiKey,
        GroqAPI: window.GroqAPI
      });
    }
  }

  /**
   * Agregar mensaje de bienvenida
   */
  addWelcomeMessage() {
    const welcomeMessage = "¡Hola! 👋 Soy Edgar AI, el asistente del portafolio de Edgar. Puedo ayudarte con preguntas sobre Business Intelligence, Data Science, sus proyectos y experiencia. ¿En qué te puedo ayudar?";
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

    // Ocultar quick actions
    this.elements.quickActions.style.display = 'none';

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
    
    messageEl.innerHTML = `
      <div class="message-content">${content}</div>
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
   * Respuesta de fallback cuando no hay API
   */
  getFallbackResponse(message) {
    const responses = {
      'hola': '¡Hola! 👋 Soy Edgar AI. Estoy aquí para contarte sobre Edgar y sus proyectos de BI y Data Science. ¿Qué te interesa saber?',
      'edgar': 'Edgar es un especialista en Business Intelligence y Data Science. Experto en Power BI, Python, DAX y TensorFlow.js. Tiene experiencia en dashboards interactivos y análisis de datos. 📊',
      'power bi': 'Edgar domina Power BI y DAX para crear dashboards impactantes. Ha desarrollado varios proyectos como el dashboard de Ford 2025 e indicadores institucionales. 📈',
      'proyectos': 'Destacan: 🚗 Dashboard Ford 2025, 🏛️ DENUE León con Streamlit, 📊 Indicadores institucionales, 🧠 Red neuronal MNIST con TensorFlow.js',
      'contacto': 'Puedes contactar a Edgar a través del formulario de contacto en su portafolio, LinkedIn o email. ¡Estará encantado de colaborar contigo! 📧',
      'experiencia': 'Edgar tiene experiencia en análisis de datos, visualización con Power BI, desarrollo web, machine learning y creación de dashboards interactivos.',
      'skills': 'Domina: Power BI, DAX, Python, JavaScript, TensorFlow.js, Streamlit, HTML/CSS, análisis estadístico y visualización de datos.',
      'data science': 'Edgar aplica Data Science en proyectos reales: análisis predictivo, machine learning, procesamiento de datos y visualizaciones interactivas.',
      'machine learning': 'Ha implementado redes neuronales con TensorFlow.js, modelos predictivos y análisis de patrones en datos empresariales.',
      'ayuda': 'Estoy aquí para responder sobre Edgar, sus proyectos, habilidades técnicas y experiencia en BI/Data Science. ¡Pregúntame lo que quieras! 💡',
      'que hace': 'Edgar se especializa en convertir datos en insights accionables mediante dashboards interactivos, análisis estadístico y soluciones de BI.',
      'dashboards': 'Edgar crea dashboards interactivos en Power BI con visualizaciones impactantes, KPIs dinámicos y análisis en tiempo real.',
      'python': 'Usa Python para análisis de datos, automatización, web scraping, machine learning y desarrollo de aplicaciones con Streamlit.'
    };

    const lowerMessage = message.toLowerCase();
    
    // Buscar coincidencias exactas primero
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

    return 'Interesante pregunta 🤔. Puedo contarte sobre Edgar, sus proyectos de BI, experiencia en Power BI, Data Science o sus habilidades técnicas. ¿Qué te gustaría saber específicamente?';
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