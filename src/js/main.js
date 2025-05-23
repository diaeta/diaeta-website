// main.js - Updated to use window.diaetaCabinetsData and new JSON structure

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
  // Check if the clinic finder section exists on the page
  if (document.getElementById('clinic-locations') && typeof window.diaetaCabinetsData !== 'undefined') {
    initClinicFinder(window.diaetaCabinetsData);
  } else if (document.getElementById('clinic-locations')) {
    console.warn("Diaeta: Clinic finder section present, but window.diaetaCabinetsData is not defined. Ensure cabinets data is passed from Eleventy.");
    // Optionally display a message to the user in the clinic finder section
    const clinicContent = document.querySelector('#clinic-locations .clinic-content');
    if (clinicContent) {
        clinicContent.innerHTML = "<p class='text-center text-danger'>Impossible de charger les informations des cliniques. Veuillez réessayer plus tard ou nous contacter.</p>";
    }
  }
  
  // Initialize animated stats if they exist
  initializeAnimatedStats();

  // Fix for mobile card positioning if those cards exist
  if (document.querySelector('.clinic-card')) {
    fixMobileCardPositioning();
    window.addEventListener('resize', fixMobileCardPositioning);
  }
});

// Header functionality (largely unchanged)
function initializeHeader() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (!header) return; // Exit if header not found

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      const isOpen = header.classList.contains('menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
  
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const langSelector = this.closest('.lang-selector');
      if (!langSelector) return;
      document.querySelectorAll('.lang-selector').forEach(selector => {
        if (selector !== langSelector) {
          selector.classList.remove('open');
        }
      });
      langSelector.classList.toggle('open');
      const isOpen = langSelector.classList.contains('open');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('href').replace('#', '');
      // const languageText = this.textContent.trim(); // Not used in example
      document.querySelectorAll('.lang-toggle span').forEach(span => {
        span.textContent = lang.toUpperCase();
      });
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('href') === this.getAttribute('href'));
        opt.setAttribute('aria-current', opt.classList.contains('active') ? 'true' : 'false');
      });
      document.querySelectorAll('.lang-selector').forEach(selector => selector.classList.remove('open'));
      document.querySelectorAll('.lang-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
    });
  });
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-selector')) {
      document.querySelectorAll('.lang-selector').forEach(selector => selector.classList.remove('open'));
      document.querySelectorAll('.lang-toggle').forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
    }
  });
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (header.classList.contains('menu-open') && menuToggle) {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
      }
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });
}

// Hero section functionality (unchanged)
function initializeHero() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroVideo = document.getElementById('hero-video');
  const highlights = document.querySelectorAll('.highlight'); // Make sure this class exists in hero if used
  
  if (heroVideo && window.innerWidth < 768) {
      heroVideo.pause();
      // Consider removing or hiding instead of heroVideo.remove() if it causes issues
      // heroVideo.style.display = 'none'; 
  }
  
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      const nextSection = document.querySelector('.hero-section + section');
      if (nextSection) {
        const headerEl = document.querySelector('.site-header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 0;
        const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  }
  
  if (highlights.length > 0) {
    highlights.forEach(highlight => {
      highlight.addEventListener('mouseenter', function(e) {
        const tooltipText = getTooltipContent(this.textContent.trim());
        createTooltip(tooltipText, e, this);
      });
      highlight.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.hero-highlight-tooltip');
        if (tooltip) tooltip.remove();
      });
    });
  }
  
  function getTooltipContent(highlightText) {
    const tooltipContent = {
      'Diaeta': 'Du latin "diaeta", mode de vie équilibré basé sur des principes scientifiques.',
      'science de la nutrition': 'Approche basée sur les dernières recherches scientifiques en nutrition.',
      'personnalisée': 'Adaptée à votre métabolisme, vos préférences et votre mode de vie.',
      'art de vivre': "L'équilibre parfait entre plaisir gustatif et nutrition optimale."
    };
    return tooltipContent[highlightText] || 'Une approche scientifique de la nutrition';
  }
  
  function createTooltip(text, event, element) {
    const existingTooltip = document.querySelector('.hero-highlight-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    const tooltip = document.createElement('div');
    tooltip.classList.add('hero-highlight-tooltip');
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = elementRect.top + window.scrollY - tooltipRect.height - 10; // Ensure scrollY is accounted for
    const left = elementRect.left + window.scrollX + (elementRect.width - tooltipRect.width) / 2;
    
    tooltip.style.position = 'absolute'; // Ensure it's absolute for correct positioning with scroll
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    
    setTimeout(() => tooltip.classList.add('visible'), 10);
  }
}

// Specialties section functionality (unchanged)
function initializeSpecialties() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      const lazyImages = modal.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    });
  });
}

// Contact Form functionality (unchanged)
function initializeContactForm() {
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const serviceType = document.getElementById('serviceType').value;
      if (!fullName || !email || !phone || !serviceType) {
        showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
      }
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        showFormMessage('Veuillez entrer un numéro de téléphone valide.', 'error');
        return;
      }
      showFormMessage('Votre demande a été envoyée. Nous vous contacterons prochainement.', 'success'); // Changed message
      form.reset();
    });
  }
  function showFormMessage(message, type) {
    const existingMessage = form.querySelector('.form-message'); // Query within form
    if (existingMessage) existingMessage.remove();
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`; // Use className
    messageEl.textContent = message;
    form.appendChild(messageEl); // Append to form, not just before submit button
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') {
      setTimeout(() => messageEl.remove(), 5000);
    }
  }
}

// Scroll animations (unchanged)
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
  animatedElements.forEach(element => observer.observe(element));
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => el.classList.add('animated'));
  }, 1500);
}

// Lazy loading (unchanged)
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src], .lazy-background');
  if (!lazyImages.length) return;
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
            element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
            element.classList.remove('lazy-background');
            element.removeAttribute('data-bg-src');
          }
          imageObserver.unobserve(element);
        }
      });
    }, { rootMargin: '50px 0px', threshold: 0.01 });
    lazyImages.forEach(image => imageObserver.observe(image));
  } else {
    lazyImages.forEach(element => {
      if (element.tagName === 'IMG' && element.dataset.src) {
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
      } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
        element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
        element.classList.remove('lazy-background');
        element.removeAttribute('data-bg-src');
      }
    });
  }
  if (window.innerWidth < 768) {
    setTimeout(() => {
      document.querySelectorAll('img[data-src], .lazy-background[data-bg-src]').forEach(element => {
        if (element.tagName === 'IMG' && element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        } else if (element.classList.contains('lazy-background') && element.dataset.bgSrc) {
          element.style.backgroundImage = `url('${element.dataset.bgSrc}')`;
          element.classList.remove('lazy-background');
           element.removeAttribute('data-bg-src');
        }
      });
    }, 500);
  }
}

// Function to fix mobile images and animations (unchanged)
function fixMobileImages() {
  document.querySelectorAll('img[data-src]').forEach(img => {
    if (img.dataset.src && img.src !== img.dataset.src) { // Check if already loaded
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
  const elementsToAnimate = [
    '.science-image-container', '.specialty-image-container', 
    '.science-image-container img', '.specialty-image-container img',
    '.science-pillar-groups .animate-on-scroll', '.science-fact', '.specialty-card'
  ];
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector + ':not(.animated)').forEach(el => el.classList.add('animated')); // Target only not animated
  });
  document.querySelectorAll('.specialty-image').forEach(img => img.style.opacity = '1');
  const ecosystemBtn = document.querySelector('.science-cta .btn-outline');
  if (ecosystemBtn && window.innerWidth < 768) {
    ecosystemBtn.classList.add('btn-outline-enhanced');
  }
}

// Science Approach Section Interactions (largely unchanged)
function initScienceSection() {
  const facts = [
    "Notre génétique influence considérablement notre réponse aux aliments. Une approche personnalisée est donc souvent plus efficace qu'un plan standardisé.",
    "Apprécier ses repas et éviter les restrictions sévères sont des clés essentielles pour intégrer durablement de nouvelles habitudes alimentaires.",
    "Le suivi régulier, facilité par des outils modernes, aide à ajuster votre plan et est fortement lié au succès à long terme du maintien des objectifs.",
    "Le 'timing' de vos repas peut être aussi important que leur contenu ; comprendre votre rythme biologique personnel fait partie d'une approche scientifique moderne."
  ];
  let currentFact = 0;
  const factElement = document.querySelector('.fact-text');
  if (factElement) {
    const rotateFactWithAnimation = () => {
      factElement.style.opacity = '0';
      factElement.style.transform = 'translateY(5px)';
      setTimeout(() => {
        currentFact = (currentFact + 1) % facts.length;
        factElement.textContent = facts[currentFact];
        factElement.style.opacity = '1';
        factElement.style.transform = 'translateY(0)';
      }, 500);
    };
    setInterval(rotateFactWithAnimation, 8000);
    if (factElement.parentElement) { // Ensure parentElement exists
        factElement.parentElement.addEventListener('click', function() {
            if (window.innerWidth <= 768) rotateFactWithAnimation();
        });
    }
  }
  const pillars = document.querySelectorAll('.science-pillar');
  pillars.forEach(pillar => {
    pillar.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'rgba(var(--accent-rgb), 0.05)';
      const icon = this.querySelector('.pillar-icon');
      if (icon) icon.style.animation = 'pulse 1.5s infinite';
    });
    pillar.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '';
      const icon = this.querySelector('.pillar-icon');
      if (icon) icon.style.animation = '';
    });
  });
  const scienceBadge = document.querySelector('.science-badge');
  if (scienceBadge) {
    scienceBadge.addEventListener('click', showComparisonTooltip);
  }
}

function showComparisonTooltip() { // Extracted for clarity
    let comparisonTooltip = document.getElementById('science-comparison');
    if (comparisonTooltip && comparisonTooltip.classList.contains('visible')) return; // Don't reopen if visible

    if (!comparisonTooltip) {
      comparisonTooltip = document.createElement('div');
      comparisonTooltip.id = 'science-comparison';
      comparisonTooltip.className = 'comparison-tooltip'; // Add class for styling
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
        </div>`;
      document.body.appendChild(comparisonTooltip);
      const closeBtn = comparisonTooltip.querySelector('.close-tooltip');
      if (closeBtn) {
          closeBtn.addEventListener('click', function() {
            comparisonTooltip.classList.remove('visible');
            // Remove after transition for smoother effect
            // setTimeout(() => { if(comparisonTooltip) comparisonTooltip.remove(); }, 300); 
          });
      }
    }
    // Ensure tooltip is visible (add class after slight delay for animation)
    setTimeout(() => comparisonTooltip.classList.add('visible'), 10);
  }
// Note: Comparison Tooltip CSS from original main.js should be in your style.css for this to work.

// Enhanced Science Section Mobile Optimization (unchanged)
function improveScienceSectionMobile() {
  if (window.innerWidth < 768) {
    const mainImage = document.querySelector('.science-main-image');
    if (mainImage && mainImage.dataset.src && mainImage.src !== mainImage.dataset.src) {
      mainImage.src = mainImage.dataset.src;
      mainImage.removeAttribute('data-src');
    }
    const accentImage1 = document.querySelector('.science-accent-1');
    if (accentImage1 && accentImage1.dataset.src && accentImage1.src !== accentImage1.dataset.src) {
      accentImage1.src = accentImage1.dataset.src;
      accentImage1.removeAttribute('data-src');
    }
    document.querySelectorAll('.science-approach-section .animate-on-scroll:not(.animated)')
            .forEach(element => element.classList.add('animated'));
    const scienceFact = document.querySelector('.science-fact');
    if (scienceFact) {
      scienceFact.style.opacity = '1';
      scienceFact.classList.add('animated');
      scienceFact.style.cursor = 'pointer'; // Added from original for consistency
      scienceFact.setAttribute('aria-label', 'Cliquez pour voir plus de faits scientifiques');
      factElement.addEventListener('touchstart', function() { this.style.backgroundColor = 'rgba(var(--primary-rgb), 0.08)'; }, { passive: true });
      factElement.addEventListener('touchend', function() { this.style.backgroundColor = ''; }, { passive: true });
    }
    const outlineBtn = document.querySelector('.science-cta .btn-outline');
    if (outlineBtn) outlineBtn.classList.add('btn-outline-enhanced');
    const scienceImageContainer = document.querySelector('.science-image-container');
    if (scienceImageContainer) {
      scienceImageContainer.style.position = 'relative';
      scienceImageContainer.style.height = 'auto';
      scienceImageContainer.style.minHeight = '250px';
      scienceImageContainer.style.display = 'block';
      scienceImageContainer.style.margin = '0 auto 2rem';
    }
  }
}

// Enhanced mobile touch interactions (unchanged)
function addTouchInteractions() {
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
      setTimeout(() => { this.style.backgroundColor = ''; }, 300);
    }, { passive: true });
  });
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

// Improved mobile animations sequence (unchanged)
function improveMobileAnimations() {
  if (window.innerWidth < 768) {
    const elements = [
      '.science-badge', '.science-title', '.science-description', '.science-fact',
      '.science-image-container', '.pillar-group:nth-child(1)', 
      '.pillar-group:nth-child(2)', '.science-cta'
    ];
    elements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.classList.add('animated'); // Ensure animated class is added
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 150 * index);
      }
    });
  }
}

// ----------------------------------------------------------------------------------
// Clinic Finder Functionality - REFACTORED to use cabinetsData from window
// ----------------------------------------------------------------------------------
function initClinicFinder(cabinetsData) {
  if (!cabinetsData || cabinetsData.length === 0) {
    console.error("Diaeta: Cabinets data is missing or empty for Clinic Finder.");
    return;
  }
  // Filter out video consultations for physical map/list display
  const physicalClinics = cabinetsData.filter(cabinet => cabinet.id !== 'video' && cabinet.coordinates && cabinet.coordinates.length === 2);

  initViewToggles();
  initDayFilters(physicalClinics); // Pass data to filters

  if (document.getElementById('clinicsMap')) {
    initMap(physicalClinics);
  }
  
  initLocateMe(physicalClinics);
  generateClinicCards(physicalClinics); // Generate cards for list view
}

function initViewToggles() {
  const viewToggles = document.querySelectorAll('.view-toggle');
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  
  if (!viewToggles.length || !listView || !mapView) return;
  
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      viewToggles.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const viewType = this.getAttribute('data-view');
      if (viewType === 'list') {
        listView.classList.add('active');
        mapView.classList.remove('active');
      } else if (viewType === 'map') {
        listView.classList.remove('active');
        mapView.classList.add('active');
        if (window.clinicMap) {
          setTimeout(() => window.clinicMap.invalidateSize(), 100);
        }
      }
    });
  });
}

function initDayFilters(cabinetsData) { // cabinetsData is passed here
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const dayFilter = this.getAttribute('data-day'); // e.g., "lundi"
      
      // Filter clinic cards in list view
      const clinicCards = document.querySelectorAll('.clinic-card');
      clinicCards.forEach(card => {
        card.classList.remove('filtered-in');
        const cardDays = card.getAttribute('data-days'); // Space-separated lowercase French day names
        if (dayFilter === 'all' || (cardDays && cardDays.includes(dayFilter))) {
          card.style.display = '';
          setTimeout(() => card.classList.add('filtered-in'), 10);
        } else {
          card.style.display = 'none';
        }
      });
      
      // Update map view if active and map exists
      if (window.clinicMap && document.getElementById('mapView') && document.getElementById('mapView').classList.contains('active')) {
        // Show all markers first
        for (let id in window.clinicMarkers) {
            if (window.clinicMarkers[id]) window.clinicMarkers[id].addTo(window.clinicMap);
        }
        // Then hide non-matching ones
        if (dayFilter !== 'all') {
          cabinetsData.forEach(cabinet => {
            // Extract French day names from opening_hours
            const cabinetDays = cabinet.opening_hours ? cabinet.opening_hours.map(oh => oh.dayOfWeekFRENCH.toLowerCase()) : [];
            if (!cabinetDays.includes(dayFilter.toLowerCase())) {
              if (window.clinicMarkers[cabinet.id]) { // Check if marker exists
                window.clinicMarkers[cabinet.id].removeFrom(window.clinicMap);
              }
            }
          });
        }
      }
    });
  });
}

function initMap(clinicsToMap) { // Renamed parameter
  if (typeof L === 'undefined') {
    console.error('Leaflet library is not loaded');
    return;
  }
  const mapElement = document.getElementById('clinicsMap');
  if (!mapElement) return;

  const map = L.map(mapElement).setView([50.85045,  4.34878], 12); // Brussels center
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  window.clinicMap = map;
  
  const markers = {};
  clinicsToMap.forEach(cabinet => { // Use cabinetsData passed to function
    if (!cabinet.coordinates || cabinet.coordinates.length !== 2) return; // Skip if no coords

    const clinicIcon = L.divIcon({
      className: 'clinic-marker',
      html: `<div class="marker-icon"><i class="fa-solid fa-stethoscope"></i></div>`,
      iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40]
    });
    const marker = L.marker(cabinet.coordinates, { icon: clinicIcon }).addTo(map);
    markers[cabinet.id] = marker; // Use cabinet.id from JSON
    
    marker.on('click', () => {
      showClinicDetails(cabinet, marker); 
      highlightSidebarCard(cabinet.id);
    });
    
    // Updated popup to use new structure
    let neighborhood = cabinet.address_obj ? `${cabinet.address_obj.postalCode} - ${cabinet.address_obj.city}` : cabinet.city;
    marker.bindPopup(`
      <div class="map-popup">
        <h4>${cabinet.name}</h4>
        <p>${neighborhood || ''}</p>
        <button class="popup-details-btn">Voir détails</button>
      </div>
    `);
    marker.on('popupopen', () => {
      const detailsBtn = document.querySelector('.popup-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          showClinicDetails(cabinet, marker); 
          marker.closePopup();
        });
      }
    });
  });
  window.clinicMarkers = markers;
  addMapStyles(); // Ensure this is defined or CSS is directly in style.css
  generateSidebarCards(clinicsToMap); // Use cabinetsData
}

function addMapStyles() { // Unchanged, assumed CSS is in style.css or this function is complete
  const style = document.createElement('style');
  style.textContent = `
    .clinic-marker .marker-icon { width: 40px; height: 40px; background-color: #006D77; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.2); border: 2px solid white; }
    .clinic-marker .marker-icon i { transform: rotate(45deg); color: white; font-size: 16px; }
    .map-popup { text-align: center; padding: 5px; } .map-popup h4 { margin: 0 0 5px; font-size: 14px; color: #006D77; } .map-popup p { margin: 0 0 8px; font-size: 12px; color: #616161; }
    .popup-details-btn { background-color: #006D77; color: white; border: none; border-radius: 20px; padding: 5px 10px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; }
    .popup-details-btn:hover { background-color: #005863; }
    .leaflet-popup-content-wrapper { border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); } .leaflet-popup-tip { background-color: white; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
  `; // Simplified for brevity
  document.head.appendChild(style);
}

function showClinicDetails(cabinet, marker) { // Parameter is now 'cabinet'
  const detailPanel = document.getElementById('clinicDetailPanel');
  if (!detailPanel) return;

  let scheduleHtml = '';
  if (cabinet.opening_hours) {
    cabinet.opening_hours.forEach(day_schedule => {
      let dayHours = day_schedule.timeSlots.map(slot => `${slot.opens.replace(":", "h")} - ${slot.closes.replace(":", "h")}`).join(', ');
      scheduleHtml += `<li><div class="day">${day_schedule.dayOfWeekFRENCH}</div><div class="hours available">${dayHours}</div></li>`;
    });
  }
  if (cabinet.hours_details_note) {
    scheduleHtml += `<li><div class="day text-muted"><em>Note</em></div><div class="hours text-muted"><em>${cabinet.hours_details_note}</em></div></li>`;
  }
  if (!scheduleHtml) {
    scheduleHtml = '<li><div class="day">Horaires</div><div class="hours">Veuillez consulter le module de réservation.</div></li>';
  }
  
  let addressDisplay = cabinet.fullAddress || (cabinet.address_obj ? `${cabinet.address_obj.streetNumber} ${cabinet.address_obj.streetName}, ${cabinet.address_obj.postalCode} ${cabinet.address_obj.city}` : 'Adresse non disponible');
  let neighborhoodDisplay = cabinet.address_obj ? `${cabinet.address_obj.postalCode} - ${cabinet.address_obj.city}` : cabinet.city || '';

  detailPanel.innerHTML = `
    <div class="detail-panel-header"><h3>${cabinet.name}</h3><button class="close-panel-btn" aria-label="Fermer"><i class="fa-solid fa-times"></i></button></div>
    <div class="detail-panel-body">
      <div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-location-dot"></i> Adresse</h4>
        <p class="detail-text">${addressDisplay} (${neighborhoodDisplay})</p>
        ${cabinet.Maps_link ? `<a href="${cabinet.Maps_link}" class="detail-action-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-directions"></i> Itinéraire</a>` : ''}
      </div>
      <div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-clock"></i> Horaires</h4><ul class="schedule-list">${scheduleHtml}</ul></div>
      ${cabinet.notes ? `<div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-info-circle"></i> Notes</h4><p class="detail-text">${cabinet.notes}</p></div>` : ''}
      <div class="detail-action"><a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}" class="book-btn btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Prendre rendez-vous</a></div>
    </div>`; // Updated link to RDV page
  detailPanel.classList.add('active');
  const closeBtn = detailPanel.querySelector('.close-panel-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => detailPanel.classList.remove('active'));
  
  if (window.clinicMap && marker && typeof marker.getLatLng === 'function') { // Check marker validity
    window.clinicMap.panTo(marker.getLatLng(), { animate: true/*, padding: [0, 400, 0, 0]*/ }); // Padding might be too aggressive, consider panel placement
  }
}

function generateSidebarCards(cabinetsData) { // Parameter is cabinetsData
  const sidebarContainer = document.querySelector('.sidebar-clinics');
  if (!sidebarContainer) return;
  sidebarContainer.innerHTML = '';
  
  cabinetsData.forEach(cabinet => { // Use cabinetsData
    if (cabinet.id === 'video') return; // Skip video consultation for physical sidebar

    let scheduleStr = '';
    if (cabinet.opening_hours) {
      scheduleStr = cabinet.opening_hours.map(day_schedule => 
        `${day_schedule.dayOfWeekFRENCH}: ${day_schedule.timeSlots.map(slot => `${slot.opens.replace(":", "h")}-${slot.closes.replace(":", "h")}`).join(' & ')}`
      ).join('<br>');
    }
    if (cabinet.hours_details_note) {
        scheduleStr += (scheduleStr ? '<br>' : '') + `<em>${cabinet.hours_details_note}</em>`;
    }
    if (!scheduleStr) scheduleStr = "Consultez les disponibilités.";

    const card = document.createElement('div');
    card.className = 'sidebar-clinic-card';
    card.setAttribute('data-clinic-id', cabinet.id); // Use new ID
    let neighborhoodDisplay = cabinet.address_obj ? `${cabinet.address_obj.postalCode} - ${cabinet.address_obj.city}` : cabinet.city || '';
    card.innerHTML = `
      <h4>${cabinet.name}</h4>
      <div class="clinic-address"><i class="fa-solid fa-location-dot"></i><span>${cabinet.fullAddress || 'Adresse non spécifiée'}<br>${neighborhoodDisplay}</span></div>
      <div class="clinic-schedule"><div class="schedule-badge">${scheduleStr}</div></div>
      <a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}" class="card-action-btn"><i class="fa-solid fa-calendar-check"></i> Prendre rendez-vous</a>`;
    
    card.addEventListener('click', () => {
      if (window.clinicMarkers && window.clinicMarkers[cabinet.id]) { // Use new ID
        showClinicDetails(cabinet, window.clinicMarkers[cabinet.id]);
        highlightSidebarCard(cabinet.id);
      } else {
        // Fallback if marker not found (e.g. if map not active / fully init)
        console.warn("Marker not found for sidebar click:", cabinet.id);
         // Potentially still show a simplified detail panel or switch to map view
      }
    });
    sidebarContainer.appendChild(card);
  });
   // Update results count
   const resultsCountElement = document.querySelector('.sidebar-results');
   if (resultsCountElement) {
       const count = sidebarContainer.children.length;
       resultsCountElement.textContent = `${count} clinique${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`;
   }
}

function generateClinicCards(cabinetsData) { // Parameter is cabinetsData
  const gridContainer = document.querySelector('.clinic-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';
  
  cabinetsData.forEach(cabinet => { // Use cabinetsData
    if (cabinet.id === 'video') return; // Skip video consultation for this grid

    const daysList = cabinet.opening_hours ? cabinet.opening_hours.map(day_schedule => day_schedule.dayOfWeekFRENCH.toLowerCase()) : [];
    
    let scheduleBadges = '';
    if (cabinet.opening_hours) {
      cabinet.opening_hours.forEach(day_schedule => {
        day_schedule.timeSlots.forEach(slot => {
            scheduleBadges += `<div class="schedule-badge">${day_schedule.dayOfWeekFRENCH}: ${slot.opens.replace(":", "h")} - ${slot.closes.replace(":", "h")}</div>`;
        });
      });
    }
    if (cabinet.hours_details_note) {
        scheduleBadges += `<div class="schedule-badge schedule-note"><em>${cabinet.hours_details_note}</em></div>`; // Added class for styling note
    }
    if (!scheduleBadges) {
        scheduleBadges = '<div class="schedule-badge">Horaires non spécifiés ou sur demande.</div>';
    }

    const daysOfWeek = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    const dayIndicators = daysOfWeek.map(day => {
      const isAvailable = daysList.includes(day.toLowerCase()) ? 'available' : '';
      return `<span class="day-indicator ${isAvailable}" title="${day.charAt(0).toUpperCase() + day.slice(1)}">${day.charAt(0).toUpperCase()}</span>`;
    }).join('');
    
    let neighborhoodDisplay = cabinet.address_obj ? `${cabinet.address_obj.postalCode} - ${cabinet.address_obj.city}` : cabinet.city || '';
    const card = document.createElement('div');
    card.className = 'clinic-card';
    card.setAttribute('data-days', daysList.join(' ')); // For filtering
    card.setAttribute('data-clinic-id', cabinet.id); // For potential map interaction from list
    card.innerHTML = `
      <h3 class="clinic-name">
        <a href="/fr/cabinets/${cabinet.id}/" class="clinic-name-link">
          ${cabinet.name} <i class="fas fa-info-circle fa-xs clinic-info-icon"></i>
        </a>
      </h3>
      <div class="clinic-meta"><span class="clinic-neighborhood">${neighborhoodDisplay}</span></div>
      <div class="clinic-address"><i class="fa-solid fa-location-dot"></i><span>${cabinet.fullAddress || 'Adresse non disponible'}</span></div>
      <div class="availability-week">${dayIndicators}</div>
      <div class="clinic-schedule">${scheduleBadges}</div>
      <a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}" class="clinic-book-btn"><i class="fa-solid fa-calendar-check"></i> Rendez-vous</a>`;
    gridContainer.appendChild(card);
  });
}

function highlightSidebarCard(clinicId) {
  document.querySelectorAll('.sidebar-clinic-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-clinic-id') === clinicId);
  });
  const targetCard = document.querySelector(`.sidebar-clinic-card[data-clinic-id="${clinicId}"]`);
  if (targetCard) {
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function initLocateMe(cabinetsData) { // Parameter is cabinetsData
  const locateBtn = document.querySelector('.locate-me-btn');
  if (!locateBtn) return;
  
  locateBtn.addEventListener('click', () => {
    locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Localisation...';
    locateBtn.disabled = true;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          const physicalCabinets = cabinetsData.filter(c => c.id !== 'video' && c.coordinates && c.coordinates.length === 2); // Ensure we only use physical clinics with coords
          if (physicalCabinets.length === 0) {
            alert('Aucune clinique physique trouvée pour la géolocalisation.');
            resetLocateBtn();
            return;
          }
          const nearest = findNearestClinic(userLocation, physicalCabinets);
          
          if (nearest && window.clinicMap && window.clinicMarkers && window.clinicMarkers[nearest.id]) {
            const mapViewToggle = document.querySelector('.view-toggle[data-view="map"]');
            if (mapViewToggle && !mapViewToggle.classList.contains('active')) {
              mapViewToggle.click(); // Switch to map view
            }
            setTimeout(() => { // Delay to allow map view to activate
                const marker = window.clinicMarkers[nearest.id];
                window.clinicMap.flyTo(marker.getLatLng(), 15, { animate: true, duration: 1 });
                setTimeout(() => {
                    marker.openPopup();
                    showClinicDetails(nearest, marker);
                    highlightSidebarCard(nearest.id);
                }, 1000); // Delay for flyTo animation
            }, 200);
          } else if (nearest) {
             alert(`Clinique la plus proche trouvée : ${nearest.name} à ${nearest.fullAddress}. Activez la vue carte pour la localiser.`);
          } else {
            alert('Aucune clinique trouvée à proximité.');
          }
          resetLocateBtn();
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Impossible de déterminer votre position. Veuillez vérifier vos paramètres de localisation.');
          resetLocateBtn();
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 } // Increased timeout
      );
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
      resetLocateBtn();
    }
  });
}
function resetLocateBtn() {
    const locateBtn = document.querySelector('.locate-me-btn');
    if(locateBtn) {
        locateBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> À proximité';
        locateBtn.disabled = false;
    }
}


function findNearestClinic(userLocation, clinicsToSearch) { // Parameter is clinicsToSearch
  let nearestClinic = null;
  let shortestDistance = Infinity;
  
  clinicsToSearch.forEach(cabinet => { // Use cabinetsData
    if (!cabinet.coordinates || cabinet.coordinates.length !== 2) return; // Skip if no coords
    const distance = calculateDistance(userLocation[0], userLocation[1], cabinet.coordinates[0], cabinet.coordinates[1]);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestClinic = cabinet;
    }
  });
  return nearestClinic;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
// END Clinic Finder Functionality
// ----------------------------------------------------------------------------------

// Animated Stats (Unchanged from original, assuming it works if elements exist)
function initializeAnimatedStats() {
  const statElements = document.querySelectorAll('.specialty-card .stat-value');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('stat-animated')) {
              animateStat(entry.target);
              entry.target.classList.add('stat-animated');
              obs.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });
  statElements.forEach(el => observer.observe(el));
}

function animateStat(element) {
  const targetValueString = element.textContent || ""; // Ensure textContent is not null
  const match = targetValueString.match(/(-?\d+[\.,]?\d*)(.*)/);
  if (!match) return;

  const targetValue = parseFloat(match[1].replace(',', '.'));
  const suffix = match[2].trim();
  const duration = 1500; 
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  function countUp() {
      frame++;
      const progress = frame / totalFrames;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      let currentValue = targetValue * easeOutProgress;

      if (targetValue % 1 !== 0) { // Float
           currentValue = parseFloat(currentValue.toFixed(1));
      } else { // Integer
           currentValue = Math.round(currentValue);
      }
      element.textContent = currentValue + suffix;
      if (frame < totalFrames) {
          requestAnimationFrame(countUp);
      } else {
          element.textContent = targetValueString; // Ensure final exact value
      }
  }
  requestAnimationFrame(countUp);
}

// Fix for mobile card positioning (Unchanged)
function fixMobileCardPositioning() {
  if (window.innerWidth < 768) {
    const clinicCards = document.querySelectorAll('.clinic-card');
    clinicCards.forEach((card, index) => {
      card.style.position = 'relative';
      card.style.marginBottom = '1rem';
      card.style.zIndex = (100 - index).toString(); 
      card.style.transform = 'none';
    });
  }
}

// Ensure animation classes are added (Original logic at the end of your JS)
// This part seems to have been merged into initializeScrollAnimations or is redundant
// Re-adding it for completeness if it was intended to be separate:
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.section-header').forEach(header => {
    if (!header.classList.contains('animate-on-scroll')) { // Add if not already there
        header.classList.add('animate-on-scroll', 'fade-up');
    }
  });
  document.querySelectorAll('.specialty-card, .success-card, .science-pillar, .contact-form-container').forEach(element => {
    if (!element.classList.contains('animate-on-scroll')) {
        element.classList.add('animate-on-scroll', 'fade-up');
    }
  });
  document.querySelectorAll('.contact-list, .approach-list').forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach((item, index) => {
        if(!item.classList.contains('animate-on-scroll')) {
            item.classList.add('animate-on-scroll', 'fade-in');
            item.style.animationDelay = `${index * 0.1}s`;
        }
    });
  });
});
// Note: The initHeroAnimations, initTextHighlights, initFeatureBadges functions from original main.js 
// seemed specific to a hero section animation script and were separate.
// If they are still needed and not part of initializeHero, they should be kept.
// For now, assuming initializeHero covers necessary hero interactions.