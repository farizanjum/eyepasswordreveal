document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/complete') {
    document.querySelector('form').remove();
    document.querySelector('h1').textContent = 'All set.';
    document.getElementById('complete').hidden = false;
    return;
  }
  const body = document.body;
  const input = document.getElementById('password-input');
  const overlay = document.getElementById('password-overlay');
  const button = document.getElementById('eye-btn');
  const wrapper = document.getElementById('input-wrapper');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const masks = CSS.supports('mask-image', 'conic-gradient(black, transparent)') ||
    CSS.supports('-webkit-mask-image', 'conic-gradient(black, transparent)');
  let revealed = false;
  let eye;
  let timeout;
  let syncTimer;
  let pointerFrame;
  let point;
  let origin;

  function syncText() {
    const text = revealed && masks ? input.value : '';
    if (overlay.textContent !== text) overlay.textContent = text;
    overlay.scrollLeft = input.scrollLeft;
  }
  function position() {
    const rect = button.getBoundingClientRect();
    const field = wrapper.getBoundingClientRect();
    origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 - 28 };
    body.style.setProperty('--beam-x', `${origin.x}px`);
    body.style.setProperty('--beam-y', `${origin.y}px`);
    overlay.style.setProperty('--eye-x', `${origin.x - field.left}px`);
    overlay.style.setProperty('--eye-y', `${origin.y - field.top}px`);
    aim(field.left + 20, field.top + field.height / 2);
  }
  function aim(x, y) {
    const angle = Math.atan2(y - origin.y, x - origin.x) * 180 / Math.PI + 90;
    body.style.setProperty('--beam-angle', `${angle}deg`);
  }
  function renew() {
    clearTimeout(timeout);
    timeout = setTimeout(hide, 10000);
  }
  function hide() {
    revealed = false;
    body.classList.remove('reveal-active');
    input.type = 'password';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Show password');
    overlay.textContent = '';
    clearTimeout(timeout);
    clearInterval(syncTimer);
    cancelAnimationFrame(pointerFrame);
    pointerFrame = undefined;
    eye?.stop();
  }
  button.addEventListener('click', () => {
    if (revealed) { hide(); return; }
    revealed = true;
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Hide password');
    if (masks) {
      eye ??= createFireEye(document.getElementById('fire-eye'));
      position();
      syncText();
      body.classList.add('reveal-active');
      eye.start(motion.matches);
      // Some password managers change the value without input/change events.
      syncTimer = setInterval(syncText, 200);
    } else {
      input.type = 'text';
    }
    renew();
  });
  for (const event of ['input', 'change', 'scroll']) input.addEventListener(event, syncText);
  document.addEventListener('pointermove', (event) => {
    if (!revealed || !masks) return;
    point = { x: event.clientX, y: event.clientY };
    if (pointerFrame !== undefined) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = undefined;
      if (!revealed) return;
      aim(point.x, point.y);
      renew();
    });
  }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
  wrapper.addEventListener('focusout', (event) => {
    if (!wrapper.contains(event.relatedTarget)) hide();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.documentElement.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') hide();
  });
  document.addEventListener('pointercancel', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', hide);
  window.addEventListener('resize', () => { if (revealed && masks) position(); });
  window.addEventListener('scroll', () => { if (revealed && masks) position(); }, { passive: true });
  motion.addEventListener('change', hide);
  document.querySelector('form').addEventListener('submit', hide);
});
