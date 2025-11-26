(function() { 
  const sections = document.querySelectorAll("div[id$='-section']");
  const navLinks = document.querySelectorAll(".nav-link");
  
  // Target the correct content wrapper class for animations
  const animatedWrappers = document.querySelectorAll('.content-section-wrapper'); 

  // --- 1. FORCE SCROLL TO TOP ON REFRESH ---
  // Ensures the page always starts at the top to see the first animation properly.
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0); 
  });
  
  window.addEventListener('load', () => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    // Manually remove hidden class from elements immediately in view 
    // (This handles cases where the first section is already visible on load)
    animatedWrappers.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.remove('section-hidden');
      }
    });
  });
  
  // --- 2. ACTIVE LINK LOGIC ---

  function updateActiveLink() {
    let currentSection = "";
    const scrollY = window.scrollY; 

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // logic: checks if we have scrolled past 1/3rd of the section
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

  // Listen for scroll events to update the active link in the navbar
  window.addEventListener("scroll", updateActiveLink);

  // Note: The previous click listener with setTimeout was removed 
  // to allow the scroll listener to handle updates naturally.

  // --- 3. FADE-IN ANIMATION LOGIC (Intersection Observer) ---

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // WHEN VISIBLE: Remove the hidden class to trigger the smooth slide-up
        entry.target.classList.remove('section-hidden');
      } else {
        // WHEN HIDDEN: Add the class back so the animation can play again next time
        entry.target.classList.add('section-hidden');
      }
    });
  }, {
    // Threshold: Trigger when the element is 10% visible
    threshold: 0.1, 
    // Root Margin: Triggers the animation slightly sooner as you scroll down
    rootMargin: "0px 0px -50px 0px" 
  });

  // Start observing all content wrappers
  animatedWrappers.forEach((el) => {
    // Start observing everything; the 'section-hidden' class controls the state
    observer.observe(el);
  });

})();