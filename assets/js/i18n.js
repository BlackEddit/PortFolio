/**
 * Internationalization System
 * Sistema simple de traducción ES/EN
 */

class I18nSystem {
  constructor() {
    this.currentLang = 'es';
    this.translations = {};
    this.init();
  }

  /**
   * Inicializa el sistema de idiomas
   */
  async init() {
    console.log('Inicializando sistema de idiomas...');
    
    // Cargar idioma guardado o español por defecto
    const savedLang = localStorage.getItem('lang') || 'es';
    await this.changeLanguage(savedLang);
    
    this.setupEventListeners();
    console.log('Sistema de idiomas inicializado correctamente');
  }

  /**
   * Carga las traducciones desde archivo JSON
   * @param {string} lang - Código de idioma (es/en)
   */
  async loadTranslations(lang) {
    try {
      const response = await fetch(`assets/lang/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${lang}.json:`, error);
      return {};
    }
  }

  /**
   * Aplica las traducciones a todos los elementos con data-i18n
   * @param {Object} translations - Objeto con traducciones
   */
  applyTranslations(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedValue(translations, key);
      if (translation) {
        element.textContent = translation;
      }
    });
  }

  /**
   * Obtiene un valor anidado del objeto de traducciones
   * @param {Object} obj - Objeto de traducciones
   * @param {string} key - Clave anidada (ej: "nav.about")
   */
  getNestedValue(obj, key) {
    return key.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Cambia el idioma activo
   * @param {string} lang - Código de idioma (es/en)
   */
  async changeLanguage(lang) {
    console.log(`Cambiando idioma a: ${lang}`);
    
    const newTranslations = await this.loadTranslations(lang);
    if (Object.keys(newTranslations).length > 0) {
      this.translations = newTranslations;
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
      this.applyTranslations(this.translations);
      this.updateLanguageUI();
    }
  }

  /**
   * Actualiza la interfaz del selector de idioma
   */
  updateLanguageUI() {
    const currentLangText = document.getElementById('currentLangText');
    const spanishBtn = document.getElementById('spanishBtn');
    const englishBtn = document.getElementById('englishBtn');
    
    if (currentLangText) {
      currentLangText.textContent = this.currentLang.toUpperCase();
    }
    
    // Actualizar botones activos
    if (spanishBtn && englishBtn) {
      // Resetear estados
      spanishBtn.classList.remove('bg-emerald-600', 'text-white', 'text-zinc-400');
      englishBtn.classList.remove('bg-emerald-600', 'text-white', 'text-zinc-400');
      
      if (this.currentLang === 'es') {
        spanishBtn.classList.add('bg-emerald-600', 'text-white');
        englishBtn.classList.add('text-zinc-400');
      } else {
        englishBtn.classList.add('bg-emerald-600', 'text-white');
        spanishBtn.classList.add('text-zinc-400');
      }
    }
  }

  /**
   * Configura los event listeners para el selector de idioma
   */
  setupEventListeners() {
    const languageToggle = document.getElementById('languageToggle');
    const spanishBtn = document.getElementById('spanishBtn');
    const englishBtn = document.getElementById('englishBtn');
    const dropdown = document.getElementById('languageDropdown');
    
    // Toggle dropdown
    if (languageToggle) {
      languageToggle.addEventListener('click', () => {
        dropdown?.classList.toggle('hidden');
      });
    }
    
    // Cambiar a español
    if (spanishBtn) {
      spanishBtn.addEventListener('click', () => {
        this.changeLanguage('es');
        dropdown?.classList.add('hidden');
      });
    }
    
    // Cambiar a inglés
    if (englishBtn) {
      englishBtn.addEventListener('click', () => {
        this.changeLanguage('en');
        dropdown?.classList.add('hidden');
      });
    }
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        dropdown?.classList.add('hidden');
      }
    });
  }
}

// Inicializar sistema de idiomas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nSystem();
});