(function() { 
  const sections = document.querySelectorAll("div[id$='-section']");
  const navLinks = document.querySelectorAll(".nav-link");
  const animatedWrappers = document.querySelectorAll('.content-section-wrapper'); 
  
  // Hamburger menu elements
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  // --- 1. FORCE SCROLL TO TOP ON REFRESH ---
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0); 
  });
  
  window.addEventListener('load', () => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    animatedWrappers.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.remove('section-hidden');
      }
    });
  });
  
  // --- 2. HAMBURGER MENU FUNCTIONALITY ---
  
  function openMenu() {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  // Open menu when hamburger button is clicked
  hamburgerBtn.addEventListener('click', openMenu);

  // Close menu when close button is clicked
  closeBtn.addEventListener('click', closeMenu);

  // Close menu when overlay is clicked
  navOverlay.addEventListener('click', closeMenu);

  // Close menu when any nav link is clicked (smooth scroll to section)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
    });
  });

  // --- 3. ACTIVE LINK LOGIC ---

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

  // --- 4. FADE-IN ANIMATION LOGIC (Intersection Observer) ---

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('section-hidden');
      } else {
        entry.target.classList.add('section-hidden');
      }
    });
  }, {
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px" 
  });

  animatedWrappers.forEach((el) => {
    observer.observe(el);
  });

  // --- 5. BACK TO TOP BUTTON LOGIC ---
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

})();