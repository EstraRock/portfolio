/* ═══════════════════════════════════════════════
   ESAT YUSUF TAŞ — CYBER PORTFOLIO
   script.js  v2.0  |  Vanilla JS
   ═══════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   1. BOOT PARTICLE CANVAS
   ───────────────────────────────────────────── */
(function initBootParticles() {
  const canvas = document.getElementById('boot-particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, bootAnimId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function createParticles() {
    const count = Math.min(80, Math.floor((W * H) / 18000));
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      size:  Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      dx: (Math.random() - 0.5) * 0.3,
    }));
  }
  function animateBootParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.dx;
      p.opacity = Math.max(0.05, Math.min(0.6, p.opacity + (Math.random() - 0.5) * 0.02));
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,204,${p.opacity})`;
      ctx.fill();
    });
    bootAnimId = requestAnimationFrame(animateBootParticles);
  }
  window.stopBootParticles = () => cancelAnimationFrame(bootAnimId);

  resize(); createParticles(); animateBootParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* ─────────────────────────────────────────────
   2. BOOT BAR
   ───────────────────────────────────────────── */
(function animateBootBar() {
  const fill     = document.getElementById('boot-bar-fill');
  const sysText  = document.getElementById('boot-sys-text');
  const messages = [
    'INITIALIZING NEURAL INTERFACE...',
    'LOADING CIPHER PROTOCOLS...',
    'ESTABLISHING SECURE LINK...',
    'CALIBRATING HOLOGRAPHIC MATRIX...',
    'SYSTEM READY. AWAITING AUTHORIZATION.',
  ];
  let pct = 0, msgIdx = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 3 + 0.5;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    fill.style.width = pct + '%';
    const ni = Math.min(Math.floor((pct / 100) * messages.length), messages.length - 1);
    if (ni !== msgIdx) { msgIdx = ni; sysText.textContent = messages[msgIdx]; }
  }, 60);
})();

/* ─────────────────────────────────────────────
   3. MAIN 3D CYBER GRID
   ───────────────────────────────────────────── */
const GridController = (function () {
  const canvas = document.getElementById('cyber-grid');
  const ctx    = canvas.getContext('2d');
  let W, H, animId;
  const isMobile = () => window.innerWidth < 768;

  const cfg = {
    speed: 0.008, targetSpeed: 0.008, speedLerp: 0.04,
    fov: 350, lineColor: '0,255,204', lineColorB: '0,229,255',
    numLines: 20, depth: 1.5,
  };

  let zOffset = 0;

  function project(wx, wy, wz) {
    const scale = cfg.fov / (cfg.fov + wz * cfg.fov);
    return { x: W/2 + wx * scale * W * 0.9, y: H/2 + wy * scale * H * 0.9, scale };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cfg.numLines = isMobile() ? 12 : 20;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    cfg.speed += (cfg.targetSpeed - cfg.speed) * cfg.speedLerp;
    zOffset = (zOffset + cfg.speed) % 1;

    const zSteps = isMobile() ? 8 : 14;
    const n = cfg.numLines;

    for (let seg = 0; seg < zSteps; seg++) {
      const zNear = (seg   / zSteps + zOffset) % 1;
      const zFar  = ((seg+1)/ zSteps + zOffset) % 1;
      const wNear = zNear * cfg.depth;
      const wFar  = zFar  * cfg.depth;
      const alpha = Math.pow(1 - zNear, 2.5) * 0.6;
      if (alpha < 0.01) continue;

      // Longitudinal lines
      for (let i = -n; i <= n; i++) {
        const wx = i / n;
        const pNear = project(wx, 0, wNear);
        const pFar  = project(wx, 0, wFar);
        const topN  = project(wx, -1, wNear), topF = project(wx, -1, wFar);
        const botN  = project(wx,  1, wNear), botF = project(wx,  1, wFar);

        const g = ctx.createLinearGradient(pNear.x, topN.y, pFar.x, topF.y);
        g.addColorStop(0, `rgba(${cfg.lineColor},${alpha * 0.4})`);
        g.addColorStop(1, `rgba(${cfg.lineColor},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(0.3, pNear.scale * 1.2);
        ctx.beginPath(); ctx.moveTo(topN.x, topN.y); ctx.lineTo(topF.x, topF.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(botN.x, botN.y); ctx.lineTo(botF.x, botF.y); ctx.stroke();

        ctx.strokeStyle = `rgba(${cfg.lineColorB},${alpha * 0.15})`;
        ctx.lineWidth = Math.max(0.2, pNear.scale * 0.5);
        ctx.beginPath(); ctx.moveTo(pNear.x, pNear.y); ctx.lineTo(pFar.x, pFar.y); ctx.stroke();
      }
      // Lateral rings
      for (let j = -n; j <= n; j++) {
        const wy = j / n;
        const L = project(-1, -1+(wy+1)*.5, wNear), R = project(1, -1+(wy+1)*.5, wNear);
        ctx.strokeStyle = `rgba(${cfg.lineColor},${alpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(R.x, R.y); ctx.stroke();
        const BL = project(-1,(wy+1)*.5,wNear), BR = project(1,(wy+1)*.5,wNear);
        ctx.beginPath(); ctx.moveTo(BL.x,BL.y); ctx.lineTo(BR.x,BR.y); ctx.stroke();
      }
    }

    // Horizon glow
    const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H)*0.35);
    glow.addColorStop(0, 'rgba(0,255,204,0.06)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(drawFrame);
  }

  function start() { resize(); drawFrame(); window.addEventListener('resize', resize); }
  function hyperdrive() {
    cfg.targetSpeed = 0.08;
    setTimeout(() => { cfg.targetSpeed = 0.018; }, 2000);
  }

  return { start, hyperdrive };
})();

/* ─────────────────────────────────────────────
   4. VELOCITY → GLITCH INTENSITY
      • Desktop: mouse movement speed → --mouse-vel
      • Mobile:  gyroscope tilt speed  → --mouse-vel  (progressive enhancement)
   ───────────────────────────────────────────── */
(function initVelocityGlitch() {
  let vel = 0, decayTimer;
  const root   = document.documentElement;
  const velBar = document.getElementById('vel-bar');
  const velVal = document.getElementById('vel-val');
  const velHud = document.getElementById('vel-hud');

  function setVelocity(v) {
    vel = Math.min(Math.max(v, 0), 1);
    root.style.setProperty('--mouse-vel', vel.toFixed(3));
    if (velBar) velBar.style.width = (vel * 100) + '%';
    if (velVal) velVal.textContent = vel.toFixed(2);
  }

  function scheduleDecay() {
    clearTimeout(decayTimer);
    decayTimer = setTimeout(() => {
      let v = vel;
      const decay = setInterval(() => {
        v *= 0.8;
        if (v < 0.01) { v = 0; clearInterval(decay); }
        setVelocity(v);
      }, 50);
    }, 80);
  }

  /* ── DESKTOP: mouse movement ── */
  let lastX = 0, lastY = 0, lastT = 0;
  window.addEventListener('mousemove', e => {
    const now  = performance.now();
    const dt   = now - lastT || 16;
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    const norm = Math.min(dist / dt / 3, 1); // saturate at 3 px/ms
    setVelocity(vel < norm ? vel * 0.3 + norm * 0.7 : vel * 0.85 + norm * 0.15);
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    scheduleDecay();
  });

  /* ── MOBILE: gyroscope / device orientation (progressive enhancement) ── */
  let gyroEnabled  = false;
  let lastBeta = null, lastGamma = null, lastGyroT = null;

  function handleOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    const now = performance.now();
    if (lastBeta !== null) {
      const dt = now - lastGyroT || 16;
      const dBeta  = Math.abs(e.beta  - lastBeta);
      const dGamma = Math.abs(e.gamma - lastGamma);
      // Ignore tiny drift (< 0.5°), normalise: 20°/frame = full glitch
      const motion = Math.min((dBeta + dGamma) / dt * 8, 1);
      if (motion > 0.05) {
        setVelocity(vel < motion ? vel * 0.4 + motion * 0.6 : vel * 0.7 + motion * 0.3);
        scheduleDecay();
      }
    }
    lastBeta = e.beta; lastGamma = e.gamma; lastGyroT = now;
  }

  function activateGyro() {
    if (gyroEnabled) return;
    gyroEnabled = true;
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  }

  // iOS 13+ requires explicit permission
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    // Store for later; we request after user gesture (boot-btn)
    window.__requestGyroPermission = function() {
      DeviceOrientationEvent.requestPermission()
        .then(state => { if (state === 'granted') activateGyro(); })
        .catch(() => {});
    };
  } else if ('DeviceOrientationEvent' in window) {
    // Android / older iOS — no permission needed, activate on touch
    window.addEventListener('touchstart', function onFirstTouch() {
      activateGyro();
      window.removeEventListener('touchstart', onFirstTouch);
    }, { once: true, passive: true });
  }

  window.showVelHud = function () { velHud && velHud.classList.remove('hidden'); };
})();


/* ─────────────────────────────────────────────
   5. BOOT BUTTON
      • Touch device: "basili tut" hold-to-boot (MOBILE)
      • Desktop:       normal click              (DESKTOP, unchanged)
   ───────────────────────────────────────────── */
(function initBootButton() {
  const btn         = document.getElementById('boot-btn');
  const holdBar     = document.getElementById('hold-progress');
  const bootScreen  = document.getElementById('boot-screen');
  const mainContent = document.getElementById('main-content');
  const audioEl     = document.getElementById('bg-audio');
  const audioBtn    = document.getElementById('audio-toggle');
  const isTouch     = navigator.maxTouchPoints > 0;

  // Mark body so CSS can show hold UX
  if (isTouch) document.body.classList.add('is-touch');

  function triggerBoot() {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = '0.5';

    // iOS 13 gyro permission on gesture
    if (window.__requestGyroPermission) window.__requestGyroPermission();

    audioEl.volume = 0.35;
    audioEl.play().catch(() => {});
    GridController.hyperdrive();
    if (window.stopBootParticles) window.stopBootParticles();
    bootScreen.classList.add('fade-out');

    setTimeout(() => {
      bootScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
      mainContent.classList.add('reveal');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        mainContent.classList.add('visible');
        audioBtn.classList.remove('hidden');
        if (window.showVelHud) window.showVelHud();
        startContentAnimations();
      }));
    }, 900);
  }

  if (isTouch) {
    /* —— MOBILE: hold-to-boot —— */
    let progress = 0, holdRaf;
    const HOLD_DURATION = 1200; // ms to fill bar
    const STEP_MS = 16;

    function startHold(e) {
      if (btn.disabled) return;
      // Prevent page scroll while holding
      e.preventDefault();
      
      // Müzik çalmaya başlasın
      audioEl.volume = 0.35;
      audioEl.play().catch(() => {});

      progress = 0;
      function tick() {
        progress += (STEP_MS / HOLD_DURATION) * 100;
        holdBar.style.width = Math.min(progress, 100) + '%';
        if (progress >= 100) { triggerBoot(); return; }
        holdRaf = setTimeout(tick, STEP_MS);
      }
      tick();
    }
    function cancelHold() {
      // Eğer sistem zaten açılmaya başladıysa (buton devre dışıysa) müziği kesme!
      if (btn.disabled) return;
      
      clearTimeout(holdRaf);
      progress = 0;
      holdBar.style.width = '0%';
      
      // Müziği durdur ve başa sar
      audioEl.pause();
      audioEl.currentTime = 0;
    }

    btn.addEventListener('touchstart',  startHold,  { passive: false });
    btn.addEventListener('touchend',    cancelHold, { passive: true  });
    btn.addEventListener('touchcancel', cancelHold, { passive: true  });

  } else {
    /* —— DESKTOP: simple click (UNCHANGED BEHAVIOUR) —— */
    btn.addEventListener('click', triggerBoot);
  }
})();


/* ─────────────────────────────────────────────
   6. GLITCH HELPERS
   ───────────────────────────────────────────── */
function triggerGlitch(el, duration = 400) {
  el.classList.add('glitching');
  setTimeout(() => el.classList.remove('glitching'), duration);
}
function scheduleRandomGlitch(el, min = 5000, max = 12000) {
  setTimeout(() => { triggerGlitch(el, 350); scheduleRandomGlitch(el, min, max); },
    min + Math.random() * (max - min));
}

/* ─────────────────────────────────────────────
   7. TYPEWRITER
   ───────────────────────────────────────────── */
function typewrite(el, text, speed = 40, cb = null) {
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(t); if (cb) cb(); }
  }, speed);
}
function typewriteLines(el, lines, speed = 28, lineDelay = 300, cb = null) {
  el.textContent = '';
  let li = 0;
  function nextLine() {
    if (li >= lines.length) { if (cb) cb(); return; }
    const line = lines[li++];
    let ci = 0;
    const div = document.createElement('div');
    el.appendChild(div);
    const t = setInterval(() => {
      div.textContent += line[ci++];
      if (ci >= line.length) { clearInterval(t); setTimeout(nextLine, lineDelay); }
    }, speed);
  }
  nextLine();
}

/* ─────────────────────────────────────────────
   8. SKILL BAR OBSERVER
   ───────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const obs  = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('animated'), 200); obs.unobserve(e.target); }
  }), { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

/* ─────────────────────────────────────────────
   9. INTERACTIVE TERMINAL ENGINE
   ───────────────────────────────────────────── */
const Terminal = (function () {
  const history = [];
  let histIdx   = -1;

  /* ── command definitions ── */
  const COMMANDS = {

    help: () => ({
      color: 'color-neon',
      text: [
        '╔══════════════════════════════════════════════════╗',
        '║          AVAILABLE COMMANDS — NEURAL_OS v2.0     ║',
        '╠══════════════════════════════════════════════════╣',
        '║  help       ›  Bu menüyü göster                  ║',
        '║  sys_info   ›  Donanım ve sistem bilgisi         ║',
        '║  fuel       ›  Yakıt seviyesini kontrol et       ║',
        '║  f1_start   ›  F1 tepki süresi oyununu başlat    ║',
        '║  whoami     ›  Mevcut kullanıcı kimliği          ║',
        '║  ls         ›  Dizin içeriğini listele           ║',
        '║  date       ›  Sistem saatini göster             ║',
        '║  clear      ›  Terminali temizle                 ║',
        '╚══════════════════════════════════════════════════╝',
      ].join('\n'),
    }),

    sys_info: () => ({
      color: 'color-electric',
      text: [
        '┌─ SYSTEM DIAGNOSTIC REPORT ─────────────────────────┐',
        '│                                                      │',
        '│  CPU    : Intel Core i9  @ 5.6 GHz (Boost)          │',
        '│  GPU    : NVIDIA RTX 5060 · 8 GB VRAM               │',
        '│           (Evet, 4 değil 8! Teşekkürler Jensen.)     │',
        '│  RAM    : 40 GB DDR5 · 6400 MHz                      │',
        '│  DISK   : 2 TB NVMe SSD · 7400 MB/s                 │',
        '│  OS     : Arch Linux (btw) / Windows 11 Dual-Boot   │',
        '│  KERNEL : 6.9.1-arch1                               │',
        '│  TEMP   : 68°C  ████████░░ Stabil                   │',
        '│  STATUS : ▓▓▓▓▓▓▓▓▓▓ ALL SYSTEMS NOMINAL           │',
        '│                                                      │',
        '└──────────────────────────────────────────────────────┘',
      ].join('\n'),
    }),

    fuel: () => {
      const logs = [
        '[WARN]  Yakıt sensörü tetiklendi.',
        '[INFO]  Mevcut yakıt: %3 — KRİTİK SEVİYE',
        '[ALERT] Performans düşüşü bekleniyor!',
        '[INFO]  Acil protokol başlatılıyor...',
        '[REQ]   Zurna dürüm × 2 sipariş edildi.',
        '[REQ]   Soğuk ayran × 1 L talep edildi.',
        '[INFO]  ETA teslimat: 15 dakika',
        '[OK]    Yakıt takviyesi planlandı. Bekle bizi.',
      ];
      return { color: 'color-green', text: logs.join('\n') };
    },

    f1_start: () => {
      setTimeout(() => F1Game.open(), 100);
      return { color: 'color-yellow', text: '>> F1 Reaction Test yükleniyor... 🏎️' };
    },

    whoami: () => ({
      color: 'color-neon',
      text: 'root@esat · Elektrik-Elektronik Mühendisi · Robotik Kaptanı · Sistem Geliştirici',
    }),

    ls: () => ({
      color: 'color-electric',
      text: [
        'drwxr-xr-x  projects/    [c++, python, flutter, ros2]',
        'drwxr-xr-x  research/    [rag_arch, embedded_ml]',
        'drwxr-xr-x  robots/      [autonomous_vehicle, arm6dof]',
        '-rw-r--r--  about.txt    [Marmara EEE · 2024]',
        '-rw-r--r--  cv.pdf       [Güncel · PDF]',
        '-rwxr-xr-x  startup.sh   [./this_portfolio.js]',
      ].join('\n'),
    }),

    date: () => ({
      color: 'color-muted',
      text: new Date().toLocaleString('tr-TR', {
        weekday:'long', year:'numeric', month:'long',
        day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit',
      }) + ' — SYSTEM_CLOCK_SYNCED',
    }),

    clear: () => {
      document.getElementById('term-history').innerHTML = '';
      return null; // no output to display
    },
  };

  function scrollBottom() {
    const tb = document.getElementById('terminal-block');
    if (tb) tb.scrollTop = tb.scrollHeight;
  }

  function printEntry(cmd, response) {
    const hist = document.getElementById('term-history');
    const entry = document.createElement('div');
    entry.className = 'hist-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'hist-cmd-line';
    cmdLine.innerHTML =
      `<span class="t-user">root@esat</span>` +
      `<span class="t-sep">:</span>` +
      `<span class="t-path">~</span>` +
      `<span class="t-sep">$</span>` +
      `<span>&nbsp;${escapeHtml(cmd)}</span>`;
    entry.appendChild(cmdLine);

    if (response) {
      const out = document.createElement('div');
      out.className = 'hist-output ' + (response.color || 'color-default');
      out.textContent = response.text;
      entry.appendChild(out);
    }

    hist.appendChild(entry);
    scrollBottom();
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function execute(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    history.unshift(raw);
    histIdx = -1;

    const handler = COMMANDS[cmd];
    let response;
    if (handler) {
      response = handler();
    } else {
      response = {
        color: 'color-red',
        text: `bash: ${raw}: command not found\nYazım için 'help' komutunu dene.`,
      };
    }
    printEntry(raw, response);
  }

  function init() {
    const input = document.getElementById('term-input');
    if (!input) return;

    // Click anywhere on terminal block to focus input
    document.getElementById('terminal-block').addEventListener('click', () => input.focus());

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        execute(val);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
        else { histIdx = -1; input.value = ''; }
      }
    });
  }

  return { init, execute };
})();

/* ─────────────────────────────────────────────
   10. F1 REACTION TIME GAME
   ───────────────────────────────────────────── */
const F1Game = (function () {
  const overlay  = document.getElementById('f1-overlay');
  const lights   = [1,2,3,4,5].map(n => document.getElementById(`f1-l${n}`));
  const statusEl = document.getElementById('f1-status');
  const goBtn    = document.getElementById('f1-go-btn');
  const resultEl = document.getElementById('f1-result');

  let phase = 'idle'; // idle | lighting | waiting | ready | done | tooEarly
  let startTime, lightsTimer, goTimer;

  function reset() {
    lights.forEach(l => l.classList.remove('on'));
    statusEl.textContent = 'HAZIRLAN...';
    statusEl.className   = 'f1-status';
    goBtn.disabled       = true;
    resultEl.textContent = '';
    phase = 'idle';
  }

  function startSequence() {
    reset();
    phase = 'lighting';
    let i = 0;
    lightsTimer = setInterval(() => {
      lights[i].classList.add('on');
      i++;
      if (i >= lights.length) {
        clearInterval(lightsTimer);
        statusEl.textContent = '...';
        // Random delay 0.5 – 3s before lights out
        const delay = 500 + Math.random() * 2500;
        goTimer = setTimeout(() => {
          lights.forEach(l => l.classList.remove('on'));
          statusEl.textContent = 'GEÇ!!!';
          statusEl.classList.add('go');
          goBtn.disabled = false;
          goBtn.focus();
          startTime = performance.now();
          phase = 'ready';
        }, delay);
      }
    }, 700);
  }

  function onGo() {
    if (phase === 'lighting') {
      // Too early!
      clearInterval(lightsTimer);
      clearTimeout(goTimer);
      lights.forEach(l => l.classList.remove('on'));
      statusEl.textContent = 'ERKEN GEÇTİN! ❌';
      statusEl.className   = 'f1-status too-early';
      resultEl.textContent = 'Kırmızı ışıklar söndükten sonra tıkla!';
      phase = 'tooEarly';
      Terminal.execute('f1_early_exit');
      goBtn.disabled = true;
      setTimeout(() => { startSequence(); }, 2000);
      return;
    }
    if (phase !== 'ready') return;
    phase = 'done';
    const rt = Math.round(performance.now() - startTime);
    goBtn.disabled = true;
    let rating;
    if (rt < 150)      rating = '🏆 INSANI! Pro seviye!';
    else if (rt < 220) rating = '⚡ MÜKEMMEL! Race driver!';
    else if (rt < 300) rating = '✅ İYİ! Ortalama pilot.';
    else if (rt < 450) rating = '🙂 Normal insan.';
    else if (rt < 700) rating = '😅 Biraz geç kaldın.';
    else               rating = '🐢 Kaplumbağa mı?';

    statusEl.textContent = 'SONUÇ';
    resultEl.innerHTML   = `Tepki Süresi: <strong>${rt} ms</strong> — ${rating}`;

    // Print to terminal
    Terminal.execute(`f1_result ${rt}ms`);
    document.getElementById('term-history').lastElementChild
      && (document.getElementById('term-history').lastElementChild.querySelector('.hist-output').textContent =
        `>> Tepki süresi: ${rt} ms — ${rating}`);

    setTimeout(() => { startSequence(); }, 3000);
  }

  function open() {
    overlay.classList.remove('hidden');
    startSequence();
  }
  function close() {
    clearInterval(lightsTimer);
    clearTimeout(goTimer);
    overlay.classList.add('hidden');
    reset();
  }

  document.getElementById('f1-close').addEventListener('click', close);
  goBtn.addEventListener('click', onGo);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
    if ((e.key === ' ' || e.key === 'Enter') && !overlay.classList.contains('hidden') && !goBtn.disabled) {
      e.preventDefault(); onGo();
    }
  });

  return { open, close };
})();

/* ─────────────────────────────────────────────
   11. AUDIO TOGGLE
   ───────────────────────────────────────────── */
(function initAudioToggle() {
  const btn  = document.getElementById('audio-toggle');
  const icon = document.getElementById('audio-icon');
  const aud  = document.getElementById('bg-audio');
  let muted  = false;
  btn.addEventListener('click', () => {
    muted = !muted;
    aud.muted = muted;
    icon.textContent = muted ? '✕' : '♫';
    btn.classList.toggle('muted', muted);
    btn.setAttribute('aria-label', muted ? 'Sesi aç' : 'Sesi kapat');
  });
})();

/* ─────────────────────────────────────────────
   12. CONTENT ANIMATION SEQUENCE
   ───────────────────────────────────────────── */
function startContentAnimations() {
  const title = document.getElementById('main-title');
  setTimeout(() => { triggerGlitch(title, 500); scheduleRandomGlitch(title); }, 300);

  const subtitleEl = document.getElementById('subtitle-text');
  setTimeout(() => {
    typewrite(subtitleEl, 'Elektrik-Elektronik Mühendisi | Robotik Kaptanı | Sistem Geliştirici', 35);
  }, 700);

  const aboutOutput = document.getElementById('about-output');
  const aboutLines  = [
    '╔══════════════════════════════════════╗',
    '║  NAME    : Esat Yusuf Taş            ║',
    '║  AFFIL   : Marmara Üniversitesi EEE  ║',
    '║  NODE_ID : EYT-2024                  ║',
    '╠══════════════════════════════════════╣',
    '║  STATUS  : [ONLINE] ▓▓▓▓▓▓▓▓▓▓ 100% ║',
    '╠══════════════════════════════════════╣',
    '║                                      ║',
    '║  Donanım ve yazılımı birleştirerek   ║',
    '║  otonom sistemler ve gömülü          ║',
    '║  mimariler inşa ediyorum.            ║',
    '║                                      ║',
    '║  Problemleri çözmek için makineler   ║',
    '║  tasarlıyorum — ve o makineleri      ║',
    '║  çalıştıracak kodu yazıyorum.        ║',
    '║                                      ║',
    '╚══════════════════════════════════════╝',
  ];
  setTimeout(() => {
    typewriteLines(aboutOutput, aboutLines, 12, 30, () => {
      initSkillBars();
      Terminal.init();
      // Welcome message
      setTimeout(() => {
        Terminal.execute('help');
      }, 400);
    });
  }, 1400);

  document.querySelectorAll('.section').forEach((s, i) => {
    s.style.animationDelay = `${0.3 + i * 0.12}s`;
  });
}

/* ─────────────────────────────────────────────
   13. MOBILE FULLSCREEN TERMINAL
       Progressive enhancement: only activates on ≤600px screens.
       Desktop terminal stays exactly as-is.
   ───────────────────────────────────────────── */
(function initMobileTerminal() {
  const isMobileWidth = () => window.matchMedia('(max-width: 600px)').matches;
  const termBlock = document.getElementById('terminal-block');
  const termInput = document.getElementById('term-input');
  const closeBtn  = document.getElementById('term-mobile-close');

  if (!termBlock || !termInput || !closeBtn) return;

  function openFullscreen() {
    if (!isMobileWidth()) return;
    termBlock.classList.add('terminal-fullscreen');
    document.body.style.overflow = 'hidden'; // prevent scroll behind
    // Scroll history to bottom
    setTimeout(() => {
      const hist = document.getElementById('term-history');
      if (hist) hist.scrollTop = hist.scrollHeight;
    }, 50);
  }

  function closeFullscreen() {
    termBlock.classList.remove('terminal-fullscreen');
    document.body.style.overflow = '';
    termInput.blur();
  }

  termInput.addEventListener('focus', openFullscreen, { passive: true });
  closeBtn.addEventListener('click', () => { closeFullscreen(); });

  // Also close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && termBlock.classList.contains('terminal-fullscreen')) {
      closeFullscreen();
    }
  });

  // Re-open if still focused and window resizes to mobile
  window.addEventListener('resize', () => {
    if (!isMobileWidth() && termBlock.classList.contains('terminal-fullscreen')) {
      closeFullscreen();
    }
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   14. MODEL-VIEWER SCROLL LOCK (Mobile)
       Shows "tap to activate" overlay so scroll works normally.
       Tapping overlay unlocks model interaction.
       On desktop: overlay is CSS display:none — no effect.
   ───────────────────────────────────────────── */
(function initModelLock() {
  const overlay    = document.getElementById('model-lock-overlay');
  const modelViewer = document.getElementById('model3d');
  const stage      = document.getElementById('hologram-stage');
  if (!overlay || !modelViewer || !stage) return;

  const isMobileWidth = () => window.matchMedia('(max-width: 768px)').matches;

  let modelActive = false;
  let deactivateTimer;

  function activateModel() {
    if (!isMobileWidth()) return;
    modelActive = true;
    overlay.classList.add('active');
    // Allow model-viewer touch events (override pan-y)
    modelViewer.style.touchAction = 'none';
    // Auto-deactivate after 6 seconds of no interaction
    clearTimeout(deactivateTimer);
    deactivateTimer = setTimeout(deactivateModel, 6000);
  }

  function deactivateModel() {
    modelActive = false;
    overlay.classList.remove('active');
    modelViewer.style.touchAction = 'pan-y';
    clearTimeout(deactivateTimer);
  }

  // Tap/click overlay to activate
  overlay.addEventListener('click',     activateModel, { passive: true });
  overlay.addEventListener('touchend',  activateModel, { passive: true });
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') activateModel();
  });

  // Touching the model-viewer while active resets the auto-deactivate timer
  modelViewer.addEventListener('touchstart', () => {
    if (modelActive) {
      clearTimeout(deactivateTimer);
      deactivateTimer = setTimeout(deactivateModel, 6000);
    }
  }, { passive: true });

  // If user scrolls page away from hologram, deactivate
  window.addEventListener('scroll', () => {
    if (!modelActive) return;
    const rect = stage.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) deactivateModel();
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   15. INIT
   ───────────────────────────────────────────── */
GridController.start();
