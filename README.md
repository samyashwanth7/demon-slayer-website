# Demon Slayer Web Experience

A high-performance, immersive, and interactive web experience dedicated to the world of *Demon Slayer: Kimetsu no Yaiba*. 

Designed and Developed by **P Sampath Kumar**.

## 🛠️ Technologies Used

This project was built from the ground up using **Vanilla web technologies**, purposefully avoiding heavy frameworks like React or Three.js to maximize performance and demonstrate deep technical understanding of the DOM and browser rendering.

* **HTML5:** Semantic structure and the robust Canvas API for raw graphics rendering.
* **CSS3:** Advanced techniques including CSS Grid/Flexbox, Custom Properties (Variables), `mix-blend-mode`, `backdrop-filter` (glassmorphism), complex nested `box-shadow` layering, and native CSS transitions/keyframes.
* **JavaScript (ES6+):** Pure Vanilla JS for DOM manipulation, state management, event handling, and driving the physics-based animation engine.
* **GSAP (GreenSock Animation Platform):** Used for complex, scroll-linked animations and Timeline sequencing (e.g., the cinematic intro text, Kanji overlays, and scroll-triggered reveals).

---

## 🎨 How We Built the Animations

The core "Wow" factor of this project comes from the **Custom Canvas Engine**. Instead of relying on CSS for complex particle effects (which can cause severe lag), we built a `requestAnimationFrame` loop that draws directly onto an HTML5 `<canvas>` element layered behind the UI.

Here is a breakdown of how the specific character animations were achieved:

### 1. The Animation Engine (`SlashAnimator` Class)
We created a custom JavaScript class that tracks an array of `slashes` and `particles`. 
* **Slashes** are drawn using `CanvasRenderingContext2D.quadraticCurveTo()`, allowing us to create perfect, curved sword arcs by defining start points, control points, and end points.
* **Particles** use basic physics (Velocity X, Velocity Y, friction/decay, and alpha fading) to simulate sparks, bubbles, and dust flying off the blade.

### 2. Character-Specific Breathing Styles
The animation engine dynamically changes its drawing logic based on the character currently in focus on the screen:

* **Tanjiro (Sun Breathing - Hinokami Kagura):** 
  * Draws two massive, intertwining crescent slashes (using `points` arrays to trace the arc).
  * Spawns 110 "ember" particles with heavy `screenShake` (simulating a violent, explosive impact).
  * Uses glowing colors: Gold, Orange, and White-hot Red.
  
* **Inosuke (Beast Breathing):**
  * Draws three jagged, wild diagonal claw marks simultaneously.
  * Spawns chaotic particles in brown (dirt/earth) and green (beast aura) to simulate his feral, unrefined fighting style.

* **Shinobu (Insect Breathing):**
  * Completely removes the harsh sword lines.
  * Instead, it spawns 90 particles uniquely shaped and colored (purple and white) with a spiraling velocity `Math.sin(angle + Math.PI/2)` to mimic the elegant fluttering of a massive swarm of butterflies.

* **Giyu (Water Breathing):**
  * Uses curved blue arcs with a trailing gradient to look like flowing water.
  * Spawns an expanding concentric ring (using `arc()`) to simulate the ripple of "Dead Calm" (the 11th Form).

* **Mitsuri (Love Breathing):**
  * Uses a complex 6-point quadratic curve to simulate the flexible, whip-like motion of her unique sword.
  * Spawns pink "heart" shaped particles.

* **Muichiro (Mist Breathing):**
  * Draws massive, thick, semi-transparent white/cyan rings and slow-moving, large-radius particles to simulate obscuring fog.

### 3. Interactive UI Elements
* **Glassmorphism Cards:** The character cards use `backdrop-filter: blur(20px)` and semi-transparent RGBA backgrounds to create the frosted glass effect, heavily relying on multiple box-shadows to create depth and glowing edges.
* **Custom Cursor:** The custom cursor is a `div` element tracking the mouse `mousemove` event, with its color and trailing particles changing dynamically depending on which character's slide is active.
* **Scroll Hijacking (GSAP):** `ScrollTrigger` is used to pin the screen during the "Kanji Transition" phases, fading massive Japanese text in and out based on the user's scroll depth before unlocking the page.

---

## 🚀 Running the Project

Since this project uses entirely Vanilla technologies, there is no build step required! 
Simply open `index.html` in any modern web browser to view the experience. 

*(Note: For the best experience, ensure Hardware Acceleration is enabled in your browser settings to support the Canvas rendering at 60 FPS).*
