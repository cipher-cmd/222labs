# 222lab Smoothness & Polish Design

**Date:** 2026-05-22  
**Status:** Approved

## Goal

Make the site pixel-perfect and smooth across all devices — mobile, desktop, high-end, low-end. Fix scroll jank. Remove media7.webp. Polish animations.

## Root Cause: Mobile Scroll Jank

JS parallax handler fires synchronously on every `scroll` event without `requestAnimationFrame`. On iOS/Android, this blocks the compositor thread and causes dropped frames. Fix: disable parallax on mobile entirely (static hero), use RAF on desktop.

## Changes

### 1. Parallax (App.jsx)

- Detect mobile via `window.matchMedia('(max-width: 900px)')` or `navigator.maxTouchPoints > 0`
- If mobile: skip adding scroll listener, set `heroBgRef` transform to none
- If desktop: wrap handler in `requestAnimationFrame`, cancel pending RAF on each scroll event
- Clean up RAF ref in `useEffect` return

### 2. Image Optimization (App.jsx)

- Hero images: add `fetchpriority="high"` (no lazy, above fold)
- All other images: add `loading="lazy"` and `decoding="async"`
- Prevents unnecessary network load on page open

### 3. Remove media7.webp (App.jsx)

- Remove the `<div class="mag-item">` block for media7.webp from the magazines grid
- 7 items remain: media1–6 + media8

### 4. Magazine Grid — 7 Items (index.css)

- 2-column grid stays
- Last odd item (`:last-child:nth-child(odd)`) gets `grid-column: 1 / -1` + `max-width: calc(50% - 20px)` + `margin: 0 auto`
- Looks intentional, not broken

### 5. Reveal Animations (index.css)

- Reduce `translateY(40px)` → `translateY(24px)` — snappier, less dramatic
- Reduce transition duration `0.8s` → `0.65s`
- Add stagger delays via `nth-child` on `.mag-item` and `.test-card` (0ms, 80ms, 160ms, 240ms)

### 6. prefers-reduced-motion (index.css)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

### 7. content-visibility (index.css)

- Add `content-visibility: auto; contain-intrinsic-size: 0 800px` to `.magazines` and `.footer-section`
- Skips rendering off-screen content on low-end devices

### 8. will-change Hygiene (index.css)

- Keep `will-change: transform` on `.hero-parallax-wrapper` only
- Remove implicit `will-change` hints from `.mag-item`, `.test-card` (transition alone is fine)
- Too many `will-change` declarations exhaust GPU memory on low-end

### 9. touch-action (index.css)

- Add `touch-action: manipulation` to `.as-seen-img`, `.mag-item`, `.test-card` — eliminates 300ms tap delay on mobile

### 10. Footer Logo Hover (index.css)

- `.footer-logo:hover` gets `transform: scale(1.05)` — transition already exists, just missing the scale target

## Files Changed

- `src/App.jsx` — parallax fix, image attributes, remove media7
- `src/index.css` — all CSS improvements

## Non-Goals

- No new sections or features
- No dependency changes
- No build config changes
