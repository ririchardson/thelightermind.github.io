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
  function observeFadeElements() { // wrapped in a function
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

  // Make it accessible globally so blog.js can call it again
  window.observeFadeElements = observeFadeElements;



  // **Workaround for mobile: tiny scroll to trigger observer**
  window.addEventListener('load', () => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });



  const buttonLearnMore = document.getElementById("learn-more");
  const buttonSchedule = document.getElementById("schedule");

  if (buttonLearnMore) {
    buttonLearnMore.addEventListener("click", () => {
      window.location.href = "about.html";
    });
  }
  if (buttonSchedule) {
    buttonSchedule.addEventListener("click", () => {
      window.location.href = "schedule.html";
    });
  }
});



// ===============================
// GLOBAL DISCLAIMER POPUP SYSTEM
// (SHOWS EVERY PAGE LOAD — NO CACHING)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const disclaimer = document.getElementById('disclaimer-overlay');
  const acceptBtn = document.getElementById('disclaimer-accept');
  const closeBtn = document.getElementById('disclaimer-close');

  if (!disclaimer || !acceptBtn) return;

  // ALWAYS show on load
  disclaimer.classList.add('active');
  document.body.classList.add('disclaimer-lock');

  function closeDisclaimer() {
    disclaimer.classList.remove('active');
    document.body.classList.remove('disclaimer-lock');
  }

  acceptBtn.addEventListener('click', closeDisclaimer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDisclaimer);
  }
});

// ===============================
// SESSION BOOKING FLOW
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  const typeCards = document.querySelectorAll('.session-card');
  const formatTitle = document.getElementById('format-title');
  const formatSelect = document.getElementById('format-select');
  const calendarWrapper = document.getElementById('calendar-wrapper');

  let selectedType = null;
  let selectedFormat = null;

  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));

      card.classList.add('selected');
      selectedType = card.dataset.type;

      formatTitle.classList.remove('hidden');
      formatSelect.classList.remove('hidden');

      formatTitle.classList.add('fade-block');
      formatSelect.classList.add('fade-block');

      calendarWrapper.classList.add('hidden');
    });
  });

  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedFormat = btn.dataset.format;

      calendarWrapper.classList.remove('hidden');
      calendarWrapper.classList.add('fade-block');

      // Placeholder for Google Sheet hook later
      console.log('Session type:', selectedType);
      console.log('Format:', selectedFormat);
    });
  });

});
