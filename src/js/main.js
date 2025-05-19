// main.js - Version complète et corrigée
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeHeader();
  initializeHero();
  initializeSpecialties();
  initializeContactForm();
  
  // Add scroll animations
  initializeScrollAnimations();
  
  // Handle lazy loading
  initializeLazyLoading();
  
  // Fix for mobile images - run after a short delay
  setTimeout(fixMobileImages, 1000);
  
  // Run image fix on window resize
  window.addEventListener('resize', fixMobileImages);
  
  // Initialize Science section enhancements
  initScienceSection();
  improveScienceSectionMobile();
  
  // Run mobile-specific animations
  if (window.innerWidth < 768) {
    addTouchInteractions();
    improveMobileAnimations();
  }
  
  // Initialize clinic finder functionality
  initClinicFinder();
});

// Header functionality
function initializeHeader() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  
  // Handle scroll effects
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Check initial scroll position
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
  
  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      
      const isOpen = header.classList.contains('menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      // Toggle icon
      const icon = menuToggle.querySelector('i');
      if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Language dropdowns - handle ALL language toggles
  const langToggles = document.querySelectorAll('.lang-toggle');
  
  langToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const langSelector = this.closest('.lang-selector');
      
      // Close all other language selectors first
      document.querySelectorAll('.lang-selector').forEach(selector => {
        if (selector !== langSelector) {
          selector.classList.remove('open');
        }
      });
      
      // Toggle this selector
      langSelector.classList.toggle('open');
      
      const isOpen = langSelector.classList.contains('open');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  
  // Handle language option selection
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get selected language code and text
      const lang = this.getAttribute('href').replace('#', '');
      const languageText = this.textContent.trim();
      
      // Update all toggle buttons with selected language
      document.querySelectorAll('.lang-toggle span').forEach(span => {
        span.textContent = lang.toUpperCase();
      });
      
      // Update active state on all option links
      document.querySelectorAll('.lang-option').forEach(opt => {
        if (opt.getAttribute('href') === this.getAttribute('href')) {
          opt.classList.add('active');
          opt.setAttribute('aria-current', 'true');
        } else {
          opt.classList.remove('active');
          opt.setAttribute('aria-current', 'false');
        }
      });
      
      // Close all dropdowns
      document.querySelectorAll('.lang-selector').forEach(selector => {
        selector.classList.remove('open');
      });
      
      // Set all toggles to not expanded
      document.querySelectorAll('.lang-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  });
  
  // Close language selectors when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-selector')) {
      document.querySelectorAll('.lang-selector').forEach(selector => {
        selector.classList.remove('open');
      });
      
      document.querySelectorAll('.lang-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
  
  // Handle anchor links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Close mobile menu if open
      if (header.classList.contains('menu-open')) {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
      
      // Smooth scroll to section
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Hero section functionality
function initializeHero() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroVideo = document.getElementById('hero-video');
  const highlights = document.querySelectorAll('.highlight');
  
  // Optimize video for mobile
  if (heroVideo) {
    if (window.innerWidth < 768) {
      heroVideo.pause();
      heroVideo.remove();
    }
  }
  
  // Scroll indicator
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      const nextSection = document.querySelector('.hero-section + section');
      if (nextSection) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Handle highlight tooltips
  if (highlights.length > 0) {
    highlights.forEach(highlight => {
      highlight.addEventListener('mouseenter', function(e) {
        const tooltipText = getTooltipContent(this.textContent.trim());
        createTooltip(tooltipText, e, this);
      });
      
      highlight.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.hero-highlight-tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }
  
  function getTooltipContent(highlightText) {
    const tooltipContent = {
      'Diaeta': 'Du latin "diaeta", mode de vie équilibré basé sur des principes scientifiques.',
      'science de la nutrition': 'Approche basée sur les dernières recherches scientifiques en nutrition.',
      'personnalisée': 'Adaptée à votre métabolisme, vos préférences et votre mode de vie.',
      'art de vivre': 'L\'équilibre parfait entre plaisir gustatif et nutrition optimale.'
    };
    
    return tooltipContent[highlightText] || 'Une approche scientifique de la nutrition';
  }
  
  function createTooltip(text, event, element) {
    // Remove any existing tooltips
    const existingTooltip = document.querySelector('.hero-highlight-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('hero-highlight-tooltip');
    tooltip.textContent = text;
    
    // Position tooltip
    document.body.appendChild(tooltip);
    
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    const top = elementRect.top - tooltipRect.height - 10;
    const left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    
    // Show tooltip with animation
    setTimeout(() => {
      tooltip.classList.add('visible');
    }, 10);
  }
}

// Specialties section functionality
function initializeSpecialties() {
  // Handle modal loading
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      // Load any deferred content
      const lazyImages = modal.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    });
  });
}

// Contact Form functionality
function initializeContactForm() {
  const form = document.getElementById('appointmentForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const serviceType = document.getElementById('serviceType').value;
      
      if (!fullName || !email || !phone || !serviceType) {
        showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
      }
      
      // Phone validation
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        showFormMessage('Veuillez entrer un numéro de téléphone valide.', 'error');
        return;
      }
      
      // If validation passes, show success message (in a real app, you would submit form to server)
      showFormMessage('Votre rendez-vous a été pris en compte. Nous vous contacterons prochainement pour confirmer.', 'success');
      
      // Reset form
      form.reset();
    });
  }
  
  function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.classList.add('form-message', `form-message-${type}`);
    messageEl.textContent = message;
    
    // Add to form
    form.appendChild(messageEl);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove after delay for success messages
    if (type === 'success') {
      setTimeout(() => {
        messageEl.remove();
      }, 5000);
    }
  }
}

// Scroll animations - Improved with backup animation trigger
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05, // Lower threshold for increased sensitivity
    rootMargin: '0px 0px -5% 0px'
  });
  
  // Observe elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Failsafe: Add animated class after a delay to ensure animations are shown
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      if (!el.classList.contains('animated')) {
        el.classList.add('animated');
      }
    });
  }, 1500);
}

// Lazy loading - Enhanced for better mobile support
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src], .lazy-background');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
            element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
            element.classList.remove('lazy-background');
          }
          
          imageObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(element => {
      if (element.tagName === 'IMG') {
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
      } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
        element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
        element.classList.remove('lazy-background');
      }
    });
  }
  
  // For mobile devices, load all images immediately after a short delay
  if (window.innerWidth < 768) {
    setTimeout(() => {
      document.querySelectorAll('img[data-src], .lazy-background').forEach(element => {
        if (element.tagName === 'IMG' && element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
          element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
          element.classList.remove('lazy-background');
        }
      });
    }, 500);
  }
}

// Function to fix mobile images and animations
function fixMobileImages() {
  // Force all images to load on mobile
  const allLazyImages = document.querySelectorAll('img[data-src]');
  allLazyImages.forEach(img => {
    if (img.src !== img.dataset.src && img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
  
  // Force animation completion for key elements
  const elementsToAnimate = [
    '.science-image-container', 
    '.specialty-image-container', 
    '.science-image-container img', 
    '.specialty-image-container img',
    '.science-pillar-groups .animate-on-scroll',
    '.science-fact',
    '.specialty-card'
  ];
  
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('animated')) {
        el.classList.add('animated');
      }
    });
  });
  
  // Ensure specialty images are visible
  document.querySelectorAll('.specialty-image').forEach(img => {
    img.style.opacity = '1';
  });
  
  // Fix for "Découvrir notre écosystème" button
  const ecosystemBtn = document.querySelector('.science-cta .btn-outline');
  if (ecosystemBtn && window.innerWidth < 768) {
    ecosystemBtn.classList.add('btn-outline-enhanced');
  }
}

// Science Approach Section Interactions
function initScienceSection() {
  // Rotating facts for the science fact callout
  const facts = [
    "Notre génétique influence considérablement notre réponse aux aliments. Une approche personnalisée est donc souvent plus efficace qu'un plan standardisé.",
    "Apprécier ses repas et éviter les restrictions sévères sont des clés essentielles pour intégrer durablement de nouvelles habitudes alimentaires.",
    "Le suivi régulier, facilité par des outils modernes, aide à ajuster votre plan et est fortement lié au succès à long terme du maintien des objectifs.",
    "Le 'timing' de vos repas peut être aussi important que leur contenu ; comprendre votre rythme biologique personnel fait partie d'une approche scientifique moderne."
  ];
  
  // Current fact index
  let currentFact = 0;
  
  // Enhanced facts rotation with better transitions
  const factElement = document.querySelector('.fact-text');
  if (factElement) {
    // Setup enhanced fact rotation
    const rotateFactWithAnimation = () => {
      // Fade out with transform
      factElement.style.opacity = '0';
      factElement.style.transform = 'translateY(5px)';
      
      // Change text and fade in after transition
      setTimeout(() => {
        // Update to next fact
        currentFact = (currentFact + 1) % facts.length;
        factElement.textContent = facts[currentFact];
        
        // Animate back in
        factElement.style.opacity = '1';
        factElement.style.transform = 'translateY(0)';
      }, 500);
    };
    
    // Set interval for fact rotation
    setInterval(rotateFactWithAnimation, 8000);
    
    // Make fact clickable on mobile for manual rotation
    factElement.parentElement.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        rotateFactWithAnimation();
      }
    });
  }
  
  // Enhance pillar interactions
  const pillars = document.querySelectorAll('.science-pillar');
  pillars.forEach(pillar => {
    pillar.addEventListener('mouseenter', function() {
      // Highlight current pillar
      this.style.backgroundColor = 'rgba(var(--accent-rgb), 0.05)';
      
      // Get the icon element
      const icon = this.querySelector('.pillar-icon');
      
      // Add a subtle pulse animation
      if (icon) {
        icon.style.animation = 'pulse 1.5s infinite';
      }
    });
    
    pillar.addEventListener('mouseleave', function() {
      // Reset styles
      this.style.backgroundColor = '';
      
      // Get the icon element
      const icon = this.querySelector('.pillar-icon');
      
      // Remove animation
      if (icon) {
        icon.style.animation = '';
      }
    });
  });
  
  // Add comparison tooltip functionality
  const scienceBadge = document.querySelector('.science-badge');
  if (scienceBadge) {
    scienceBadge.addEventListener('click', function() {
      // Create comparison modal or tooltip
      showComparisonTooltip();
    });
  }
  
  function showComparisonTooltip() {
    // Create tooltip element if it doesn't exist
    let comparisonTooltip = document.getElementById('science-comparison');
    
    if (!comparisonTooltip) {
      comparisonTooltip = document.createElement('div');
      comparisonTooltip.id = 'science-comparison';
      comparisonTooltip.className = 'comparison-tooltip';
      comparisonTooltip.innerHTML = `
        <div class="comparison-header">
          <h4>Approche Traditionnelle vs. Diaeta</h4>
          <button class="close-tooltip" aria-label="Fermer"><i class="fa-solid fa-times"></i></button>
        </div>
        <div class="comparison-content">
          <div class="comparison-col traditional-col">
            <h5><i class="fa-solid fa-ban comparison-icon traditional-icon"></i> Approche Traditionnelle</h5>
            <ul class="comparison-list">
              <li><i class="fa-solid fa-circle-minus list-icon"></i> Régimes génériques</li>
              <li><i class="fa-solid fa-circle-minus list-icon"></i> Focus sur les restrictions</li>
              <li><i class="fa-solid fa-circle-minus list-icon"></i> Recommandations universelles</li>
              <li><i class="fa-solid fa-circle-minus list-icon"></i> Objectifs à court terme</li>
              <li><i class="fa-solid fa-circle-minus list-icon"></i> Risque de frustration</li>
            </ul>
          </div>
          <div class="comparison-col diaeta-col">
            <h5><i class="fa-solid fa-flask-vial comparison-icon diaeta-icon"></i> Approche Diaeta</h5>
            <ul class="comparison-list">
              <li><i class="fa-solid fa-check-circle list-icon"></i> Plans personnalisés</li>
              <li><i class="fa-solid fa-check-circle list-icon"></i> Focus sur l'équilibre & plaisir</li>
              <li><i class="fa-solid fa-check-circle list-icon"></i> Adaptée à votre métabolisme</li>
              <li><i class="fa-solid fa-check-circle list-icon"></i> Résultats durables</li>
              <li><i class="fa-solid fa-check-circle list-icon"></i> Accompagnement scientifique</li>
            </ul>
          </div>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(comparisonTooltip);
      
      // Add close functionality
      const closeBtn = comparisonTooltip.querySelector('.close-tooltip');
      closeBtn.addEventListener('click', function() {
        comparisonTooltip.classList.remove('visible');
        setTimeout(() => {
          comparisonTooltip.remove();
        }, 300);
      });
      
      // Show tooltip with animation
      setTimeout(() => {
        comparisonTooltip.classList.add('visible');
      }, 10);
    }
  }
  
  // Add custom CSS for tooltip
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .comparison-tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); /* Softer shadow */
  width: 90%;
  max-width: 650px; /* Slightly wider */
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bounce effect */
  border-top: 5px solid var(--primary-500); /* Add top border */
}

.comparison-tooltip.visible {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4); /* Adjusted padding */
  border-bottom: 1px solid var(--neutral-200);
  background-color: var(--neutral-50); /* Light background for header */
}

.comparison-header h4 {
  margin: 0;
  color: var(--primary-600); /* Darker primary for header text */
  font-size: var(--text-lg);
  font-family: var(--font-primary); /* Use primary font */
  font-weight: 600;
}

.close-tooltip {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-500);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-tooltip:hover {
  background: var(--neutral-200);
  color: var(--neutral-700);
}

.comparison-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5); /* Increased gap */
  padding: var(--space-5); /* Increased padding */
}
    
    .comparison-col {
      padding: var(--space-3);
      border-radius: var(--border-radius-md);
    }
    
    .comparison-col:first-child {
      background-color: rgba(var(--neutral-200-rgb), 0.2);
    }
    
    .comparison-col:last-child {
      background-color: rgba(var(--accent-rgb), 0.1);
    }
    
    .comparison-col h5 {
      margin-top: 0;
      margin-bottom: var(--space-4); /* Space below title */
      font-size: var(--text-base); /* Slightly smaller title */
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding-bottom: var(--space-2);
      border-bottom: 2px solid; /* Add border below title */
    }

    .traditional-col h5 {
  color: var(--secondary-700); /* Use secondary color for traditional */
  border-bottom-color: var(--secondary-200);
}

.diaeta-col h5 {
  color: var(--primary-600); /* Use primary for Diaeta */
  border-bottom-color: var(--primary-200);
}

.comparison-icon {
  font-size: 1.1em;
  opacity: 0.8;
}

.traditional-icon { color: var(--secondary-500); }
.diaeta-icon { color: var(--primary-500); }

.comparison-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comparison-list li {
  display: flex;
  align-items: flex-start; /* Align icon with start of text */
  gap: var(--space-2);
  margin-bottom: var(--space-3); /* Increased spacing */
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-secondary);
}

.comparison-list .list-icon {
  font-size: 1em;
  margin-top: 0.2em; /* Align icon slightly better */
  flex-shrink: 0;
  opacity: 0.7;
}

.traditional-col .list-icon { color: var(--secondary-400); }
.diaeta-col .list-icon { color: var(--accent-500); } /* Use accent green for Diaeta checkmarks */

/* Responsive */
@media (max-width: 767px) {
  .comparison-content {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }
  .comparison-tooltip {
     max-width: 95%;
     max-height: 85vh;
     display: flex;
     flex-direction: column;
  }
   .comparison-header h4 {
       font-size: var(--text-base);
   }
   .comparison-content {
       overflow-y: auto; /* Allow content scrolling if needed */
       flex-grow: 1;
   }
    
    .comparison-col ul {
      padding-left: var(--space-5);
      margin: 0;
    }
    
    .comparison-col li {
      margin-bottom: var(--space-2);
    }
    
    .comparison-col:last-child li {
      color: var(--primary-600);
      font-weight: var(--font-medium);
    }
    
    @media (max-width: 767px) {
      .comparison-content {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }
    }
  `;
  document.head.appendChild(style);
}

// Enhanced Science Section Mobile Optimization
function improveScienceSectionMobile() {
  // Only apply on mobile
  if (window.innerWidth < 768) {
    // Force the main image to load correctly
    const mainImage = document.querySelector('.science-main-image');
    if (mainImage && mainImage.dataset && mainImage.dataset.src) {
      mainImage.src = mainImage.dataset.src;
      mainImage.removeAttribute('data-src');
    }
    
    // Ensure accent image 1 is visible
    const accentImage1 = document.querySelector('.science-accent-1');
    if (accentImage1 && accentImage1.dataset && accentImage1.dataset.src) {
      accentImage1.src = accentImage1.dataset.src;
      accentImage1.removeAttribute('data-src');
    }
    
    // Ensure animation classes don't hide content
    document.querySelectorAll('.science-approach-section .animate-on-scroll').forEach(element => {
      element.classList.add('animated');
    });
    
    // Fix fact callout to ensure it's visible
    const scienceFact = document.querySelector('.science-fact');
    if (scienceFact) {
      scienceFact.style.opacity = '1';
      scienceFact.classList.add('animated');
    }
    
    // Add enhanced styling to the outline button
    const outlineBtn = document.querySelector('.science-cta .btn-outline');
    if (outlineBtn) {
      outlineBtn.classList.add('btn-outline-enhanced');
    }
    
    // Adjust the image container for mobile
    const scienceImageContainer = document.querySelector('.science-image-container');
    if (scienceImageContainer) {
      scienceImageContainer.style.position = 'relative';
      scienceImageContainer.style.height = 'auto';
      scienceImageContainer.style.minHeight = '250px';
      scienceImageContainer.style.display = 'block';
      scienceImageContainer.style.margin = '0 auto 2rem';
    }
    
    // Add touch feedback to the fact element
    const factElement = document.querySelector('.science-fact');
    if (factElement) {
      factElement.style.cursor = 'pointer';
      factElement.setAttribute('aria-label', 'Cliquez pour voir plus de faits scientifiques');
      
      // Add visual feedback on tap
      factElement.addEventListener('touchstart', function() {
        this.style.backgroundColor = 'rgba(var(--primary-rgb), 0.08)';
      }, { passive: true });
      
      factElement.addEventListener('touchend', function() {
        this.style.backgroundColor = '';
      }, { passive: true });
    }
  }
}

// Enhanced mobile touch interactions
function addTouchInteractions() {
  // Improve pillar interactions on touch devices
  const pillars = document.querySelectorAll('.science-pillar');
  pillars.forEach(pillar => {
    pillar.addEventListener('touchstart', function() {
      this.style.backgroundColor = 'rgba(var(--accent-rgb), 0.05)';
      
      const icon = this.querySelector('.pillar-icon');
      if (icon) {
        icon.style.backgroundColor = 'var(--accent-500)';
        icon.style.color = 'white';
        icon.style.transform = 'scale(1.1)';
      }
    }, { passive: true });
    
    pillar.addEventListener('touchend', function() {
      this.style.backgroundColor = '';
      
      const icon = this.querySelector('.pillar-icon');
      if (icon) {
        icon.style.backgroundColor = '';
        icon.style.color = '';
        icon.style.transform = '';
      }
      
      // Add a slight delay before removing styles
      setTimeout(() => {
        this.style.backgroundColor = '';
      }, 300);
    }, { passive: true });
  });
  
  // Add touch feedback to pillar groups
  const pillarGroups = document.querySelectorAll('.pillar-group');
  pillarGroups.forEach(group => {
    group.addEventListener('touchstart', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 8px 20px rgba(var(--primary-rgb), 0.12)';
    }, { passive: true });
    
    group.addEventListener('touchend', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    }, { passive: true });
  });
  
  // Make badge more interactive
  const scienceBadge = document.querySelector('.science-badge');
  if (scienceBadge) {
    scienceBadge.addEventListener('touchstart', function() {
      this.style.transform = 'scale(1.05)';
      this.style.backgroundColor = 'rgba(var(--accent-rgb), 0.2)';
    }, { passive: true });
    
    scienceBadge.addEventListener('touchend', function() {
      this.style.transform = '';
      this.style.backgroundColor = '';
    }, { passive: true });
  }
}

// Improved mobile animations sequence
function improveMobileAnimations() {
  if (window.innerWidth < 768) {
    // Create a smoother animation sequence
    const elements = [
      '.science-badge',
      '.science-title',
      '.science-description',
      '.science-fact',
      '.science-image-container',
      '.pillar-group:nth-child(1)',
      '.pillar-group:nth-child(2)',
      '.science-cta'
    ];
    
    elements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        // Ensure element is visible
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.classList.add('animated');
        
        // Add a small delay between animations
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 150 * index);
      }
    });
  }
}

// Clinic Finder Functionality
function initClinicFinder() {
  // Clinic data
  const clinics = [
    {
      id: 1,
      name: "Espace Pluridy",
      neighborhood: "1180 - Uccle",
      address: "99, Dieweg",
      schedule: [
        { day: "Mercredi", hours: "14h - 20h" }
      ],
      coordinates: [50.795916, 4.347599]
    },
    {
      id: 2,
      name: "Centre Médical Tenbosch-Châtelain",
      neighborhood: "1050 - Ixelles",
      address: "85, Rue Tenbosch",
      schedule: [
        { day: "Jeudi", hours: "13h - 18h" },
        { day: "Samedi", hours: "9h - 14h" }
      ],
      coordinates: [50.821356, 4.361131]
    },
    {
      id: 3,
      name: "Basili-K-Santé",
      neighborhood: "1081 - Koekelberg",
      address: "99, Avenue Seghers ",
      schedule: [
        { day: "Samedi", hours: "9h - 13h" }
      ],
      coordinates: [50.864653, 4.3202]
    },
    {
      id: 4,
      name: "Mediwoluwe",
      neighborhood: "1050 - Woluwe-Saint-Pierre",
      address: "9, Avenue de Broqueville ",
      schedule: [
        { day: "Lundi", hours: "11h - 21h" }
      ],
      coordinates: [50.838352, 4.409348]
    },
    {
      id: 5,
      name: "Centre Médical Les Etrimaux",
      neighborhood: "1150 - Woluwe-Saint-Pierre",
      address: "168, Drève de Nivelles",
      schedule: [
        { day: "Lundi", hours: "12h30 - 16h30" }
      ],
      coordinates: [50.824888, 4.411236]
    },
    {
      id: 6,
      name: "Centre REVAGO",
      neighborhood: "1082 - Berchem-Sainte-Agathe",
      address: "187, Avenue du Roi Albert",
      schedule: [
        { day: "Mardi", hours: "14h - 20h" }
      ],
      coordinates: [50.86686, 4.287244]
    },
    {
      id: 7,
      name: "Centre Médical Medic Alix",
      neighborhood: "1150 - Woluwe-Saint-Pierre",
      address: "Parv. Sainte-Alix 3 ",
      schedule: [
        { day: "Mardi", hours: "14h - 20h" }
      ],
      coordinates: [50.827479, 4.461214]
    },
    {
      id: 8,
      name: "Centre Médical Wolu20",
      neighborhood: "1200 - Woluwe-Saint-Lambert",
      address: "Avenue Marcel Thiry 20",
      schedule: [
        { day: "Jeudi", hours: "13h30 - 20h" }
      ],
      coordinates: [50.854992, 4.440912]
    }
  ];

  // Initialize view toggles
  initViewToggles();
  
  // Initialize day filters
  initDayFilters();
  
  // Initialize map if the map view is available
  if (document.getElementById('clinicsMap')) {
    initMap(clinics);
  }
  
  // Initialize locate me functionality
  initLocateMe(clinics);
  
  // Generate cards for list view
  generateClinicCards(clinics);
}

function initViewToggles() {
  const viewToggles = document.querySelectorAll('.view-toggle');
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  
  if (!viewToggles.length || !listView || !mapView) return;
  
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      // Remove active class from all toggles
      viewToggles.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked toggle
      this.classList.add('active');
      
      // Get view type from data attribute
      const viewType = this.getAttribute('data-view');
      
      // Toggle views
      if (viewType === 'list') {
        listView.classList.add('active');
        mapView.classList.remove('active');
      } else if (viewType === 'map') {
        listView.classList.remove('active');
        mapView.classList.add('active');
        
        // Trigger map resize event if map is initialized
        if (window.clinicMap) {
          setTimeout(() => {
            window.clinicMap.invalidateSize();
          }, 100);
        }
      }
    });
  });
}

function initDayFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const dayFilter = this.getAttribute('data-day');
      
      // Filter clinics in list view
      const clinicCards = document.querySelectorAll('.clinic-card');
      clinicCards.forEach(card => {
        // Remove previous animation classes
        card.classList.remove('filtered-in');
        
        const cardDays = card.getAttribute('data-days');
        
        if (dayFilter === 'all' || (cardDays && cardDays.includes(dayFilter))) {
          // Show card
          card.style.display = '';
          
          // Add animation class
          setTimeout(() => {
            card.classList.add('filtered-in');
          }, 10);
        } else {
          // Hide card
          card.style.display = 'none';
        }
      });
      
      // Update map view if active
      if (window.clinicMap && document.getElementById('mapView').classList.contains('active')) {
        // Show all markers by default
        for (let id in window.clinicMarkers) {
          window.clinicMarkers[id].addTo(window.clinicMap);
        }
        
        // Then hide non-matching ones
        if (dayFilter !== 'all') {
          // Get all clinics
          const allClinics = getClinicData();
          
          // Filter out those that don't match the day
          allClinics.forEach(clinic => {
            const clinicDays = clinic.schedule.map(s => s.day.toLowerCase());
            if (!clinicDays.includes(dayFilter.toLowerCase())) {
              // Remove from map
              window.clinicMarkers[clinic.id].removeFrom(window.clinicMap);
            }
          });
        }
      }
    });
  });
}

function initMap(clinics) {
  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    console.error('Leaflet library is not loaded');
    return;
  }
  
  // Initialize map
  const map = L.map('clinicsMap').setView([50.85045,  4.34878], 12); // Brussels center
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Store map reference globally
  window.clinicMap = map;
  
  // Add markers for each clinic
  const markers = {};
  
  clinics.forEach(clinic => {
    // Custom icon
    const clinicIcon = L.divIcon({
      className: 'clinic-marker',
      html: `<div class="marker-icon"><i class="fa-solid fa-stethoscope"></i></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    
    // Create marker
    const marker = L.marker(clinic.coordinates, { icon: clinicIcon })
      .addTo(map);
      
    // Store marker reference
    markers[clinic.id] = marker;
    
    // Add click event to show clinic details
    marker.on('click', () => {
      showClinicDetails(clinic, marker);
      
      // Highlight corresponding sidebar card
      highlightSidebarCard(clinic.id);
    });
    
    // Add popup with basic info
    marker.bindPopup(`
      <div class="map-popup">
        <h4>${clinic.name}</h4>
        <p>${clinic.neighborhood}</p>
        <button class="popup-details-btn">Voir détails</button>
      </div>
    `);
    
    // Handle popup details button click
    marker.on('popupopen', () => {
      const detailsBtn = document.querySelector('.popup-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          showClinicDetails(clinic, marker);
          marker.closePopup();
        });
      }
    });
  });
  
  // Store markers reference
  window.clinicMarkers = markers;
  
  // Add custom CSS for map markers
  addMapStyles();
  
  // Generate sidebar cards
  generateSidebarCards(clinics);
}

function addMapStyles() {
  // Add custom CSS for map elements
  const style = document.createElement('style');
  style.textContent = `
    .clinic-marker {
      background: transparent;
    }
    
    .marker-icon {
      width: 40px;
      height: 40px;
      background-color: #006D77;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border: 2px solid white;
    }
    
    .marker-icon i {
      transform: rotate(45deg);
      color: white;
      font-size: 16px;
    }
    
    .map-popup {
      text-align: center;
      padding: 5px;
    }
    
    .map-popup h4 {
      margin: 0 0 5px;
      font-size: 14px;
      color: #006D77;
    }
    
    .map-popup p {
      margin: 0 0 8px;
      font-size: 12px;
      color: #616161;
    }
    
    .popup-details-btn {
      background-color: #006D77;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .popup-details-btn:hover {
      background-color: #005863;
    }
    
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
    
    .leaflet-popup-tip {
      background-color: white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
  `;
  
  document.head.appendChild(style);
}

function showClinicDetails(clinic, marker) {
  const detailPanel = document.getElementById('clinicDetailPanel');
  if (!detailPanel) return;
  
  // Create schedule HTML
  const scheduleHtml = clinic.schedule.map(s => `
    <li>
      <div class="day">${s.day}</div>
      <div class="hours available">${s.hours}</div>
    </li>
  `).join('');
  
  // Update panel content
  detailPanel.innerHTML = `
    <div class="detail-panel-header">
      <h3>${clinic.name}</h3>
      <button class="close-panel-btn" aria-label="Fermer">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
    <div class="detail-panel-body">
      <div class="detail-section">
        <h4 class="detail-title">
          <i class="fa-solid fa-location-dot"></i>
          Adresse
        </h4>
        <p class="detail-text">${clinic.address} (${clinic.neighborhood})</p>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}" 
           class="detail-action-link" target="_blank" rel="noopener noreferrer">
          <i class="fa-solid fa-directions"></i>
          Itinéraire
        </a>
      </div>
      
      <div class="detail-section">
        <h4 class="detail-title">
          <i class="fa-solid fa-clock"></i>
          Horaires
        </h4>
        <ul class="schedule-list">
          ${scheduleHtml}
        </ul>
      </div>
      
      <div class="detail-action">
        <a href="#booking" class="book-btn btn btn-primary">
          <i class="fa-solid fa-calendar-check"></i>
          Prendre rendez-vous
        </a>
      </div>
    </div>
  `;
  
  // Show panel
  detailPanel.classList.add('active');
  
  // Handle close button
  const closeBtn = detailPanel.querySelector('.close-panel-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailPanel.classList.remove('active');
    });
  }
  
  // Center map on marker with offset for panel
  if (window.clinicMap) {
    window.clinicMap.panTo(marker.getLatLng(), {
      animate: true,
      padding: [0, 400, 0, 0] // Padding [top, right, bottom, left]
    });
  }
}

function generateSidebarCards(clinics) {
  const sidebarContainer = document.querySelector('.sidebar-clinics');
  if (!sidebarContainer) return;
  
  // Clear existing content
  sidebarContainer.innerHTML = '';
  
  // Generate card for each clinic
  clinics.forEach(clinic => {
    // Create schedule string
    const scheduleStr = clinic.schedule.map(s => `${s.day}: ${s.hours}`).join('<br>');
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'sidebar-clinic-card';
    card.setAttribute('data-clinic-id', clinic.id);
    card.innerHTML = `
      <h4>${clinic.name}</h4>
      <div class="clinic-address">
        <i class="fa-solid fa-location-dot"></i>
        <span>${clinic.address}<br>${clinic.neighborhood}</span>
      </div>
      <div class="clinic-schedule">
        <div class="schedule-badge">${scheduleStr}</div>
      </div>
      <a href="#booking" class="card-action-btn">
        <i class="fa-solid fa-calendar-check"></i>
        Prendre rendez-vous
      </a>
    `;
    
    // Add click event
    card.addEventListener('click', () => {
      // Show clinic details
      if (window.clinicMarkers && window.clinicMarkers[clinic.id]) {
        showClinicDetails(clinic, window.clinicMarkers[clinic.id]);
      }
      
      // Highlight this card
      highlightSidebarCard(clinic.id);
    });
    
    // Add card to container
    sidebarContainer.appendChild(card);
  });
}

function generateClinicCards(clinics) {
  const gridContainer = document.querySelector('.clinic-grid');
  if (!gridContainer) return;
  
  // Clear existing content
  gridContainer.innerHTML = '';
  
  // Generate cards for list view
  clinics.forEach(clinic => {
    // Get days for filtering
    const daysList = clinic.schedule.map(s => s.day.toLowerCase());
    
    // Create card HTML
    const card = document.createElement('div');
    card.className = 'clinic-card';
    card.setAttribute('data-days', daysList.join(' '));
    
    // Create schedule badges HTML
    const scheduleBadges = clinic.schedule.map(s => 
      `<div class="schedule-badge">${s.day}: ${s.hours}</div>`
    ).join('');
    
    // Create availability indicators
    const daysOfWeek = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    const dayIndicators = daysOfWeek.map(day => {
      const isAvailable = daysList.includes(day) ? 'available' : '';
      return `<span class="day-indicator ${isAvailable}" title="${day.charAt(0).toUpperCase() + day.slice(1)}">${day.charAt(0).toUpperCase()}</span>`;
    }).join('');
    
    card.innerHTML = `
      <h3 class="clinic-name">${clinic.name}</h3>
      <div class="clinic-meta">
        <span class="clinic-neighborhood">${clinic.neighborhood}</span>
      </div>
      <div class="clinic-address">
        <i class="fa-solid fa-location-dot"></i>
        <span>${clinic.address}</span>
      </div>
      <div class="availability-week">
        ${dayIndicators}
      </div>
      <div class="clinic-schedule">
        ${scheduleBadges}
      </div>
      <a href="#booking" class="clinic-book-btn">
        <i class="fa-solid fa-calendar-check"></i> Rendez-vous
      </a>
    `;
    
    gridContainer.appendChild(card);
  });
}

function highlightSidebarCard(clinicId) {
  // Remove active class from all cards
  document.querySelectorAll('.sidebar-clinic-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Add active class to matching card
  const targetCard = document.querySelector(`.sidebar-clinic-card[data-clinic-id="${clinicId}"]`);
  if (targetCard) {
    targetCard.classList.add('active');
    
    // Scroll card into view
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function initLocateMe(clinics) {
  const locateBtn = document.querySelector('.locate-me-btn');
  if (!locateBtn) return;
  
  locateBtn.addEventListener('click', () => {
    // Show loading state
    locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Localisation...';
    locateBtn.disabled = true;
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          
          // Find nearest clinic
          const nearest = findNearestClinic(userLocation, clinics);
          
          // Switch to map view if not already active
          const mapViewToggle = document.querySelector('.view-toggle[data-view="map"]');
          if (mapViewToggle && !mapViewToggle.classList.contains('active')) {
            mapViewToggle.click();
          }
          
          // Show clinic details and center map
          if (window.clinicMarkers && window.clinicMarkers[nearest.id]) {
            const marker = window.clinicMarkers[nearest.id];
            
            // Pan to marker with animation
            if (window.clinicMap) {
              window.clinicMap.flyTo(marker.getLatLng(), 15, {
                animate: true,
                duration: 1
              });
              
              // Show marker popup
              setTimeout(() => {
                marker.openPopup();
                showClinicDetails(nearest, marker);
                highlightSidebarCard(nearest.id);
              }, 1000);
            }
          }
          
          // Reset button
          locateBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> À proximité';
          locateBtn.disabled = false;
        },
        // Error callback
        (error) => {
          console.error('Geolocation error:', error);
          
          // Show error message
          alert('Impossible de déterminer votre position. Veuillez vérifier vos paramètres de localisation et réessayer.');
          
          // Reset button
          locateBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> À proximité';
          locateBtn.disabled = false;
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation not supported
      alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
      
      // Reset button
      locateBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> À proximité';
      locateBtn.disabled = false;
    }
  });
}

function findNearestClinic(userLocation, clinics) {
  let nearestClinic = null;
  let shortestDistance = Infinity;
  
  clinics.forEach(clinic => {
    const distance = calculateDistance(
      userLocation[0], 
      userLocation[1], 
      clinic.coordinates[0], 
      clinic.coordinates[1]
    );
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestClinic = clinic;
    }
  });
  
  return nearestClinic;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Helper function to get clinic data
function getClinicData() {
  return [
    {
      id: 1,
      name: "Espace Pluridy",
      neighborhood: "1180 - Uccle",
      address: "99, Dieweg",
      schedule: [
        { day: "Mercredi", hours: "14h - 20h" }
      ],
      coordinates: [50.795916, 4.347599]
    },
    {
      id: 2,
      name: "Centre Médical Tenbosch-Châtelain",
      neighborhood: "1050 - Ixelles",
      address: "85, Rue Tenbosch",
      schedule: [
        { day: "Jeudi", hours: "13h - 18h" },
        { day: "Samedi", hours: "9h - 14h" }
      ],
      coordinates: [50.821356, 4.361131]
    },
    {
      id: 3,
      name: "Basili-K-Santé",
      neighborhood: "1081 - Koekelberg",
      address: "99, Avenue Seghers ",
      schedule: [
        { day: "Samedi", hours: "9h - 13h" }
      ],
      coordinates: [50.864653, 4.3202]
    },
    {
      id: 4,
      name: "Mediwoluwe",
      neighborhood: "1050 - Woluwe-Saint-Pierre",
      address: "9, Avenue de Broqueville ",
      schedule: [
        { day: "Lundi", hours: "11h - 21h" }
      ],
      coordinates: [50.838352, 4.409348]
    },
    {
      id: 5,
      name: "Centre Médical Les Etrimaux",
      neighborhood: "1150 - Woluwe-Saint-Pierre",
      address: "168, Drève de Nivelles",
      schedule: [
        { day: "Lundi", hours: "12h30 - 16h30" }
      ],
      coordinates: [50.824888, 4.411236]
    },
    {
      id: 6,
      name: "Centre REVAGO",
      neighborhood: "1082 - Berchem-Sainte-Agathe",
      address: "187, Avenue du Roi Albert",
      schedule: [
        { day: "Mardi", hours: "14h - 20h" }
      ],
      coordinates: [50.86686, 4.287244]
    },
    {
      id: 7,
      name: "Centre Médical Medic Alix",
      neighborhood: "1150 - Woluwe-Saint-Pierre",
      address: "Parv. Sainte-Alix 3 ",
      schedule: [
        { day: "Mardi", hours: "14h - 20h" }
      ],
      coordinates: [50.827479, 4.461214]
    },
    {
      id: 8,
      name: "Centre Médical Wolu20",
      neighborhood: "1200 - Woluwe-Saint-Lambert",
      address: "Avenue Marcel Thiry 20",
      schedule: [
        { day: "Jeudi", hours: "13h30 - 20h" }
      ],
      coordinates: [50.854992, 4.440912]
    }
  ];
}

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to section headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.classList.add('animate-on-scroll', 'fade-up');
  });
  
  // Add animation classes to cards, etc.
  document.querySelectorAll('.specialty-card, .success-card, .science-pillar, .contact-form-container').forEach(element => {
    element.classList.add('animate-on-scroll', 'fade-up');
  });
  
  // Stagger animations for list items
  document.querySelectorAll('.contact-list, .approach-list').forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach((item, index) => {
      item.classList.add('animate-on-scroll', 'fade-in');
      item.style.animationDelay = `${index * 0.1}s`;
    });
  });
});

// Hero Section Animation Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll animations for hero section
  initHeroAnimations();
  
  // Initialize text highlight interactions
  initTextHighlights();
  
  // Initialize feature badge interactions
  initFeatureBadges();
});

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
  // Select all elements to animate
  const animatedElements = document.querySelectorAll('.hero-section .animate-on-scroll');
  
  // Add animated class to trigger animations
  animatedElements.forEach((element, index) => {
    // Stagger the animations slightly
    setTimeout(() => {
      element.classList.add('animated');
    }, 100 * index);
  });
}

/**
 * Initialize text highlight interactions
 */
function initTextHighlights() {
  const highlights = document.querySelectorAll('.text-highlight');
  
  highlights.forEach(highlight => {
    highlight.addEventListener('mouseenter', function() {
      // Create and show tooltip with explanation
      const tooltipText = getTooltipText(this.textContent.trim());
      createTooltip(tooltipText, this);
    });
    
    highlight.addEventListener('mouseleave', function() {
      // Remove tooltip
      const tooltip = document.querySelector('.highlight-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
  
  function getTooltipText(text) {
    const tooltips = {
      'expertise scientifique': 'Recommandations basées sur les dernières recherches en nutrition',
      'approche personnalisée': 'Plan nutritionnel adapté à votre métabolisme unique'
    };
    
    return tooltips[text] || 'Une approche basée sur des principes scientifiques';
  }
  
  function createTooltip(text, element) {
    // Remove existing tooltips
    const existingTooltip = document.querySelector('.highlight-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('highlight-tooltip');
    tooltip.textContent = text;
    
    // Add to body
    document.body.appendChild(tooltip);
    
    // Position tooltip above the element
    const elemRect = element.getBoundingClientRect();
    tooltip.style.top = (elemRect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (elemRect.left + (elemRect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
    
    // Add visible class after a small delay (for animation)
    setTimeout(() => {
      tooltip.classList.add('visible');
    }, 10);
  }
}

/**
 * Initialize feature badge interactions
 */
function initFeatureBadges() {
  const badges = document.querySelectorAll('.feature-badge');
  
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Add this to improve mobile card positioning
function fixMobileCardPositioning() {
  if (window.innerWidth < 768) {
    const clinicCards = document.querySelectorAll('.clinic-card');
    
    clinicCards.forEach((card, index) => {
      // Reset any problematic styles
      card.style.position = 'relative';
      card.style.marginBottom = '1rem';
      card.style.zIndex = (100 - index); // Ensures proper stacking
      
      // Clear any transforms that might be causing issues
      card.style.transform = 'none';
    });
  }
}

// --- Specialties Section - Animated Stats ---

/**
 * Initializes the counting animation for statistics in specialty cards.
 */
function initializeAnimatedStats() {
  const statElements = document.querySelectorAll('.specialty-card .stat-value');

  if (!statElements.length) {
      // console.log("No stat elements found to animate."); // Optional logging
      return;
  }

  // Create one observer for all stat elements
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          // Check if the element is intersecting and hasn't been animated yet
          if (entry.isIntersecting && !entry.target.classList.contains('stat-animated')) {
              const targetElement = entry.target;
              animateStat(targetElement);
              targetElement.classList.add('stat-animated'); // Mark as animated
              observer.unobserve(targetElement); // Stop observing once animated
          }
      });
  }, {
      threshold: 0.5, // Trigger when 50% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Start a bit before it's fully in view
  });

  // Observe each stat value element
  statElements.forEach(el => {
      observer.observe(el);
  });
}

/**
* Animates a single statistic value element.
* @param {HTMLElement} element - The element containing the stat value.
*/
function animateStat(element) {
  const targetValueString = element.textContent;
  // Extract number and suffix (e.g., %, +, years)
  const match = targetValueString.match(/(-?\d+[\.,]?\d*)(.*)/);
  if (!match) {
      // console.error("Could not parse stat value:", targetValueString); // Optional logging
      return; // Cannot parse value
  }

  const targetValue = parseFloat(match[1].replace(',', '.')); // Handle decimal comma
  const suffix = match[2].trim(); // Get the "%", "+", etc.
  const duration = 1500; // Animation duration in milliseconds
  const frameDuration = 1000 / 60; // Approx 60 FPS
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const countUp = () => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out function: starts fast, slows down towards the end
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      let currentValue = Math.round(targetValue * easeOutProgress);

      // Handle potential floating point for HbA1c etc.
      if (targetValue % 1 !== 0) { // Check if target is a float
           currentValue = (targetValue * easeOutProgress).toFixed(1); // Keep one decimal place
      }


      element.textContent = currentValue + suffix;

      if (frame < totalFrames) {
          requestAnimationFrame(countUp);
      } else {
          element.textContent = targetValueString; // Ensure final value is exact
      }
  };

  // Start the animation
   requestAnimationFrame(countUp);
}


// --- End Animated Stats ---


// Modify the main DOMContentLoaded listener to call the new function
document.addEventListener('DOMContentLoaded', function() {
// ... (existing initializations like initializeHeader, initializeHero, etc.) ...

initializeAnimatedStats(); // <-- ADD THIS CALL

// ... (rest of existing initializations) ...
});
// Add the call inside the main DOMContentLoaded listener:

// Call on load and resize
window.addEventListener('DOMContentLoaded', fixMobileCardPositioning);
window.addEventListener('resize', fixMobileCardPositioning);