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
    // Initialize the carousel and toggles after the window loads
    initCarousel(); 
    initToggleButtons(); // Restore toggle buttons initialization
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
      
      // Determine if the current scroll position is past the start of the section
      // adjusted by 1/3rd of the section height to trigger earlier
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
        // Optional: re-hide when scrolling away
        // entry.target.classList.add('section-hidden');
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

  // --- 7. VIDEO PLAYER FUNCTIONALITY ---
  
  const videoPlayer = document.getElementById('gameTrailer');
  const videoOverlay = document.getElementById('videoOverlay');
  const playButton = document.getElementById('playButton');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeSliderFill = document.getElementById('volumeSliderFill');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const videoProgress = document.getElementById('videoProgress');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const videoControls = document.getElementById('videoControls');

  // Format time from seconds to MM:SS
  function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Update volume slider fill
  function updateVolumeSliderFill() {
    const volume = videoPlayer.volume;
    volumeSlider.value = volume;
    volumeSliderFill.style.transform = `scaleX(${volume})`;
  }

  // Initialize video player
  function initVideoPlayer() {
      // Set video duration when metadata is loaded
      videoPlayer.addEventListener('loadedmetadata', () => {
          durationEl.textContent = formatTime(videoPlayer.duration);
          updateVolumeSliderFill();
      });
      
      // Update current time and progress bar as video plays
      videoPlayer.addEventListener('timeupdate', () => {
          const currentTime = videoPlayer.currentTime;
          const duration = videoPlayer.duration;
          
          // Update current time display
          currentTimeEl.textContent = formatTime(currentTime);
          
          // Update progress bar
          const progressPercent = (currentTime / duration) * 100;
          progressBar.style.width = `${progressPercent}%`;
          
          // Show controls when video is playing
          if (!videoPlayer.paused && !videoPlayer.ended) {
              videoControls.classList.add('visible');
          }
      });
      
      // Handle video play/pause
      function togglePlayPause() {
          if (videoPlayer.paused || videoPlayer.ended) {
              videoPlayer.play();
              playPauseBtn.classList.add('playing');
              videoOverlay.classList.add('hidden');
              videoControls.classList.add('visible');
          } else {
              videoPlayer.pause();
              playPauseBtn.classList.remove('playing');
          }
      }
      
      // Play button click
      playButton.addEventListener('click', togglePlayPause);
      playPauseBtn.addEventListener('click', togglePlayPause);
      
      // Volume slider change
      volumeSlider.addEventListener('input', (e) => {
          const volume = parseFloat(e.target.value);
          videoPlayer.volume = volume;
          videoPlayer.muted = volume === 0;
          updateVolumeSliderFill();
          
          // Update mute button state
          if (volume === 0) {
              volumeBtn.classList.add('muted');
          } else {
              volumeBtn.classList.remove('muted');
          }
      });
      
      // Volume button click (toggle mute/unmute)
      volumeBtn.addEventListener('click', () => {
          if (videoPlayer.muted) {
              videoPlayer.muted = false;
              videoPlayer.volume = volumeSlider.value > 0 ? parseFloat(volumeSlider.value) : 0.5;
              volumeSlider.value = videoPlayer.volume;
              volumeBtn.classList.remove('muted');
          } else {
              videoPlayer.muted = true;
              volumeBtn.classList.add('muted');
          }
          updateVolumeSliderFill();
      });
      
      // Update mute state when volume changes
      videoPlayer.addEventListener('volumechange', () => {
          if (videoPlayer.muted) {
              volumeBtn.classList.add('muted');
          } else {
              volumeBtn.classList.remove('muted');
          }
          updateVolumeSliderFill();
      });
      
      // Fullscreen toggle
      fullscreenBtn.addEventListener('click', () => {
          const videoContainer = videoPlayer.parentElement;
          
          if (!document.fullscreenElement) {
              if (videoContainer.requestFullscreen) {
                  videoContainer.requestFullscreen();
              } else if (videoContainer.webkitRequestFullscreen) {
                  videoContainer.webkitRequestFullscreen();
              }
              videoContainer.classList.add('fullscreen');
          } else {
              if (document.exitFullscreen) {
                  document.exitFullscreen();
              } else if (document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
              }
              videoContainer.classList.remove('fullscreen');
          }
      });
      
      // Exit fullscreen when ESC is pressed
      document.addEventListener('fullscreenchange', () => {
          const videoContainer = videoPlayer.parentElement;
          if (!document.fullscreenElement) {
              videoContainer.classList.remove('fullscreen');
          }
      });
      
      // Progress bar click to seek
      videoProgress.addEventListener('click', (e) => {
          const rect = videoProgress.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          videoPlayer.currentTime = pos * videoPlayer.duration;
      });
      
      // Show/hide controls on hover
      const videoContainer = videoPlayer.parentElement;
      let controlsTimeout;
      
      videoContainer.addEventListener('mouseenter', () => {
          clearTimeout(controlsTimeout);
          if (!videoPlayer.paused && !videoPlayer.ended) {
              videoControls.classList.add('visible');
          }
      });
      
      videoContainer.addEventListener('mouseleave', () => {
          if (!videoPlayer.paused && !videoPlayer.ended) {
              controlsTimeout = setTimeout(() => {
                  videoControls.classList.remove('visible');
              }, 2000);
          }
      });
      
      // Handle video end
      videoPlayer.addEventListener('ended', () => {
          playPauseBtn.classList.remove('playing');
          videoOverlay.classList.remove('hidden');
          videoControls.classList.remove('visible');
          progressBar.style.width = '0%';
          currentTimeEl.textContent = '0:00';
      });
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
          if (e.target === videoPlayer || document.fullscreenElement) {
              switch(e.key.toLowerCase()) {
                  case ' ':
                  case 'k':
                      e.preventDefault();
                      togglePlayPause();
                      break;
                  case 'm':
                      e.preventDefault();
                      videoPlayer.muted = !videoPlayer.muted;
                      break;
                  case 'arrowup':
                      e.preventDefault();
                      videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
                      volumeSlider.value = videoPlayer.volume;
                      updateVolumeSliderFill();
                      break;
                  case 'arrowdown':
                      e.preventDefault();
                      videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
                      volumeSlider.value = videoPlayer.volume;
                      updateVolumeSliderFill();
                      break;
                  case 'f':
                      e.preventDefault();
                      fullscreenBtn.click();
                      break;
                  case 'arrowleft':
                      e.preventDefault();
                      videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 10);
                      break;
                  case 'arrowright':
                      e.preventDefault();
                      videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 10);
                      break;
              }
          }
      });
  }

  // Initialize video player when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
      if (videoPlayer) {
          initVideoPlayer();
      }
  });

  // --- 8. CAROUSEL/SLIDER FUNCTIONALITY (JS Game Loop) ---
  
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track) return;

    // --- Configuration ---
    const autoScrollSpeed = 1; // Pixels per frame (Adjust for speed)
    let isPaused = false;
    let isDragging = false;
    
    // --- State ---
    let currentX = 0;
    let startX = 0;
    let dragStartX = 0;
    let targetX = null; // For button navigation smoothing

    // --- Setup Clones ---
    // We need enough clones to fill the screen twice to ensure seamless looping
    const originalSlides = Array.from(track.children);
    
    // Clone logic: Append original set to end, and prepend to start
    originalSlides.forEach(slide => {
      const cloneEnd = slide.cloneNode(true);
      cloneEnd.classList.add('clone');
      track.appendChild(cloneEnd);
    });

    // Get all slides now including clones
    let allSlides = Array.from(track.querySelectorAll('.carousel-slide'));
    
    // --- Metrics ---
    // We calculate these dynamically to support responsive resizing
    function getMetrics() {
      const slide = allSlides[0];
      const style = window.getComputedStyle(slide);
      const width = slide.offsetWidth;
      const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      const fullSlideWidth = width + margin;
      
      // The width of one complete set of original slides
      const singleSetWidth = fullSlideWidth * originalSlides.length;
      
      return { fullSlideWidth, singleSetWidth };
    }

    // --- Interaction Event Listeners ---

    // 1. Pause on Hover (Desktop) / Touch (Mobile)
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => {
      if (!isDragging) isPaused = false;
    });
    
    // 2. Touch/Drag Logic
    const handleDragStart = (x) => {
      isDragging = true;
      isPaused = true;
      startX = x;
      dragStartX = currentX;
      track.style.cursor = 'grabbing';
      // Cancel any button animation
      targetX = null; 
    };

    const handleDragMove = (x) => {
      if (!isDragging) return;
      const diff = x - startX;
      currentX = dragStartX + diff;
    };

    const handleDragEnd = () => {
      isDragging = false;
      // Resume auto-scroll if mouse leaves, otherwise wait for mouseleave event
      track.style.cursor = 'grab';
    };

    // Mouse Events
    track.addEventListener('mousedown', e => {
      e.preventDefault(); // Prevent text selection
      handleDragStart(e.clientX);
    });
    window.addEventListener('mousemove', e => handleDragMove(e.clientX));
    window.addEventListener('mouseup', handleDragEnd);

    // Touch Events
    track.addEventListener('touchstart', e => handleDragStart(e.touches[0].clientX), { passive: false });
    track.addEventListener('touchmove', e => handleDragMove(e.touches[0].clientX), { passive: false });
    track.addEventListener('touchend', handleDragEnd);

    // 3. Arrow Navigation
    function moveSlide(direction) {
      const { fullSlideWidth } = getMetrics();
      
      // If we are already animating to a target, update it, otherwise start from current
      const startPos = targetX !== null ? targetX : currentX;
      
      // Set target (Move 1 slide width)
      targetX = startPos - (direction * fullSlideWidth);
      isPaused = true; // Pause auto-scroll while animating manually
      
      // Auto-resume after animation (optional, creates a nice 'pause after click' feel)
      setTimeout(() => {
        targetX = null;
        if (!track.matches(':hover')) isPaused = false;
      }, 600);
    }

    nextBtn.addEventListener('click', () => moveSlide(1)); // Move Left (Next)
    prevBtn.addEventListener('click', () => moveSlide(-1)); // Move Right (Prev)


    // --- The Main Loop (RequestAnimationFrame) ---
    function animate() {
      const { singleSetWidth } = getMetrics();

      // 1. Handle Automatic Movement
      if (!isDragging && targetX === null) {
        if (!isPaused) {
          currentX -= autoScrollSpeed;
        }
      } 
      // 2. Handle Button Animation (Smooth Lerp)
      else if (targetX !== null) {
        // Linear Interpolation (Lerp) for smooth easing
        currentX += (targetX - currentX) * 0.1;
        
        // Snap when close enough
        if (Math.abs(targetX - currentX) < 0.5) {
          currentX = targetX;
          targetX = null; // Stop button animation
        }
      }

      // 3. Handle Infinite Loop Boundaries (Seamless Teleport)
      // If we've scrolled past the entire first set of slides...
      if (currentX <= -singleSetWidth) {
        // Teleport back to 0 (plus whatever overlap to be seamless)
        currentX += singleSetWidth;
        // Adjust target if we were animating across the boundary
        if (targetX !== null) targetX += singleSetWidth;
        dragStartX += singleSetWidth;
      } 
      // If we've dragged too far right (into positive territory)...
      else if (currentX > 0) {
        currentX -= singleSetWidth;
        if (targetX !== null) targetX -= singleSetWidth;
        dragStartX -= singleSetWidth;
      }

      // 4. Apply Transform
      track.style.transform = `translateX(${currentX}px)`;

      requestAnimationFrame(animate);
    }

    // Start
    animate();
  }

  // --- 9. MECHANICS TOGGLE FUNCTIONALITY (Restored) ---
  
  function initToggleButtons() {
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
  }

  // --- 10. SCREENSHOT ZOOM MODAL FUNCTIONALITY ---

const screenshotModal = document.getElementById('screenshot-modal');
const screenshotModalClose = document.querySelector('.screenshot-modal-close');
const screenshotModalImage = document.getElementById('modal-screenshot-image');
const screenshotModalCaption = document.getElementById('modal-screenshot-caption');
const screenshotItems = document.querySelectorAll('.screenshot-item');

// Open screenshot modal when screenshot is clicked
screenshotItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const screenshotImg = item.querySelector('.game-screenshot');
    const caption = item.querySelector('.screenshot-caption');
    
    // Set modal content
    screenshotModalImage.src = screenshotImg.src;
    screenshotModalImage.alt = screenshotImg.alt;
    
    // Set caption if exists
    if (caption) {
      screenshotModalCaption.textContent = caption.textContent;
      screenshotModalCaption.style.display = 'block';
    } else {
      screenshotModalCaption.style.display = 'none';
    }
    
    // Show modal
    screenshotModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close screenshot modal when X is clicked
screenshotModalClose.addEventListener('click', () => {
  screenshotModal.classList.remove('active');
  screenshotModalImage.style.transform = 'scale(1)';
  document.body.style.overflow = '';
});

// Close screenshot modal when clicking outside the image
screenshotModal.addEventListener('click', (e) => {
  if (e.target === screenshotModal || e.target.classList.contains('screenshot-modal-content')) {
    screenshotModal.classList.remove('active');
    screenshotModalImage.style.transform = 'scale(1)';
    document.body.style.overflow = '';
  }
});

// Close screenshot modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && screenshotModal.classList.contains('active')) {
    screenshotModal.classList.remove('active');
    screenshotModalImage.style.transform = 'scale(1)';
    document.body.style.overflow = '';
  }
});

// Zoom in/out on mouse wheel
screenshotModalImage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const currentScale = parseFloat(screenshotModalImage.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
  const newScale = e.deltaY > 0 ? Math.max(0.5, currentScale - 0.1) : Math.min(3, currentScale + 0.1);
  screenshotModalImage.style.transform = `scale(${newScale})`;
  screenshotModalImage.style.maxWidth = 'none'; // Remove max-width constraint when zooming
  screenshotModalImage.style.maxHeight = 'none'; // Remove max-height constraint when zooming
});

// Reset zoom when closing modal
screenshotModalClose.addEventListener('click', () => {
  screenshotModalImage.style.transform = 'scale(1)';
  screenshotModalImage.style.maxWidth = '100%';
  screenshotModalImage.style.maxHeight = '100%';
});

screenshotModal.addEventListener('click', (e) => {
  if (e.target === screenshotModal) {
    screenshotModalImage.style.transform = 'scale(1)';
    screenshotModalImage.style.maxWidth = '100%';
    screenshotModalImage.style.maxHeight = '100%';
  }
});

// --- 11. NEWSLETTER FORM FUNCTIONALITY - FIXED ---

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterInput = document.querySelector('.newsletter-input');
const newsletterButton = document.querySelector('.newsletter-button');

if (newsletterForm) {
  // Ensure form elements are properly centered on load
  document.addEventListener('DOMContentLoaded', () => {
    newsletterForm.style.display = 'flex';
    newsletterForm.style.justifyContent = 'center';
    newsletterForm.style.alignItems = 'center';
    newsletterForm.style.width = '100%';
    
    if (newsletterInput) {
      newsletterInput.style.textAlign = 'center';
      newsletterInput.style.width = '100%';
    }
    
    if (newsletterButton) {
      newsletterButton.style.textAlign = 'center';
    }
  });
  
  newsletterButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = newsletterInput.value.trim();
    
    if (!email) {
      showNewsletterMessage('Please enter your email address.', 'error');
      newsletterInput.focus();
      return;
    }
    
    if (!validateEmail(email)) {
      showNewsletterMessage('Please enter a valid email address.', 'error');
      newsletterInput.focus();
      return;
    }
    
    // Simulate form submission
    showNewsletterMessage('Thank you for subscribing! You will receive updates soon.', 'success');
    newsletterInput.value = '';
    
    // In a real implementation, you would send the data to a server here
    console.log('Newsletter subscription:', email);
  });
  
  // Also allow form submission with Enter key
  newsletterInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      newsletterButton.click();
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showNewsletterMessage(message, type) {
  // Remove any existing message
  const existingMessage = document.querySelector('.newsletter-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `newsletter-message newsletter-${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin-top: 15px;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    ${type === 'success' ? 
      'background: rgba(0, 200, 100, 0.2); color: #00ff88; border: 1px solid #00ff88;' : 
      'background: rgba(255, 100, 100, 0.2); color: #ff5555; border: 1px solid #ff5555;'}
  `;
  
  // Insert after the form
  newsletterForm.parentNode.insertBefore(messageEl, newsletterForm.nextSibling);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.style.opacity = '0';
      messageEl.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 500);
    }
  }, 5000);
}


})();