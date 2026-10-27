/**
 * RED HOPE - Liquid Blood Cell & Plasma Particle Engine
 * Interactive WebGL / Canvas 2D Fluid Simulation
 * Inspired by Liquid Sculpture Hero physics (Curl turbulence, fluid wake, elastic return)
 */

(function () {
  'use strict';

  const canvas = document.getElementById('heroLiquidCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight || window.innerHeight);

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 80 : 160;

  // Particle colors (Blood red, crimson, deep ruby, glowing plasma)
  const COLORS = [
    { r: 200, g: 16, b: 46, a: 0.85 },  // Vibrant Blood Red
    { r: 166, g: 15, b: 45, a: 0.8 },   // Primary Crimson
    { r: 217, g: 4, b: 41, a: 0.75 },   // Ruby Blood Cell
    { r: 255, g: 77, b: 109, a: 0.65 }, // Oxygenated Cell
    { r: 139, g: 0, b: 0, a: 0.9 },     // Deep Hemoglobin
    { r: 255, g: 150, b: 170, a: 0.5 }  // Plasma Light
  ];

  class BloodParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.homeX = Math.random() * width;
      this.homeY = Math.random() * height;
      this.x = initial ? this.homeX : Math.random() * width;
      this.y = initial ? this.homeY : Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 9 + 4; // Erythrocyte cell diameter
      this.baseRadius = this.radius;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.03;
      this.mass = this.radius * 0.12;
      this.aspect = 0.6 + Math.random() * 0.35; // Biconcave disc flattening
      this.turbulenceOffset = Math.random() * 1000;
    }

    update(time, mouse) {
      this.angle += this.spinSpeed;

      // Gentle floating buoyancy (simulating liquid blood flow)
      const noiseX = Math.sin(time * 0.001 + this.turbulenceOffset) * 0.35;
      const noiseY = Math.cos(time * 0.0012 + this.turbulenceOffset * 0.8) * 0.35;
      this.vx += noiseX * 0.1;
      this.vy += noiseY * 0.1;

      // Mouse interactive liquid disturbance
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = mouse.radius;
        const maxDistSq = maxDist * maxDist;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / maxDist) * mouse.strength;
          
          // Liquid outward swirl + curl noise
          const normalX = dx / dist;
          const normalY = dy / dist;
          const tangentX = -normalY;
          const tangentY = normalX;

          this.vx += (normalX * 3.5 + tangentX * 2.2 + mouse.vx * 0.25) * force;
          this.vy += (normalY * 3.5 + tangentY * 2.2 + mouse.vy * 0.25) * force;
        }
      }

      // Viscous damping (simulating liquid blood plasma viscosity)
      this.vx *= 0.94;
      this.vy *= 0.94;

      // Gentle elastic pull back to home region to maintain ambient sculpture
      const pullX = (this.homeX - this.x) * 0.0025;
      const pullY = (this.homeY - this.y) * 0.0025;
      this.vx += pullX;
      this.vy += pullY;

      this.x += this.vx;
      this.y += this.vy;

      // Screen wrap
      if (this.x < -40) this.x = width + 40;
      if (this.x > width + 40) this.x = -40;
      if (this.y < -40) this.y = height + 40;
      if (this.y > height + 40) this.y = -40;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Liquid comet streak when moving fast
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 1.2) {
        ctx.scale(1 + Math.min(speed * 0.15, 0.8), 1);
      }

      // Draw red blood cell (erythrocyte biconcave oval)
      ctx.beginPath();
      ctx.ellipse(0, 0, this.radius * 1.3, this.radius * this.aspect, 0, 0, Math.PI * 2);

      // Radial gradient for 3D liquid cell look
      const grad = ctx.createRadialGradient(
        -this.radius * 0.3, -this.radius * 0.3, this.radius * 0.1,
        0, 0, this.radius * 1.4
      );
      const c = this.color;
      grad.addColorStop(0, `rgba(${c.r + 35}, ${c.g + 30}, ${c.b + 30}, ${c.a})`);
      grad.addColorStop(0.65, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * 0.85})`);
      grad.addColorStop(1, `rgba(${Math.max(0, c.r - 40)}, 0, 0, ${c.a * 0.3})`);

      ctx.fillStyle = grad;
      ctx.shadowColor = `rgba(${c.r}, 0, 20, 0.45)`;
      ctx.shadowBlur = Math.min(speed * 3 + 8, 20);
      ctx.fill();

      // Biconcave inner dimple
      ctx.beginPath();
      ctx.ellipse(0, 0, this.radius * 0.5, this.radius * this.aspect * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.max(0, c.r - 50)}, 0, 0, 0.35)`;
      ctx.shadowBlur = 0;
      ctx.fill();

      ctx.restore();
    }
  }

  // Create particle pool
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new BloodParticle());
  }

  // Mouse & Touch Tracking
  const mouse = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    active: false,
    radius: isMobile ? 120 : 190,
    strength: 1.2
  };

  const heroSection = canvas.closest('.hero-liquid-section') || canvas.parentElement;

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (mouse.prevX !== -9999) {
      mouse.vx = (x - mouse.prevX) * 0.4;
      mouse.vy = (y - mouse.prevY) * 0.4;
    }
    mouse.prevX = mouse.x = x;
    mouse.prevY = mouse.y = y;
    mouse.active = true;
  }

  heroSection.addEventListener('mousemove', (e) => {
    updatePointer(e.clientX, e.clientY);
  });

  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.prevX = -9999;
  });

  heroSection.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.prevX = -9999;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    particles.forEach(p => p.reset());
  });

  // Animation Loop
  let lastTime = 0;
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // Draw connecting fluid membrane lines between close cells
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update(now, mouse);

      // Connect near neighbors with faint red liquid capillaries
      for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
        const p2 = particles[j];
        const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
        if (distSq < 7200) { // approx 85px
          const alpha = (1 - Math.sqrt(distSq) / 85) * 0.22;
          ctx.strokeStyle = `rgba(200, 16, 46, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      p1.draw(ctx);
    }

    // Decay mouse velocity
    mouse.vx *= 0.85;
    mouse.vy *= 0.85;
  }

  requestAnimationFrame(animate);
})();
