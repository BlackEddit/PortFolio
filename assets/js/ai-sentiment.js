/**
 * Analizador de Sentimientos Empresarial
 * Sistema de IA para análisis automático de feedback y reseñas
 */

class SentimentAnalyzer {
  constructor() {
    this.apiKey = null; // Se obtiene dinámicamente
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.isAnalyzing = false;
    
    this.examples = {
      positive: "Estoy absolutamente enamorado de este producto. La calidad supera mis expectativas más altas. El equipo de soporte me resolvió una duda en menos de 5 minutos por WhatsApp. Aunque pagué un poco más que en otros sitios, realmente vale cada peso. Ya lo recomendé a 3 amigos y todos están felices. Definitivamente voy a comprar más productos de esta marca.",
      negative: "Qué decepción tan grande. Pagué $2,500 por algo que se rompió al tercer día. El servicio al cliente es una broma - me tienen dando vueltas hace 2 semanas sin resolver nada. Encima me dijeron que no hay garantía porque 'se ve que lo usé mal'. Nunca más compro aquí y ya le dije a mi familia que no lo hagan tampoco. Pérdida total de dinero y tiempo.",
      neutral: "El producto cumple lo que promete, sin más. Lo pedí el martes y llegó el viernes, tiempo normal. El precio está dentro del rango que esperaba. El empaque venía bien, sin daños. Creo que hay opciones similares en el mercado, pero este está bien para lo que necesitaba. No me quejo pero tampoco me emociona."
    };
  }
  
  async analyzeText(text) {
    if (!text || text.trim().length === 0) {
      return {
        error: "Por favor ingresa un texto para analizar"
      };
    }
    
    if (this.isAnalyzing) {
      return {
        error: "Ya hay un análisis en progreso, espera un momento"
      };
    }
    
    this.isAnalyzing = true;
    
    try {
      // Obtener API key usando el mismo sistema que el chat assistant
      if (!this.apiKey) {
        console.log('🔑 Obteniendo API key...');
        this.apiKey = await window.getAPIKey();
      }
      
      // Si no hay API key disponible, usar sistema de respaldo
      if (!this.apiKey) {
        console.log('⚠️ No API key disponible, usando análisis local');
        return {
          error: 'Usando análisis local - Conectar IA para análisis completo',
          fallback: this.getFallbackAnalysis(text)
        };
      }
      const prompt = `Eres un consultor empresarial experto. Analiza este feedback de cliente y extrae insights accionables para mejorar el negocio.

TEXTO: "${text}"

Responde en JSON con análisis profundo empresarial:
{
  "perfil_cliente": "descripción del tipo de cliente (ej: 'Cliente exigente con altas expectativas', 'Usuario casual satisfecho', etc)",
  "nivel_urgencia": "critico|alto|medio|bajo",
  "probabilidad_recompra": "número 0-100",
  "probabilidad_recomendacion": "número 0-100", 
  "drivers_principales": ["factor 1", "factor 2", "factor 3"],
  "riesgos_detectados": ["riesgo específico 1", "riesgo 2"],
  "oportunidades": ["oportunidad concreta 1", "oportunidad 2"],
  "acciones_inmediatas": [
    "Acción específica que debe tomar la empresa YA",
    "Segunda acción urgente"
  ],
  "impacto_financiero": "descripción del impacto en ingresos/costos",
  "segmento_mercado": "a qué segmento pertenece este cliente",
  "emociones_detectadas": ["emoción primaria", "emoción secundaria"],
  "comparativa_competencia": "insights sobre cómo se compara con competidores",
  "potencial_viral": "alto|medio|bajo - probabilidad de que comparta su experiencia",
  "valor_lifetime": "estimación del valor del cliente a largo plazo"
}`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto analista de sentimientos empresariales. Respondes SOLO con JSON válido, sin texto adicional antes o después.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse the JSON response
      const analysis = JSON.parse(aiResponse);
      
      return {
        ...analysis,
        timestamp: new Date().toISOString(),
        wordCount: text.split(/\s+/).length
      };
      
    } catch (error) {
      console.error('Error en análisis:', error);
      
      // Detectar si es problema de conexión/API
      const isConnectionError = error.message.includes('fetch') || 
                               error.message.includes('network') || 
                               error.message.includes('CORS') ||
                               error.message.includes('401') ||
                               error.message.includes('429');
      
      return {
        error: isConnectionError ? 
          'Usando análisis local - Conectar IA para análisis completo' : 
          `Error en procesamiento: ${error.message}`,
        fallback: this.getFallbackAnalysis(text)
      };
    } finally {
      this.isAnalyzing = false;
    }
  }
  
  getFallbackAnalysis(text) {
    const textoBajo = text.toLowerCase();
    const longitud = text.length;
    
    // Si el texto es muy corto, dar análisis básico
    if (longitud < 20) {
      return {
        perfil_cliente: 'Feedback insuficiente para análisis detallado',
        nivel_urgencia: 'medio',
        probabilidad_recompra: 40,
        probabilidad_recomendacion: 30,
        drivers_principales: ['información limitada'],
        riesgos_detectados: ['Falta de engagement del cliente'],
        oportunidades: ['Solicitar feedback más detallado'],
        acciones_inmediatas: [
          'Contactar cliente para obtener más información',
          'Enviar encuesta estructurada'
        ],
        impacto_financiero: 'Indeterminado - Requiere más datos',
        segmento_mercado: 'No determinado',
        emociones_detectadas: ['neutral'],
        potencial_viral: 'bajo',
        valor_lifetime: 'Requiere análisis adicional'
      };
    }
    
    // Análisis más sofisticado para textos largos
    const indicadores = {
      urgente: ['urgente', 'inmediato', 'ya', 'ahora', 'rápido', 'problema grave'],
      satisfaccion: ['feliz', 'contento', 'satisfecho', 'encantado', 'enamorado', 'excelente', 'perfecto'],
      insatisfaccion: ['no sirve', 'malo', 'pésimo', 'decepción', 'enojado', 'molesto', 'frustrado', 'terrible'],
      precio: ['caro', 'barato', 'precio', 'costo', 'dinero', 'pesos', '$'],
      recomendacion: ['recomiendo', 'recomendé', 'familia', 'amigos', 'conocidos'],
      competencia: ['otros sitios', 'competencia', 'alternativa', 'opciones similares']
    };
    
    let urgencia = 'bajo';
    let recompra = 50;
    let recomendacion = 50;
    
    if (indicadores.urgente.some(word => textoBajo.includes(word))) urgencia = 'alto';
    if (indicadores.insatisfaccion.some(word => textoBajo.includes(word))) {
      urgencia = 'alto';
      recompra = 25;
      recomendacion = 20;
    }
    if (indicadores.satisfaccion.some(word => textoBajo.includes(word))) {
      urgencia = 'bajo';
      recompra = 85;
      recomendacion = 90;
    }
    
    return {
      perfil_cliente: longitud > 200 ? 'Cliente detallista y comprometido' : 'Cliente con feedback conciso',
      nivel_urgencia: urgencia,
      probabilidad_recompra: recompra,
      probabilidad_recomendacion: recomendacion,
      drivers_principales: ['experiencia general'],
      riesgos_detectados: urgencia === 'alto' ? ['Insatisfacción del cliente'] : ['Neutralidad en experiencia'],
      oportunidades: ['Mejora en comunicación con clientes'],
      acciones_inmediatas: [
        urgencia === 'alto' ? 'Seguimiento inmediato requerido' : 'Monitorear satisfacción',
        'Solicitar feedback más específico'
      ],
      impacto_financiero: recompra > 70 ? 'Positivo' : 'Neutral a negativo',
      segmento_mercado: 'Cliente estándar',
      emociones_detectadas: urgencia === 'alto' ? ['insatisfacción'] : ['neutral'],
      potencial_viral: 'bajo',
      valor_lifetime: recompra > 70 ? 'Medio-Alto' : 'Bajo-Medio'
    };
  }
  
  renderResults(analysis) {
    const resultsDiv = document.getElementById('sentiment-results');
    if (!resultsDiv) return;
    
    if (analysis.error && !analysis.fallback) {
      resultsDiv.innerHTML = `
        <div class="text-center py-4 text-red-400">
          <div class="font-semibold mb-2">Error en el análisis</div>
          <div class="text-sm">${analysis.error}</div>
        </div>
      `;
      return;
    }
    
    const data = analysis.fallback || analysis;
    
    // Colores por urgencia en lugar de sentimiento básico
    const urgencyColors = {
      critico: { bg: 'red-900/30', border: 'red-400/30', text: 'red-300', icon: '🚨' },
      alto: { bg: 'orange-900/30', border: 'orange-400/30', text: 'orange-300', icon: '⚠️' },
      medio: { bg: 'yellow-900/30', border: 'yellow-400/30', text: 'yellow-300', icon: '📊' },
      bajo: { bg: 'emerald-900/30', border: 'emerald-400/30', text: 'emerald-300', icon: '✅' }
    };
    
    const urgency = urgencyColors[data.nivel_urgencia] || urgencyColors.medio;
    
    resultsDiv.innerHTML = `
      <div class="space-y-3 max-h-96 overflow-y-auto">
        
        <!-- Dashboard Ejecutivo -->
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="bg-blue-900/20 border border-blue-400/30 rounded p-2 text-center">
            <div class="text-blue-300 font-bold">${data.probabilidad_recompra || 'N/A'}%</div>
            <div class="text-blue-200">Recompra</div>
          </div>
          <div class="bg-purple-900/20 border border-purple-400/30 rounded p-2 text-center">
            <div class="text-purple-300 font-bold">${data.probabilidad_recomendacion || 'N/A'}%</div>
            <div class="text-purple-200">Recomendación</div>
          </div>
          <div class="bg-${urgency.bg} border border-${urgency.border} rounded p-2 text-center">
            <div class="text-${urgency.text} font-bold">${urgency.icon}</div>
            <div class="text-${urgency.text}">${(data.nivel_urgencia || 'medio').toUpperCase()}</div>
          </div>
        </div>

        <!-- Perfil del Cliente -->
        ${data.perfil_cliente ? `
          <div class="bg-slate-800/50 rounded p-3">
            <div class="font-semibold text-cyan-300 mb-1 text-sm">👤 Perfil del Cliente:</div>
            <div class="text-xs text-cyan-200">${data.perfil_cliente}</div>
          </div>
        ` : ''}

        <!-- Acciones Inmediatas (Lo más importante) -->
        ${data.acciones_inmediatas && data.acciones_inmediatas.length > 0 ? `
          <div class="bg-red-900/20 border border-red-400/30 rounded p-3">
            <div class="font-semibold text-red-300 mb-2 text-sm">🚀 Acciones Inmediatas:</div>
            <div class="space-y-1">
              ${data.acciones_inmediatas.map(accion => `
                <div class="text-xs text-red-200 bg-red-800/20 rounded px-2 py-1">• ${accion}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Oportunidades de Negocio -->
        ${data.oportunidades && data.oportunidades.length > 0 ? `
          <div class="bg-emerald-900/20 border border-emerald-400/30 rounded p-3">
            <div class="font-semibold text-emerald-300 mb-2 text-sm">💰 Oportunidades:</div>
            <div class="space-y-1">
              ${data.oportunidades.map(op => `
                <div class="text-xs text-emerald-200">• ${op}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Riesgos -->
        ${data.riesgos_detectados && data.riesgos_detectados.length > 0 ? `
          <div class="bg-orange-900/20 border border-orange-400/30 rounded p-3">
            <div class="font-semibold text-orange-300 mb-2 text-sm">⚠️ Riesgos Detectados:</div>
            <div class="space-y-1">
              ${data.riesgos_detectados.map(riesgo => `
                <div class="text-xs text-orange-200">• ${riesgo}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Análisis Financiero -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          ${data.impacto_financiero ? `
            <div class="bg-green-900/20 border border-green-400/30 rounded p-2">
              <div class="font-semibold text-green-300 mb-1">💵 Impacto Financiero:</div>
              <div class="text-green-200">${data.impacto_financiero}</div>
            </div>
          ` : ''}
          ${data.valor_lifetime ? `
            <div class="bg-indigo-900/20 border border-indigo-400/30 rounded p-2">
              <div class="font-semibold text-indigo-300 mb-1">📈 Valor Lifetime:</div>
              <div class="text-indigo-200">${data.valor_lifetime}</div>
            </div>
          ` : ''}
        </div>

        <!-- Insights Adicionales -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          ${data.segmento_mercado ? `
            <div class="bg-purple-900/20 border border-purple-400/30 rounded p-2">
              <div class="font-semibold text-purple-300">🎯 Segmento:</div>
              <div class="text-purple-200">${data.segmento_mercado}</div>
            </div>
          ` : ''}
          ${data.potencial_viral ? `
            <div class="bg-pink-900/20 border border-pink-400/30 rounded p-2">
              <div class="font-semibold text-pink-300">🔥 Viral:</div>
              <div class="text-pink-200">${data.potencial_viral.toUpperCase()}</div>
            </div>
          ` : ''}
        </div>

        <!-- Drivers Principales -->
        ${data.drivers_principales && data.drivers_principales.length > 0 ? `
          <div class="bg-slate-700/30 rounded p-3">
            <div class="font-semibold text-slate-300 mb-2 text-sm">🔑 Drivers Principales:</div>
            <div class="flex flex-wrap gap-1">
              ${data.drivers_principales.map(driver => `
                <span class="px-2 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-xs text-blue-300">${driver}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${analysis.fallback ? `
          <div class="text-center text-xs text-yellow-400 mt-2">
            ⚠️ Análisis con sistema de respaldo - Conectar IA para análisis completo
          </div>
        ` : ''}
      </div>
    `;
  }
  
  async loadExample(type) {
    const textarea = document.getElementById('sentiment-input');
    if (!textarea || !this.examples[type]) return;
    
    textarea.value = this.examples[type];
    await this.analyze();
  }
  
  async analyze() {
    const textarea = document.getElementById('sentiment-input');
    const button = document.getElementById('analyze-btn');
    const results = document.getElementById('sentiment-results');
    
    if (!textarea || !button || !results) return;
    
    const text = textarea.value.trim();
    
    if (!text) {
      results.innerHTML = `
        <div class="text-center py-4 text-yellow-400">
          <div class="text-sm">Por favor ingresa un texto para analizar</div>
        </div>
      `;
      return;
    }
    
    // UI Loading state
    button.disabled = true;
    button.textContent = 'Analizando...';
    
    results.innerHTML = `
      <div class="text-center py-6">
        <div class="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div class="text-sm text-purple-300">Procesando con IA empresarial...</div>
      </div>
    `;
    
    try {
      const analysis = await this.analyzeText(text);
      this.renderResults(analysis);
    } catch (error) {
      console.error('Error:', error);
      results.innerHTML = `
        <div class="text-center py-4 text-red-400">
          <div class="text-sm">Error al procesar el análisis</div>
        </div>
      `;
    } finally {
      button.disabled = false;
      button.textContent = 'Analizar con IA';
    }
  }
  
  clear() {
    const textarea = document.getElementById('sentiment-input');
    const results = document.getElementById('sentiment-results');
    
    if (textarea) textarea.value = '';
    if (results) {
      results.innerHTML = `
        <div class="text-center py-4 text-slate-400 text-sm">
          Esperando texto para analizar...
        </div>
      `;
    }
  }
}

// Instancia global
let sentimentAnalyzer = null;

// Funciones globales para la UI
async function analyzeWithGroq() {
  if (!sentimentAnalyzer) {
    sentimentAnalyzer = new SentimentAnalyzer();
  }
  await sentimentAnalyzer.analyze();
}

function clearSentimentAnalysis() {
  if (!sentimentAnalyzer) {
    sentimentAnalyzer = new SentimentAnalyzer();
  }
  sentimentAnalyzer.clear();
}

async function loadSentimentExample(type) {
  if (!sentimentAnalyzer) {
    sentimentAnalyzer = new SentimentAnalyzer();
  }
  await sentimentAnalyzer.loadExample(type);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  sentimentAnalyzer = new SentimentAnalyzer();
});