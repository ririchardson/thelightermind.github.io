document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('top-nav');
  const sentinel = document.getElementById('nav-sentinel');

  if (!nav || !sentinel) {
    console.warn('Missing #top-nav or #nav-sentinel — make sure the sentinel is right after #top.');
    return;
  }

  // IntersectionObserver to toggle "scrolled" class when sentinel leaves the viewport
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // sentinel is visible -> we're at the top -> remove class
        nav.classList.remove('scrolled');
      } else {
        // sentinel gone -> user scrolled past #top -> add class
        nav.classList.add('scrolled');
      }
    });
  }, {
    root: null,         // viewport
    threshold: 0,       // fire as soon as any part crosses
    rootMargin: '0px'
  });

  io.observe(sentinel);



  const fadeEls = document.querySelectorAll('.whole, .whole-dark, .split-left, .split-right');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target); // stops observing once faded in
      }
    });
  }, { threshold: 0.15 }); // triggers when 15% visible

  fadeEls.forEach(el => observer.observe(el));

  // **Workaround for mobile: tiny scroll to trigger observer**
  window.addEventListener('load', () => {
    window.scrollBy(0, 1); // scroll down 1px
    window.scrollBy(0, -1); // scroll back up 1px
  });
});