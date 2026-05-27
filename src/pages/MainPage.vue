<template>
  <div class="main-page">

    <!-- Hero -->
    <section class="hero">

      <!-- Eyebrow -->
      <p class="hero-eyebrow">Est. 2024 &nbsp;·&nbsp; Private Bar</p>

      <!-- Decorative hero illustration -->
      <div class="hero-art" aria-hidden="true">
        <svg viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" class="hero-svg">
          <defs>
            <filter id="hero-wc" x="-40%" y="-40%" width="180%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.036" numOctaves="4" seed="7" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>

          <!-- Multi-color watercolor wash (cocktail variety) -->
          <ellipse filter="url(#hero-wc)" cx="140" cy="170" rx="105" ry="118" fill="#C4823A" style="opacity:0.14;"/>
          <ellipse filter="url(#hero-wc)" cx="162" cy="138" rx="78" ry="88"  fill="#7A8FAF" style="opacity:0.11;"/>
          <ellipse filter="url(#hero-wc)" cx="112" cy="205" rx="68" ry="72"  fill="#6AAF5A" style="opacity:0.10;"/>
          <ellipse filter="url(#hero-wc)" cx="170" cy="210" rx="52" ry="58"  fill="#B84A6A" style="opacity:0.08;"/>

          <!-- Wine glass outline -->
          <g fill="none" stroke="#C8C2B8" stroke-width="1.2">
            <!-- Bowl -->
            <path d="M 95,52 Q 64,138 102,208 L 178,208 Q 216,138 185,52 Z"/>
            <!-- Liquid fill inside bowl -->
            <path d="M 99,66 Q 70,145 105,205 L 175,205 Q 210,145 181,66 Z"
              fill="#C4823A" style="opacity:0.22;" stroke="none"/>
            <!-- Stem -->
            <line x1="140" y1="208" x2="140" y2="290"/>
            <!-- Base -->
            <path d="M 108,290 Q 108,303 140,303 Q 172,303 172,290"/>
            <!-- Wine legs -->
            <path d="M 116,178 Q 133,164 127,147" stroke="#C4823A" stroke-width="0.9" style="opacity:0.38;"/>
            <path d="M 163,184 Q 150,170 155,152" stroke="#C4823A" stroke-width="0.9" style="opacity:0.38;"/>
            <!-- Glass highlight -->
            <path d="M 108,65 Q 106,132 110,202"
              stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-linecap="round" fill="none"/>
          </g>

          <!-- Floating ingredient dots (decorative) -->
          <g style="opacity:0.35;">
            <circle cx="72"  cy="110" r="4" fill="#C4823A"/>
            <circle cx="58"  cy="175" r="3" fill="#6AAF5A"/>
            <circle cx="210" cy="128" r="3.5" fill="#7A8FAF"/>
            <circle cx="218" cy="195" r="3" fill="#B84A6A"/>
            <circle cx="80"  cy="242" r="2.5" fill="#C4A03A"/>
          </g>

          <!-- Small decorative star/cross marks -->
          <g stroke="#C5A880" stroke-width="0.8" style="opacity:0.3;">
            <line x1="50" y1="80"  x2="56" y2="86"/> <line x1="56" y1="80"  x2="50" y2="86"/>
            <line x1="228" y1="155" x2="234" y2="161"/> <line x1="234" y1="155" x2="228" y2="161"/>
            <line x1="62"  y1="270" x2="67"  y2="275"/> <line x1="67"  y1="270" x2="62"  y2="275"/>
          </g>
        </svg>
      </div>

      <!-- Title -->
      <h1 class="hero-title">Samik</h1>

      <!-- Ornament -->
      <div class="hero-ornament">
        <span class="orn-line"></span>
        <span class="orn-diamond">◆</span>
        <span class="orn-line"></span>
      </div>

      <!-- Subtitle -->
      <p class="hero-subtitle">Cocktail Bar</p>

      <!-- Korean description -->
      <p class="hero-desc">
        문을 열고 들어오면, 세상은 잠시 멈춥니다.<br>
        이곳은 좋은 술과 조용한 대화를 위한 공간입니다.
      </p>

      <!-- CTA -->
      <router-link to="/menu" class="hero-cta">View the Menu</router-link>
    </section>

    <!-- Teaser strip -->
    <section class="teaser-strip">
      <div class="teaser-inner">
        <div v-for="item in teasers" :key="item.label" class="teaser-item">
          <p class="teaser-value">{{ item.value }}</p>
          <p class="teaser-label">{{ item.label }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const teasers = [
  { value: 'Hand-crafted', label: 'Every pour' },
  { value: 'Seasonal',     label: 'Rotating menu' },
  { value: 'Curated',      label: 'Spirit selection' },
]
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #141210;
}

/* ─── Hero ─── */
.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 1.5rem 3.5rem;
}

.hero-eyebrow {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C5A880;
  margin-bottom: 2.5rem;
}

/* Illustration */
.hero-art {
  width: 100%;
  max-width: 240px;
  margin-bottom: 2rem;
}
.hero-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Title in Dancing Script */
.hero-title {
  font-family: 'Dancing Script', cursive;
  font-size: clamp(3.8rem, 9vw, 6.5rem);
  font-weight: 700;
  color: #EAE6DF;
  line-height: 1;
  margin-bottom: 1rem;
}

/* Ornament */
.hero-ornament {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}
.orn-line {
  display: block;
  width: 2.8rem;
  height: 1px;
  background: #C5A880;
  opacity: 0.5;
}
.orn-diamond {
  font-size: 0.45rem;
  color: #C5A880;
  opacity: 0.7;
}

/* Subtitle */
.hero-subtitle {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: #C8C2B8;
  margin-bottom: 1.8rem;
}

/* Korean description */
.hero-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-style: italic;
  line-height: 2;
  color: #C8C2B8;
  max-width: 26rem;
  margin-bottom: 2.5rem;
}

/* CTA button */
.hero-cta {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  text-decoration: none;
  color: #EAE6DF;
  border: 1px solid #C5A880;
  padding: 0.75rem 2.2rem;
  transition: background 0.2s, color 0.2s;
}
.hero-cta:hover {
  background: #C5A880;
  color: #141210;
}

/* ─── Teaser strip ─── */
.teaser-strip {
  border-top: 1px solid #2E2823;
  border-bottom: 1px solid #2E2823;
  background: #1A1613;
}
.teaser-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  text-align: center;
}
.teaser-value {
  font-family: 'Dancing Script', cursive;
  font-size: 1.4rem;
  font-weight: 600;
  color: #C5A880;
  margin-bottom: 0.35rem;
}
.teaser-label {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C8C2B8;
}

@media (max-width: 480px) {
  .teaser-inner { grid-template-columns: 1fr; gap: 1.2rem; }
}
</style>
