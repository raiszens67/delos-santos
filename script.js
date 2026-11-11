(function () {
  var root = document.documentElement;

  // Theme toggle (remembered per browser)
  var themeBtn = document.getElementById('themeBtn');
  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function paintIcon() { themeBtn.textContent = currentTheme() === 'dark' ? '☀' : '☾'; }
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  paintIcon();
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintIcon();
  });

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var navList = document.getElementById('navList');
  menuBtn.addEventListener('click', function () {
    var open = navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Project filters
  var buttons = document.querySelectorAll('.filters button');
  var cards = document.querySelectorAll('.project');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    });
  });

  // Contact form validation
  var form = document.getElementById('contactForm');
  function setErr(id, text) { document.getElementById(id).textContent = text; return !text; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var msg = form.msg.value.trim();
    var ok = true;
    ok = setErr('nameErr', name ? '' : 'Enter your name.') && ok;
    ok = setErr('emailErr', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.') && ok;
    ok = setErr('msgErr', msg ? '' : 'Write a message.') && ok;
    var status = document.getElementById('status');
    if (!ok) { status.textContent = ''; return; }
    // Replace with your own email address:
    var to = 'you@example.com';
    var body = encodeURIComponent(msg + '\n\n– ' + name + ' (' + email + ')');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + body;
    status.textContent = 'Opening your email app to send the message.';
    form.reset();
  });

  // Highlight the nav link for the section in view
  var links = document.querySelectorAll('nav a[href^="#"]');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { io.observe(s); });

  document.getElementById('year').textContent = new Date().getFullYear();
})();