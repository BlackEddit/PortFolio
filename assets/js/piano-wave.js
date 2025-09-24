/**
 * Navigation Wave Effect - Subtle automatic animation
 * Efecto de ola sutil que pasa por la navegación
 */

class NavigationWave {
  constructor() {
    this.navLinks = [];
    this.isPlaying = false;
    this.currentSequence = 0;
    this.waveInterval = null;
    this.sequences = [
      // Secuencia 1: Flujo natural y suave
      [
        { selector: '.piano-key-about', duration: 1200 },
        { selector: '.piano-key-dashboards', duration: 1000 },
        { selector: '.piano-key-models', duration: 1100 },
        { selector: '.piano-key-demo', duration: 1000 },
        { selector: '.piano-key-project', duration: 1300 },
        { selector: '.piano-key-contact', duration: 1200 }
      ],
      // Secuencia 2: Ritmo pausado
      [
        { selector: '.piano-key-demo', duration: 900 },
        { selector: '.piano-key-about', duration: 1100 },
        { selector: '.piano-key-project', duration: 1000 },
        { selector: '.piano-key-models', duration: 900 },
        { selector: '.piano-key-contact', duration: 1200 },
        { selector: '.piano-key-dashboards', duration: 1000 }
      ],
      // Secuencia 3: Flujo muy suave
      [
        { selector: '.piano-key-contact', duration: 1400 },
        { selector: '.piano-key-about', duration: 1200 },
        { selector: '.piano-key-models', duration: 1000 },
        { selector: '.piano-key-project', duration: 1300 },
        { selector: '.piano-key-dashboards', duration: 1100 },
        { selector: '.piano-key-demo', duration: 1200 }
      ]
    ];
    this.currentStepIndex = 0;
    this.init();
  }

  init() {
    this.collectNavLinks();
    this.startWave();
    this.setupEventListeners();
  }

  collectNavLinks() {
    const selectors = [
      '.piano-key-about',
      '.piano-key-dashboards', 
      '.piano-key-models',
      '.piano-key-demo',
      '.piano-key-project',
      '.piano-key-contact'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        this.navLinks.push({
          element: el,
          selector: selector,
          originalColor: getComputedStyle(el).color
        });
      });
    });
  }

  startWave() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentStepIndex = 0;
    this.playCurrentSequence();
  }

  playCurrentSequence() {
    const sequence = this.sequences[this.currentSequence];
    const step = sequence[this.currentStepIndex];
    
    if (!step) {
      // Secuencia terminada, esperar y cambiar a la siguiente
      setTimeout(() => {
        this.currentSequence = (this.currentSequence + 1) % this.sequences.length;
        this.currentStepIndex = 0;
        this.playCurrentSequence();
      }, 3000);
      return;
    }

    // Activar el paso actual
    this.activateStep(step.selector, step.duration);
    
    // Programar el siguiente paso con overlap más suave
    const nextDelay = step.duration * 0.4; // 40% de overlap para fluidez
    this.waveInterval = setTimeout(() => {
      this.currentStepIndex++;
      this.playCurrentSequence();
    }, nextDelay);
  }

  activateStep(selector, duration) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      // Agregar clase de ola activa con transición suave
      element.classList.add('piano-wave-active');
      
      // Crear efecto de ondas con delay para suavidad
      setTimeout(() => {
        this.createRippleEffect(element);
      }, 100);
      
      // Remover la clase después de la duración con fade out gradual
      setTimeout(() => {
        element.classList.remove('piano-wave-active');
      }, duration * 0.8); // Termina antes para permitir overlap
    });
  }

  createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'piano-ripple';
    
    const size = Math.max(rect.width, rect.height) * 0.3;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1000);
  }

  stop() {
    this.isPlaying = false;
    if (this.waveInterval) {
      clearTimeout(this.waveInterval);
      this.waveInterval = null;
    }
    
    // Limpiar todas las clases activas
    this.navLinks.forEach(link => {
      link.element.classList.remove('piano-wave-active');
    });
  }

  setupEventListeners() {
    // Pausar cuando el usuario hace hover en la navegación
    const nav = document.querySelector('nav');
    if (nav) {
      nav.addEventListener('mouseenter', () => {
        this.stop();
      });
      
      nav.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!this.isPlaying) {
            this.startWave();
          }
        }, 1000);
      });
    }

    // Control con tecla P (para pausar/reanudar)
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'p' && e.ctrlKey) {
        e.preventDefault();
        if (this.isPlaying) {
          this.stop();
        } else {
          this.startWave();
        }
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que otros scripts se carguen
  setTimeout(() => {
    window.navigationWave = new NavigationWave();
  }, 1000);
});

// Exportar para uso externo
window.NavigationWave = NavigationWave;