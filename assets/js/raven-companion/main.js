/**
 * ===================================
 * RAVEN COMPANION - VERSIÓN FIJA
 * Cuervo que se queda FIJO al lado del chat
 * ===================================
 */

class RavenCompanion {
  constructor() {
    this.raven = null;
    this.bubble = null;
    this.isActive = false;
    this.chatOpen = false;
    
    this.phrases = [
      "¡Hola! Soy Edgar AI 🤖",
      "¿Necesitas ayuda? 💡", 
      "Pregúntame sobre mis proyectos",
      "¿Datos? ¡Mi especialidad!",
      "Abre el chat para hablar 💬",
      "Power BI es genial 📊",
      "¡Hablemos de ML! 🧠"
    ];
    
    this.init();
  }

  /**
   * Inicializar el cuervo
   */
  init() {
    this.createRaven();
    this.createBubble();
    this.setupEventListeners();
    
    // Saludo inicial después de 2 segundos
    setTimeout(() => {
      this.showBubble("¡Hola! 🐦‍⬛ Click en mí para chatear", 4000);
    }, 2000);
  }

  /**
   * Crear elemento del cuervo ÉPICO 🔥
   */
  createRaven() {
    this.raven = document.createElement('div');
    this.raven.className = 'raven-companion epic-raven floating';
    
    // Cuervo SVG épico con animaciones
    this.raven.innerHTML = `
      <div class="raven-container">
        <div class="raven-shadow"></div>
        <div class="raven-body">
          <svg width="70" height="70" viewBox="0 0 100 100" class="raven-svg">
            <!-- Cuerpo del cuervo -->
            <ellipse cx="50" cy="60" rx="25" ry="20" fill="#1a1a2e" class="raven-main-body"/>
            
            <!-- Cabeza -->
            <circle cx="50" cy="35" r="18" fill="#16213e" class="raven-head"/>
            
            <!-- Alas -->
            <path d="M25 55 Q15 45 20 65 Q30 70 35 60" fill="#0f1419" class="raven-wing left-wing"/>
            <path d="M75 55 Q85 45 80 65 Q70 70 65 60" fill="#0f1419" class="raven-wing right-wing"/>
            
            <!-- Pico -->
            <path d="M42 32 Q35 30 42 35" fill="#ffaa00" class="raven-beak"/>
            
            <!-- Ojos brillantes -->
            <circle cx="45" cy="32" r="4" fill="#00ffaa" class="raven-eye left-eye">
              <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="fill" values="#00ffaa;#00ccff;#ff00aa;#00ffaa" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="55" cy="32" r="4" fill="#00ffaa" class="raven-eye right-eye">
              <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="fill" values="#00ffaa;#00ccff;#ff00aa;#00ffaa" dur="3s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Brillo en los ojos -->
            <circle cx="46" cy="31" r="1" fill="#ffffff" opacity="0.8"/>
            <circle cx="56" cy="31" r="1" fill="#ffffff" opacity="0.8"/>
            
            <!-- Cola -->
            <path d="M50 80 Q45 90 55 90 Q50 85 50 80" fill="#1a1a1a" class="raven-tail"/>
          </svg>
        </div>
        
        <!-- Partículas mágicas -->
        <div class="magic-particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>
        
        <!-- Aura brillante -->
        <div class="raven-aura"></div>
      </div>
    `;
    
    // Posición FIJA al lado del chat
    this.raven.style.cssText = `
      position: fixed;
      bottom: 140px;
      right: 30px;
      cursor: pointer;
      z-index: 999;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 8px 16px rgba(0, 255, 255, 0.3));
    `;
    
    document.body.appendChild(this.raven);
    this.startEpicAnimations();
  }

  /**
   * Crear burbuja de diálogo FIJA
   */
  createBubble() {
    this.bubble = document.createElement('div');
    this.bubble.className = 'raven-bubble fixed-bubble';
    this.bubble.style.cssText = `
      position: fixed;
      bottom: 230px;
      right: 15px;
      background: rgba(15, 23, 42, 0.98);
      backdrop-filter: blur(15px);
      border: 2px solid rgba(0, 255, 170, 0.4);
      border-radius: 16px;
      padding: 14px 18px;
      color: #e2e8f0;
      font-size: 15px;
      font-weight: 500;
      max-width: 280px;
      opacity: 0;
      transform: translateY(15px) scale(0.85);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10000;
      box-shadow: 0 12px 40px rgba(0, 255, 170, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4);
      pointer-events: none;
    `;
    
    // Agregar triángulo apuntando al cuervo
    this.bubble.classList.add('raven-speech-bubble');
    
    document.body.appendChild(this.bubble);
  }

  /**
   * Configurar eventos (SIN seguir mouse)
   */
  setupEventListeners() {
    // Click en el cuervo para frases random
    this.raven.addEventListener('click', () => {
      this.onRavenClick();
    });

    // Hover effects épicos
    this.raven.addEventListener('mouseenter', () => {
      const aura = this.raven.querySelector('.raven-aura');
      const particles = this.raven.querySelectorAll('.particle');
      
      if (aura) aura.style.opacity = '0.4';
      particles.forEach(particle => {
        particle.style.animationDuration = '2s';
      });
      
      // Sonido sutil (opcional)
      this.playHoverSound();
    });

    this.raven.addEventListener('mouseleave', () => {
      const aura = this.raven.querySelector('.raven-aura');
      const particles = this.raven.querySelectorAll('.particle');
      
      if (aura && !this.isActive) aura.style.opacity = '0';
      particles.forEach(particle => {
        particle.style.animationDuration = '4s';
      });
    });
  }

  /**
   * Click en el cuervo - ABRIR CHAT
   */
  onRavenClick() {
    // Buscar el chat assistant y abrirlo/cerrarlo
    if (window.chatAssistantInstance) {
      window.chatAssistantInstance.toggleChat();
    } else {
      // Fallback: mostrar frase si no hay chat
      const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
      this.showBubble(randomPhrase, 3000);
    }
    
    // Animación de "hablando"
    this.raven.style.animation = 'ravenThink 0.6s ease-in-out';
    setTimeout(() => {
      this.raven.style.animation = 'ravenFloat 3s ease-in-out infinite';
    }, 600);
  }

  /**
   * Mostrar burbuja con mensaje
   */
  showBubble(message, duration = 3000) {
    this.bubble.innerHTML = message;
    this.bubble.style.opacity = '1';
    this.bubble.style.transform = 'translateY(0) scale(1)';
    
    setTimeout(() => {
      this.hideBubble();
    }, duration);
  }

  /**
   * Ocultar burbuja
   */
  hideBubble() {
    this.bubble.style.opacity = '0';
    this.bubble.style.transform = 'translateY(10px) scale(0.9)';
  }

  /**
   * Reaccionar cuando se abre/cierra el chat
   */
  onChatToggle(isOpen) {
    this.chatOpen = isOpen;
    
    if (isOpen) {
      this.raven.style.transform = 'scale(1.05)';
      this.showBubble("¡Genial! ¿En qué puedo ayudarte? 🚀", 2000);
    } else {
      this.raven.style.transform = 'scale(1)';
    }
  }

  /**
   * Reaccionar cuando llega un mensaje del chat
   */
  onChatMessage(type = 'user') {
    if (type === 'assistant') {
      // El cuervo "reacciona" cuando la IA responde
      this.raven.style.animation = 'ravenThink 0.8s ease-in-out';
      setTimeout(() => {
        this.raven.style.animation = 'ravenFloat 3s ease-in-out infinite';
      }, 800);
    }
  }

  /**
   * Estados del cuervo con efectos visuales
   */
  setState(state) {
    this.raven.className = `raven-companion epic-raven ${state}`;
    
    // Efectos visuales según el estado
    const aura = this.raven.querySelector('.raven-aura');
    const eyes = this.raven.querySelectorAll('.raven-eye');
    
    switch (state) {
      case 'active':
        if (aura) aura.style.opacity = '0.6';
        eyes.forEach(eye => eye.style.fill = '#00ff00');
        break;
      case 'listening':
        if (aura) aura.style.opacity = '0.8';
        eyes.forEach(eye => eye.style.fill = '#ffff00');
        break;
      case 'thinking':
        eyes.forEach(eye => eye.style.fill = '#ff00ff');
        break;
      default:
        if (aura) aura.style.opacity = '0';
        eyes.forEach(eye => eye.style.fill = '#00ffff');
    }
  }

  /**
   * Iniciar animaciones épicas del cuervo
   */
  startEpicAnimations() {
    // Animación de respiración
    this.breathingAnimation();
    
    // Parpadeo de ojos aleatorio
    this.blinkEyes();
    
    // Movimiento sutil de alas
    this.animateWings();
    
    // Partículas flotantes
    this.animateParticles();
  }

  /**
   * Animación de respiración sutil
   */
  breathingAnimation() {
    const animate = () => {
      this.breathingPhase += 0.02;
      const scale = 1 + Math.sin(this.breathingPhase) * 0.05;
      const body = this.raven.querySelector('.raven-main-body');
      if (body) {
        body.style.transform = `scale(${scale})`;
      }
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Parpadeo aleatorio de ojos
   */
  blinkEyes() {
    setInterval(() => {
      if (Math.random() > 0.7) {
        const eyes = this.raven.querySelectorAll('.raven-eye');
        eyes.forEach(eye => {
          eye.style.animation = 'ravenBlink 0.3s ease-in-out';
          setTimeout(() => {
            eye.style.animation = '';
          }, 300);
        });
      }
    }, 2000);
  }

  /**
   * Animación sutil de alas
   */
  animateWings() {
    const leftWing = this.raven.querySelector('.left-wing');
    const rightWing = this.raven.querySelector('.right-wing');
    
    if (leftWing && rightWing) {
      leftWing.style.animation = 'ravenWingLeft 4s ease-in-out infinite';
      rightWing.style.animation = 'ravenWingRight 4s ease-in-out infinite';
    }
  }

  /**
   * Animación de partículas mágicas
   */
  animateParticles() {
    const particles = this.raven.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      particle.style.animationDelay = `${index * 0.5}s`;
    });
  }

  /**
   * Manejar eventos del chat (MÉTODO QUE FALTABA)
   */
  onChatEvent(event) {
    switch (event) {
      case 'chat_opened':
        this.setState('active');
        this.showBubble("¡Perfecto! ¿En qué te ayudo? 🚀", 2000);
        this.triggerEpicEffect('activate');
        break;
      case 'chat_closed':
        this.setState('floating');
        this.showBubble("¡Hasta luego! 👋", 1500);
        this.triggerEpicEffect('deactivate');
        break;
      case 'message_sent':
        this.setState('listening');
        this.triggerEpicEffect('pulse');
        break;
      case 'response_received':
        this.setState('active');
        this.triggerEpicEffect('glow');
        break;
    }
  }

  /**
   * Efectos épicos para eventos especiales
   */
  triggerEpicEffect(effect) {
    const aura = this.raven.querySelector('.raven-aura');
    if (!aura) return;
    
    switch (effect) {
      case 'activate':
        aura.style.animation = 'ravenActivate 1s ease-out';
        break;
      case 'pulse':
        aura.style.animation = 'ravenPulse 0.6s ease-in-out';
        break;
      case 'glow':
        aura.style.animation = 'ravenGlow 2s ease-in-out';
        break;
    }
    
    setTimeout(() => {
      aura.style.animation = '';
    }, 2000);
  }

  /**
   * Sonido sutil en hover (opcional)
   */
  playHoverSound() {
    // Crear un sonido sintético sutil
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Silenciosamente fallar si no hay soporte de audio
      }
    }
  }

  /**
   * Cleanup al destruir
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.raven && this.raven.parentNode) {
      this.raven.parentNode.removeChild(this.raven);
    }
    if (this.bubble && this.bubble.parentNode) {
      this.bubble.parentNode.removeChild(this.bubble);
    }
  }
}

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.RavenCompanion = RavenCompanion;
}