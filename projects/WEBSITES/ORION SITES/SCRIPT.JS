const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const summary = `Thank you, ${name || 'builder'}!\n\nEmail: ${email || 'not provided'}\nMessage: ${message || 'No message entered.'}`;

    alert(summary);
    form.reset();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const waypoint = document.querySelector('.hero-panel');
  if (!waypoint) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(waypoint);
});

// Window control buttons: minimize, restore, close
document.addEventListener('DOMContentLoaded', () => {
  const minimizeBtn = document.querySelector('.wc-minimize');
  const restoreBtn = document.querySelector('.wc-restore');
  const closeBtn = document.querySelector('.wc-close');
  const reopenBtn = document.getElementById('reopenBtn');
  const dismissBtn = document.getElementById('dismissBtn');

  function setMinimized(min) {
    if (min) {
      document.documentElement.classList.add('site-minimized');
      if (minimizeBtn) minimizeBtn.style.display = 'none';
      if (restoreBtn) restoreBtn.style.display = 'inline-block';
    } else {
      document.documentElement.classList.remove('site-minimized');
      if (minimizeBtn) minimizeBtn.style.display = 'inline-block';
      if (restoreBtn) restoreBtn.style.display = 'none';
    }
  }

  function setClosed(closed) {
    if (closed) {
      document.documentElement.classList.add('site-closed');
      const overlay = document.getElementById('closedOverlay');
      if (overlay) { overlay.hidden = false; }
    } else {
      document.documentElement.classList.remove('site-closed');
      const overlay = document.getElementById('closedOverlay');
      if (overlay) { overlay.hidden = true; }
    }
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => setMinimized(true));
  }
  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => setMinimized(false));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => setClosed(true));
  }
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => setClosed(false));
  }
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      const overlay = document.getElementById('closedOverlay');
      if (overlay) overlay.hidden = true;
    });
  }
});
