/**
 * Dashboard Carousel System
 * Maneja la rotació  // Actualizar indicadores de puntos
  for (let i = 0; i < DASHBOARDS.length; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      dot.className = i === index 
        ? 'w-2 h-2 rounded-full bg-blue-500' 
        : 'w-2 h-2 rounded-full bg-zinc-600';
    }
  }ica de dashboards de Power BI
 */

// Configuración de dashboards - fácil de mantener
const DASHBOARDS = [
  
 {
    id: 'ford2025',
    title: 'FORD 2025',
    description: 'Dashboard de análisis Ford 2025',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiYjYzZDFlYWQtODQ5Ny00OWY0LWE1OGItNGUxN2FkM2I3NmE1IiwidCI6IjEyMDFlNjcwLTI4YjQtNDg1ZC05OTNhLWIxYzU0OGRhMmZhYiJ9',
    tags: ['Ford', 'Análisis', '2025']
  },
  // TEMPORALMENTE COMENTADOS - LISTOS PARA ACTIVAR CUANDO ESTÉN ACTUALIZADOS
  /*
  {
    id: 'diario',
    title: 'Diario Complementos',
    description: 'Monitoreo diario de complementos',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiNjhhYTRmYzMtZTI4Zi00MzlhLWEwN2QtMGNmYjEzZGJhNTQyIiwidCI6IjEyMDFlNjcwLTI4YjQtNDg1ZC05OTNhLWIxYzU0OGRhMmZhYiJ9',
    tags: ['Diario', 'Monitoreo', 'Tiempo Real']
  },
  */
  // DASHBOARD ACTIVO ACTUALMENTE
  {
    id: 'indicadores',
    title: 'Indicadores Institucionales',
    description: 'Dashboard institucional educativo',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiYzVjMzVjMGQtYmVlNC00YjlkLWE2ZTEtNDRmMThjOTRlZDNiIiwidCI6IjEyMDFlNjcwLTI4YjQtNDg1ZC05OTNhLWIxYzU0OGRhMmZhYiJ9',
    tags: ['Educación', 'KPIs', 'Institucional']
  }
];

// Variables del carrusel
let currentDashIndex = 0;
let carouselInterval = null;
let isPaused = false;

/**
 * Actualiza el dashboard mostrado
 * @param {number} index - Índice del dashboard a mostrar
 */
function updateDashboard(index) {
  const dashboard = DASHBOARDS[index];
  const iframe = document.getElementById('pbiFrame');
  const title = document.getElementById('dashTitle');
  const counter = document.getElementById('dashCounter');
  const fallbackLink = document.getElementById('currentDashboardLink');
  
  // Actualizar iframe
  if (iframe) {
    iframe.src = dashboard.url;
    iframe.title = dashboard.title;
  }
  
  // Actualizar UI
  if (title) title.textContent = dashboard.title;
  if (counter) counter.textContent = `${index + 1}/${DASHBOARDS.length}`;
  
  // Actualizar link de fallback con el dashboard actual
  if (fallbackLink) {
    fallbackLink.href = dashboard.url;
  }
  
  // Actualizar botón de acceso rápido
  const quickAccessBtn = document.getElementById('quickAccessBtn');
  if (quickAccessBtn) {
    quickAccessBtn.href = dashboard.url;
  }
  
  // Actualizar dots indicadores
  for (let i = 0; i < DASHBOARDS.length; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      dot.className = i === index 
        ? 'w-2 h-2 rounded-full bg-blue-500' 
        : 'w-2 h-2 rounded-full bg-zinc-600';
    }
  }
  
  currentDashIndex = index;
  console.log(`Dashboard cambiado a: ${dashboard.title}`);
}

/**
 * Avanza al siguiente dashboard
 */
function nextDashboard() {
  const nextIndex = (currentDashIndex + 1) % DASHBOARDS.length;
  updateDashboard(nextIndex);
}

/**
 * Retrocede al dashboard anterior
 */
function prevDashboard() {
  const prevIndex = (currentDashIndex - 1 + DASHBOARDS.length) % DASHBOARDS.length;
  updateDashboard(prevIndex);
}

/**
 * Inicia la rotación automática del carrusel
 */
function startCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextDashboard, 10000); // 10 segundos
  isPaused = false;
  
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) playPauseBtn.textContent = '⏸️';
  
  console.log('Carrusel iniciado - rotación cada 10 segundos');
}

/**
 * Pausa la rotación automática del carrusel
 */
function pauseCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
  isPaused = true;
  
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) playPauseBtn.textContent = '▶️';
  
  console.log('Carrusel pausado');
}

/**
 * Inicializa el sistema de carrusel
 */
function initDashboardCarousel() {
  console.log('Inicializando carrusel de dashboards...');
  
  // Event listeners para controles
  const nextBtn = document.getElementById('nextDash');
  const prevBtn = document.getElementById('prevDash');
  const playPauseBtn = document.getElementById('playPause');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextDashboard();
      pauseCarousel(); // Pausar auto-play al interactuar
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevDashboard();
      pauseCarousel(); // Pausar auto-play al interactuar
    });
  }
  
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPaused) {
        startCarousel();
      } else {
        pauseCarousel();
      }
    });
  }
  
  // Inicializar con el primer dashboard
  updateDashboard(0);
  startCarousel();
  
  console.log(`Carrusel inicializado con ${DASHBOARDS.length} dashboards`);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboardCarousel);

// Exponer funciones globalmente si es necesario
window.DashboardCarousel = {
  updateDashboard,
  nextDashboard,
  prevDashboard,
  startCarousel,
  pauseCarousel,
  DASHBOARDS
};