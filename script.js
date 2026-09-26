/* ==========================================================================
   IRFANA PARVEEN H - FUTURISTIC AI PORTFOLIO JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Audio Synthesizer (Web Audio API for subtle futuristic SFX) ---
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSFX(freq = 440, type = 'sine', duration = 0.08) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  const sfxBtn = document.getElementById('sfxToggle');
  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      sfxBtn.classList.toggle('active', soundEnabled);
      showToast(soundEnabled ? '🔊 Audio Effects Active' : '🔇 Audio Muted');
      if (soundEnabled) playSFX(880, 'triangle', 0.15);
    });
  }

  // --- 2. Theme Switching ---
  const themeBtn = document.getElementById('themeToggle');
  const themes = ['cyan', 'purple', 'emerald'];
  let currentThemeIdx = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const newTheme = themes[currentThemeIdx];
      document.body.setAttribute('data-theme', newTheme);
      showToast(`🎨 Theme Accent: ${newTheme.toUpperCase()}`);
      playSFX(600, 'sine', 0.1);
    });
  }

  // --- 3. Synapse Canvas Engine (Neural Nodes & Dynamic Lines) ---
  const canvas = document.getElementById('synapseCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.size = Math.random() * 2 + 1;
      this.color = Math.random() > 0.3 ? '#00F0FF' : '#8A2BE2';
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      this.pulse += 0.03;

      // Mouse Proximity Attraction
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      const alpha = 0.5 + Math.sin(this.pulse) * 0.3;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Connect Nearby Particles (Neural Synapses)
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          const opacity = (1 - dist / 130) * 0.25;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();

  // --- 4. Dynamic Typing Title Effect ---
  const typingText = document.getElementById('typingText');
  const roles = [
    'ML Engineer @ Brainvoice.ai',
    'AI Healthcare ERP Specialist',
    'Forecasting & Scheduling Engineer',
    'NLP & Deep Learning Architect'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingText) return;
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingText.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // --- 5. Skills Filter Engine ---
  const skillChips = document.querySelectorAll('.skill-chip');
  const filterChips = document.querySelectorAll('.filter-chip');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const cat = chip.dataset.filter;
      skillChips.forEach(sc => {
        if (cat === 'all' || sc.dataset.cat === cat) {
          sc.style.display = 'flex';
          sc.style.animation = 'fadeIn 0.3s ease';
        } else {
          sc.style.display = 'none';
        }
      });
      playSFX(650, 'triangle', 0.08);
    });
  });

  // --- 6. Interactive CLI Terminal Modal Drawer ---
  const terminalToggle = document.getElementById('terminalToggle');
  const terminalModal = document.getElementById('terminalModal');
  const closeTermBtn = document.getElementById('closeTermBtn');
  const termInput = document.getElementById('termInput');
  const termBody = document.getElementById('termBody');

  function openTerminal() {
    if (terminalModal) {
      terminalModal.classList.add('active');
      if (termInput) termInput.focus();
      playSFX(850, 'sine', 0.1);
    }
  }

  function closeTerminal() {
    if (terminalModal) {
      terminalModal.classList.remove('active');
      playSFX(450, 'sine', 0.08);
    }
  }

  if (terminalToggle) terminalToggle.addEventListener('click', openTerminal);
  if (closeTermBtn) closeTermBtn.addEventListener('click', closeTerminal);

  // Command Parser
  if (termInput) {
    termInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = '';
        executeCommand(cmd);
      }
    });
  }

  function appendTermLine(html) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function executeCommand(cmd) {
    appendTermLine(`<span class="terminal-prompt">irfana@ai-workstation:~$</span> ${cmd}`);

    switch (cmd) {
      case 'help':
        appendTermLine(`Available commands:
  - <strong style="color:var(--accent-cyan)">whoami</strong>    : Summary of Irfana Parveen H
  - <strong style="color:var(--accent-cyan)">skills</strong>    : List primary AI/ML, ERP & software skills
  - <strong style="color:var(--accent-cyan)">projects</strong>  : Overview of AVCRI ERP, IntelliQ & ML systems
  - <strong style="color:var(--accent-cyan)">contact</strong>   : Direct email & location details
  - <strong style="color:var(--accent-cyan)">exp</strong>       : Current ML Engineer role at Brainvoice.ai
  - <strong style="color:var(--accent-cyan)">clear</strong>     : Clear terminal screen`);
        break;

      case 'whoami':
        appendTermLine(`Irfana Parveen H | Software & AI/ML Engineer
Location: Coimbatore, Tamil Nadu
Degree: B.Tech in Artificial Intelligence and Data Science (GPA: 7.8)
Role: ML Engineer @ Brainvoice.ai`);
        break;

      case 'skills':
        appendTermLine(`Primary Stack:
  [AI/ML & ERP] Constraint Scheduling Algorithms, Forecasting, PyTorch, TensorFlow, scikit-learn
  [Vision/APIs] OpenCV, MediaPipe, Groq API, REST API
  [Software]   Python, SQL, HTML, CSS, Flask, React Native
  [Data]       Pandas, NumPy, MongoDB, MySQL`);
        break;

      case 'projects':
        appendTermLine(`Featured Projects:
  1. AVCRI ERP & AI-Driven Healthcare System (Brainvoice.AI | 2026)
  2. IntelliQ Mobile AI Chatbot (Flask + React Native + Groq API + BERT)
  3. Mental Disorder ML Classifier (Logistic Regression & SVM)
  4. Hand Gesture Interface (OpenCV & MediaPipe)`);
        break;

      case 'contact':
        appendTermLine(`Contact Irfana Parveen H:
  - Email: irfuirfa2003@gmail.com
  - Location: Coimbatore, Tamil Nadu`);
        break;

      case 'exp':
        appendTermLine(`Current Experience:
  ML Engineer at Brainvoice.ai (Sep 2025 - Present)
  - Developing AVCRI AI-driven Healthcare ERP System & constraint scheduling algorithms.
  - Speech processing, NLP models, voice analytics, real-time inference optimization.`);
        break;

      case 'clear':
        termBody.innerHTML = '';
        break;

      case '':
        break;

      default:
        appendTermLine(`<span style="color:#FF0055">Command not found: "${cmd}". Type 'help' for available commands.</span>`);
    }

    playSFX(600, 'triangle', 0.05);
  }

  // --- 7. Copy Utilities & Toast Notifications ---
  window.copyText = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label} copied to clipboard!`);
      playSFX(900, 'sine', 0.1);
    });
  };

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // --- 8. Navbar Scroll Observer ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});
