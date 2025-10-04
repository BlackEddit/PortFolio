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
  console.log(`🎯 Actualizando dashboard a índice: ${index}`, dashboard);
  
  // Mapear índices a IDs de slides HTML
  const slideIds = ['dashboard-ford', 'dashboard-institucionales'];
  
  // Actualizar slides - mostrar solo el seleccionado
  slideIds.forEach((slideId, i) => {
    const slide = document.getElementById(slideId);
    if (slide) {
      if (i === index) {
        // Slide activo
        slide.style.transform = 'translateX(0%)';
        slide.style.opacity = '1';
        slide.classList.remove('opacity-50');
        console.log(`✅ Mostrando slide: ${slideId}`);
      } else if (i < index) {
        // Slides anteriores
        slide.style.transform = 'translateX(-100%)';
        slide.style.opacity = '0.5';
        slide.classList.add('opacity-50');
      } else {
        // Slides siguientes
        slide.style.transform = 'translateX(100%)';
        slide.style.opacity = '0.5';
        slide.classList.add('opacity-50');
      }
    } else {
      console.warn(`⚠️ No se encontró el slide: ${slideId}`);
    }
  });
  
  // Actualizar contador
  const currentCounter = document.getElementById('current-dash');
  const totalCounter = document.getElementById('total-dash');
  if (currentCounter) currentCounter.textContent = index + 1;
  if (totalCounter) totalCounter.textContent = DASHBOARDS.length;
  
  // Actualizar dots indicadores
  for (let i = 0; i < DASHBOARDS.length; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      dot.className = i === index 
        ? 'w-4 h-4 rounded-full bg-blue-600 transition-all hover:scale-110'
        : 'w-4 h-4 rounded-full bg-blue-600/30 hover:bg-blue-600/50 transition-all hover:scale-110';
    }
  }
  
  currentDashIndex = index;
  
  // ⚡ LIMPIAR IFRAME CARGADO AL CAMBIAR DE DASHBOARD
  clearLoadedDashboard();
  
  console.log(`✅ Dashboard cambiado a: ${dashboard.title}`);
}

// Función para limpiar el dashboard cargado
function clearLoadedDashboard() {
  const largePreview = document.getElementById('large-dashboard-preview');
  if (largePreview && largePreview.querySelector('iframe')) {
    console.log('🗑️ Liberando iframe anterior...');
    
    // Restaurar contenido por defecto
    largePreview.innerHTML = `
      <div class="mb-6 text-center">
        <h3 class="text-3xl font-bold text-blue-300 mb-3">📊 Dashboard Interactivo</h3>
        <p class="text-zinc-400 text-lg">Vista completa del dashboard - Interactúa directamente con los datos</p>
      </div>
      <div class="w-full rounded-xl border border-blue-500/60 bg-zinc-900 shadow-2xl" style="height: 80vh; min-height: 700px; max-height: 900px;">
        <div class="w-full h-full flex items-center justify-center text-center text-blue-400 p-8">
          <div>
            <div class="w-24 h-24 mx-auto mb-6 bg-blue-600/20 rounded-full flex items-center justify-center shadow-xl">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-blue-400 mb-2">🚀 Listo para cargar</h4>
            <p class="text-lg text-blue-300">Haz clic en "⚡ Cargar Dashboard" para ver los datos interactivos</p>
            <div class="mt-6 text-sm text-zinc-500">
              <p>📊 Dimensiones optimizadas: 80vh × 100% para mejor visualización de Power BI</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Resetear botones de carga a estado inicial
  resetAllLoadButtons();
}

// Función para resetear todos los botones de carga
function resetAllLoadButtons() {
  const allLoadBtns = document.querySelectorAll('button[onclick="loadDashboard()"]');
  allLoadBtns.forEach(btn => {
    if (btn.textContent.includes('Dashboard Cargado')) {
      btn.innerHTML = '⚡ Cargar Dashboard';
      btn.disabled = false;
      btn.className = 'flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105';
    }
  });
  console.log('🔄 Botones de carga reseteados');
}

/**
 * Avanza al siguiente dashboard
 */
function nextDashboard() {
  console.log('➡️ NEXT: Ir al siguiente dashboard (actual:', currentDashIndex, ')');
  const nextIndex = (currentDashIndex + 1) % DASHBOARDS.length;
  console.log('➡️ NEXT: Cambiando de', currentDashIndex, 'a', nextIndex);
  updateDashboard(nextIndex);
}

/**
 * Retrocede al dashboard anterior
 */
function prevDashboard() {
  console.log('⬅️ PREV: Ir al dashboard anterior (actual:', currentDashIndex, ')');
  const prevIndex = (currentDashIndex - 1 + DASHBOARDS.length) % DASHBOARDS.length;
  console.log('⬅️ PREV: Cambiando de', currentDashIndex, 'a', prevIndex);
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
  console.log('🚀 Inicializando carrusel de dashboards...');
  
  // Los botones usan onclick en HTML, no necesitamos event listeners duplicados
  console.log('🔍 Botones configurados con onclick en HTML - sin duplicar eventos');
  
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
  // startCarousel(); // AUTOPLAY DESHABILITADO - Control manual del usuario
  
  console.log(`Carrusel inicializado con ${DASHBOARDS.length} dashboards`);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboardCarousel);

// Función para obtener el índice actual
function getCurrentIndex() {
  return currentDashIndex;
}

// Exponer funciones globalmente para acceso desde HTML
window.updateDashboard = updateDashboard;
window.nextDashboard = nextDashboard;
window.prevDashboard = prevDashboard;

window.DashboardCarousel = {
  updateDashboard,
  nextDashboard,
  prevDashboard,
  startCarousel,
  pauseCarousel,
  getCurrentIndex,
  clearLoadedDashboard,
  resetAllLoadButtons,
  DASHBOARDS
};