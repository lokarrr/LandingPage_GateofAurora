(function() { 
  const sections = document.querySelectorAll("div[id$='-section']");
  const navLinks = document.querySelectorAll(".nav-link");
  
  // FIX: Target the correct content wrapper class
  const animatedWrappers = document.querySelectorAll('.content-section-wrapper'); 

  // --- 1. FORCE SCROLL TO TOP ON REFRESH ---
  // Ensures the page always starts at the top to see the first animation.
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0); 
  });
  
  window.addEventListener('load', () => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    // Manually remove hidden class from elements immediately in view (e.g., if Home is shorter than viewport)
    animatedWrappers.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.remove('section-hidden');
      }
    });
  });
  
  // --- 2. ACTIVE LINK LOGIC (UNCHANGED) ---

  function updateActiveLink() {
    let currentSection = "";
    const scrollY = window.scrollY; 

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(updateActiveLink, 100); 
    });
  });

  // --- 3. FADE-IN ANIMATION LOGIC (Intersection Observer) ---

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When visible, remove the hidden class to trigger the smooth slide-up
        entry.target.classList.remove('section-hidden');
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Threshold: Trigger when the element is 10% visible
    threshold: 0.1, 
    // Root Margin: Triggers the animation slightly sooner
    rootMargin: "0px 0px -50px 0px" 
  });

  // Start observing all content wrappers
  animatedWrappers.forEach((el) => {
    // Only observe elements that are initially hidden
    if (el.classList.contains('section-hidden')) {
        observer.observe(el);
    }
  });

})();