// ===== NIGHTWOLF PORTFOLIO JAVASCRIPT =====

class NightWolfPortfolio {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
    this.themes = {
      dark: { icon: '🌙', name: 'Dark', colors: ["#10b981","#7b2eff","#ff005d"], linkColor: '#10b981' },
      light: { icon: '☀️', name: 'Light', colors: ["#059669","#6d28d9","#dc2626"], linkColor: '#059669' },
      cyber: { icon: '⚡', name: 'Cyberpunk', colors: ["#00ffff","#ff00ff","#ffff00"], linkColor: '#00ffff' },
      ocean: { icon: '🌊', name: 'Ocean', colors: ["#3b82f6","#22c55e","#06b6d4"], linkColor: '#3b82f6' },
      purple: { icon: '🔮', name: 'Purple', colors: ["#a855f7","#22c55e","#f59e0b"], linkColor: '#a855f7' },
      matrix: { icon: '💚', name: 'Matrix', colors: ["#00ff00","#22c55e","#65a30d"], linkColor: '#00ff00' }
    };
    this.init();
  }

  init() {
    this.initEventListeners();
    this.initThemes();
    this.initParticles();
    this.initVisualEffects();
  }

  initEventListeners() {
    document.getElementById('y').textContent = new Date().getFullYear();
    
    // Mobile menu
    document.getElementById('hamburger')?.addEventListener('click', () => this.toggleMobileMenu());
    
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleDropdown());
    document.getElementById('themeDropdown')?.addEventListener('click', (e) => this.handleThemeClick(e));
    
    // Avatar confetti
    document.getElementById('avatarWrap')?.addEventListener('click', () => this.createConfetti());
    
    // Player toggle
    document.getElementById('toggleBtn')?.addEventListener('click', () => this.togglePlayer());
    
    // Dashboard switcher
    document.getElementById('btnDash1')?.addEventListener('click', () => this.setDashboard('d1'));
    document.getElementById('btnDash2')?.addEventListener('click', () => this.setDashboard('d2'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  initThemes() {
    this.setTheme(this.currentTheme);
  }

  setTheme(theme) {
    const themeData = this.themes[theme];
    if (!themeData) return;
    
    if (theme === 'dark') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
    
    document.getElementById('themeIcon').textContent = themeData.icon;
    
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme);
    });
    
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    
    if (window.tsParticles) {
      window.PARTICLE_COLORS = themeData.colors;
      window.PARTICLE_LINK_COLOR = themeData.linkColor;
      this.updateParticles();
    }
  }

// Particulas - Simulación de Galaxia
  initParticles() {
    setTimeout(() => {
      const themeData = this.themes[this.currentTheme];
      window.PARTICLE_COLORS = themeData.colors;
      window.PARTICLE_LINK_COLOR = themeData.linkColor;
      
      tsParticles.load("tsparticles", {
        fullScreen: { enable: false },
        detectRetina: true,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          color: { value: ["#ffffff", "#10b981", "#7b2eff", "#ff005d"] },
          shape: { type: "circle" },
          opacity: { 
            value: 0.8, 
            random: { enable: true, minimumValue: 0.2 },
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
          },
          size: { 
            value: { min: 0.5, max: 2.5 },
            animation: { enable: true, speed: 3, minimumValue: 0.1, sync: false }
          },
          links: { enable: false },
          move: { 
            enable: true, 
            speed: 0.3, 
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "out" },
            spin: { acceleration: 0, enable: true },
            orbit: { animation: { count: 0, enable: true, speed: 0.5, sync: false }, enable: true, opacity: 1, rotation: { random: true, value: { min: 0, max: 360 } }, width: 1 }
          }
        },
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { 
              enable: true, 
              mode: "slow",
              parallax: { enable: true, force: 60, smooth: 10 }
            },
            onClick: { enable: true, mode: "attract" },
            resize: true
          },
          modes: {
            slow: { factor: 0.1, radius: 200 },
            attract: { distance: 200, duration: 0.4, factor: 5 }
          }
        }
      });

      // Agregar algunas "estrellas especiales" con tooltips
      // this.addGalaxySecrets(); // Cometa deshabilitado
    }, 100);
  }

  addGalaxySecrets() {
    // Función deshabilitada - sin cometa
    return;
  }

  initVisualEffects() {
    setTimeout(() => {
      this.initTypingAnimation();
      this.initParallax();
      this.initMatrixRain();
      this.initMouseTrail();
    }, 500);
  }

  initTypingAnimation() {
    const text1 = "The thing is not \"how\" you do it.";
    const text2 = "The thing is just make it happen.\"";
    const el1 = document.getElementById('typingSlogan');
    const el2 = document.getElementById('typingSlogan2');
    
    if (!el1 || !el2) return;
    
    let i = 0;
    const speed = 100;
    
    const typeText1 = () => {
      if (i < text1.length) {
        el1.textContent = '"' + text1.substring(0, i + 1);
        i++;
        setTimeout(typeText1, speed);
      } else {
        setTimeout(() => {
          i = 0;
          typeText2();
        }, 500);
      }
    };
    
    const typeText2 = () => {
      if (i < text2.length) {
        el2.textContent = text2.substring(0, i + 1);
        i++;
        setTimeout(typeText2, speed);
      }
    };
    
    setTimeout(typeText1, 1000);
  }

  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((element, index) => {
        const rate = scrolled * -0.3 * (index + 1);
        element.style.transform = `translateY(${rate}px)`;
      });
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  initMatrixRain() {
    const canvas = document.getElementById('matrixRain');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops = Array(columns).fill(1);
    
    const draw = () => {
      if (document.body.dataset.theme !== 'matrix') {
        animationId = requestAnimationFrame(draw);
        return;
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
  }

  initMouseTrail() {
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.8) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = (e.clientX - 4) + 'px';
        trail.style.top = (e.clientY - 4) + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 800);
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const lines = ['line1', 'line2', 'line3'].map(id => document.getElementById(id));
    
    if (this.isMenuOpen) {
      lines[0].style.transform = 'rotate(45deg) translate(3px, 3px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(3px, -3px)';
      mobileMenu.style.transform = 'translateY(0)';
      mobileMenu.style.opacity = '1';
      mobileMenu.style.pointerEvents = 'auto';
    } else {
      lines.forEach(line => line.style.transform = 'none');
      lines[1].style.opacity = '1';
      mobileMenu.style.transform = 'translateY(-100%)';
      mobileMenu.style.opacity = '0';
      mobileMenu.style.pointerEvents = 'none';
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdown = document.getElementById('themeDropdown');
    dropdown.classList.toggle('active', this.isDropdownOpen);
  }

  handleThemeClick(e) {
    if (e.target.classList.contains('theme-option')) {
      const theme = e.target.dataset.theme;
      this.setTheme(theme);
      this.toggleDropdown();
    }
  }

  createConfetti() {
    const avatar = document.getElementById('avatarWrap');
    const rect = avatar.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = window.PARTICLE_COLORS || this.themes.dark.colors;
    
    for (let i = 0; i < 42; i++) {
      const d = document.createElement('div');
      d.className = 'confetti';
      const c = colors[i % colors.length];
      d.style.background = c;
      d.style.boxShadow = `0 0 15px ${c}`;
      const angle = Math.random() * 360;
      const radius = 120 + Math.random() * 120;
      d.style.setProperty('--rot', angle + 'deg');
      d.style.setProperty('--tx', `${radius * Math.cos(angle * Math.PI / 180)}px`);
      d.style.setProperty('--ty', `${radius * Math.sin(angle * Math.PI / 180)}px`);
      d.style.left = cx + 'px';
      d.style.top = cy + 'px';
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 1000);
    }
  }

  togglePlayer() {
    const btn = document.getElementById('toggleBtn');
    const wrap = document.getElementById('playerWrap');
    const hidden = wrap.style.transform === 'translateY(100%)';
    
    wrap.style.transform = hidden ? 'translateY(0)' : 'translateY(100%)';
    btn.textContent = hidden ? 'Ocultar música ⤵' : 'Mostrar música ⤴';
  }

  setDashboard(key) {
    const dashboards = {
      d1: {
        title: "COMPLEMENTOS DE TARIFA 2025",
        url: "https://app.powerbi.com/view?r=eyJrIjoiNjhhYTRmYzMtZTI4Zi00MzlhLWEwN2QtMGNmYjEzZGJhNTQyIiwidCI6IjEyMDFlNjcwLTI4YjQtNDg1ZC05OTNhLWIxYzU0OGRhMmZhYiJ9"
      },
      d2: {
        title: "Diario Complementos",
        url: "https://app.powerbi.com/view?r=eyJrIjoiMDAzNTg1YjEtOWU4MS00YmMxLWIzNWMtYWU2MjA5ZjExZjEwIiwidCI6IjEyMDFlNjcwLTI4YjQtNDg1ZC05OTNhLWIxYzU0OGRhMmZhYiJ9"
      }
    };
    
    const d = dashboards[key];
    if (!d) return;
    
    const frame = document.getElementById('pbiFrame');
    const loader = document.getElementById('dashLoader');
    const btn1 = document.getElementById('btnDash1');
    const btn2 = document.getElementById('btnDash2');
    
    // Update button states
    if (key === 'd1') {
      btn1.classList.add('bg-emerald-600', 'text-white', 'shadow');
      btn2.classList.remove('bg-emerald-600', 'text-white', 'shadow');
    } else {
      btn2.classList.add('bg-emerald-600', 'text-white', 'shadow');
      btn1.classList.remove('bg-emerald-600', 'text-white', 'shadow');
    }
    
    // Show loader and update iframe
    loader.style.opacity = '1';
    frame.title = d.title;
    frame.src = d.url;
    
    frame.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
      }, 500);
    }, { once: true });
  }

  handleKeyboard(e) {
    if (e.ctrlKey && e.shiftKey) {
      const shortcuts = { 'T': 'dark', 'L': 'light', 'C': 'cyber', 'O': 'ocean', 'P': 'purple', 'M': 'matrix' };
      if (shortcuts[e.key.toUpperCase()]) {
        e.preventDefault();
        this.setTheme(shortcuts[e.key.toUpperCase()]);
      }
    }
  }

  updateParticles() {
    const container = tsParticles.domItem(0);
    if (container) {
      container.options.particles.color.value = window.PARTICLE_COLORS;
      container.options.particles.links.color = window.PARTICLE_LINK_COLOR;
      container.refresh();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NightWolfPortfolio();
});
