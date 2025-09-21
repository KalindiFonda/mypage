// Particle system using Canvas for better performance
class SimpleParticles {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.particles = [];

        // Default configuration options
        this.options = {
            particleCount: options.particleCount || 60,
            color: options.color || '#d80000',
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 10,
            baseSpeed: options.baseSpeed || 0.1,
            ...options
        };

        // Create canvas for rendering
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.init();
        this.animate();
    }

    init() {
        // Set up canvas styling
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';

        this.resize();
        this.container.appendChild(this.canvas);

        // Create all particles
        for (let i = 0; i < this.options.particleCount; i++) {
            this.createParticle();
        }

        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        // Each particle gets its own speed multiplier
        const speedMultiplier = Math.random() * 0.9 + 0.3;
        const particleSpeed = this.options.baseSpeed * speedMultiplier;

        const particle = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * particleSpeed,
            vy: (Math.random() - 0.5) * particleSpeed,
            maxSpeed: particleSpeed,
            size: Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
            opacity: Math.random(),
            opacityDirection: Math.random() > 0.5 ? 1 : -1,
            opacitySpeed: Math.random() * 0.002 + 0.001
        };

        this.particles.push(particle);
    }

    updateParticle(particle) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add slight random direction changes for organic movement
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;

        // Limit velocity to particle's max speed
        const maxVel = particle.maxSpeed * 1.5;
        particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
        particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));

        // Update opacity animation
        particle.opacity += particle.opacityDirection * particle.opacitySpeed;
        if (particle.opacity <= 0 || particle.opacity >= 1) {
            particle.opacityDirection *= -1;
            particle.opacity = Math.max(0, Math.min(1, particle.opacity));
        }

        // Wrap around screen edges
        if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
        if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
        if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    drawParticle(particle) {
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', function () {
    const initParticles = () => {
        new SimpleParticles('simple-particles', {
            color: '#d80000',
            baseSpeed: 0.8
        });
    };

    if (window.requestIdleCallback) {
        // Use idle time to initialize particles
        requestIdleCallback(initParticles, { timeout: 500 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(initParticles, 100);
    }
});

// Window resize is now handled in the SimpleParticles class
