
      import * as THREE from "three";

      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // ==========================================================================
      // SLASH ANIMATOR CLASS - CUSTOM CANVAS SWORD ACTION EFFECTS
      // ==========================================================================
      class SlashAnimator {
        constructor(canvasId) {
          this.canvas = document.getElementById(canvasId);
          if (!this.canvas) return;
          this.ctx = this.canvas.getContext("2d");
          this.particles = [];
          this.slashes = [];
          this.animationFrame = null;
          this.isDrawing = false;
          this.flashOpacity = 0;
          this.screenShake = 0;
          this.shakeElement = this.canvas.parentElement;

          this.resize();
          window.addEventListener("resize", () => this.resize());
        }

        resize() {
          if (!this.canvas) return;
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
        }

        trigger(style) {
          if (!this.canvas) return;
          this.isDrawing = true;
          this.particles = [];
          this.slashes = [];
          this.flashOpacity = 0;
          this.screenShake = 0;

          if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
          }

          const centerX = this.canvas.width / 2;
          const centerY = this.canvas.height / 2;
          const w = this.canvas.width;
          const h = this.canvas.height;

          if (style === "water") {
            this.slashes.push({
              points: [
                { x: -50, y: h * 0.35 },
                { x: w * 0.3, y: h * 0.65 },
                { x: w * 0.7, y: h * 0.25 },
                { x: w + 50, y: h * 0.55 }
              ],
              progress: 0,
              color: "rgba(103, 185, 255, 0.9)",
              glowColor: "rgba(103, 185, 255, 0.45)",
              width: 16,
              speed: 0.04
            });
            for (let i = 0; i < 50; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: h * 0.45 + (Math.random() - 0.5) * h * 0.25,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.2) * 2.5,
                radius: Math.random() * 5 + 1.5,
                color: Math.random() > 0.4 ? "rgba(103, 185, 255, " + (0.3 + Math.random() * 0.5) + ")" : "rgba(255, 255, 255, 0.8)",
                alpha: 1,
                decay: Math.random() * 0.012 + 0.006,
                type: "bubble"
              });
            }
          } else if (style === "bloom") {
            this.slashes.push({
              points: [
                { x: -50, y: h * 0.7 },
                { x: w * 0.5, y: h * 0.45 },
                { x: w + 50, y: h * 0.2 }
              ],
              progress: 0,
              color: "rgba(255, 115, 198, 0.9)",
              glowColor: "rgba(255, 115, 198, 0.5)",
              width: 14,
              speed: 0.045
            });
            for (let i = 0; i < 60; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 10 + 3;
              this.particles.push({
                x: centerX + (Math.random() - 0.5) * 150,
                y: centerY + (Math.random() - 0.5) * 150,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: Math.random() * 4.5 + 1,
                color: Math.random() > 0.3 ? "rgba(255, 115, 198, 1)" : "rgba(255, 220, 240, 1)",
                alpha: 1,
                decay: Math.random() * 0.018 + 0.008,
                type: "ember"
              });
            }
          } else if (style === "thunder") {
            this.flashOpacity = 0.9;
            const points = [{ x: -50, y: h * 0.35 }];
            const segmentCount = 5;
            for (let i = 1; i <= segmentCount; i++) {
              points.push({
                x: (w / segmentCount) * i + (i === segmentCount ? 50 : (Math.random() - 0.5) * 60),
                y: centerY + (Math.random() - 0.5) * h * 0.3
              });
            }
            this.slashes.push({
              points: points,
              progress: 0,
              color: "rgba(255, 255, 255, 1)",
              glowColor: "rgba(255, 226, 120, 0.95)",
              width: 22,
              speed: 0.1
            });
            for (let i = 0; i < 70; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 15 + 6;
              this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: "rgba(255, 204, 72, 1)",
                alpha: 1,
                decay: Math.random() * 0.035 + 0.015,
                type: "lightning"
              });
            }
          } else if (style === "beast") {
            this.screenShake = 12;
            this.slashes.push({
              points: [
                { x: -50, y: -50 },
                { x: w * 0.35, y: h * 0.45 },
                { x: w + 50, y: h + 50 }
              ],
              progress: 0,
              color: "rgba(103, 214, 141, 0.85)",
              glowColor: "rgba(103, 214, 141, 0.4)",
              width: 14,
              speed: 0.05
            });
            this.slashes.push({
              points: [
                { x: -50, y: h + 50 },
                { x: w * 0.65, y: h * 0.55 },
                { x: w + 50, y: -50 }
              ],
              progress: 0,
              color: "rgba(103, 214, 141, 0.85)",
              glowColor: "rgba(103, 214, 141, 0.4)",
              width: 14,
              speed: 0.05
            });
            for (let i = 0; i < 55; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 4 + 1.5,
                color: Math.random() > 0.4 ? "rgba(103, 214, 141, 0.9)" : "rgba(220, 255, 230, 0.9)",
                alpha: 1,
                decay: Math.random() * 0.025 + 0.01,
                type: "claw"
              });
            }
          } else if (style === "sound") {
            this.screenShake = 8;
            for (let i = 0; i < 4; i++) {
              this.slashes.push({
                isRing: true,
                x: centerX + (Math.random() - 0.5) * 100,
                y: centerY + (Math.random() - 0.5) * 100,
                radius: 0,
                targetRadius: Math.random() * w * 0.3 + w * 0.1,
                progress: 0,
                color: `rgba(255, 226, 112, ${0.8 - i * 0.18})`,
                glowColor: "rgba(255, 204, 72, 0.4)",
                width: 6 + i * 2,
                speed: 0.05 + i * 0.005
              });
            }
            for (let i = 0; i < 50; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 12 + 4;
              this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 5 + 2,
                color: Math.random() > 0.4 ? "#ffe270" : "#ffffff",
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01,
                type: "sound"
              });
            }
          } else if (style === "insect") {
            for (let i = 0; i < 60; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * 200;
              this.particles.push({
                x: centerX + Math.cos(angle) * dist,
                y: centerY + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.7) * 3 - 1,
                radius: Math.random() * 4 + 1.5,
                color: Math.random() > 0.4 ? "rgba(176, 131, 255, 0.9)" : "rgba(255, 255, 255, 0.95)",
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008,
                type: "butterfly"
              });
            }
          } else if (style === "mist") {
            for (let i = 0; i < 40; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * w * 0.4;
              this.particles.push({
                x: centerX + Math.cos(angle) * dist,
                y: centerY + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 45 + 15,
                color: Math.random() > 0.5 ? "rgba(103, 214, 210, 0.18)" : "rgba(240, 255, 253, 0.12)",
                alpha: 0.8,
                decay: Math.random() * 0.008 + 0.004,
                type: "mist"
              });
            }
          } else if (style === "love") {
            this.slashes.push({
              points: [
                { x: centerX - w * 0.3, y: centerY + h * 0.2 },
                { x: centerX - w * 0.1, y: centerY - h * 0.3 },
                { x: centerX + w * 0.1, y: centerY + h * 0.3 },
                { x: centerX + w * 0.3, y: centerY - h * 0.2 }
              ],
              progress: 0,
              color: "rgba(255, 115, 198, 0.9)",
              glowColor: "rgba(255, 115, 198, 0.45)",
              width: 10,
              speed: 0.035
            });
            for (let i = 0; i < 35; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                radius: Math.random() * 4 + 1.5,
                color: "rgba(255, 115, 198, 0.85)",
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008,
                type: "heart"
              });
            }
          } else if (style === "stone") {
            this.screenShake = 6;
            for (let i = 0; i < 40; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h * 0.4,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 8 + 4,
                radius: Math.random() * 8 + 3,
                color: "rgba(120, 115, 110, 0.85)",
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01,
                type: "stone"
              });
            }
          } else if (style === "serpent") {
            const points = [];
            for (let i = 0; i < 10; i++) {
              points.push({
                x: (w / 9) * i,
                y: centerY + Math.sin(i * 1.5) * h * 0.22
              });
            }
            this.slashes.push({
              points: points,
              progress: 0,
              color: "rgba(180, 70, 255, 0.9)",
              glowColor: "rgba(90, 10, 180, 0.5)",
              width: 12,
              speed: 0.04
            });
            for (let i = 0; i < 30; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: centerY + (Math.random() - 0.5) * h * 0.4,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 4 + 1.5,
                color: "rgba(180, 70, 255, 0.8)",
                alpha: 1,
                decay: Math.random() * 0.018 + 0.009,
                type: "scale"
              });
            }
          } else if (style === "wind") {
            for (let k = 0; k < 3; k++) {
              this.slashes.push({
                points: [
                  { x: -50, y: h * (0.2 + k * 0.3) },
                  { x: w * 0.4, y: h * (0.6 - k * 0.2) },
                  { x: w * 0.8, y: h * (0.3 + k * 0.2) },
                  { x: w + 50, y: h * (0.5 - k * 0.1) }
                ],
                progress: 0,
                color: "rgba(103, 214, 141, 0.85)",
                glowColor: "rgba(103, 214, 141, 0.35)",
                width: 10,
                speed: 0.045
              });
            }
            for (let i = 0; i < 50; i++) {
              this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.3) * 10 - 2,
                vy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 4 + 1,
                color: "rgba(103, 214, 141, 0.75)",
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01,
                type: "wind"
              });
            }
          } else if (style === "muzan") {
            this.screenShake = 22;
            this.flashOpacity = 0.95;
            for (let i = 0; i < 5; i++) {
              this.slashes.push({
                points: [
                  { x: 0, y: h * (0.15 + i * 0.18) },
                  { x: w, y: h * (0.15 + i * 0.18) }
                ],
                progress: 0,
                color: "rgba(255, 60, 0, 0.85)",
                glowColor: "rgba(255, 0, 0, 0.9)",
                width: 3,
                speed: 0.12
              });
            }
            for (let i = 0; i < 4; i++) {
              const startY = Math.random() * h;
              const endY = Math.random() * h;
              this.slashes.push({
                points: [
                  { x: -50, y: startY },
                  { x: centerX + (Math.random() - 0.5) * w * 0.4, y: centerY + (Math.random() - 0.5) * h * 0.4 },
                  { x: w + 50, y: endY }
                ],
                progress: 0,
                color: "rgba(255, 0, 50, 0.95)",
                glowColor: "rgba(120, 0, 10, 0.9)",
                width: 14,
                speed: 0.07
              });
            }
            for (let i = 0; i < 80; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 14 + 4;
              this.particles.push({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 6 + 1.5,
                color: Math.random() > 0.4 ? "rgba(255, 0, 50, 1)" : "rgba(10, 0, 2, 1)",
                alpha: 1,
                decay: Math.random() * 0.016 + 0.007,
                type: "blood"
              });
            }
          }

          this.loop();
        }

        loop() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          if (this.flashOpacity > 0.01) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashOpacity})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.flashOpacity -= 0.08;
          }

          if (this.screenShake > 0.1) {
            const dx = (Math.random() - 0.5) * this.screenShake;
            const dy = (Math.random() - 0.5) * this.screenShake;
            if (this.shakeElement) {
              this.shakeElement.style.transform = `translate(${dx}px, ${dy}px)`;
            }
            this.screenShake *= 0.85;
          } else if (this.shakeElement) {
            this.shakeElement.style.transform = "";
          }

          let slashesDone = true;

          this.slashes.forEach((slash) => {
            if (slash.isRing) {
              if (slash.progress < 1) {
                slash.progress += slash.speed;
                if (slash.progress > 1) slash.progress = 1;
                slashesDone = false;
              }
              const radius = slash.radius + (slash.targetRadius - slash.radius) * slash.progress;
              this.ctx.save();
              this.ctx.shadowBlur = 24;
              this.ctx.shadowColor = slash.glowColor;
              this.ctx.strokeStyle = slash.color;
              this.ctx.lineWidth = slash.width;
              this.ctx.beginPath();
              this.ctx.arc(slash.x, slash.y, radius, 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.restore();
              return;
            }

            if (slash.progress < 1) {
              slash.progress += slash.speed;
              if (slash.progress > 1) slash.progress = 1;
              slashesDone = false;
            }

            const pointsToDraw = Math.floor(slash.points.length * slash.progress);
            if (pointsToDraw < 1) return;

            this.ctx.save();
            this.ctx.shadowBlur = 24;
            this.ctx.shadowColor = slash.glowColor;
            this.ctx.strokeStyle = slash.color;
            this.ctx.lineWidth = slash.width;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";

            this.ctx.beginPath();
            this.ctx.moveTo(slash.points[0].x, slash.points[0].y);

            for (let i = 1; i < pointsToDraw; i++) {
              this.ctx.lineTo(slash.points[i].x, slash.points[i].y);
            }

            if (pointsToDraw < slash.points.length) {
              const lastPt = slash.points[pointsToDraw - 1];
              const nextPt = slash.points[pointsToDraw];
              const segProgress = (slash.points.length * slash.progress) - pointsToDraw;
              const currX = lastPt.x + (nextPt.x - lastPt.x) * segProgress;
              const currY = lastPt.y + (nextPt.y - lastPt.y) * segProgress;
              this.ctx.lineTo(currX, currY);
            }

            this.ctx.stroke();
            this.ctx.restore();
          });

          this.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              this.particles.splice(idx, 1);
              return;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;

            if (p.type === "lightning") {
              this.ctx.strokeStyle = p.color;
              this.ctx.lineWidth = p.radius;
              this.ctx.beginPath();
              this.ctx.moveTo(p.x, p.y);
              this.ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
              this.ctx.stroke();
            } else if (p.type === "butterfly") {
              this.ctx.beginPath();
              this.ctx.moveTo(p.x, p.y - p.radius);
              this.ctx.lineTo(p.x + p.radius * 1.2, p.y - p.radius * 0.4);
              this.ctx.lineTo(p.x, p.y + p.radius);
              this.ctx.lineTo(p.x - p.radius * 1.2, p.y - p.radius * 0.4);
              this.ctx.closePath();
              this.ctx.fill();
            } else if (p.type === "heart") {
              this.ctx.beginPath();
              const w = p.radius * 2;
              const h = p.radius * 2;
              this.ctx.moveTo(p.x, p.y - h / 4);
              this.ctx.bezierCurveTo(p.x - w / 2, p.y - h / 2, p.x - w, p.y + h / 6, p.x, p.y + h);
              this.ctx.bezierCurveTo(p.x + w, p.y + h / 6, p.x + w / 2, p.y - h / 2, p.x, p.y - h / 4);
              this.ctx.fill();
            } else {
              this.ctx.beginPath();
              this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              this.ctx.fill();
            }
            this.ctx.restore();
          });

          if (!slashesDone || this.particles.length > 0 || this.flashOpacity > 0.01 || this.screenShake > 0.1) {
            this.animationFrame = requestAnimationFrame(() => this.loop());
          } else {
            this.isDrawing = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          }
        }
      }

      const loadingScreen = document.getElementById("loading-screen");
      const loaderProgressBar = document.getElementById("loader-progress-bar");
      const loaderProgressLabel = document.getElementById(
        "loader-progress-label",
      );
      const routeTransition = document.getElementById("route-transition");
      const pageFlash = document.getElementById("page-flash");
      const thunderHit = document.getElementById("thunder-hit");
      const ambientOverlay = document.querySelector(".ambient-overlay");
      const siteHeader = document.getElementById("site-header");

      const progressBar = document.getElementById("progress-bar");
      const cursor = document.querySelector(".cursor");
      const cursorRing = document.querySelector(".cursor-ring");

      const sections = [...document.querySelectorAll("main .section, main .heroes-section")];
      const loreLines = [...document.querySelectorAll(".scroll-line")];
      const magneticEls = [
        ...document.querySelectorAll(
          ".magnetic, .nav-action, .theme-btn, .replay-btn",
        ),
      ];

      const slides = [...document.querySelectorAll(".hero-slide")];
      let currentSlideIndex = 0;
      let slashAnimator;

      const navHashLinks = [...document.querySelectorAll('a[href^="#"]')];
      const memoryLayers = {
        tanjiro: document.getElementById("tanjiro-memory"),
        nezuko: document.getElementById("nezuko-memory"),
        zenitsu: document.getElementById("zenitsu-memory"),
        inosuke: document.getElementById("inosuke-memory"),
      };

      let introPlayed = false;

      function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = height > 0 ? (scrollTop / height) * 100 : 0;
        progressBar.style.width = progress + "%";
      }

      updateScrollProgress();
      window.addEventListener("scroll", updateScrollProgress, {
        passive: true,
      });

      function hideAllMemories() {
        Object.values(memoryLayers).forEach((el) => {
          if (el) el.style.opacity = "0";
        });
      }

      function flashMemory(name, duration = 420) {
        hideAllMemories();
        const el = memoryLayers[name];
        if (!el) return;
        el.style.opacity = "1";
        setTimeout(() => {
          el.style.opacity = "0";
        }, duration);
      }

      function fakeRouteTransition(targetHash) {
        if (prefersReduced) return;
        routeTransition.animate(
          [
            { transform: "translateX(-140%) skewX(-22deg)", opacity: 0 },
            {
              transform: "translateX(-14%) skewX(-22deg)",
              opacity: 1,
              offset: 0.46,
            },
            { transform: "translateX(135%) skewX(-22deg)", opacity: 0 },
          ],
          {
            duration: 950,
            easing: "cubic-bezier(.16,1,.3,1)",
          },
        );

        pageFlash.animate(
          [{ opacity: 0 }, { opacity: 0.09, offset: 0.24 }, { opacity: 0 }],
          { duration: 360, easing: "ease-out" },
        );

        if (targetHash === "#heroes") flashMemory("tanjiro", 500);
        if (targetHash === "#hashira") flashMemory("nezuko", 460);
        if (targetHash === "#blade") flashMemory("zenitsu", 320);
        if (targetHash === "#lore") flashMemory("inosuke", 420);
      }

      navHashLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const hash = link.getAttribute("href");
          if (!hash || !hash.startsWith("#")) return;
          const target = document.querySelector(hash);
          if (!target) return;

          e.preventDefault();
          fakeRouteTransition(hash);
          setTimeout(
            () => {
              target.scrollIntoView({
                behavior: prefersReduced ? "auto" : "smooth",
                block: "start",
              });
            },
            prefersReduced ? 0 : 120,
          );
        });
      });

      if (!prefersReduced && cursor && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function tickCursor() {
          ringX += (mouseX - ringX) * 0.18;
          ringY += (mouseY - ringY) * 0.18;
          cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
          requestAnimationFrame(tickCursor);
        }
        tickCursor();

        document
          .querySelectorAll(
            "a, button, .hero-slide, .hashira-card, .style-item, .blade-btn",
          )
          .forEach((el) => {
            el.addEventListener("mouseenter", () => {
              cursorRing.style.width = "64px";
              cursorRing.style.height = "64px";
              cursorRing.style.borderColor = "rgba(255,255,255,.42)";
            });
            el.addEventListener("mouseleave", () => {
              cursorRing.style.width = "44px";
              cursorRing.style.height = "44px";
              cursorRing.style.borderColor = "rgba(255,255,255,.26)";
            });
          });
      }

      magneticEls.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          if (prefersReduced) return;
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.1}px, ${y * 0.12}px)`;
          btn.style.setProperty(
            "--mx",
            `${((e.clientX - rect.left) / rect.width) * 100}%`,
          );
          btn.style.setProperty(
            "--my",
            `${((e.clientY - rect.top) / rect.height) * 100}%`,
          );
          const inner = btn.querySelector("span");
          if (inner)
            inner.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
        });

        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "";
          const inner = btn.querySelector("span");
          if (inner) inner.style.transform = "";
        });
      });

      // 3D Parallax Hover effect on slides
      slides.forEach((slide) => {
        const img = slide.querySelector(".slide-image");
        const plate = slide.querySelector(".slide-glow-plate");
        if (img) {
          slide.addEventListener("pointermove", (e) => {
            if (prefersReduced) return;
            const rect = slide.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Smoothly animate image tilting towards cursor
            gsap.to(img, {
              rotateY: x * 20,
              rotateX: -y * 20,
              z: 35,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto"
            });

            // Smoothly animate glow plate slightly away from cursor for depth separation
            if (plate) {
              gsap.to(plate, {
                rotateY: -x * 12,
                rotateX: y * 12,
                x: -x * 24,
                y: -y * 24,
                z: -10,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
              });
            }
          });

          slide.addEventListener("mouseleave", () => {
            gsap.to(img, {
              rotateY: 0,
              rotateX: 0,
              z: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto"
            });
            if (plate) {
              gsap.to(plate, {
                rotateY: 0,
                rotateX: 0,
                x: 0,
                y: 0,
                z: -30,
                duration: 0.9,
                ease: "power3.out",
                overwrite: "auto"
              });
            }
          });
        }
      });

      // Slash trigger on hover for Hero slides
      slides.forEach(slide => {
        slide.addEventListener("pointerenter", () => {
          if (!prefersReduced && slashAnimator) {
            const charName = slide.dataset.character;
            let style = "water";
            if (charName === "nezuko") style = "bloom";
            else if (charName === "zenitsu") style = "thunder";
            else if (charName === "inosuke") style = "beast";
            slashAnimator.trigger(style);
          }
        });
      });

      // Slash trigger on hover for Hashira slides
      const hashiraSlidesList = document.querySelectorAll(".hashira-slide");
      hashiraSlidesList.forEach(slide => {
        slide.addEventListener("pointerenter", () => {
          if (!prefersReduced && hashiraSlashAnimator) {
            const charName = slide.dataset.character;
            let style = "water";
            if (charName === "rengoku") style = "flame";
            else if (charName === "tengen") style = "sound";
            else if (charName === "shinobu") style = "insect";
            else if (charName === "muichiro") style = "mist";
            else if (charName === "mitsuri") style = "love";
            else if (charName === "gyomei") style = "stone";
            else if (charName === "obanai") style = "serpent";
            else if (charName === "sanemi") style = "wind";
            else if (charName === "akaza") style = "compass";
            else if (charName === "kokushibo") style = "moon";
            else if (charName === "douma") style = "ice";
            else if (charName === "muzan") style = "muzan";
            hashiraSlashAnimator.trigger(style);
          }
        });
      });

      function playSlideEntrance(idx) {
        if (prefersReduced) return;
        const s = slides[idx];
        if (!s) return;

        const eyebrow = s.querySelector(".eyebrow");
        const title = s.querySelector(".slide-title");
        const desc = s.querySelector(".slide-desc");
        const tags = s.querySelectorAll(".tag");
        const stats = s.querySelectorAll(".mini-stat");
        const img = s.querySelector(".slide-image");
        const plate = s.querySelector(".slide-glow-plate");
        const textCard = s.querySelector(".slide-text");

        // Reset styles first so they don't block layout calculation
        gsap.killTweensOf([eyebrow, title, desc, tags, stats, img, plate, textCard]);

        // Stagger entrance timeline
        const tl = gsap.timeline();

        tl.fromTo(textCard,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        if (eyebrow) {
          tl.fromTo(eyebrow,
            { y: 15, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
            { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.6, ease: "power3.out" },
            "-=0.6"
          );
        }

        tl.fromTo(title,
          { y: 20, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.7, ease: "power3.out" },
          "-=0.5"
        );

        tl.fromTo(desc,
          { y: 15, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.7, ease: "power3.out" },
          "-=0.4"
        );

        tl.fromTo(tags,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "-=0.4"
        );

        tl.fromTo(stats,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          "-=0.3"
        );

        gsap.fromTo(img,
          { scale: 0.82, x: 50, opacity: 0 },
          { scale: 1, x: 0, opacity: 1, duration: 1.0, ease: "power4.out", delay: 0.15 }
        );

        if (plate) {
          gsap.fromTo(plate,
            { scale: 0.75, opacity: 0 },
            { scale: 1, opacity: 0.55, duration: 1.2, ease: "power3.out", delay: 0.1 }
          );
        }
      }

      function changeSlide(idx) {
        if (idx === currentSlideIndex) return;

        const oldSlide = slides[currentSlideIndex];
        const newSlide = slides[idx];

        const charName = newSlide.dataset.character;
        let slashStyle = "water";
        if (charName === "tanjiro") slashStyle = "water";
        else if (charName === "nezuko") slashStyle = "bloom";
        else if (charName === "zenitsu") slashStyle = "thunder";
        else if (charName === "inosuke") slashStyle = "beast";

        if (!prefersReduced && slashAnimator) {
          slashAnimator.trigger(slashStyle);
        }

        slides.forEach((s, sIdx) => {
          if (sIdx === idx) {
            s.classList.add("active");
            playSlideEntrance(idx);
            updateSceneTheme(document.getElementById("heroes"));
            if (charName === "tanjiro") flashMemory("tanjiro", 500);
            if (charName === "nezuko") flashMemory("nezuko", 460);
            if (charName === "zenitsu") flashMemory("zenitsu", 320);
            if (charName === "inosuke") flashMemory("inosuke", 420);
          } else {
            s.classList.remove("active");
          }
        });

        currentSlideIndex = idx;
      }

      function initScrollShowcase() {
        if (prefersReduced) return;

        ScrollTrigger.matchMedia({
          "(min-width: 1025px)": function() {
            gsap.timeline({
              scrollTrigger: {
                trigger: "#heroes",
                start: "top top",
                end: "+=2600",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                onEnter: () => {
                  playSlideEntrance(currentSlideIndex);
                },
                onEnterBack: () => {
                  playSlideEntrance(currentSlideIndex);
                },
                onUpdate: (self) => {
                  const p = self.progress;
                  let targetIdx = 0;
                  if (p < 0.25) targetIdx = 0;
                  else if (p < 0.50) targetIdx = 1;
                  else if (p < 0.75) targetIdx = 2;
                  else targetIdx = 3;

                  if (targetIdx !== currentSlideIndex) {
                    changeSlide(targetIdx);
                  }
                }
              }
            });
          }
        });
      }

      function initMobileScrollTrigger() {
        if (prefersReduced) return;

        ScrollTrigger.matchMedia({
          "(max-width: 1024px)": function() {
            slides.forEach((slide, idx) => {
              // Trigger initial animation for all slides when entering view on mobile
              ScrollTrigger.create({
                trigger: slide,
                start: "top 60%",
                onEnter: () => {
                  const charName = slide.dataset.character;
                  let slashStyle = "water";
                  if (charName === "tanjiro") slashStyle = "water";
                  else if (charName === "nezuko") slashStyle = "bloom";
                  else if (charName === "zenitsu") slashStyle = "thunder";
                  else if (charName === "inosuke") slashStyle = "beast";

                  if (slashAnimator) slashAnimator.trigger(slashStyle);
                  playSlideEntrance(idx);

                  updateSceneTheme(document.getElementById("heroes"));
                  if (charName === "tanjiro") flashMemory("tanjiro", 500);
                  if (charName === "nezuko") flashMemory("nezuko", 460);
                  if (charName === "zenitsu") flashMemory("zenitsu", 320);
                  if (charName === "inosuke") flashMemory("inosuke", 420);
                }
              });
            });
          }
        });
      }

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            sections.forEach((s) =>
              s.classList.toggle("is-active", s === section),
            );
            updateSceneTheme(section);

            // Update active nav link
            const id = section.id || section.getAttribute("id");
            if (id) {
              document.querySelectorAll(".nav-links a").forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
              });
            }
          });
        },
        { threshold: 0.4 },
      );

      sections.forEach((section) => sectionObserver.observe(section));

      const loreObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.55 },
      );

      loreLines.forEach((line) => loreObserver.observe(line));

      const characterThemes = {
        tanjiro: {
          washA: "rgba(103, 185, 255, 0.14)",
          washB: "rgba(103, 185, 255, 0.04)",
          bg: new THREE.Color(0x040810),
          pointA: new THREE.Color(0x67b9ff),
          pointB: new THREE.Color(0x224488),
          density: 1.2,
          speed: 0.05,
          orbit: 0.16,
        },
        nezuko: {
          washA: "rgba(255, 115, 198, 0.14)",
          washB: "rgba(255, 115, 198, 0.04)",
          bg: new THREE.Color(0x100508),
          pointA: new THREE.Color(0xff73c6),
          pointB: new THREE.Color(0xffadad),
          density: 1.1,
          speed: 0.06,
          orbit: 0.14,
        },
        zenitsu: {
          washA: "rgba(255, 204, 72, 0.14)",
          washB: "rgba(255, 204, 72, 0.04)",
          bg: new THREE.Color(0x0e0c06),
          pointA: new THREE.Color(0xffcc48),
          pointB: new THREE.Color(0xfff3a8),
          density: 1.4,
          speed: 0.08,
          orbit: 0.18,
        },
        inosuke: {
          washA: "rgba(103, 214, 141, 0.14)",
          washB: "rgba(103, 214, 141, 0.04)",
          bg: new THREE.Color(0x041008),
          pointA: new THREE.Color(0x67d68d),
          pointB: new THREE.Color(0xa5ffd6),
          density: 1.25,
          speed: 0.07,
          orbit: 0.15,
        }
      };

      function updateSceneTheme(section) {
        if (section.id === "heroes") {
          const charName = slides[currentSlideIndex]?.dataset.character;
          const theme = characterThemes[charName];
          if (theme) {
            ambientOverlay.style.background = `
              radial-gradient(circle at 20% 20%, ${theme.washA}, transparent 26%),
              radial-gradient(circle at 80% 24%, ${theme.washB}, transparent 20%)
            `;
            currentSceneTarget = theme;
            return;
          }
        }

        const washA = section.dataset.washA || "rgba(103,185,255,0.1)";
        const washB = section.dataset.washB || "rgba(255,115,198,0.08)";
        ambientOverlay.style.background = `
        radial-gradient(circle at 20% 20%, ${washA}, transparent 26%),
        radial-gradient(circle at 80% 24%, ${washB}, transparent 20%)
      `;
        currentSceneName = section.dataset.scene || "hero";
        currentSceneTarget = sceneThemes[currentSceneName] || sceneThemes.hero;
      }

      function createRenderer(canvas, alpha = true) {
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(
          canvas.clientWidth ||
            canvas.parentElement?.clientWidth ||
            window.innerWidth,
          canvas.clientHeight ||
            canvas.parentElement?.clientHeight ||
            window.innerHeight,
          false,
        );
        return renderer;
      }

      const sceneThemes = {
        hero: {
          bg: new THREE.Color(0x050607),
          pointA: new THREE.Color(0x67b9ff),
          pointB: new THREE.Color(0xff73c6),
          density: 1.0,
          speed: 0.045,
          orbit: 0.18,
        },
        heroes: {
          bg: new THREE.Color(0x06080d),
          pointA: new THREE.Color(0x67b9ff),
          pointB: new THREE.Color(0xffcc48),
          density: 1.12,
          speed: 0.055,
          orbit: 0.16,
        },
        styles: {
          bg: new THREE.Color(0x07080b),
          pointA: new THREE.Color(0x67b9ff),
          pointB: new THREE.Color(0xff9448),
          density: 1.22,
          speed: 0.075,
          orbit: 0.12,
        },
        hashira: {
          bg: new THREE.Color(0x0a0810),
          pointA: new THREE.Color(0xb083ff),
          pointB: new THREE.Color(0xff9448),
          density: 0.9,
          speed: 0.04,
          orbit: 0.12,
        },
        lore: {
          bg: new THREE.Color(0x100c0b),
          pointA: new THREE.Color(0xffc47a),
          pointB: new THREE.Color(0xff8f8f),
          density: 0.7,
          speed: 0.03,
          orbit: 0.08,
        },
        blade: {
          bg: new THREE.Color(0x0b0908),
          pointA: new THREE.Color(0xff9448),
          pointB: new THREE.Color(0x67b9ff),
          density: 0.8,
          speed: 0.022,
          orbit: 0.05,
        },
        footer: {
          bg: new THREE.Color(0x07070a),
          pointA: new THREE.Color(0x67b9ff),
          pointB: new THREE.Color(0xb083ff),
          density: 0.6,
          speed: 0.02,
          orbit: 0.04,
        },
      };

      let currentSceneName = "hero";
      let currentSceneTarget = sceneThemes.hero;

      function createAmbientScene() {
        const canvas = document.getElementById("ambient-canvas");
        const renderer = createRenderer(canvas, true);
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050607, 0.055);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 16);

        const ambient = new THREE.AmbientLight(0xffffff, 0.45);
        const pointA = new THREE.PointLight(0x67b9ff, 1.8, 40);
        const pointB = new THREE.PointLight(0xff73c6, 1.4, 30);
        pointA.position.set(-5, 2, 8);
        pointB.position.set(5, -2, 6);

        scene.add(ambient, pointA, pointB);

        const center = new THREE.Group();
        scene.add(center);

        const knot = new THREE.Mesh(
          new THREE.TorusKnotGeometry(2.3, 0.26, 220, 24),
          new THREE.MeshPhysicalMaterial({
            color: 0x8fd9ff,
            emissive: 0x132435,
            roughness: 0.2,
            metalness: 0.55,
            transparent: true,
            opacity: 0.82,
            clearcoat: 1,
            clearcoatRoughness: 0.22,
          }),
        );
        center.add(knot);

        const orbitRing = new THREE.Mesh(
          new THREE.TorusGeometry(3.4, 0.04, 16, 180),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.18,
          }),
        );
        orbitRing.rotation.x = Math.PI / 2;
        center.add(orbitRing);

        const count = 2200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const radiusSeed = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const radius = 5 + Math.random() * 6;
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 10;
          radiusSeed[i] = radius;

          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = height;
          positions[i3 + 2] = Math.sin(angle) * radius;

          colors[i3] = 0.5 + Math.random() * 0.3;
          colors[i3 + 1] = 0.6 + Math.random() * 0.2;
          colors[i3 + 2] = 0.9 + Math.random() * 0.1;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
          size: 0.05,
          vertexColors: true,
          transparent: true,
          opacity: 0.84,
        });

        const points = new THREE.Points(particleGeo, particleMat);
        scene.add(points);

        let pointerX = 0;
        let pointerY = 0;

        window.addEventListener(
          "pointermove",
          (e) => {
            pointerX = (e.clientX / window.innerWidth) * 2 - 1;
            pointerY = (e.clientY / window.innerHeight) * 2 - 1;
          },
          { passive: true },
        );

        function resize() {
          const w = canvas.clientWidth || window.innerWidth;
          const h = canvas.clientHeight || window.innerHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }

        resize();
        window.addEventListener("resize", resize);

        const clock = new THREE.Clock();

        function animate() {
          const t = clock.getElapsedTime();

          scene.fog.color.lerp(currentSceneTarget.bg, 0.02);
          pointA.color.lerp(currentSceneTarget.pointA, 0.03);
          pointB.color.lerp(currentSceneTarget.pointB, 0.03);

          knot.material.color.lerp(
            currentSceneTarget.pointA
              .clone()
              .lerp(currentSceneTarget.pointB, 0.28),
            0.03,
          );
          knot.material.emissive.lerp(
            currentSceneTarget.pointA.clone().multiplyScalar(0.18),
            0.03,
          );

          center.rotation.x +=
            (currentSceneTarget.orbit * 0.6 - center.rotation.x) * 0.01;
          center.rotation.y +=
            (((t * currentSceneTarget.speed * 2.8) % (Math.PI * 2)) -
              center.rotation.y) *
            0.015;

          knot.position.y =
            Math.sin(t * (0.5 + currentSceneTarget.speed * 8)) * 0.18;
          orbitRing.rotation.z += currentSceneTarget.speed * 0.3;
          points.rotation.y += currentSceneTarget.speed * 0.18;
          points.rotation.x = Math.sin(t * 0.1) * 0.06;

          particleMat.size +=
            (0.05 * currentSceneTarget.density - particleMat.size) * 0.04;
          particleMat.opacity +=
            (0.75 + currentSceneTarget.density * 0.08 - particleMat.opacity) *
            0.04;

          camera.position.x +=
            (pointerX * (0.6 + currentSceneTarget.orbit * 2) -
              camera.position.x) *
            0.025;
          camera.position.y +=
            (-pointerY * (0.45 + currentSceneTarget.orbit * 1.5) -
              camera.position.y) *
            0.025;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }

        animate();
      }

      function getFireballTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(255, 230, 200, 1)");
        grad.addColorStop(0.5, "rgba(255, 100, 50, 0.8)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
      }

      function createBreathingScene() {
        const canvas = document.getElementById("breathing-canvas");
        const renderer = createRenderer(canvas, true);
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 8);

        const count = 1200; // slightly fewer but larger
        const positions = new Float32Array(count * 3);
        const initialStates = [];

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const radius = Math.random() * 5;
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 6.0;
          const speed = 0.5 + Math.random() * 2.0;
          const drift = (Math.random() - 0.5) * 2.0;

          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = height;
          positions[i3 + 2] = Math.sin(angle) * radius;

          initialStates.push({ radius, angle, height, speed, drift, baseY: height });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );

        const material = new THREE.PointsMaterial({
          size: 0.35,
          color: 0xffffff,
          map: getFireballTexture(),
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const styleMap = {
          water: { color: 0x67b9ff, speed: 1.0, size: 0.35 },
          flame: { color: 0xff6622, speed: 1.8, size: 0.45 },
          thunder: { color: 0xffcc48, speed: 2.8, size: 0.3 },
          wind: { color: 0x99ffcc, speed: 1.4, size: 0.35 },
        };

        let activeStyle = "water";
        let targetColor = new THREE.Color(styleMap.water.color);

        function resize() {
          const parent = canvas.parentElement;
          const w = parent ? parent.clientWidth : 560;
          const h = parent ? parent.clientHeight : 560;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }

        resize();
        window.addEventListener("resize", resize);

        const buttons = [...document.querySelectorAll(".style-item")];
        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeStyle = btn.dataset.style;

            const s = styleMap[activeStyle];
            targetColor.setHex(s.color);
            gsap.to(material, { size: s.size, duration: 0.6, ease: "power2.out" });

            if (activeStyle === "thunder" && !prefersReduced) {
              const thunderHit = document.getElementById("thunder-hit");
              if (thunderHit) {
                thunderHit.animate(
                  [
                    { opacity: 0 },
                    { opacity: 0.86, offset: 0.2 },
                    { opacity: 0 },
                  ],
                  { duration: 260, easing: "ease-out" },
                );
              }
            }
          });
        });

        const clock = new THREE.Clock();

        function animate() {
          const time = clock.getElapsedTime();
          const style = styleMap[activeStyle];

          material.color.lerp(targetColor, 0.08);

          const posArr = geometry.attributes.position.array;

          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const state = initialStates[i];

            // Upward float
            state.height += 0.012 * style.speed * state.speed;
            if (state.height > 3.0) {
              state.height = -3.0; // wrap around
              state.angle = Math.random() * Math.PI * 2;
            }

            // Organic drift
            const xDrift = Math.sin(time * 0.5 + i) * state.drift * 0.5;
            const zDrift = Math.cos(time * 0.6 + i) * state.drift * 0.5;

            posArr[i3] = (Math.cos(state.angle) * state.radius) + xDrift;
            posArr[i3 + 1] = state.height;
            posArr[i3 + 2] = (Math.sin(state.angle) * state.radius) + zDrift;
          }

          geometry.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }

        animate();


      function runIntroSequence(force = false) {
        if (introPlayed && !force) return;
        introPlayed = true;

        const duration = prefersReduced ? 0 : 2600;
        const startedAt = performance.now();
        const katanaBlade = document.getElementById("katana-blade");

        function step(now) {
          const elapsed = now - startedAt;
          const p = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
          const percent = Math.round(p * 100);

          loaderProgressBar.style.width = percent + "%";
          loaderProgressLabel.textContent = percent + "%";
          if (katanaBlade) katanaBlade.style.width = (p * 100) + "%";

          if (p < 1) {
            requestAnimationFrame(step);
          } else {
            // Slash cut reveal
            if (!prefersReduced) {
              routeTransition.animate(
                [
                  { transform: "translateX(-140%) skewX(-22deg)", opacity: 0 },
                  {
                    transform: "translateX(-18%) skewX(-22deg)",
                    opacity: 1,
                    offset: 0.35,
                  },
                  { transform: "translateX(135%) skewX(-22deg)", opacity: 0 },
                ],
                { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" },
              );

              pageFlash.animate(
                [
                  { opacity: 0 },
                  { opacity: 0.25, offset: 0.15 },
                  { opacity: 0 },
                ],
                { duration: 400, easing: "ease-out" },
              );
            }

            loadingScreen.classList.add("hidden");
            siteHeader.classList.add("ready");

            const hero = document.querySelector(".hero");
            hero?.classList.add("is-active");
          }
        }

        requestAnimationFrame(step);
      }

      document.getElementById("replay-btn")?.addEventListener("click", () => {
        loadingScreen.classList.remove("hidden");
        loaderProgressBar.style.width = "0%";
        loaderProgressLabel.textContent = "0%";
        runIntroSequence(true);
      });

      document.getElementById("theme-btn")?.addEventListener("click", () => {
        const root = document.documentElement;
        const next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);

        if (next === "light") {
          document.body.style.background =
            "radial-gradient(circle at 20% 10%, rgba(103,185,255,0.08), transparent 28%), radial-gradient(circle at 80% 18%, rgba(255,115,198,0.08), transparent 24%), radial-gradient(circle at 50% 100%, rgba(255,204,72,0.08), transparent 30%), linear-gradient(180deg, #f6f3ed 0%, #ece6df 55%, #e8e2db 100%)";
          document.body.style.color = "#1f1713";
        } else {
          document.body.style.background =
            "radial-gradient(circle at 20% 10%, rgba(103, 185, 255, 0.08), transparent 28%), radial-gradient(circle at 80% 18%, rgba(255, 115, 198, 0.08), transparent 24%), radial-gradient(circle at 50% 100%, rgba(255, 204, 72, 0.08), transparent 30%), linear-gradient(180deg, #050506 0%, #090c12 55%, #040506 100%)";
          document.body.style.color = "var(--color-text)";
        }
      });

      // GSAP Stat Counter reveal
      const statNumbers = document.querySelectorAll(".stat-number");
      statNumbers.forEach((num) => {
        const target = parseInt(num.dataset.target, 10);
        gsap.to(num, {
          innerText: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: ".hero",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });

      // Pinned Hashiras slideshow logic
      let hashiraSlides = [...document.querySelectorAll(".hashira-slide")];
      let currentHashiraIndex = 0;
      let hashiraSlashAnimator = null;

      function playHashiraSlideEntrance(idx) {
        if (prefersReduced) return;
        const s = hashiraSlides[idx];
        if (!s) return;

        const eyebrow = s.querySelector(".eyebrow");
        const title = s.querySelector(".slide-title");
        const desc = s.querySelector(".slide-desc");
        const tags = s.querySelectorAll(".tag");
        const stats = s.querySelectorAll(".mini-stat");
        const visualCard = s.querySelector(".hashira-card-scaled");
        const img = s.querySelector(".slide-image");
        const plate = s.querySelector(".slide-glow-plate");
        const textCard = s.querySelector(".slide-text");
        const charName = s.dataset.character;

        gsap.killTweensOf([eyebrow, title, desc, tags, stats, visualCard, img, plate, textCard]);

        const tl = gsap.timeline();

        // Character-specific text entrance
        if (charName === "giyu") {
          tl.fromTo(textCard,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" }
          );
        } else if (charName === "rengoku") {
          tl.fromTo(textCard,
            { y: 60, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.4)" }
          );
        } else if (charName === "akaza") {
          tl.fromTo(textCard,
            { x: 60, opacity: 0, rotateY: 15 },
            { x: 0, opacity: 1, rotateY: 0, duration: 0.7, ease: "power4.out" }
          );
        } else if (charName === "kokushibo") {
          tl.fromTo(textCard,
            { y: -40, opacity: 0, rotateX: -10 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1.0, ease: "power3.out" }
          );
        } else if (charName === "douma") {
          tl.fromTo(textCard,
            { scale: 0.85, opacity: 0, filter: "blur(8px)" },
                    { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out" }
          );
        } else if (charName === "muzan") {
          tl.fromTo(textCard,
            { scale: 1.15, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "power4.out" }
          );
        } else if (charName === "obanai") {
          tl.fromTo(textCard,
            { y: 40, opacity: 0, rotateZ: 5 },
            { y: 0, opacity: 1, rotateZ: 0, duration: 1.1, ease: "power3.out" }
          );
        } else {
          tl.fromTo(textCard,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );
        }

        if (eyebrow) {
          tl.fromTo(eyebrow,
            { y: 15, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
            { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.6, ease: "power3.out" },
            "-=0.6"
          );
        }

        tl.fromTo(title,
          { y: 20, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.7, ease: "power3.out" },
          "-=0.5"
        );

        tl.fromTo(desc,
          { y: 15, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 0.7, ease: "power3.out" },
          "-=0.4"
        );

        tl.fromTo(tags,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" },
          "-=0.4"
        );

        tl.fromTo(stats,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        );

        // Character-specific visual entrance
        if (visualCard) {
          if (charName === "giyu") {
            gsap.fromTo(visualCard,
              { scale: 0.9, y: -30, opacity: 0 },
              { scale: 1, y: 0, opacity: 1, duration: 1.3, ease: "power2.out", delay: 0.1 }
            );
          } else if (charName === "rengoku") {
            gsap.fromTo(visualCard,
              { scale: 0.7, y: 80, opacity: 0 },
              { scale: 1, y: 0, opacity: 1, duration: 1.0, ease: "back.out(1.2)", delay: 0.05 }
            );
          } else if (charName === "akaza") {
            gsap.fromTo(visualCard,
              { scale: 1.2, opacity: 0, rotateZ: 3 },
              { scale: 1, opacity: 1, rotateZ: 0, duration: 0.6, ease: "power4.out", delay: 0.05 }
            );
          } else if (charName === "kokushibo") {
            gsap.fromTo(visualCard,
              { scale: 0.85, rotateY: -20, opacity: 0 },
              { scale: 1, rotateY: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.1 }
            );
          } else if (charName === "douma") {
            gsap.fromTo(visualCard,
              { scale: 0.9, opacity: 0, filter: "blur(6px) brightness(1.5)" },
              { scale: 1, opacity: 1, filter: "blur(0px) brightness(1)", duration: 1.3, ease: "power2.out", delay: 0.1 }
            );
          } else if (charName === "muzan") {
            gsap.fromTo(visualCard,
              { scale: 1.3, opacity: 0, rotateX: 10 },
              { scale: 1, opacity: 1, rotateX: 0, duration: 0.8, ease: "power4.out", delay: 0.05 }
            );
          } else if (charName === "obanai") {
            gsap.fromTo(visualCard,
              { scale: 0.9, opacity: 0, y: -40 },
              { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.1)", delay: 0.1 }
            );
          } else {
            gsap.fromTo(visualCard,
              { scale: 0.82, x: 40, opacity: 0 },
              { scale: 1, x: 0, opacity: 1, duration: 1.0, ease: "power4.out", delay: 0.1 }
            );
          }
        }

        if (img) {
          if (charName === "giyu") {
            gsap.fromTo(img,
              { scale: 1.15, y: 40, opacity: 0 },
              { scale: 1, y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.15 }
            );
          } else if (charName === "rengoku") {
            gsap.fromTo(img,
              { scale: 0.6, y: 100, opacity: 0, filter: "brightness(2) saturate(2)" },
              { scale: 1, y: 0, opacity: 1, filter: "brightness(1) saturate(1)", duration: 1.2, ease: "power3.out", delay: 0.1 }
            );
          } else if (charName === "akaza") {
            gsap.fromTo(img,
              { x: -80, scale: 1.1, opacity: 0 },
              { x: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power4.out", delay: 0.05 }
            );
          } else if (charName === "kokushibo") {
            gsap.fromTo(img,
              { scale: 0.75, opacity: 0, rotateY: -15 },
              { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: "power2.out", delay: 0.15 }
            );
          } else if (charName === "douma") {
            gsap.fromTo(img,
              { scale: 1.2, opacity: 0, filter: "blur(10px) brightness(1.8)" },
              { scale: 1, opacity: 1, filter: "blur(0px) brightness(1)", duration: 1.4, ease: "power2.out", delay: 0.15 }
            );
          } else if (charName === "muzan") {
            gsap.fromTo(img,
              { scale: 1.3, opacity: 0, y: -40 },
              { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "power4.out", delay: 0.1 }
            );
          } else if (charName === "obanai") {
            gsap.fromTo(img,
              { scale: 0.85, opacity: 0, filter: "hue-rotate(90deg) contrast(1.2)" },
              { scale: 1, opacity: 1, filter: "hue-rotate(0deg) contrast(1)", duration: 1.4, ease: "power2.out", delay: 0.15 }
            );
          } else {
            gsap.fromTo(img,
              { scale: 0.8, x: 60, opacity: 0 },
              { scale: 1, x: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.15 }
            );
          }
        }

        if (plate) {
          const plateDuration = (charName === "rengoku") ? 0.8 : (charName === "muzan") ? 0.7 : (charName === "obanai") ? 1.4 : 1.2;
          const plateScale = (charName === "rengoku") ? 0.5 : (charName === "akaza") ? 1.1 : (charName === "obanai") ? 0.85 : 0.75;
          gsap.fromTo(plate,
            { scale: plateScale, opacity: 0 },
            { scale: 1, opacity: 0.55, duration: plateDuration, ease: "power3.out", delay: 0.1 }
          );
        }
      }

      function changeHashiraSlide(idx) {
        if (idx === currentHashiraIndex) return;

        const oldSlide = hashiraSlides[currentHashiraIndex];
        const newSlide = hashiraSlides[idx];
        const charName = newSlide.dataset.character;

        let slashStyle = "water";
        if (charName === "giyu") slashStyle = "water";
        else if (charName === "rengoku") slashStyle = "flame";
        else if (charName === "tengen") slashStyle = "sound";
        else if (charName === "shinobu") slashStyle = "insect";
        else if (charName === "muichiro") slashStyle = "mist";
        else if (charName === "mitsuri") slashStyle = "love";
        else if (charName === "gyomei") slashStyle = "stone";
        else if (charName === "obanai") slashStyle = "serpent";
        else if (charName === "sanemi") slashStyle = "wind";
        else if (charName === "akaza") slashStyle = "compass";
        else if (charName === "kokushibo") slashStyle = "moon";
        else if (charName === "douma") slashStyle = "ice";
        else if (charName === "muzan") slashStyle = "muzan";

        if (!prefersReduced && hashiraSlashAnimator) {
          hashiraSlashAnimator.trigger(slashStyle);
        }

        hashiraSlides.forEach((s, sIdx) => {
          if (sIdx === idx) {
            s.classList.add("active");
            playHashiraSlideEntrance(idx);

            // Adjust ambient background wash based on theme
            let washA = "rgba(176, 131, 255, 0.08)";
            let washB = "rgba(255, 173, 72, 0.07)";
            if (charName === "giyu") { washA = "rgba(103, 185, 255, 0.12)"; washB = "rgba(34, 68, 136, 0.05)"; }
            else if (charName === "rengoku") { washA = "rgba(255, 173, 72, 0.14)"; washB = "rgba(255, 60, 0, 0.06)"; }
            else if (charName === "tengen") { washA = "rgba(255, 226, 112, 0.12)"; washB = "rgba(200, 150, 20, 0.06)"; }
            else if (charName === "shinobu") { washA = "rgba(176, 131, 255, 0.14)"; washB = "rgba(100, 40, 180, 0.05)"; }
            else if (charName === "muichiro") { washA = "rgba(103, 214, 210, 0.12)"; washB = "rgba(20, 120, 110, 0.05)"; }
            else if (charName === "mitsuri") { washA = "rgba(255, 115, 198, 0.14)"; washB = "rgba(180, 20, 100, 0.05)"; }
            else if (charName === "gyomei") { washA = "rgba(172, 165, 157, 0.1)"; washB = "rgba(70, 70, 70, 0.06)"; }
            else if (charName === "obanai") { washA = "rgba(180, 70, 255, 0.1)"; washB = "rgba(90, 10, 180, 0.05)"; }
            else if (charName === "sanemi") { washA = "rgba(103, 214, 141, 0.12)"; washB = "rgba(10, 120, 60, 0.06)"; }
            else if (charName === "akaza") { washA = "rgba(100, 140, 255, 0.12)"; washB = "rgba(255, 80, 140, 0.06)"; }
            else if (charName === "kokushibo") { washA = "rgba(160, 100, 255, 0.14)"; washB = "rgba(255, 200, 60, 0.05)"; }
            else if (charName === "douma") { washA = "rgba(100, 220, 240, 0.12)"; washB = "rgba(200, 240, 255, 0.06)"; }
            else if (charName === "muzan") { washA = "rgba(255, 0, 50, 0.15)"; washB = "rgba(10, 0, 2, 0.1)"; }

            document.documentElement.style.setProperty("--bg-wash-a", washA);
            document.documentElement.style.setProperty("--bg-wash-b", washB);
          } else {
            s.classList.remove("active");
          }
        });

        currentHashiraIndex = idx;
      }

      function initHashiraScrollShowcase() {
        if (prefersReduced) return;

        ScrollTrigger.matchMedia({
          "(min-width: 1025px)": function() {
            gsap.timeline({
              scrollTrigger: {
                trigger: "#hashira",
                start: "top top",
                end: "+=8500",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                onEnter: () => {
                  playHashiraSlideEntrance(currentHashiraIndex);
                },
                onEnterBack: () => {
                  playHashiraSlideEntrance(currentHashiraIndex);
                },
                onUpdate: (self) => {
                  const p = self.progress;
                  const slideCount = hashiraSlides.length;
                  let targetIdx = Math.min(Math.floor(p * slideCount), slideCount - 1);
                  if (targetIdx !== currentHashiraIndex) {
                    changeHashiraSlide(targetIdx);
                  }
                }
              }
            });
          }
        });
      }

      function initHashiraMobileScrollTrigger() {
        if (prefersReduced) return;
        ScrollTrigger.matchMedia({
          "(max-width: 1024px)": function() {
            hashiraSlides.forEach((slide, idx) => {
              ScrollTrigger.create({
                trigger: slide,
                start: "top 60%",
                onEnter: () => {
                  const charName = slide.dataset.character;
                  let slashStyle = "water";
                  if (charName === "giyu") slashStyle = "water";
                  else if (charName === "rengoku") slashStyle = "flame";
                  else if (charName === "tengen") slashStyle = "sound";
                  else if (charName === "shinobu") slashStyle = "insect";
                  else if (charName === "muichiro") slashStyle = "mist";
                  else if (charName === "mitsuri") slashStyle = "love";
                  else if (charName === "gyomei") slashStyle = "stone";
                  else if (charName === "obanai") slashStyle = "serpent";
                  else if (charName === "sanemi") slashStyle = "wind";
                  else if (charName === "akaza") slashStyle = "compass";
                  else if (charName === "kokushibo") slashStyle = "moon";
                  else if (charName === "douma") slashStyle = "ice";
                  else if (charName === "muzan") slashStyle = "muzan";

                  if (hashiraSlashAnimator) hashiraSlashAnimator.trigger(slashStyle);
                  playHashiraSlideEntrance(idx);
                }
              });
            });
          }
        });
      }

      // Parallax listeners for Hashira scaled cards
      hashiraSlides.forEach((slide) => {
        const card = slide.querySelector(".hashira-card-scaled");
        const img = slide.querySelector(".slide-image");
        const plate = slide.querySelector(".slide-glow-plate");

        slide.addEventListener("pointermove", (e) => {
          if (prefersReduced) return;
          const rect = slide.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          if (card) {
            gsap.to(card, {
              rotateY: x * 15,
              rotateX: -y * 15,
              z: 20,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto"
            });
          }

          if (img) {
            gsap.to(img, {
              rotateY: x * 22,
              rotateX: -y * 22,
              z: 45,
              x: x * 15,
              y: y * 15,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto"
            });
          }

          if (plate) {
            gsap.to(plate, {
              rotateY: -x * 10,
              rotateX: y * 10,
              x: -x * 20,
              y: -y * 20,
              z: -15,
              duration: 0.7,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
        });

        slide.addEventListener("mouseleave", () => {
          if (card) {
            gsap.to(card, {
              rotateY: 0,
              rotateX: 0,
              z: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
          if (img) {
            gsap.to(img, {
              rotateY: 0,
              rotateX: 0,
              z: 0,
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
          if (plate) {
            gsap.to(plate, {
              rotateY: 0,
              rotateX: 0,
              x: 0,
              y: 0,
              z: -30,
              duration: 0.9,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
        });
      });

      createAmbientScene();
      createBreathingScene();

      // Initialize slash animator & scroll triggers
      slashAnimator = new SlashAnimator("slash-canvas");
      hashiraSlashAnimator = new SlashAnimator("hashira-slash-canvas");

      initScrollShowcase();
      initMobileScrollTrigger();
      initHashiraScrollShowcase();
      initHashiraMobileScrollTrigger();

      runIntroSequence();

      window.addEventListener("hashchange", () => {
        const id = location.hash;
        if (!id) return;
        const target = document.querySelector(id);
        if (target) {
          fakeRouteTransition(id);
          setTimeout(
            () => {
              target.scrollIntoView({
                behavior: prefersReduced ? "auto" : "smooth",
              });
            },
            prefersReduced ? 0 : 100,
          );
        }
      });

      document.addEventListener("DOMContentLoaded", () => {
        // Epic battle audio for Infinity Castle vibe
        const audioUrl = "https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58bb.mp3?filename=epic-battle-112906.mp3";
        const bgAudio = new Audio(audioUrl);
        bgAudio.loop = true;
        bgAudio.volume = 0.45;

        const audioIndicator = document.querySelector(".audio-indicator");
        const audioLabel = audioIndicator.querySelector("span:not(.audio-dot)");
        let hasUserInteracted = false;

        audioIndicator.addEventListener("click", () => {
          if (bgAudio.paused) {
            bgAudio.play()
              .then(() => {
                hasUserInteracted = true;
                audioIndicator.classList.add("playing");
                audioLabel.textContent = "Infinity Castle Audio — Live";
              })
              .catch((err) => {
                console.error("Audio playback blocked or failed:", err);
              });
          } else {
            bgAudio.pause();
            hasUserInteracted = true;
            audioIndicator.classList.remove("playing");
            audioLabel.textContent = "Infinity Castle Audio — Muted";
          }
        });
      });
    