class I18n {
  constructor() {
    this.currentLang = 'es'; // idioma por defecto
    this.translations = {};
    this.init();
  }

  async init() {
    // 1. Detectar idioma automáticamente 
    await this.detectLanguage(); // Espera: detecta idioma del usuario
    
    // 2. Cargar traducciones
    await this.loadTranslations();// Espera: carga el diccionario
    
    // 3. Aplicar traducciones
    this.translatePage();// Traduce la página
    
    // 4. Crear selector de idioma
    this.createLanguageSelector();// Crea el botón de idiomas
  }

  async detectLanguage() {
    // Prioridad de detección:
    // 1. URL parameter (?lang=en)  Busca específicamente el parámetro "lang"
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    
    // 2. LocalStorage (preferencia guardada)
    const savedLang = localStorage.getItem('language');
    
    // 3. Navegador del usuario
    const browserLang = navigator.language.slice(0, 2); // 'es-MX' -> 'es'
    
    // 4. Detección por IP/geolocalización (simplificada)
    const geoLang = await this.detectByGeo(); //await = "Espera a que termine detectByGeo() antes de continuar"

    // Decidir idioma final
    if (urlLang && ['es', 'en'].includes(urlLang)) {
      this.currentLang = urlLang;
    } else if (savedLang && ['es', 'en'].includes(savedLang)) {
      this.currentLang = savedLang;
    } else if (['es', 'en'].includes(browserLang)) {
      this.currentLang = browserLang;
    } else if (geoLang) {
      this.currentLang = geoLang;
    }

    console.log(`🌐 Idioma detectado: ${this.currentLang}`);
  }

  async detectByGeo() {
    try {
      // Usar API gratuita para detectar país
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Países de habla hispana
      const spanishCountries = ['MX', 'ES', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'CU', 'BO', 'DO', 'HN', 'PY', 'NI', 'CR', 'PA', 'UY', 'GT', 'SV'];
      
      return spanishCountries.includes(data.country_code) ? 'es' : 'en';
    } catch (error) {
      console.log('No se pudo detectar ubicación:', error);
      return null;
    }
  }

  async loadTranslations() {
    try {
      const response = await fetch(`assets/lang/${this.currentLang}.json`);
      this.translations = await response.json();
      console.log(`✅ Traducciones cargadas: ${this.currentLang}`);
    } catch (error) {
      console.error('Error cargando traducciones:', error);
      // Fallback a español si falla
      if (this.currentLang !== 'es') {
        this.currentLang = 'es';
        await this.loadTranslations();
      }
    }
  }

  translatePage() {
    // Buscar todos los elementos con data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Si tiene placeholder, traducir eso también
        if (element.placeholder !== undefined) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    console.log(`🔄 Página traducida a ${this.currentLang}`);
  }

  getTranslation(key) {
    // Navegar objeto anidado: "nav.about" -> translations.nav.about
    const keys = key.split('.');
    let translation = this.translations;
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        console.warn(`⚠️ Traducción no encontrada: ${key}`);
        return key; // Devolver la clave si no encuentra traducción
      }
    }
    
    return translation;
  }

  createLanguageSelector() {
    // Crear botón de idioma
    const langSelector = document.createElement('div');
    langSelector.className = 'language-selector';
    langSelector.innerHTML = `
      <button id="langToggle" class="lang-toggle" aria-label="Cambiar idioma">
        <span class="flag" id="langFlag">${this.currentLang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
        <span class="lang-text">${this.currentLang.toUpperCase()}</span>
      </button>
      <div id="langDropdown" class="lang-dropdown">
        <div class="lang-option" data-lang="es">🇲🇽 Español</div>
        <div class="lang-option" data-lang="en">🇺🇸 English</div>
      </div>
    `;

    // Insertar junto al selector de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.parentNode.insertBefore(langSelector, themeToggle);
    }

    // Eventos
    this.setupLanguageSelectorEvents();
  }

  setupLanguageSelectorEvents() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');

    // Toggle dropdown
    langToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', () => {
      langDropdown?.classList.remove('active');
    });

    // Cambiar idioma
    document.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const newLang = e.target.getAttribute('data-lang');
        this.changeLanguage(newLang);
      });
    });
  }

  async changeLanguage(newLang) {
    if (newLang === this.currentLang) return;

    this.currentLang = newLang;
    
    // Guardar preferencia
    localStorage.setItem('language', newLang);
    
    // Actualizar URL sin recargar
    const url = new URL(window.location);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url);

    // Recargar traducciones y aplicar
    await this.loadTranslations();
    this.translatePage();
    
    // Actualizar selector
    document.getElementById('langFlag').textContent = newLang === 'es' ? '🇲🇽' : '🇺🇸';
    document.getElementById('langToggle').querySelector('.lang-text').textContent = newLang.toUpperCase();
    
    console.log(`🔄 Idioma cambiado a: ${newLang}`);
  }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18n();
});