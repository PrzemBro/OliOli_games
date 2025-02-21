class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.leafesArray = [];
    this.isAnimating = true;

    // Czekamy na załadowanie strony przed inicjalizacją
    if (document.readyState === "complete") {
      this.init();
    } else {
      window.addEventListener("load", () => this.init());
    }
  }

  init() {
    // Inicjalizacja po pełnym załadowaniu strony
    this.initCanvas();
    this.numberOfLeafes = this.calculateLeafes();
    this.initLeafes();
    this.setupEventListeners();
    this.animate();
  }

  initCanvas() {
    const container = this.canvas.parentElement;
    if (container) {
      // Ustawiamy wymiary canvasa zgodnie z kontenerem
      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
    }
  }

  calculateLeafes() {
    const width = this.canvas.width;
    if (width < 1024) return 30;
    if (width < 1440) return 60;
    if (width < 1920) return 100;
    return 175;
  }

  initLeafes() {
    const sakuras = new Image();
    sakuras.src = "img/sakuras.png";

    // Czekamy na załadowanie obrazka przed tworzeniem liści
    sakuras.onload = () => {
      this.leafesArray = [];
      for (let i = 0; i < this.numberOfLeafes; i++) {
        this.leafesArray.push(new Leaf(this.canvas, sakuras));
      }
    };
  }

  animate() {
    if (!this.isAnimating || this.leafesArray.length === 0) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.leafesArray.forEach((leaf) => {
      leaf.draw(this.ctx);
      leaf.update();
    });
    requestAnimationFrame(() => this.animate());
  }

  setupEventListeners() {
    // Obsługa zmiany rozmiaru okna
    window.addEventListener("resize", () => {
      const container = this.canvas.parentElement;
      if (container) {
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.numberOfLeafes = this.calculateLeafes();
        this.initLeafes();
      }
    });

    // Obsługa ruchu myszą
    window.addEventListener("mousemove", (e) => {
      if (!this.isAnimating || this.leafesArray.length === 0) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const direction = x < this.canvas.width / 2 ? 1 : -1;
      const magnitude = direction * (0.5 + Math.abs(x - this.canvas.width / 2) / this.canvas.width);

      this.leafesArray.forEach((leaf) => {
        leaf.directionX = magnitude;
      });
    });

    // Obsługa widoczności sekcji
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "home") {
            this.isAnimating = entry.isIntersecting;
            if (this.isAnimating && this.leafesArray.length > 0) {
              this.animate();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const homeSection = document.getElementById("home");
    if (homeSection) {
      observer.observe(homeSection);
    }
  }
}

class Leaf {
  constructor(canvas, image) {
    this.canvas = canvas;
    this.image = image;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = this.calculateSize();
    this.speed = this.calculateSpeed();
    this.angle = Math.random() * 360;
    this.spin = Math.random() < 0.5 ? -1 : 1;
    this.directionX = 0;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
    this.spriteSize = 100;
  }

  calculateSize() {
    const width = this.canvas.width;
    if (width < 1024) return Math.random() * 16 + 18;
    if (width < 1440) return Math.random() * 18 + 20;
    return Math.random() * 20 + 25;
  }

  calculateSpeed() {
    const baseSpeed = this.canvas.width >= 1920 ? 2 : 1;
    return baseSpeed + Math.random(); // Zmniejszone prędkości
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(((this.angle * Math.PI) / 360) * this.spin);
    ctx.shadowBlur = 30;
    ctx.shadowColor = "pink";
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteSize,
      this.frameY * this.spriteSize,
      this.spriteSize,
      this.spriteSize,
      0,
      0,
      this.size,
      this.size
    );
    ctx.restore();
  }

  update() {
    this.angle += 1; // Zmniejszona prędkość obrotu
    if (this.y - this.size > this.canvas.height) {
      this.reset();
      this.y = 0 - this.size;
    }
    this.y += this.speed;
    this.x += this.directionX;
  }
}

// ============= 2. NAWIGACJA =============
class Navigation {
  constructor() {
    this.mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    this.mainNav = document.querySelector(".main-nav");
    this.navLinks = document.querySelectorAll(".main-nav a");

    this.init();
  }

  init() {
    if (this.mobileNavToggle && this.mainNav) {
      // Toggle mobile menu
      this.mobileNavToggle.addEventListener("click", () => {
        this.mobileNavToggle.classList.toggle("active");
        this.mainNav.classList.toggle("active");
      });

      // Close mobile menu when clicking a link
      this.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            this.mobileNavToggle.classList.remove("active");
            this.mainNav.classList.remove("active");
          }
        });
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.mobileNavToggle.classList.remove("active");
          this.mainNav.classList.remove("active");
        }
      });
    }
  }
}

// ============= 3. INICJALIZACJA =============
document.addEventListener("DOMContentLoaded", () => {
  const backgroundAnimation = new BackgroundAnimation();
  const navigation = new Navigation();
});
