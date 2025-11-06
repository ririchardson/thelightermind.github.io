document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('top-nav');
  const sentinel = document.getElementById('nav-sentinel');

  // IntersectionObserver to toggle "scrolled" class when sentinel leaves the viewport
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.classList.remove('scrolled');
      } else {
        nav.classList.add('scrolled');
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '0px'
  });

  io.observe(sentinel);



  // ---- Fade-in observer ----
  function observeFadeElements() { // 👈 wrapped in a function
    const fadeEls = document.querySelectorAll('.whole, .whole-dark, .split-left, .split-right');

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  }

  // Run once on page load
  observeFadeElements();

  // 👇 Make it accessible globally so blog.js can call it again
  window.observeFadeElements = observeFadeElements;



  // **Workaround for mobile: tiny scroll to trigger observer**
  window.addEventListener('load', () => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });



  const buttonLearnMore = document.getElementById("learn-more");

  if (buttonLearnMore) {
      buttonLearnMore.addEventListener("click", () => {
        window.location.href = "about.html";
      });
  }
});