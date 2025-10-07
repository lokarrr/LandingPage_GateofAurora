(function() {
  const sections = document.querySelectorAll("div[id$='-section']");
  const navLinks = document.querySelectorAll(".nav-link");

  // --- NEW CODE: Force scroll to top on initial load ---
  if (window.location.hash) {
    // Check if the URL contains a fragment (e.g., #media-section)
    history.replaceState(null, null, ' '); 
    // This removes the fragment from the URL without reloading the page.
  }
  
  // Also, physically scroll the window to the top (0, 0)
  window.scrollTo(0, 0); 

  function updateActiveLink() {
    // ... (rest of your function remains the same)
    let currentSectionId = "";
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop - sectionHeight / 3) { 
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  // --- Event Listeners ---

  // Run on scroll
  window.addEventListener("scroll", updateActiveLink);

  // Run on click (for instant update before smooth scroll finishes)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(updateActiveLink, 100); 
    });
  });

})();