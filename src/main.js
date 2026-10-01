document.documentElement.classList.add('js');

// Nav: solid on scroll + mobile menu
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
const setMenu = open => {
  burger.setAttribute('aria-expanded', open);
  links.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.closest('.hero')) el.style.setProperty('--d', `${(i % 3) * 0.08}s`);
  io.observe(el);
});

// Pre-select enquiry type from service cards
const enq = document.getElementById('enqType');
document.querySelectorAll('[data-type]').forEach(a => a.addEventListener('click', () => {
  enq.value = a.dataset.type;
}));

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const items = [...document.querySelectorAll('.m-item')];
let idx = 0;
const show = i => {
  idx = (i + items.length) % items.length;
  const it = items[idx];
  lbImg.src = it.dataset.full;
  lbImg.alt = it.querySelector('img').alt;
};
items.forEach((it, i) => it.addEventListener('click', () => { show(i); lb.showModal(); }));
document.getElementById('lbClose').onclick = () => lb.close();
document.getElementById('lbPrev').onclick = () => show(idx - 1);
document.getElementById('lbNext').onclick = () => show(idx + 1);
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});
let tx = 0;
lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
});

// Instagram embeds — load only when near viewport
const ig = document.getElementById('igGrid');
if (ig) {
  const igo = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    igo.disconnect();
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(s);
  }, { rootMargin: '600px' });
  igo.observe(ig);
}

// Enquiry form (FormSubmit AJAX, with graceful fallback)
const form = document.getElementById('enquiry');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
    f.closest('.field').classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) { status.textContent = 'Please complete the highlighted fields.'; return; }
  form.classList.add('sending');
  status.textContent = 'Sending…';
  try {
    const res = await fetch('https://formsubmit.co/ajax/bobyballi@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'failed');
    form.reset();
    status.textContent = 'Thank you — your enquiry has been received. Anjali’s team will be in touch soon.';
  } catch {
    const fd = new FormData(form);
    const body = [...fd].filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k.replace('_', ' ')}: ${v}`).join('\n');
    status.innerHTML = 'We couldn’t send that automatically. <a href="mailto:bobyballi@gmail.com?subject=' +
      encodeURIComponent('Enquiry — ' + (fd.get('enquiry_type') || 'theanjali.co.nz')) + '&body=' + encodeURIComponent(body) +
      '" style="text-decoration:underline">Email us directly instead</a>.';
  } finally {
    form.classList.remove('sending');
  }
});

document.getElementById('yr').textContent = new Date().getFullYear();
