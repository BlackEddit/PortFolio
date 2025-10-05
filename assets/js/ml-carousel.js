/**
 * Carrusel de Modelos ML Empresariales
 * Sistema de navegación entre modelos de machine learning
 * Integración con Groq API para análisis de sentimientos
 */

class MLCarousel {
  constructor() {
    this.currentModel = 0;
    this.totalModels = 3;
    this.models = ['sentiment', 'mnist', 'detection'];
    this.isTransitioning = false;
    
    this.initializeCarousel();
  }
  
  initializeCarousel() {
    console.log('🎯 Inicializando carrusel ML...');
    this.updateButtons();
    this.updateDots();
  }
  
  updateMLModel(index) {
    if (this.isTransitioning || index === this.currentModel) return;
    
    this.isTransitioning = true;
    console.log(`🔄 Cambiando a modelo ML: ${this.models[index]}`);
    
    // Ocultar modelo actual
    const currentSlide = document.getElementById(`ml-model-${this.models[this.currentModel]}`);
    if (currentSlide) {
      currentSlide.style.transform = index > this.currentModel ? 'translateX(-100%)' : 'translateX(100%)';
    }
    
    // Mostrar nuevo modelo
    const newSlide = document.getElementById(`ml-model-${this.models[index]}`);
    if (newSlide) {
      newSlide.style.transform = 'translateX(0%)';
    }
    
    this.currentModel = index;
    this.updateButtons();
    this.updateDots();
    this.updateCounter();
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }
  
  nextMLModel() {
    const nextIndex = (this.currentModel + 1) % this.totalModels;
    this.updateMLModel(nextIndex);
  }
  
  prevMLModel() {
    const prevIndex = (this.currentModel - 1 + this.totalModels) % this.totalModels;
    this.updateMLModel(prevIndex);
  }
  
  updateButtons() {
    const prevBtn = document.getElementById('prev-ml-btn');
    const nextBtn = document.getElementById('next-ml-btn');
    
    // En un carrusel infinito, nunca deshabilitar botones
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }
  
  updateDots() {
    for (let i = 0; i < this.totalModels; i++) {
      const dot = document.getElementById(`ml-dot-${i}`);
      if (dot) {
        if (i === this.currentModel) {
          dot.classList.remove('bg-purple-600/30');
          dot.classList.add('bg-purple-600');
        } else {
          dot.classList.remove('bg-purple-600');
          dot.classList.add('bg-purple-600/30');
        }
      }
    }
  }
  
  updateCounter() {
    const currentEl = document.getElementById('current-ml');
    if (currentEl) {
      currentEl.textContent = this.currentModel + 1;
    }
  }
}

/**
 * Analizador de Sentimientos con Groq API
 * Integración real con IA para análisis empresarial
 */
class GroqSentimentAnalyzer {
  constructor() {
    this.isInitialized = false;
    this.apiEndpoint = '/netlify/functions/get-api-key'; // Usar tu endpoint existente
  }
  
  async initialize() {
    try {
      console.log('🚀 Inicializando analizador con Groq...');
      
      // Mostrar la interfaz
      const preview = document.getElementById('sentiment-preview');
      const interface_ = document.getElementById('sentiment-interface');
      
      if (preview) preview.style.display = 'none';
      if (interface_) interface_.style.display = 'block';
      
      this.isInitialized = true;
      console.log('✅ Analizador Groq listo');
      
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Groq:', error);
      return false;
    }
  }
  
  async analyzeWithGroq(text) {
    if (!text || text.trim().length === 0) {
      this.showError('Ingresa un texto para analizar');
      return;
    }
    
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsDiv = document.getElementById('sentiment-results');
    
    try {
      // Mostrar loading
      if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analizando...';
      }
      
      if (resultsDiv) {
        resultsDiv.innerHTML = `
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span class="ml-3 text-purple-300">Analizando con IA de Groq...</span>
          </div>
        `;
      }
      
      // Obtener API key desde tu función existente
      const keyResponse = await fetch(this.apiEndpoint);
      if (!keyResponse.ok) {
        throw new Error('No se pudo obtener la API key');
      }
      
      const { apiKey } = await keyResponse.json();
      
      // Llamada a Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Eres un experto analista de sentimientos empresarial. Analiza el texto y responde SOLO con un JSON válido en este formato:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 85,
  "score": 0.7,
  "keywords": ["palabra1", "palabra2"],
  "business_insights": [
    "Insight empresarial 1",
    "Insight empresarial 2"
  ],
  "category": "product|service|delivery|experience|general",
  "recommendation": "Acción recomendada para la empresa"
}`
            },
            {
              role: 'user',
              content: `Analiza este feedback de cliente: "${text}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error de Groq API: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No se recibió respuesta de la IA');
      }
      
      // Parsear respuesta JSON
      let analysisResult;
      try {
        analysisResult = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Error parseando JSON:', aiResponse);
        throw new Error('Formato de respuesta inválido');
      }
      
      this.renderGroqResults(analysisResult);
      
    } catch (error) {
      console.error('❌ Error en análisis Groq:', error);
      this.showError(`Error: ${error.message}`);
    } finally {
      // Restaurar botón
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analizar con IA';
      }
    }
  }
  
  renderGroqResults(results) {
    const resultsDiv = document.getElementById('sentiment-results');
    if (!resultsDiv) return;
    
    // Colores por sentimiento
    const colors = {
      positive: { bg: 'emerald', text: 'emerald' },
      negative: { bg: 'red', text: 'red' },
      neutral: { bg: 'yellow', text: 'yellow' }
    };
    
    const color = colors[results.sentiment] || colors.neutral;
    
    resultsDiv.innerHTML = `
      <div class="space-y-4">
        <!-- Resultado principal -->
        <div class="text-center p-4 bg-${color.bg}-900/30 border border-${color.bg}-400/30 rounded-lg">
          <div class="text-2xl font-bold text-${color.text}-300 mb-1">
            ${results.sentiment.toUpperCase()}
          </div>
          <div class="text-sm text-${color.text}-200">
            Confianza: ${results.confidence}% | Categoría: ${results.category}
          </div>
        </div>
        
        <!-- Palabras clave -->
        ${results.keywords && results.keywords.length > 0 ? `
          <div class="bg-purple-900/30 rounded-lg p-3 border border-purple-400/30">
            <h5 class="text-xs font-semibold text-purple-300 mb-2">Palabras Clave</h5>
            <div class="flex flex-wrap gap-1">
              ${results.keywords.slice(0, 5).map(kw => `
                <span class="px-2 py-1 bg-purple-600/20 border border-purple-400/30 rounded text-xs text-purple-300">
                  ${kw}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Insights empresariales -->
        <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
          <h5 class="text-xs font-semibold text-slate-300 mb-2">Insights IA</h5>
          <div class="space-y-1">
            ${results.business_insights.map(insight => `
              <div class="text-xs text-slate-300">• ${insight}</div>
            `).join('')}
          </div>
        </div>
        
        <!-- Recomendación -->
        ${results.recommendation ? `
          <div class="bg-blue-900/20 rounded-lg p-3 border border-blue-400/30">
            <h5 class="text-xs font-semibold text-blue-300 mb-1">Recomendación</h5>
            <p class="text-xs text-blue-200">${results.recommendation}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  showError(message) {
    const resultsDiv = document.getElementById('sentiment-results');
    if (resultsDiv) {
      resultsDiv.innerHTML = `
        <div class="text-center py-4 text-red-400 bg-red-900/20 border border-red-400/30 rounded-lg">
          <div class="text-sm">${message}</div>
          <div class="text-xs mt-1">Intenta nuevamente o verifica tu conexión</div>
        </div>
      `;
    }
  }
  
  clear() {
    const input = document.getElementById('sentiment-input');
    const results = document.getElementById('sentiment-results');
    
    if (input) input.value = '';
    if (results) {
      results.innerHTML = `
        <div class="text-center py-4 text-slate-400 text-sm">
          Esperando texto para analizar...
        </div>
      `;
    }
  }
}

// Instancias globales
let mlCarousel;
let groqAnalyzer;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ml-model-sentiment')) {
    mlCarousel = new MLCarousel();
    groqAnalyzer = new GroqSentimentAnalyzer();
    
    console.log('🎯 Carrusel ML y Groq Analyzer inicializados');
  }
});

// Funciones globales para la UI
function updateMLModel(index) {
  if (mlCarousel) {
    mlCarousel.updateMLModel(index);
  }
}

function nextMLModel() {
  if (mlCarousel) {
    mlCarousel.nextMLModel();
  }
}

function prevMLModel() {
  if (mlCarousel) {
    mlCarousel.prevMLModel();
  }
}

function initSentimentAnalyzer() {
  if (groqAnalyzer) {
    groqAnalyzer.initialize();
  }
}

function analyzeWithGroq() {
  const input = document.getElementById('sentiment-input');
  if (groqAnalyzer && input) {
    groqAnalyzer.analyzeWithGroq(input.value);
  }
}

function clearSentimentAnalysis() {
  if (groqAnalyzer) {
    groqAnalyzer.clear();
  }
}

// Ejemplos pre-cargados
function loadSentimentExample(type) {
  const examples = {
    positive: "Excelente producto! La calidad es increíble y el servicio al cliente fue fantástico. La entrega fue muy rápida y el precio está genial. Definitivamente lo recomiendo a todos mis amigos.",
    negative: "Terrible experiencia. El producto llegó defectuoso, el servicio de atención es pésimo y tardaron mucho en responder. No funciona como prometían y fue una completa decepción. No lo recomiendo para nada.",
    neutral: "El producto está bien, cumple con lo básico. El servicio fue normal, sin problemas pero tampoco nada especial. Precio promedio para lo que ofrece. Es acceptable."
  };
  
  const input = document.getElementById('sentiment-input');
  if (input && examples[type]) {
    input.value = examples[type];
  }
}