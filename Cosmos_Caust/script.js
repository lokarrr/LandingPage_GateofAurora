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

  // --- 6. CINEMATIC CHARACTER MODAL FUNCTIONALITY ---
  
  const characterModal = document.getElementById('character-modal');
  const modalClose = document.querySelector('.modal-close');
  const cinematicCards = document.querySelectorAll('.cinematic-card');
  
  // Character data for modal stats (randomized for demonstration)
  const characterStats = {
    1: { difficulty: 85, aggression: 70, speed: 90 }, // Robotic Protagonist
    2: { difficulty: 30, aggression: 80, speed: 95 }, // Pink Dinosaur
    3: { difficulty: 40, aggression: 60, speed: 50 }, // Mushroom Cap
    4: { difficulty: 95, aggression: 90, speed: 40 }, // Spiked Boss
    5: { difficulty: 70, aggression: 75, speed: 60 }, // Vault Wizard
    6: { difficulty: 80, aggression: 85, speed: 70 }  // Dark Summoner
  };

  // Open modal when character card is clicked
  cinematicCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const characterId = card.getAttribute('data-character');
      const imageSrc = card.querySelector('.cinematic-image').src;
      const name = card.querySelector('.cinematic-name').textContent;
      const role = card.querySelector('.cinematic-role').textContent;
      const description = card.querySelector('.cinematic-description p').textContent;
      
      // Set modal content
      document.getElementById('modal-character-image').src = imageSrc;
      document.getElementById('modal-character-name').textContent = name;
      document.getElementById('modal-character-role').textContent = role;
      document.getElementById('modal-character-description').textContent = description;
      
      // Set and animate stats
      const stats = characterStats[characterId];
      setTimeout(() => {
        document.getElementById('stat-difficulty').style.width = stats.difficulty + '%';
        document.getElementById('stat-aggression').style.width = stats.aggression + '%';
        document.getElementById('stat-speed').style.width = stats.speed + '%';
      }, 100);
      
      // Show modal
      characterModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal when X is clicked
  modalClose.addEventListener('click', () => {
    characterModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close modal when clicking outside the modal content
  characterModal.addEventListener('click', (e) => {
    if (e.target === characterModal) {
      characterModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && characterModal.classList.contains('active')) {
      characterModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // --- 7. MECHANICS TOGGLE FUNCTIONALITY ---

  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const toggleContents = document.querySelectorAll('.toggle-content');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      toggleContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding content
      const toggleType = button.getAttribute('data-toggle');
      const contentId = `${toggleType}-content`;
      const contentElement = document.getElementById(contentId);
      
      if (contentElement) {
        contentElement.classList.add('active');
      }
    });
  });

  // --- 8. MECHANICS GALLERY HOVER EFFECTS ---

  const mechanicsCards = document.querySelectorAll('.mechanics-visual-card');

  mechanicsCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Pause the floating animation on hover
      card.style.animationPlayState = 'paused';
    });
    
    card.addEventListener('mouseleave', () => {
      // Resume the floating animation
      card.style.animationPlayState = 'running';
    });
  });

})();