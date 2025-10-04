// ===== MNIST DEMO =====

class MNISTDemo {
  constructor() {
    this.model = null;
    this.canvas = document.getElementById('drawpad');
    this.ctx = this.canvas?.getContext('2d');
    this.drawing = false;
    this.lastPos = null;
    
    if (this.canvas) {
      this.init();
    }
  }

  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.loadModel();
  }

  setupCanvas() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 26;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#fff';
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    window.addEventListener('mouseup', () => this.stopDrawing());

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());

    // Button events
    document.getElementById('mnistClear')?.addEventListener('click', () => this.clear());
    document.getElementById('mnistPredict')?.addEventListener('click', () => this.predict());
  }

  getPos(e) {
    if (e.touches?.[0]) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return { x: e.offsetX, y: e.offsetY };
  }

  startDrawing(e) {
    this.drawing = true;
    this.lastPos = this.getPos(e);
  }

  draw(e) {
    if (!this.drawing) return;
    const pos = this.getPos(e);
    this.drawLine(this.lastPos, pos);
    this.lastPos = pos;
    e.preventDefault();
  }

  stopDrawing() {
    this.drawing = false;
    this.lastPos = null;
  }

  drawLine(from, to) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }

  clear() {
    this.setupCanvas();
    
    // Limpiar elementos nuevos
    const predictionBox = document.getElementById('prediction');
    if (predictionBox) {
      predictionBox.innerHTML = `
        <div class="text-6xl font-bold text-purple-300 mb-2">?</div>
        <p class="text-purple-200">Dibuja un número para ver la predicción</p>
      `;
    }
    
    const confidenceDisplay = document.getElementById('confidenceDisplay');
    if (confidenceDisplay) {
      confidenceDisplay.innerHTML = `
        <div class="text-purple-300 text-center py-4 border border-purple-400/30 rounded bg-purple-800/20 text-sm">
          Esperando dibujo...
        </div>
      `;
    }
    
    // Limpiar elementos viejos (fallback)
    const mnistTop = document.getElementById('mnistTop');
    if (mnistTop) mnistTop.innerHTML = '';
    
    const mnistBars = document.getElementById('mnistBars');
    if (mnistBars) mnistBars.innerHTML = '';
    
    const prevCtx = document.getElementById('mnistPreview')?.getContext('2d');
    if (prevCtx) {
      prevCtx.clearRect(0, 0, 56, 56);
    }
  }

  async loadModel() {
    console.log('🔄 Iniciando carga de modelo MNIST...');

    const modelUrls = [
      "https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json",
      "https://hpssjellis.github.io/beginner-tensorflowjs-examples-in-javascript/saved-models/mnist/convnet/my-mnist01.json"
    ];

    for (let i = 0; i < modelUrls.length; i++) {
      const url = modelUrls[i];
      console.log(`🌐 Intentando cargar modelo ${i + 1}/${modelUrls.length}:`, url);
      
      try {
        this.model = await tf.loadLayersModel(url);
        console.log('✅ Modelo cargado exitosamente:', url);
        
        // Mostrar estado en la UI si existe el elemento
        const predictionBox = document.getElementById('prediction');
        if (predictionBox) {
          const currentContent = predictionBox.innerHTML;
          if (currentContent.includes('?')) {
            predictionBox.innerHTML = currentContent.replace('Dibuja un número para ver la predicción', 'Modelo listo ✅ - Dibuja un número');
          }
        }
        return;
      } catch (err) {
        console.warn(`❌ Falló modelo ${i + 1}:`, url, err.message);
      }
    }
    
    console.error('💥 No se pudo cargar ningún modelo MNIST');
    alert('No se pudo cargar el modelo de IA. Verifica tu conexión a internet.');
  }

  preprocess() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0, 28, 28);

    // Preview
    const prevCanvas = document.getElementById('mnistPreview');
    if (prevCanvas) {
      const prevCtx = prevCanvas.getContext('2d');
      prevCtx.imageSmoothingEnabled = false;
      prevCtx.fillStyle = '#000';
      prevCtx.fillRect(0, 0, 56, 56);
      prevCtx.drawImage(tempCanvas, 0, 0, 56, 56);
    }

    const imageData = tempCtx.getImageData(0, 0, 28, 28).data;
    const input = new Float32Array(28 * 28);
    
    for (let i = 0, j = 0; i < imageData.length; i += 4, j++) {
      input[j] = imageData[i] / 255;
    }
    
    return tf.tensor4d(input, [1, 28, 28, 1]);
  }

  async predict() {
    console.log('🎯 Predict button clicked!');
    
    if (!this.model) {
      console.error('❌ Modelo no cargado');
      alert("Modelo no cargado. Espera un momento y vuelve a intentar.");
      return;
    }

    const predictBtn = document.getElementById('mnistPredict');
    
    // Simple loading state
    if (predictBtn) {
      predictBtn.disabled = true;
      predictBtn.textContent = "Prediciendo...";
    }

    try {
      console.log('🔄 Procesando imagen...');
      const input = this.preprocess();
      
      console.log('🤖 Ejecutando modelo...');
      const prediction = this.model.predict(input);
      const probabilities = Array.from(await prediction.data());
      
      console.log('✅ Probabilidades:', probabilities);
      
      input.dispose();
      prediction.dispose();
      
      this.renderResults(probabilities);
    } catch (error) {
      console.error("❌ Error en predicción:", error);
      alert("Error al predecir. Revisa la consola para más detalles.");
    } finally {
      // Reset button
      if (predictBtn) {
        predictBtn.disabled = false;
        predictBtn.innerHTML = '<div class="flex items-center gap-2"><span class="text-lg">🎯</span><span>Predecir</span></div>';
      }
    }
  }

  renderResults(probabilities) {
    this.renderTop(probabilities);
    this.renderBars(probabilities);
  }

  renderTop(probabilities) {
    const top = probabilities
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p - a.p);
    
    const winner = top[0];
    const confidence = (winner.p * 100).toFixed(1);
    
    console.log(`🎯 Predicción: ${winner.i} con ${confidence}% de confianza`);
    
    // Actualizar predicción principal
    const predictionBox = document.getElementById('prediction');
    if (predictionBox) {
      predictionBox.innerHTML = `
        <div class="text-6xl font-bold text-purple-300 mb-2">${winner.i}</div>
        <p class="text-purple-200">Confianza: ${confidence}%</p>
      `;
      console.log('✅ UI actualizada con predicción');
    } else {
      console.warn('⚠️ No se encontró elemento #prediction');
    }
    
    // Fallback para debugging
    console.log('Top 3 predicciones:', top.slice(0, 3).map(t => `${t.i}: ${(t.p * 100).toFixed(1)}%`));
  }

  renderBars(probabilities) {
    // Actualizar nuevo sistema de confianza
    const confidenceDisplay = document.getElementById('confidenceDisplay');
    if (confidenceDisplay) {
      confidenceDisplay.innerHTML = '';
      probabilities.forEach((p, d) => {
        const pct = (p * 100).toFixed(1);
        const isWinner = pct == Math.max(...probabilities.map(x => (x * 100).toFixed(1)));
        
        const el = document.createElement('div');
        el.className = `flex items-center gap-2 p-2 rounded ${isWinner ? 'bg-purple-600/30 border border-purple-400/50' : 'bg-purple-800/20 border border-purple-600/30'}`;
        el.innerHTML = `
          <div class="w-6 text-center font-bold ${isWinner ? 'text-purple-200' : 'text-purple-400'}">${d}</div>
          <div class="flex-1 h-2 bg-purple-900 rounded overflow-hidden">
            <div class="h-2 ${isWinner ? 'bg-purple-400' : 'bg-purple-600'} transition-all duration-300" style="width:${pct}%"></div>
          </div>
          <div class="w-12 text-right text-sm ${isWinner ? 'text-purple-200' : 'text-purple-400'}">${pct}%</div>
        `;
        confidenceDisplay.appendChild(el);
      });
    }
    
    // Fallback para el viejo sistema
    const barsBox = document.getElementById('mnistBars');
    if (barsBox) {
      barsBox.innerHTML = '';
      probabilities.forEach((p, d) => {
        const pct = (p * 100).toFixed(1);
        const el = document.createElement('div');
        el.innerHTML = `
          <div class="flex items-center gap-2">
            <div class="w-5 text-right">${d}</div>
            <div class="flex-1 h-3 bg-zinc-800 rounded">
              <div class="h-3 rounded bg-emerald-500 transition-all duration-500" style="width:${pct}%"></div>
            </div>
            <div class="w-14 text-right tabular-nums">${pct}%</div>
          </div>
        `;
        barsBox.appendChild(el);
      });
    }
  }
}

// Initialize MNIST demo when TensorFlow.js is loaded
if (typeof tf !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new MNISTDemo();
  });
}
