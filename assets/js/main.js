(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Compass: swings toward the pointer on devices with a mouse, idles otherwise
  const compass = document.getElementById('compass');
  if (compass && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const MAX = 28; // degrees
    let timer;
    addEventListener('pointermove', (e) => {
      const r = compass.getBoundingClientRect();
      const cx = r.left + r.width * 0.505;
      const cy = r.top + r.height * 0.5;
      // angle from "north" (straight up) to the pointer, eased and clamped
      const a = Math.atan2(e.clientX - cx, cy - e.clientY) * 180 / Math.PI;
      const deg = Math.max(-MAX, Math.min(MAX, a * 0.35));
      compass.classList.remove('idle');
      compass.style.transform = `rotate(${deg}deg)`;
      clearTimeout(timer);
      timer = setTimeout(() => {
        compass.style.transform = '';
        compass.classList.add('idle');
      }, 2500);
    }, { passive: true });
  }

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Contact form (Web3Forms)
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    const say = (msg, cls) => { status.textContent = msg; status.className = 'form-status ' + (cls || ''); };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('[required]')];
      let firstBad = null;
      fields.forEach((f) => {
        const bad = !f.value.trim() || (f.type === 'email' && !f.validity.valid);
        f.classList.toggle('invalid', bad);
        f.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) { say('Please fill in the highlighted fields.', 'err'); firstBad.focus(); return; }
      if (form.access_key.value.startsWith('YOUR_')) {
        say('The form is not connected yet. Please check back soon.', 'err');
        return;
      }
      btn.disabled = true;
      say('Sending...');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Request failed');
        form.reset();
        say('Thanks! Your message is on its way. I will reply soon.', 'ok');
      } catch (err) {
        say('Something went wrong sending that. Please try again in a moment.', 'err');
      } finally {
        btn.disabled = false;
      }
    });
  }

  // Path line progress
  const pathEl = document.querySelector('.path');
  if (pathEl) {
    if (reduced) {
      pathEl.style.setProperty('--p', 1);
    } else {
      let ticking = false;
      const update = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        pathEl.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : 0);
        ticking = false;
      };
      addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener('resize', update);
      update();
    }
  }

  // Scroll-in reveals
  if (!reduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-head, .card, .tile, .steps li, .about-photo, .about-copy, .contact-copy, .form');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('in');
        io.unobserve(el);
        // drop the helper classes afterwards so hover transforms keep working
        setTimeout(() => el.classList.remove('reveal', 'in'), 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--d', ((i % 3) * 0.08).toFixed(2) + 's');
      io.observe(el);
    });
  }
})();
