# Smoothness & Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile scroll jank, remove media7.webp, and polish all animations for a silky-smooth experience across every device.

**Architecture:** Two files only — `src/App.jsx` (parallax logic, image attributes, remove media7) and `src/index.css` (all visual/animation/performance CSS). No new dependencies.

**Tech Stack:** React 18, Vite, plain CSS (no CSS-in-JS, no animation libraries)

---

### Task 1: Fix Parallax — RAF on Desktop, Disabled on Mobile

**Files:**
- Modify: `src/App.jsx` (the `useEffect` hook, lines 6–31)

This is the root cause of mobile scroll jank. The current handler fires synchronously on every scroll event. Fix: skip the listener entirely on mobile (≤900px), use `requestAnimationFrame` on desktop so the compositor can batch updates.

- [ ] **Step 1: Replace the useEffect in App.jsx**

Open `src/App.jsx`. Replace the entire `useEffect` (lines 6–31) with this:

```jsx
useEffect(() => {
  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el) => observer.observe(el));

  // Parallax — desktop only. Mobile skips to avoid compositor jank.
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  let rafId = null;

  if (!isMobile) {
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (heroBgRef.current) {
          heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }

  return () => {
    observer.disconnect();
  };
}, []);
```

- [ ] **Step 2: Verify manually**

Run `npm run dev`. On desktop: scroll down and confirm hero parallax still animates smoothly. On mobile (DevTools → toggle device toolbar, pick iPhone): confirm hero is static and scroll is smooth with no dropped frames.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "perf: fix parallax — RAF on desktop, disabled on mobile to prevent scroll jank"
```

---

### Task 2: Image Attributes + Remove media7.webp

**Files:**
- Modify: `src/App.jsx` (all `<img>` tags)

Hero images should load immediately (`fetchpriority="high"`). Everything below the fold should lazy-load (`loading="lazy" decoding="async"`). media7.webp gets removed entirely.

- [ ] **Step 1: Update hero images (lines ~40–44)**

Find the hero image block in App.jsx (inside `.hero-parallax-wrapper`). Add `fetchpriority="high"` to all four hero `<img>` tags:

```jsx
{/* Desktop background images */}
<img src="/images/hero.webp" alt="Background Blur" className="hero-bg-blur desktop-only" fetchpriority="high" />
<img src="/images/hero.webp" alt="Hero background" className="hero-bg desktop-only" fetchpriority="high" />
{/* Mobile background images */}
<img src="/images/mobileHero.webp" alt="Mobile Background Blur" className="hero-bg-blur mobile-only" fetchpriority="high" />
<img src="/images/mobileHero.webp" alt="Mobile Hero background" className="hero-bg mobile-only hero-bg-mobile" fetchpriority="high" />
```

- [ ] **Step 2: Add lazy loading to all non-hero images**

For every `<img>` tag that is NOT in the hero section, add `loading="lazy" decoding="async"`. Apply to:

**As Seen On logos** (all 6):
```jsx
<img src="/images/flopshop.webp" alt="Flopshop" className="as-seen-img" loading="lazy" decoding="async" />
<img src="/images/guts.webp" alt="Guts" className="as-seen-img" loading="lazy" decoding="async" />
<img src="/images/pattepack.webp" alt="Pattepack" className="as-seen-img" loading="lazy" decoding="async" />
<img src="/images/timepass.webp" alt="Timepass" className="as-seen-img" loading="lazy" decoding="async" />
<img src="/images/windup.webp" alt="Windup" className="as-seen-img" loading="lazy" decoding="async" />
<img src="/images/zipit.webp" alt="Zipit" className="as-seen-img" loading="lazy" decoding="async" />
```

**Dear Saumi images** (all 4):
```jsx
<img src="/images/dearSaumi1.svg" alt="Saumi 1" className="ds-img ds-img-1" loading="lazy" decoding="async" />
<img src="/images/dearSaumi2.svg" alt="Saumi 2" className="ds-img ds-img-2" loading="lazy" decoding="async" />
<img src="/images/dearSaumi3.svg" alt="Saumi 3" className="ds-img ds-img-3" loading="lazy" decoding="async" />
<img src="/images/dearSaumi4.svg" alt="Saumi 4" className="ds-img ds-img-4" loading="lazy" decoding="async" />
```

**Testimonial cards** (all 3):
```jsx
<img src="/images/testimonial1.webp" alt="Simran Jain" loading="lazy" decoding="async" />
<img src="/images/testimonial2.webp" alt="Mammi Pappa" loading="lazy" decoding="async" />
<img src="/images/testimonial3.webp" alt="Apurv Budhraja" loading="lazy" decoding="async" />
```

**Magazine items** (media1–6, media8 — do NOT include media7):
```jsx
<img src="/images/media1.webp" alt="The Chicken Magazine" loading="lazy" decoding="async" />
<img src="/images/media2.webp" alt="R. Republic Magazine" loading="lazy" decoding="async" />
<img src="/images/media3.webp" alt="Femina Magazine" loading="lazy" decoding="async" />
<img src="/images/media4.webp" alt="Fortune Time Magazine" loading="lazy" decoding="async" />
<img src="/images/media5.webp" alt="Vogue Edition Magazine" loading="lazy" decoding="async" />
<img src="/images/media6.webp" alt="GQ Style Magazine" loading="lazy" decoding="async" />
<img src="/images/media8.webp" alt="Time Spotlight Magazine" loading="lazy" decoding="async" />
```

**Footer logo**:
```jsx
<img src="/images/logo.webp" alt="SAUMPALS Logo" className="footer-logo" loading="lazy" decoding="async" />
```

- [ ] **Step 3: Remove media7.webp from the magazines grid**

Find this block in the magazines section and delete it entirely:

```jsx
<div className="mag-item">
  <img src="/images/media7.webp" alt="Forbes Life Magazine" />
</div>
```

After removal the grid should have exactly 7 `mag-item` divs (media1, media2, media3, media4, media5, media6, media8).

- [ ] **Step 4: Verify manually**

Run `npm run dev`. Confirm:
- Hero loads immediately, no flash
- Network tab (DevTools) shows below-fold images loading only as you scroll down
- Magazine grid shows 7 items, media7 is gone

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "perf: add lazy loading to below-fold images, fetchpriority to hero, remove media7"
```

---

### Task 3: CSS — Animations, Performance, Polish

**Files:**
- Modify: `src/index.css`

All CSS changes in one task — they're all additive or small edits with no interdependencies.

- [ ] **Step 1: Tune reveal animation (snappier feel)**

Find the `.reveal` and `.reveal.visible` blocks (around line 69–78). Replace with:

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.65s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Add stagger delays to magazine items**

Find the `.mag-item` block (around line 411). After `.mag-item:hover img { ... }`, add:

```css
.mag-item:nth-child(1) { transition-delay: 0ms; }
.mag-item:nth-child(2) { transition-delay: 80ms; }
.mag-item:nth-child(3) { transition-delay: 160ms; }
.mag-item:nth-child(4) { transition-delay: 240ms; }
.mag-item:nth-child(5) { transition-delay: 0ms; }
.mag-item:nth-child(6) { transition-delay: 80ms; }
.mag-item:nth-child(7) { transition-delay: 160ms; }
```

- [ ] **Step 3: Add stagger delays to testimonial cards**

After `.test-quote { ... }` block (around line 355), add:

```css
.test-card:nth-child(1) { transition-delay: 0ms; }
.test-card:nth-child(2) { transition-delay: 80ms; }
.test-card:nth-child(3) { transition-delay: 160ms; }
```

- [ ] **Step 4: Fix magazine grid for 7 items (odd last item)**

Inside the `.magazines-grid` block (around line 402), add after the existing rules:

```css
.mag-item:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: calc(50% - 20px);
  margin: 0 auto;
}
```

- [ ] **Step 5: Add touch-action to interactive elements**

Add `touch-action: manipulation` to `.as-seen-img`, `.mag-item`, and `.test-card` — this eliminates the 300ms tap delay on mobile. Edit each block:

In `.as-seen-img` (around line 235):
```css
.as-seen-img {
  max-height: 75px;
  width: auto;
  object-fit: contain;
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  touch-action: manipulation;
}
```

In `.mag-item` (around line 411):
```css
.mag-item {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.5s ease, filter 0.5s ease;
  background: #fff;
  padding: 10px;
  filter: grayscale(15%);
  touch-action: manipulation;
}
```

In `.test-card` (around line 328):
```css
.test-card {
  width: 320px;
  background-color: #F8F4DC;
  padding: 0;
  display: flex;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  touch-action: manipulation;
}
```

- [ ] **Step 6: will-change hygiene**

The only element that genuinely needs `will-change` is `.hero-parallax-wrapper` (already has it). Confirm `.mag-item` and `.test-card` do NOT have `will-change` declarations. If they do, remove them. (Current code doesn't have them — just verify, no edit needed.)

- [ ] **Step 7: content-visibility for off-screen sections**

Add `content-visibility` to `.magazines` and `.footer-section`. Find `.magazines` block (around line 398):

```css
.magazines {
  padding: 0 5% 120px;
  content-visibility: auto;
  contain-intrinsic-size: 0 800px;
}
```

Find `.footer-section` block (around line 449):

```css
.footer-section {
  background-color: var(--color-footer-bg);
  color: var(--color-footer-text);
  padding: 80px 8% 50px;
  overflow: hidden;
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;
}
```

- [ ] **Step 8: Footer logo hover scale**

Find `.footer-logo` (around line 474). After it, add:

```css
.footer-logo:hover {
  transform: scale(1.05);
}
```

- [ ] **Step 9: prefers-reduced-motion**

At the very end of `index.css`, add:

```css
/* ================== REDUCED MOTION ================== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 10: Verify manually**

Run `npm run dev`. Check:
- Reveal animations feel snappier (0.65s, 24px)
- Magazine grid: 7 items, last item centered
- Testimonial cards stagger in on scroll
- DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" → all animations should be instant
- Mobile: smooth scroll, no parallax jank

- [ ] **Step 11: Commit**

```bash
git add src/index.css
git commit -m "style: polish animations, add touch-action, content-visibility, reduced-motion support"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Parallax RAF + mobile disable → Task 1
- [x] Image lazy loading + fetchpriority → Task 2
- [x] Remove media7.webp → Task 2
- [x] Magazine grid 7-item odd handling → Task 3 Step 4
- [x] Reveal animation tuning → Task 3 Step 1
- [x] Stagger delays → Task 3 Steps 2–3
- [x] prefers-reduced-motion → Task 3 Step 9
- [x] content-visibility → Task 3 Step 7
- [x] will-change hygiene → Task 3 Step 6
- [x] touch-action → Task 3 Step 5
- [x] Footer logo hover → Task 3 Step 8

**No placeholders, no TBDs, no "similar to above" — all steps contain exact code.**
