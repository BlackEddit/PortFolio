// ===== MÓDULO DE NAVEGACIÓN =====
let currentSection = 'home';
let previousSection = 'home';

function navigateToSection(sectionId) {
  // Ocultar COMPLETAMENTE todas las secciones principales
  const mainSections = ['top', 'about-contact'];
  mainSections.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
      element.classList.add('hidden');
    }
  });
  
  // Ocultar todas las secciones de proyecto
  document.querySelectorAll('.project-section').forEach(section => {
    section.style.display = 'none';
    section.classList.add('hidden');
  });
  
  // Mostrar SOLO la sección específica
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.remove('hidden');
  }
  
  currentSection = sectionId;
  
  // Limpiar página completamente - prevenir scroll a contenido anterior
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);
  
  setTimeout(() => {
    document.body.style.overflow = 'auto';
  }, 100);
  
  // Mensaje divertido del cuervo al entrar
  setTimeout(() => {
    const funMessages = [
      '¡Bienvenido al universo ' + sectionId + '! 🚀 ¿Listo para explorar?',
      '¡Perfecto! Has elegido ' + sectionId + '. ¿Qué te parece si investigamos juntos? 🔍',
      '¡Excelente elección! ' + sectionId + ' es fascinante. ¿Te ayudo a navegar? 🗺️'
    ];
    if (typeof sendCrowMessage === 'function') {
      sendCrowMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    }
  }, 1200);
}

function navigateBack() {
  // Ocultar TODAS las secciones de proyecto
  document.querySelectorAll('.project-section').forEach(section => {
    section.style.display = 'none';
    section.classList.add('hidden');
  });
  
  // Mostrar SOLO las secciones principales (SIN projects ya que lo eliminamos)
  const mainSections = ['top', 'about-contact'];
  mainSections.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'block';
      element.classList.remove('hidden');
    }
  });
  
  currentSection = 'home';
  window.scrollTo(0, 0);
  
  // Mensaje divertido del cuervo
  setTimeout(() => {
    const funMessages = [
      '¡Vuelta al menú principal! 🎮 ¿Qué aventura eliges ahora?',
      '¡Welcome back to the mothership! 🚀 ¿Exploramos otro planeta?',
      '¡Poof! 💨 Estás de vuelta. ¿Te animas a otro viaje?'
    ];
    if (typeof sendCrowMessage === 'function') {
      sendCrowMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    }
  }, 1000);
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
  window.navigateToSection = navigateToSection;
  window.navigateBack = navigateBack;
}