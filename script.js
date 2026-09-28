/* ═══════════════════════════════════════════════
   ESAT YUSUF TAŞ — CYBER PORTFOLIO
   script.js  v2.0  |  Vanilla JS
   ═══════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   1. MATRIX DIGITAL RAIN CANVAS
   ───────────────────────────────────────────── */
(function initMatrixRain() {
  const canvas = document.getElementById('boot-matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}/\\*+-=%$#@!?~';
  const fontSize = 14;
  let columns = 0;
  let drops = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    columns = Math.floor(W / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
  }

  function draw() {
    ctx.fillStyle = 'rgba(3, 5, 9, 0.1)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    const tiltX = parseFloat(document.documentElement.style.getPropertyValue('--tilt-x')) || 0;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const y = drops[i] * fontSize;
      const x = i * fontSize + (y * tiltX * 0.08);

      if (Math.random() > 0.88) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#e2e8f0';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(226, 232, 240, 0.75)' : 'rgba(56, 189, 248, 0.65)';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(char, x, y);

      if (y > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    animId = requestAnimationFrame(draw);
  }

  window.stopMatrixRain = () => {
    if (animId) cancelAnimationFrame(animId);
  };

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

/* ─────────────────────────────────────────────
   2. LINUX BIOS / KERNEL BOOT STREAM
   ───────────────────────────────────────────── */
(function initKernelBootLogs() {
  const container = document.getElementById('boot-kernel-logs');
  if (!container) return;

  const KERNEL_LINES = [
    { tag: 'OK',   type: 'ok',   text: 'BIOS: ACPI 6.4 initialized. Hardware verification passed.' },
    { tag: 'INIT', type: 'info', text: 'Loading Linux 6.9.1-arch1-eyt on x86_64 SMP...' },
    { tag: 'OK',   type: 'ok',   text: 'CPU: AMD/Intel 16-Core Matrix Threader @ 5.6 GHz active.' },
    { tag: 'OK',   type: 'ok',   text: 'Memory: 41943040k/43253760k available (2048k kernel code).' },
    { tag: 'INFO', type: 'info', text: 'Mounted /dev/nvme0n1p2 (ROOT) - ext4 journal recovered.' },
    { tag: 'SEC',  type: 'sec',  text: 'Cryptographic subsystem: AES-NI, SHA-512, ED25519 accelerated.' },
    { tag: 'OK',   type: 'ok',   text: 'Started D-Bus System Message Bus on unix:path=/run/dbus/system_bus_socket' },
    { tag: 'INIT', type: 'info', text: 'Calibrating holographic grid neural tensor driver...' },
    { tag: 'OK',   type: 'ok',   text: 'PCIe: NVIDIA RTX 5060 Tensor-Core Bus link speed 16.0 GT/s.' },
    { tag: 'OK',   type: 'ok',   text: 'Robotics Core: Marmara-EEE ROS2 humble bridge connected.' },
    { tag: 'INFO', type: 'info', text: 'Local RAG vector cache: 14,208 embeddings indexed into memory.' },
    { tag: 'SEC',  type: 'sec',  text: 'Identity resolved: root (uid=0, gid=0) -> Esat Yusuf Taş.' },
    { tag: 'WARN', type: 'warn', text: 'SECURITY POLICY: Neural link interface requires explicit manual override.' },
    { tag: 'AUTH', type: 'auth', text: 'AWAITING BIOMETRIC CONFIRMATION... [PRESS & HOLD TO OVERRIDE]' }
  ];

  let lineIdx = 0;
  function printNextLine() {
    if (lineIdx >= KERNEL_LINES.length) return;
    const item = KERNEL_LINES[lineIdx++];
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<span class="log-tag log-${item.type}">[ ${item.tag.padEnd(4, ' ')} ]</span><span>${item.text}</span>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    const delay = Math.floor(Math.random() * 65) + 35;
    setTimeout(printNextLine, delay);
  }

  setTimeout(printNextLine, 120);
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
    fov: 350, lineColor: '226,232,240', lineColorB: '56,189,248',
    numLines: 20, depth: 1.5,
  };

  let zOffset = 0;
  let camOffsetX = 0, camOffsetY = 0;
  let targetCamX = 0, targetCamY = 0;

  function project(wx, wy, wz) {
    const scale = cfg.fov / (cfg.fov + wz * cfg.fov);
    const cx = W/2 + camOffsetX * (1 - wz * 0.45);
    const cy = H/2 + camOffsetY * (1 - wz * 0.45);
    return { x: cx + wx * scale * W * 0.9, y: cy + wy * scale * H * 0.9, scale };
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

    // Smooth gyro camera interpolation
    camOffsetX += (targetCamX - camOffsetX) * 0.08;
    camOffsetY += (targetCamY - camOffsetY) * 0.08;

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

    // Horizon glow follows camera
    const glow = ctx.createRadialGradient(W/2 + camOffsetX, H/2 + camOffsetY, 0, W/2 + camOffsetX, H/2 + camOffsetY, Math.min(W,H)*0.35);
    glow.addColorStop(0, 'rgba(56,189,248,0.06)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(drawFrame);
  }

  function start() { resize(); drawFrame(); window.addEventListener('resize', resize); }
  function pause() { cancelAnimationFrame(animId); animId = null; }
  function resume() { if (animId == null) drawFrame(); }
  function hyperdrive() {
    cfg.targetSpeed = isMobile() ? 0.06 : 0.11;
    cfg.speedLerp = isMobile() ? 0.05 : 0.08;
    setTimeout(() => {
      cfg.targetSpeed = isMobile() ? 0.008 : 0.015;
      cfg.speedLerp = 0.04;
    }, 1800);
  }

  function setCameraTilt(tx, ty) {
    targetCamX = tx * (W * 0.12);
    targetCamY = ty * (H * 0.10);
  }

  return { start, pause, resume, hyperdrive, setCameraTilt };
})();

/* ─────────────────────────────────────────────
   4. CYBER FLUX & ATTITUDE / GYRO TELEMETRY
      • Autonomous Glitch: Spontaneous cyber flux pulses
      • Desktop: mouse drives tilt, parallax & velocity
      • Mobile: hardware gyroscope drives 3D parallax & attitude telemetry
   ───────────────────────────────────────────── */
(function initCyberFluxAndGyro() {
  let vel = 0, decayTimer;
  const root        = document.documentElement;
  const velBar      = document.getElementById('vel-bar');
  const velVal      = document.getElementById('vel-val');
  const velHud      = document.getElementById('vel-hud');
  const gyroVal     = document.getElementById('gyro-val');
  const gyroReticle = document.getElementById('gyro-reticle');

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
        v *= 0.82;
        if (v < 0.01) { v = 0; clearInterval(decay); }
        setVelocity(v);
      }, 50);
    }, 90);
  }

  /* ── AUTONOMOUS GLITCH PULSES (Kendi kendine siber parazit akışı) ── */
  function scheduleAutonomousFlux() {
    const nextInterval = 3200 + Math.random() * 4500;
    setTimeout(() => {
      // Periodic subtle cyber signal flux
      const spike = Math.random() > 0.35 ? (0.12 + Math.random() * 0.22) : (0.45 + Math.random() * 0.35);
      setVelocity(spike);
      scheduleDecay();

      // Periodic spontaneous glitch on title
      if (Math.random() > 0.55) {
        const title = document.getElementById('main-title');
        if (title) {
          title.classList.add('glitching');
          setTimeout(() => title.classList.remove('glitching'), 300);
        }
      }

      scheduleAutonomousFlux();
    }, nextInterval);
  }
  scheduleAutonomousFlux();

  /* ── ATTITUDE HUD UPDATE ── */
  function updateAttitudeHud(tx, ty) {
    if (gyroVal) {
      const pitchDeg = Math.round(ty * 45);
      const rollDeg  = Math.round(tx * 45);
      const pStr = (pitchDeg >= 0 ? '+' : '') + pitchDeg;
      const rStr = (rollDeg >= 0 ? '+' : '') + rollDeg;
      gyroVal.textContent = `P:${pStr}° R:${rStr}°`;
    }
  }

  /* ── DESKTOP: mouse movement drives camera tilt & mouse velocity ── */
  let lastX = 0, lastY = 0, lastT = 0;
  let gyroActive = false;

  window.addEventListener('mousemove', e => {
    const now  = performance.now();
    const dt   = now - lastT || 16;
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    const norm = Math.min(dist / dt / 3.5, 0.85);
    setVelocity(vel < norm ? vel * 0.25 + norm * 0.75 : vel * 0.85 + norm * 0.15);
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    scheduleDecay();

    // Mouse tilt for desktop (center is 0, -1 to +1)
    if (!gyroActive) {
      const tx = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2));
      const ty = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2));
      const clampX = Math.max(-1, Math.min(1, tx));
      const clampY = Math.max(-1, Math.min(1, ty));
      root.style.setProperty('--tilt-x', (clampX * 0.6).toFixed(3));
      root.style.setProperty('--tilt-y', (clampY * 0.6).toFixed(3));
      if (typeof GridController !== 'undefined' && GridController.setCameraTilt) {
        GridController.setCameraTilt(clampX * 0.6, clampY * 0.6);
      }
      updateAttitudeHud(clampX * 0.6, clampY * 0.6);
    }
  });

  /* ── MOBILE: hardware gyroscope ── */
  let gyroEnabled = false;

  function handleOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    gyroActive = true;

    // Normalize tilt: gamma is roll (-45° to +45°), beta is pitch (calibrated ~45° holding angle)
    const tx = Math.max(-1, Math.min(1, e.gamma / 40));
    const ty = Math.max(-1, Math.min(1, (e.beta - 45) / 40));

    root.style.setProperty('--tilt-x', tx.toFixed(3));
    root.style.setProperty('--tilt-y', ty.toFixed(3));

    // Update 3D Cyber-Grid camera
    if (typeof GridController !== 'undefined' && GridController.setCameraTilt) {
      GridController.setCameraTilt(tx, ty);
    }

    // Update Attitude telemetry HUD
    updateAttitudeHud(tx, ty);
    // Gyro is dedicated to smooth 3D motion, NOT glitch jitter
  }

  function activateGyro() {
    if (gyroEnabled) return;
    gyroEnabled = true;
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  }

  // iOS 13+ permission & touch activation
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    window.__requestGyroPermission = function() {
      DeviceOrientationEvent.requestPermission()
        .then(state => { if (state === 'granted') activateGyro(); })
        .catch(() => {});
    };
  } else if ('DeviceOrientationEvent' in window) {
    window.addEventListener('touchstart', function onFirstTouch() {
      activateGyro();
      window.removeEventListener('touchstart', onFirstTouch);
    }, { once: true, passive: true });
  }

  window.showVelHud = function () { velHud && velHud.classList.remove('hidden'); };
})();


/* ─────────────────────────────────────────────
   4.5 MOBİL SES YÖNETİCİSİ (AudioManager)
       iOS ve Android'de arka plan geçişleri, ekran
       kilitleme ve çoklu açıp kapatmalarda sesin
       askıya alınmasını (suspended / paused bug) çözer.
   ───────────────────────────────────────────── */
const AudioManager = (function setupAudioManager() {
  const audioEl = document.getElementById('bg-audio');
  const btn = document.getElementById('audio-toggle');
  const icon = document.getElementById('audio-icon');

  let isUserMuted = false;
  let audioContextUnlocked = false;

  function unlockAudioContext() {
    if (audioContextUnlocked) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      const ctx = new AC();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      if (ctx.state === 'suspended') ctx.resume();
      audioContextUnlocked = true;
    } catch (e) {}
  }

  function syncUI() {
    if (!btn || !icon || !audioEl) return;
    const isPlaying = !audioEl.paused && !audioEl.muted && !isUserMuted;
    btn.classList.toggle('muted', !isPlaying);
    icon.textContent = isPlaying ? '♫' : '✕';
    btn.setAttribute('aria-label', isPlaying ? 'Sesi kapat' : 'Sesi aç');
  }

  if (audioEl) {
    audioEl.addEventListener('play', syncUI);
    audioEl.addEventListener('pause', syncUI);
    audioEl.addEventListener('volumechange', syncUI);
  }

  function play(targetVolume = 0.35) {
    if (!audioEl) return Promise.resolve();
    unlockAudioContext();
    isUserMuted = false;
    audioEl.muted = false;
    try { audioEl.volume = targetVolume; } catch (e) {}

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      return playPromise.then(() => {
        syncUI();
      }).catch(err => {
        console.warn('Audio play deferred or blocked by browser policy:', err);
        syncUI();
        // Mobilde autoplay engellendiyse ekrana ilk dokunuşta otomatik devam ettir
        const autoRetryTouch = () => {
          if (!isUserMuted && audioEl.paused) {
            audioEl.play().then(syncUI).catch(() => {});
          }
          window.removeEventListener('touchstart', autoRetryTouch);
          window.removeEventListener('click', autoRetryTouch);
        };
        window.addEventListener('touchstart', autoRetryTouch, { passive: true, once: true });
        window.addEventListener('click', autoRetryTouch, { passive: true, once: true });
      });
    }
    return Promise.resolve();
  }

  function pause() {
    if (!audioEl) return;
    isUserMuted = true;
    audioEl.pause();
    syncUI();
  }

  function toggle() {
    if (!audioEl) return;
    unlockAudioContext();
    // Eğer duraklatılmışsa veya sessize alınmışsa çal, çalıyorsa duraklat
    if (audioEl.paused || audioEl.muted || isUserMuted) {
      play();
    } else {
      pause();
    }
  }

  function primeForPlayback() {
    if (!audioEl) return;
    unlockAudioContext();
    // Tarayıcı güvenlik tokenini almak için dokunma anında sessizce oynatmayı başlatır
    if (audioEl.paused) {
      audioEl.muted = true;
      try { audioEl.volume = 0; } catch (e) {}
      const p = audioEl.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    }
  }

  function cancelPrime() {
    if (!audioEl) return;
    // Sadece henüz yetkilendirme tamamlanmadıysa ve ses sessizdeyse durdur
    if (audioEl.muted) {
      audioEl.pause();
      try { audioEl.currentTime = 0; } catch (e) {}
    }
  }

  // Preemptive unlock on first user gesture
  const onFirstInteraction = () => {
    primeForPlayback();
    window.removeEventListener('touchstart', onFirstInteraction);
    window.removeEventListener('pointerdown', onFirstInteraction);
  };
  window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true });
  window.addEventListener('pointerdown', onFirstInteraction, { passive: true, once: true });

  window.safePlayAudio = function (el, volume) {
    play(volume !== undefined ? volume : 0.35);
  };

  return {
    play,
    pause,
    toggle,
    primeForPlayback,
    cancelPrime,
    syncUI,
    get isPlaying() { return audioEl ? (!audioEl.paused && !audioEl.muted && !isUserMuted) : false; },
    get isUserMuted() { return isUserMuted; },
    get element() { return audioEl; }
  };
})();

/* ─────────────────────────────────────────────
   5. BIOMETRIC HOLD-TO-BREACH & 3D HYPERDRIVE WARP
   ───────────────────────────────────────────── */
(function initHoldToBreach() {
  const btn         = document.getElementById('boot-hold-btn');
  const ringProgress= document.getElementById('hold-ring-progress');
  const statusSub   = document.getElementById('hold-status-sub');
  const statusMain  = document.getElementById('hold-status-main');
  const pctEl       = document.getElementById('hold-pct');
  const protocolEl  = document.getElementById('telem-protocol');
  const bootScreen  = document.getElementById('boot-screen');
  const mainContent = document.getElementById('main-content');
  const audioEl     = document.getElementById('bg-audio');
  const audioBtn    = document.getElementById('audio-toggle');
  const root        = document.documentElement;

  if (!btn || !ringProgress || !bootScreen) return;

  const CIRCUMFERENCE = 2 * Math.PI * 68; // ~427.26
  const CHARGE_TIME_MS = 1100; // Hold duration in ms
  const buzz = (pattern) => { if (navigator.vibrate) navigator.vibrate(pattern); };

  let isHolding    = false;
  let isBreached   = false;
  let holdStart    = 0;
  let animFrameId  = null;
  let currentPct   = 0;
  let lastMilestone= 0;

  /* ── WEB AUDIO SYNTHESIZER ── */
  let audioCtx  = null;
  let chargeOsc = null;
  let chargeGain= null;

  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function startSynthCharge() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      chargeOsc = ctx.createOscillator();
      chargeGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Smooth triangle wave instead of harsh sawtooth
      chargeOsc.type = 'triangle';
      chargeOsc.frequency.setValueAtTime(60, ctx.currentTime);
      chargeOsc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + (CHARGE_TIME_MS / 1000));

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + (CHARGE_TIME_MS / 1000));

      // Quiet, pleasant cyber hum (low volume)
      chargeGain.gain.setValueAtTime(0.002, ctx.currentTime);
      chargeGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + (CHARGE_TIME_MS / 1000));

      chargeOsc.connect(filter);
      filter.connect(chargeGain);
      chargeGain.connect(ctx.destination);
      chargeOsc.start();
    } catch (e) {}
  }

  function stopSynthCharge() {
    if (chargeGain && audioCtx) {
      try {
        chargeGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        setTimeout(() => {
          if (chargeOsc) { chargeOsc.stop(); chargeOsc.disconnect(); chargeOsc = null; }
          chargeGain = null;
        }, 110);
      } catch (e) {}
    }
  }

  function playWarpBoom() {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.6);

      // Comfortable, non-piercing volume
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {}
  }

  function playAudio() {
    AudioManager.play(0.35);
  }

  /* ── PROGRESS & VISUALS ── */
  function setProgress(pct) {
    currentPct = Math.min(Math.max(pct, 0), 100);
    const offset = CIRCUMFERENCE * (1 - currentPct / 100);
    ringProgress.style.strokeDashoffset = offset;
    pctEl.textContent = Math.floor(currentPct) + '%';

    root.style.setProperty('--mouse-vel', (currentPct / 100 * 0.75).toFixed(3));

    const milestone = Math.floor(currentPct / 25);
    if (milestone > lastMilestone) {
      lastMilestone = milestone;
      buzz(18);
    }
  }

  function startHold(e) {
    if (isBreached) return;
    if (e) {
      if (e.type === 'keydown' && e.repeat) return;
      if (e.type === 'touchstart') e.preventDefault();
    }

    // Dokunulduğu anda tarayıcı ses kilidini sessizce aşar (tek basışta müzik çalabilmesi için kritik)
    AudioManager.primeForPlayback();

    isHolding = true;
    holdStart = performance.now() - (currentPct / 100) * CHARGE_TIME_MS;
    lastMilestone = Math.floor(currentPct / 25);

    btn.classList.add('holding');
    statusSub.textContent  = 'YETKİLENDİRİLİYOR...';
    statusMain.textContent = 'VERİ ALINIYOR';
    if (protocolEl) protocolEl.textContent = 'DECRYPTING_TOKEN';

    buzz(25);
    startSynthCharge();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(chargeLoop);
  }

  function chargeLoop(now) {
    if (!isHolding || isBreached) return;

    const elapsed = now - holdStart;
    const pct = (elapsed / CHARGE_TIME_MS) * 100;

    if (pct >= 100) {
      setProgress(100);
      triggerBreach();
      return;
    }

    setProgress(pct);
    animFrameId = requestAnimationFrame(chargeLoop);
  }

  function endHold() {
    if (isBreached || !isHolding) return;
    isHolding = false;
    btn.classList.remove('holding');

    // Eğer işlem tamamlanmadan parmak çekildiyse ön-yüklenen sesi durdur
    AudioManager.cancelPrime();

    stopSynthCharge();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    statusSub.textContent  = 'İŞLEM KESİLDİ';
    statusMain.textContent = 'BASILI TUTUN';
    if (protocolEl) protocolEl.textContent = 'NEURAL_LINK_STBY';

    const decayStart = performance.now();
    const startPct = currentPct;
    const decayDuration = 350;

    function decayLoop(now) {
      if (isHolding || isBreached) return;
      const progress = Math.min((now - decayStart) / decayDuration, 1);
      const remainingPct = startPct * (1 - progress);
      setProgress(remainingPct);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(decayLoop);
      } else {
        setProgress(0);
        statusSub.textContent  = 'SİSTEMİ YETKİLENDİR';
        statusMain.textContent = 'BASILI TUTUN';
      }
    }
    animFrameId = requestAnimationFrame(decayLoop);
  }

  function triggerBreach() {
    if (isBreached) return;
    isBreached = true;
    isHolding = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);

    stopSynthCharge();
    playWarpBoom();
    buzz([0, 30, 40, 90]);

    btn.classList.remove('holding');
    btn.classList.add('breached');
    statusSub.textContent  = 'PROTOKOL TAMAMLANDI';
    statusMain.textContent = 'ERİŞİM ONAYLANDI';
    pctEl.textContent      = '100% OK';
    if (protocolEl) protocolEl.textContent = 'SYSTEM_OVERRIDE_SUCCESS';
    root.style.setProperty('--mouse-vel', '0');

    if (window.__requestGyroPermission) window.__requestGyroPermission();

    try { if (audioEl) audioEl.currentTime = 0; } catch (e) {}
    playAudio();
    GridController.hyperdrive();
    if (window.stopMatrixRain) window.stopMatrixRain();

    // Trigger Optic Warp Flash (zero-lag GPU flash)
    const flashEl = document.getElementById('warp-flash');
    if (flashEl) {
      flashEl.classList.remove('flash-active');
      void flashEl.offsetWidth;
      flashEl.classList.add('flash-active');
    }

    mainContent.classList.remove('hidden');
    mainContent.classList.add('reveal', 'warp-enter');
    bootScreen.classList.add('hyperdrive-warp');

    setTimeout(() => {
      bootScreen.style.display = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        mainContent.classList.add('visible');
        mainContent.classList.remove('warp-enter');
        audioBtn.classList.remove('hidden');
        if (window.showVelHud) window.showVelHud();
        startContentAnimations();
      }));
    }, 680);
  }

  // Pointer & Touch bindings
  btn.addEventListener('mousedown', startHold);
  window.addEventListener('mouseup', endHold);
  btn.addEventListener('mouseleave', () => { if (isHolding) endHold(); });

  btn.addEventListener('touchstart', startHold, { passive: false });
  window.addEventListener('touchend', endHold, { passive: true });
  window.addEventListener('touchcancel', endHold, { passive: true });

  // Keyboard binding: Space or Enter
  window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.key === ' ') && !isBreached && bootScreen.style.display !== 'none') {
      e.preventDefault();
      startHold(e);
    }
  });
  window.addEventListener('keyup', (e) => {
    if ((e.code === 'Space' || e.key === ' ') && !isBreached && bootScreen.style.display !== 'none') {
      endHold();
    }
  });
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

    // Quick command chips (mobile)
    document.querySelectorAll('#term-quick button').forEach(chip => {
      chip.addEventListener('click', e => {
        e.stopPropagation();
        execute(chip.dataset.cmd);
      });
    });

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
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    AudioManager.toggle();
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
   13. MOBILE TERMINAL
       Fullscreen modu devre dışı bırakıldı.
       Terminal artık mobilde de sayfa içinde
       normal konumda kalır; scroll kilitlenmez.
   ───────────────────────────────────────────── */
(function initMobileTerminal() {
  const termBlock = document.getElementById('terminal-block');
  const termInput = document.getElementById('term-input');
  const closeBtn  = document.getElementById('term-mobile-close');

  if (!termBlock || !termInput || !closeBtn) return;

  // Terminale tıklanınca sadece geçmişi alta kaydır, fullscreen AÇMA
  termInput.addEventListener('focus', () => {
    setTimeout(() => {
      const hist = document.getElementById('term-history');
      if (hist) hist.scrollTop = hist.scrollHeight;
      // Terminal'in görünür olması için sayfayı kaydır
      termBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }, { passive: true });

  // Kapat butonuna basılınca sadece blur yap (sayfa zaten açık)
  closeBtn.addEventListener('click', () => {
    termInput.blur();
  });

  // Escape ile blur
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') termInput.blur();
  });
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
   14.6 MOBILE SECTION NAV — scroll spy
   ───────────────────────────────────────────── */
(function initMobileNav() {
  const links = Array.from(document.querySelectorAll('#mobile-nav a'));
  if (!links.length) return;

  const map = {};
  links.forEach(a => { map[a.dataset.sec] = a; });
  const sections = links
    .map(a => document.getElementById(a.dataset.sec))
    .filter(Boolean);
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = map[entry.target.id];
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

/* ─────────────────────────────────────────────
   14.5 BACKGROUND / APP-SWITCH GUARD
        Sekme arka plana atıldığında, uygulama
        değiştirildiğinde veya tarayıcı kapatılırken
        müziği durdurur ve RAM yiyen canvas
        döngülerini askıya alır. Geri dönüldüğünde
        otomatik ve kesintisiz kurtarma sağlar.
   ───────────────────────────────────────────── */
(function initBackgroundGuard() {
  let wasPlayingBeforeBackground = false;

  function pauseHeavyWork() {
    wasPlayingBeforeBackground = AudioManager.isPlaying;
    if (wasPlayingBeforeBackground && AudioManager.element) {
      AudioManager.element.pause();
    }
    if (window.stopBootParticles) window.stopBootParticles();
    GridController.pause();
  }

  function resumeHeavyWork() {
    GridController.resume();
    if (wasPlayingBeforeBackground && !AudioManager.isUserMuted) {
      AudioManager.play();
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseHeavyWork();
    else resumeHeavyWork();
  });

  // Mobilde tarayıcıdan çıkış / sayfadan ayrılma
  window.addEventListener('pagehide', pauseHeavyWork);
  window.addEventListener('beforeunload', pauseHeavyWork);
})();

/* ─────────────────────────────────────────────
   14.7 ARCHIVE (TEAMS & PROJECTS)
   ───────────────────────────────────────────── */
(function initArchive() {
  const terminalHeader = document.getElementById('archive-terminal');
  const teamTrack = document.getElementById('team-track');
  const projectTrack = document.getElementById('project-track');
  const hologramStage = document.getElementById('hologram-stage');
  const model3d = document.getElementById('model3d');
  const projDetails = document.getElementById('project-details');
  const projTitle = document.getElementById('proj-title');
  const projDesc = document.getElementById('proj-desc');
  const projSpecs = document.getElementById('proj-specs');
  
  const hudModelName = document.getElementById('hud-model-name');
  const hudStatus = document.getElementById('hud-status');
  const hudNode = document.getElementById('hud-node');

  if (!terminalHeader || !teamTrack) return;

  let archiveData = { teams: [], projects: [] };
  let currentTeamId = null;

  function loadData() {
    fetch('projects.json')
      .then(r => r.json())
      .then(data => {
        archiveData = data;
        renderTeams();
        if (data.teams.length > 0) {
          selectTeam(data.teams[0].id);
        }
      })
      .catch(e => {
        console.error('Failed to load archive data', e);
        terminalHeader.textContent = 'root@eyt:~/archive$ error loading data';
      });
  }

  function renderTeams() {
    teamTrack.innerHTML = '';
    archiveData.teams.forEach(team => {
      const chip = document.createElement('div');
      chip.className = 'team-chip';
      chip.dataset.id = team.id;
      
      const logo = document.createElement('div');
      logo.className = 'team-logo-placeholder';
      logo.textContent = team.logoText || team.name.substring(0,2).toUpperCase();
      
      const name = document.createElement('div');
      name.className = 'team-name';
      name.textContent = team.name;

      chip.appendChild(logo);
      chip.appendChild(name);
      
      chip.addEventListener('click', () => selectTeam(team.id));
      teamTrack.appendChild(chip);
    });
  }

  function selectTeam(teamId) {
    currentTeamId = teamId;
    
    // Update active chip
    document.querySelectorAll('.team-chip').forEach(el => {
      el.classList.toggle('active', el.dataset.id === teamId);
    });

    const team = archiveData.teams.find(t => t.id === teamId);
    terminalHeader.textContent = `root@eyt:~/archive$ cd ${team ? team.id.toUpperCase() : ''}`;
    
    // Render Projects
    const teamProjects = archiveData.projects.filter(p => p.teamId === teamId);
    renderProjects(teamProjects);
    
    // Auto-select first project or clear
    if (teamProjects.length > 0) {
      selectProject(teamProjects[0]);
    } else {
      clearModel();
    }
  }

  function renderProjects(projects) {
    projectTrack.innerHTML = '';
    if (projects.length === 0) {
      projectTrack.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">No records found.</span>';
      return;
    }

    projects.forEach(proj => {
      const item = document.createElement('div');
      item.className = 'project-item';
      item.dataset.id = proj.id;
      item.innerHTML = `<span class="project-item-year">[${proj.year}]</span> ${proj.name}`;
      
      item.addEventListener('click', () => selectProject(proj));
      projectTrack.appendChild(item);
    });
  }

  function selectProject(proj) {
    // Update active item
    document.querySelectorAll('.project-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === proj.id);
    });

    // Update Model
    hologramStage.style.display = 'block';
    if (proj.modelUrl) {
      model3d.src = proj.modelUrl;
    } else {
      model3d.src = '';
    }

    // Update Details
    projDetails.style.display = 'block';
    projTitle.textContent = proj.name;
    projTitle.dataset.text = proj.name;
    projDesc.textContent = proj.description || '';
    
    projSpecs.innerHTML = '';
    if (proj.specs && proj.specs.length > 0) {
      projSpecs.innerHTML = proj.specs.map(spec => `<li>${spec}</li>`).join('');
    }

    // Update HUD
    hudModelName.textContent = `MODEL: ${proj.name.substring(0, 15).toUpperCase()}`;
    hudStatus.textContent = 'STATUS: ONLINE';
    hudNode.textContent = `NODE: ${proj.year}`;
  }

  function clearModel() {
    hologramStage.style.display = 'none';
    projDetails.style.display = 'none';
    model3d.src = '';
  }

  loadData();
})();

/* ─────────────────────────────────────────────
   15. INIT
   ───────────────────────────────────────────── */
GridController.start();
