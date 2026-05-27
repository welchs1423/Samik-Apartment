<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <span class="footer-logo">Samik</span>
      <div class="footer-divider" aria-hidden="true">
        <span></span><span class="dot">·</span><span></span>
      </div>
      <p class="footer-note">Please drink responsibly. &nbsp;·&nbsp; 21+ only.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid #2E2823;
  background: #141210;
  margin-top: auto;
}
.footer-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1.8rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.footer-logo {
  font-family: 'Dancing Script', cursive;
  font-size: 1.3rem;
  font-weight: 700;
  color: #C5A880;
  letter-spacing: 0.02em;
}
.footer-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  opacity: 0.35;
}
.footer-divider span:first-child,
.footer-divider span:last-child {
  flex: 1;
  height: 1px;
  background: #C5A880;
  display: block;
}
.dot {
  color: #C5A880;
  font-size: 0.8rem;
  flex: none !important;
  height: auto !important;
  background: none !important;
}
.footer-note {
  font-family: 'Lato', system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: #C8C2B8;
}
@media (max-width: 500px) {
  .footer-divider { display: none; }
}
</style>
