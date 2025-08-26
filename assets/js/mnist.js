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
    document.getElementById('mnistTop').innerHTML = '';
    document.getElementById('mnistBars').innerHTML = '';
    const prevCtx = document.getElementById('mnistPreview')?.getContext('2d');
    if (prevCtx) {
      prevCtx.clearRect(0, 0, 56, 56);
    }
  }

  async loadModel() {
    const topBox = document.getElementById('mnistTop');
    if (!topBox) return;

    const modelUrls = [
      "https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json",
      "https://hpssjellis.github.io/beginner-tensorflowjs-examples-in-javascript/saved-models/mnist/convnet/my-mnist01.json"
    ];

    topBox.textContent = "Cargando modelo…";
    
    for (const url of modelUrls) {
      try {
        this.model = await tf.loadLayersModel(url);
        topBox.textContent = "Modelo listo ✅";
        return;
      } catch (err) {
        console.warn("Falló modelo:", url, err);
      }
    }
    
    topBox.innerHTML = `<span class="text-red-300">No se pudo cargar el modelo</span>`;
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
    if (!this.model) {
      document.getElementById('mnistTop').textContent = "Modelo no cargado";
      return;
    }

    const predictBtn = document.getElementById('mnistPredict');
    const predictText = document.getElementById('predictText');
    const predictSpinner = document.getElementById('predictSpinner');
    
    // Loading state
    predictBtn.disabled = true;
    predictText.classList.add('hidden');
    predictSpinner.classList.remove('hidden');

    try {
      const input = this.preprocess();
      const prediction = this.model.predict(input);
      const probabilities = Array.from(await prediction.data());
      
      input.dispose();
      prediction.dispose();
      
      this.renderResults(probabilities);
    } catch (error) {
      console.error("Prediction error:", error);
      document.getElementById('mnistTop').textContent = "Error al predecir";
    } finally {
      // Reset loading state
      predictBtn.disabled = false;
      predictText.classList.remove('hidden');
      predictSpinner.classList.add('hidden');
    }
  }

  renderResults(probabilities) {
    this.renderTop(probabilities);
    this.renderBars(probabilities);
  }

  renderTop(probabilities) {
    const top = probabilities
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 3);
    
    const topBox = document.getElementById('mnistTop');
    if (topBox) {
      topBox.innerHTML = top.map(t => `
        <div class="flex items-center justify-between border border-white/10 rounded px-2 py-1">
          <div class="font-semibold text-lg">${t.i}</div>
          <div class="text-emerald-400 font-medium">${(t.p * 100).toFixed(1)}%</div>
        </div>
      `).join('');
    }
  }

  renderBars(probabilities) {
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
