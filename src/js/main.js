// main.js - Diaeta Website Functionality

document.addEventListener('DOMContentLoaded', function() {
  initializeHeader();
  initializeHero();
  initializeSpecialties();
  initializeContactForm();
  initializeScrollAnimations();
  initializeLazyLoading();
  
  setTimeout(fixMobileImages, 1000);
  window.addEventListener('resize', fixMobileImages);
  
  initScienceSection();
  improveScienceSectionMobile();
  
  if (window.innerWidth < 768) {
    addTouchInteractions();
    improveMobileAnimations();
  }
  
  const cabinetExplorerMarker = document.getElementById('cabinet-explorer-main-content');
  if (cabinetExplorerMarker) {
    if (typeof window.diaetaCabinetsData !== 'undefined' && window.diaetaCabinetsData.length > 0) {
        console.log("Diaeta: Initializing Clinic Finder on cabinets-bruxelles.html with data:", window.diaetaCabinetsData);
        initClinicFinder(window.diaetaCabinetsData);
    } else {
        console.warn("Diaeta: Cabinet Explorer section present, but window.diaetaCabinetsData is missing or empty.");
        const cabinetCardContainer = document.getElementById('cabinetCardContainer');
        const loadingMsg = cabinetCardContainer ? cabinetCardContainer.querySelector('.loading-message') : null;
        const noResultsMsg = cabinetCardContainer ? cabinetCardContainer.querySelector('.no-results-message') : null;

        if (loadingMsg) loadingMsg.style.display = 'none';
        if (noResultsMsg) {
           const currentLang = window.pageLang || 'fr';
           const contactLink = `/${currentLang}/contact/`;
           noResultsMsg.innerHTML = `<i>${currentLang === 'fr' ? "Impossible de charger les informations des cabinets. Données non disponibles ou vides. Veuillez <a href='" + contactLink + "'>nous contacter</a>." : "Could not load clinic information. Data unavailable or empty. Please <a href='" + contactLink + "'>contact us</a>."}</i>`;
           noResultsMsg.style.display = 'block';
        }
    }
  }
  
  initializeAnimatedStats();

  // Consider removing if .clinic-card is no longer used or fixMobileCardPositioning is empty
  if (document.querySelector('.clinic-card')) { 
    fixMobileCardPositioning();
    window.addEventListener('resize', fixMobileCardPositioning);
  }

  const defaultIframe = document.getElementById('defaultiFrame');
  if (defaultIframe && document.getElementById('booking-module-wrapper')) { // Check if on rendez-vous.html
    initializeRendezVousPage();
  }
  initializeScrollToLinks(); 
  initializeScrollToTopButton();
  initializeAdvancedCookieConsent();
});

function initializeAdvancedCookieConsent() {
  const container = document.getElementById('cookieConsentContainer');
  const mainBanner = document.getElementById('cookieMainBanner');
  const preferencesModal = document.getElementById('cookiePreferencesModal');

  const acceptAllBtn = document.getElementById('cookieAcceptAllBtn');
  const declineAllBtn = document.getElementById('cookieDeclineAllBtn');
  const customizeBtn = document.getElementById('cookieCustomizeBtn');
  const savePreferencesBtn = document.getElementById('cookieSavePreferencesBtn');
  const closeModalBtn = document.getElementById('cookieModalCloseBtn');

  const necessaryCheckbox = document.getElementById('cookieCatNecessary'); // Already checked & disabled
  const analyticsCheckbox = document.getElementById('cookieCatAnalytics');
  const marketingCheckbox = document.getElementById('cookieCatMarketing');

  const cookieName = 'diaeta_cookie_preferences';
  const cookieVersion = '1.0'; // Increment if structure changes to re-prompt users

  const consentMaxAgeDays = 180; // 6 months
  const nowMs = Date.now();

  if (!container || !mainBanner || !preferencesModal || !acceptAllBtn || !customizeBtn || !savePreferencesBtn || !closeModalBtn || !analyticsCheckbox || !marketingCheckbox ) {
    console.warn('Advanced cookie consent elements not found. Skipping initialization.');
    return;
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      try {
        return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/; SameSite=Lax";
  };

  const showMainBanner = () => {
    container.style.display = 'block'; // Show the main container first
    mainBanner.style.display = 'block'; // CSS will handle 'active' class for animation
    setTimeout(() => mainBanner.classList.add('active'), 50);
    preferencesModal.classList.remove('active');
    preferencesModal.style.display = 'none';
  };

  const hideMainBanner = () => {
    mainBanner.classList.remove('active');
    setTimeout(() => {
        mainBanner.style.display = 'none';
        if (!preferencesModal.classList.contains('active')) {
            container.style.display = 'none';
        }
    }, 400); // Matches CSS transition
  };

  const showPreferencesModal = () => {
    container.style.display = 'block';
    preferencesModal.style.display = 'block';
    setTimeout(() => preferencesModal.classList.add('active'), 50);
    hideMainBanner(); // Hide main banner if showing modal
  };

  const hidePreferencesModal = () => {
    preferencesModal.classList.remove('active');
    setTimeout(() => {
        preferencesModal.style.display = 'none';
        if (!mainBanner.classList.contains('active')) { // If main banner isn't also trying to show
             container.style.display = 'none';
        }
    }, 400);
  };
  
  const activateDeferredScripts = (category) => {
      const selector = `script[type="text/plain"][data-cookie-category="${category}"]`;
      document.querySelectorAll(selector).forEach(node => {
          const s = document.createElement('script');
          [...node.attributes].forEach(attr=>{
              if(attr.name!=='type') s.setAttribute(attr.name, attr.value);
          });
          s.setAttribute('data-loaded-category', category);
          s.text = node.text || '';
          node.parentNode.replaceChild(s, node);
      });
  };
  const disableCategory = (category) => {
      // This is a simple placeholder: remove dynamically added scripts
      document.querySelectorAll(`script[data-loaded-category="${category}"]`).forEach(s=>s.remove());
  };
  const applyConsent = (preferences) => {
    if (preferences.analytics) {
      activateDeferredScripts('analytics');
    } else {
      disableCategory('analytics');
    }
    if (preferences.marketing) {
      activateDeferredScripts('marketing');
    } else {
      disableCategory('marketing');
    }
  };

  const loadCurrentPreferencesToModal = () => {
    const currentPrefs = getCookie(cookieName);
    if (currentPrefs && currentPrefs.version === cookieVersion) {
      analyticsCheckbox.checked = currentPrefs.preferences.analytics === true;
      marketingCheckbox.checked = currentPrefs.preferences.marketing === true;
    } else {
      // Default settings if no cookie or old version (usually all non-essential off)
      analyticsCheckbox.checked = false;
      marketingCheckbox.checked = false;
    }
  };

  const showIfOldOrMissing = () => {
      const currentPrefs = getCookie(cookieName);
      if (!currentPrefs || currentPrefs.version !== cookieVersion) {
          showMainBanner();
          return;
      }
      const ts = currentPrefs.ts || 0;
      if (nowMs - ts > consentMaxAgeDays*24*60*60*1000) {
          // expired – ask again
          showMainBanner();
      } else {
          hideMainBanner();
      }
  };

  // --- Event Listeners ---
  acceptAllBtn.addEventListener('click', () => {
    const preferences = { necessary: true, analytics: true, marketing: true };
    setCookie(cookieName, { version: cookieVersion, ts: Date.now(), preferences: preferences }, 365*5);
    applyConsent(preferences);
    hideMainBanner();
  });

  if(declineAllBtn) { // If the decline all button exists
    declineAllBtn.addEventListener('click', () => {
        const preferences = { necessary: true, analytics: false, marketing: false };
        setCookie(cookieName, { version: cookieVersion, ts: Date.now(), preferences: preferences }, 365*5);
        applyConsent(preferences);
        hideMainBanner();
    });
  }

  customizeBtn.addEventListener('click', () => {
    loadCurrentPreferencesToModal();
    showPreferencesModal();
  });

  closeModalBtn.addEventListener('click', () => {
    hidePreferencesModal();
    // If no decision was made before opening modal, show main banner again
    const consent = getCookie(cookieName);
    if (!consent || consent.version !== cookieVersion) {
        showMainBanner();
    }
  });

  savePreferencesBtn.addEventListener('click', () => {
    const preferences = {
      necessary: true, // Always true
      analytics: analyticsCheckbox.checked,
      marketing: marketingCheckbox.checked
    };
    setCookie(cookieName, { version: cookieVersion, ts: Date.now(), preferences: preferences }, 365*5);
    applyConsent(preferences);
    hidePreferencesModal();
  });

  // --- Initial Load Logic ---
  const currentConsent = getCookie(cookieName);
  if (!currentConsent || currentConsent.version !== cookieVersion) {
    showMainBanner();
    loadCurrentPreferencesToModal(); // Pre-load modal with defaults even if not shown yet
  } else {
    applyConsent(currentConsent.preferences);
    loadCurrentPreferencesToModal(); // Ensure modal is updated if opened later
    container.style.display = 'none'; // Already consented, hide everything
  }
  
  // Make manageCookieConsent globally available
  window.manageCookieConsent = () => {
    loadCurrentPreferencesToModal();
    showPreferencesModal();
  };

  // Initial load existing prefs into modal & decide if we show banner
  loadCurrentPreferencesToModal();
  showIfOldOrMissing();

  // store consent helper now adds timestamp
  const savePreferencesCookie = (preferences) => {
      setCookie(cookieName, { version: cookieVersion, ts: Date.now(), preferences: preferences }, 365*5);
  };

  // replace all setCookie calls to use savePreferencesCookie

  // ... at end of initializeAdvancedCookieConsent before closing of function
  const manageLink = document.getElementById('cookieManageLink');
  if (manageLink) manageLink.addEventListener('click', function(e){ e.preventDefault(); showPreferencesModal(); });
}

// Placeholder for script loading functions
// function loadAnalyticsScripts() { console.log("Placeholder: Load Analytics Scripts"); }
// function unloadAnalyticsScripts() { console.log("Placeholder: Unload Analytics Scripts (clear cookies, etc.)"); }
// function loadMarketingScripts() { console.log("Placeholder: Load Marketing Scripts"); }
// function unloadMarketingScripts() { console.log("Placeholder: Unload Marketing Scripts (clear cookies, etc.)"); }


function initializeScrollToTopButton() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const scrollThreshold = 300; // Show button after scrolling 300px

  if (!scrollToTopBtn) {
    return; // Button not found
  }

  // Remove inline display style if present, to allow CSS to control visibility
  scrollToTopBtn.style.display = ''; 

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initializeHeader() {
  console.log('Diaeta: Initializing header...');
  try {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (!header) return;

  // Throttled scroll handler for better performance
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler(); // Initial call 

    console.log('Diaeta: Setting up menu toggle listener...');
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      console.log('Diaeta: Menu toggle clicked.'); // Added log
      const isOpen = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('mobile-menu-is-open', isOpen); 

      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
      }
    });
  }

  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      console.log('Language toggle clicked:', this); // Log the clicked element
      e.preventDefault();
      e.stopPropagation();
      const langSelector = this.closest('.lang-selector');
      console.log('Found langSelector:', langSelector); // Log the found parent
      if (!langSelector) {
        console.error('Diaeta: .lang-selector not found for this toggle.');
        return;
      }
      const currentlyOpen = langSelector.classList.contains('open');
      console.log('Is currently open?', currentlyOpen);

      // Close other potentially open language selectors
      document.querySelectorAll('.lang-selector.open').forEach(sel => {
        if (sel !== langSelector) {
          console.log('Closing other langSelector:', sel);
          sel.classList.remove('open');
          sel.querySelector('.lang-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      langSelector.classList.toggle('open', !currentlyOpen);
      this.setAttribute('aria-expanded', String(!currentlyOpen));
      console.log('Toggled "open" class. Now open?', langSelector.classList.contains('open'), 'Aria-expanded set to:', this.getAttribute('aria-expanded'));
    });
  });

  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const targetLangDisplay = (this.textContent || "FR").substring(0,2).toUpperCase();
      document.querySelectorAll('.lang-toggle span').forEach(span => span.textContent = targetLangDisplay);
      document.querySelectorAll('.lang-option.active').forEach(opt => {
          opt.classList.remove('active');
          opt.removeAttribute('aria-current');
      });
      this.classList.add('active');
      this.setAttribute('aria-current', 'true');
      this.closest('.lang-selector').classList.remove('open');
      this.closest('.lang-selector').querySelector('.lang-toggle').setAttribute('aria-expanded', 'false');
      window.location.href = this.href;
    });
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-selector')) {
      document.querySelectorAll('.lang-selector.open').forEach(selector => {
        selector.classList.remove('open');
        selector.querySelector('.lang-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Initialize optimized navigation listeners
  if (mainNav) {
    // Click listener for top-level navigation links
    const topLevelNavLinks = mainNav.querySelectorAll('.nav-list > .nav-item > .nav-link');
    topLevelNavLinks.forEach(link => {
      link.addEventListener('click', function(navClickEvent) {
        const isPureBootstrapDropdownToggle = this.matches('[data-bs-toggle="dropdown"]') && this.getAttribute('href') === '#';

        if (isPureBootstrapDropdownToggle) {
          // Let Bootstrap handle dropdown toggles
          return;
        }
        
        setActiveNavLink(this);
        
        // Handle same-page anchor scrolling
        const href = this.getAttribute('href');
        if (href && href.includes('#') && !href.startsWith("http")) {
          const targetId = href.split('#')[1];
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const currentBase = window.location.pathname.split('#')[0].replace(/\/$/, "");
            const linkBase = href.split('#')[0].replace(/\/$/, "");
            if (linkBase === "" || linkBase === currentBase || `/${linkBase}` === currentBase || linkBase === `/${currentBase}`) {
              navClickEvent.preventDefault();
              const headerHeight = header ? header.offsetHeight : 0;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          }
        }
        
        closeMobileMenu();
      });
    });

    // Listener for dropdown items
    mainNav.querySelectorAll('.dropdown-menu .dropdown-item').forEach(itemLink => {
      itemLink.addEventListener('click', function() {
        setActiveNavLink(this);
        closeMobileMenu();
      });
    });
  }

    // Mobile Menu Accordion Logic
    const mainNavForAccordion = document.getElementById('main-nav');
    if (mainNavForAccordion) {
        const dropdownToggles = mainNavForAccordion.querySelectorAll('.nav-list > .nav-item.dropdown > .nav-link.dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('show.bs.dropdown', function (event) {
                // Only run this logic if in mobile view.
                if (window.innerWidth >= 1200) return; // Desktop breakpoint

                // const currentDropdownMenu = this.nextElementSibling; // The ul.dropdown-menu being opened - Not needed for this logic

                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== this) { // Don't mess with the current toggle
                        const otherDropdownMenu = otherToggle.nextElementSibling;
                        if (otherDropdownMenu && otherDropdownMenu.classList.contains('show')) {
                            const instance = bootstrap.Dropdown.getInstance(otherToggle);
                            if (instance) {
                                instance.hide();
                            }
                        }
                    }
                });
            });
        });
    }

// Function removed - replaced by optimized setActiveNavLink

  function setActiveNavLinkOnLoad() {
    if (!mainNav) return;
    let currentPath = window.location.pathname;
    // Normalize currentPath: remove trailing 'index.html' or '/'
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length);
    }
    if (currentPath !== '/' && currentPath.endsWith('/')) {
        currentPath = currentPath.substring(0, currentPath.length - 1);
    }
    // Handle base paths for different languages
    const langBasePath = "/" + (document.documentElement.lang || "fr");
    if (currentPath === "" || currentPath === langBasePath.substring(0, langBasePath.length -1) ) { // e.g. /en or /fr
        currentPath = langBasePath;
    }


    const navLinks = mainNav.querySelectorAll('.nav-list > .nav-item > .nav-link');
    const dropdownItems = mainNav.querySelectorAll('.dropdown-menu .dropdown-item');
    let RDMpresent = false; 

    navLinks.forEach(link => link.classList.remove('active'));
    dropdownItems.forEach(link => link.classList.remove('active'));

    dropdownItems.forEach(link => {
        let linkHref = (link.getAttribute('href') || "");
        if (linkHref.endsWith('/index.html')) {
            linkHref = linkHref.substring(0, linkHref.length - 'index.html'.length);
        }
        if (linkHref !== '/' && linkHref.endsWith('/')) {
            linkHref = linkHref.substring(0, linkHref.length - 1);
        }
        // Ensure base path for linkHref matches current language for homepage links
        if (linkHref === "" || linkHref === "/") { // Handles cases like href="/" or href=""
             linkHref = langBasePath;
        }
        if (linkHref === currentPath) {
            link.classList.add('active');
            const parentDropdown = link.closest('.nav-item.dropdown');
            if (parentDropdown) {
                const parentToggleLink = parentDropdown.querySelector('.nav-link.dropdown-toggle');
                if (parentToggleLink) parentToggleLink.classList.add('active');
            }
            RDMpresent = true;
        }
    });

    if (!RDMpresent) {
        navLinks.forEach(link => {
            let linkHref = (link.getAttribute('href') || "");
            if (linkHref.endsWith('/index.html')) {
                linkHref = linkHref.substring(0, linkHref.length - 'index.html'.length);
            }
            if (linkHref !== '/' && linkHref.endsWith('/')) {
                linkHref = linkHref.substring(0, linkHref.length - 1);
            }
            // Ensure base path for linkHref matches current language for homepage links
            if (linkHref === "" || linkHref === "/") { // Handles cases like href="/" or href=""
                 linkHref = langBasePath;
            }
            if (linkHref === currentPath) {
                link.classList.add('active');
                RDMpresent = true;
            }
        });
    }
    
    // Fallback for section pages like news or locations if no specific item is active
    if (!RDMpresent) {
        // Example: if currentPath is /en/news/categories/some-category or /en/news/page/2
        // We want to highlight the main /en/news/ link.
        // The actual href in header_en.njk for news is /en/news/ and for locations is /en/locations/
        if (currentPath.startsWith(langBasePath + '/news')) {
            const newsLink = mainNav.querySelector(`.nav-link[href="${langBasePath}/news/"]`);
            if (newsLink) newsLink.classList.add('active');
        } else if (currentPath.startsWith(langBasePath + '/locations')) {
            const locationsLink = mainNav.querySelector(`.nav-link[href="${langBasePath}/locations/"]`);
            if (locationsLink) locationsLink.classList.add('active');
        }
        // Add other similar fallback checks if needed for other sections
    }
  }
  setActiveNavLinkOnLoad();
  console.log('Diaeta: Header initialization complete.');
  } catch (error) {
    console.error('Diaeta: Error during initializeHeader:', error);
  }
}

function initializeHero() {
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo && window.innerWidth < 768) {
      heroVideo.pause();
  }
  const highlights = document.querySelectorAll('.hero-description .text-highlight');
  if (!highlights.length) return;
  const tooltipContents = {
    "expertise scientifique": "Approche basée sur les dernières recherches validées en nutrition et métabolisme.",
    "approche personnalisée": "Plans adaptés à votre profil unique : métabolisme, préférences, et style de vie."
  };
  highlights.forEach(highlight => {
    const tooltipText = tooltipContents[highlight.textContent.trim().toLowerCase()] || "Information complémentaire.";
    highlight.setAttribute('data-tooltip', tooltipText);
    highlight.setAttribute('tabindex', '0'); 
    highlight.setAttribute('role', 'button');
    highlight.setAttribute('aria-describedby', 'hero-tooltip'); 
    const showTooltip = () => {
        let tooltip = document.getElementById('hero-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'hero-tooltip';
            tooltip.className = 'hero-highlight-tooltip'; 
            document.body.appendChild(tooltip);
        }
        tooltip.textContent = highlight.getAttribute('data-tooltip');
        const rect = highlight.getBoundingClientRect();
        let topPos = rect.top - tooltip.offsetHeight - 10 + window.scrollY; 
        let leftPos = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + window.scrollX;
        if (topPos < window.scrollY) { 
            topPos = rect.bottom + 10 + window.scrollY; 
        }
        if (leftPos < window.scrollX) leftPos = window.scrollX + 5; 
        if (leftPos + tooltip.offsetWidth > window.innerWidth + window.scrollX) {
            leftPos = window.innerWidth + window.scrollX - tooltip.offsetWidth - 5; 
        }
        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
        tooltip.classList.add('visible');
    };
    const hideTooltip = () => {
        const tooltip = document.getElementById('hero-tooltip');
        if (tooltip) tooltip.classList.remove('visible');
    };
    highlight.addEventListener('mouseenter', showTooltip);
    highlight.addEventListener('focus', showTooltip);
    highlight.addEventListener('mouseleave', hideTooltip);
    highlight.addEventListener('blur', hideTooltip);
  });
}

function initializeSpecialties() { /* Currently empty */ }

function initializeContactForm() {
  const form = document.getElementById('appointmentForm'); 
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      showFormMessage('Votre demande de rendez-vous a été envoyée (simulation).', 'success', form);
      form.reset();
    });
  }
  const contactQuestionForm = document.getElementById('contactQuestionForm'); 
  const formMessageContactDiv = document.getElementById('form-message-contact');
  if (contactQuestionForm && formMessageContactDiv) {
      const submitButton = contactQuestionForm.querySelector('button[type="submit"]');
      contactQuestionForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const originalButtonText = submitButton.innerHTML;
          submitButton.disabled = true;
          submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';
          formMessageContactDiv.innerHTML = '';
          const formData = new FormData(contactQuestionForm);
          const formObject = {};
          formData.forEach((value, key) => { formObject[key] = value; });
          const backendUrl = contactQuestionForm.action;
          fetch(backendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(formObject)
          })
          .then(response => {
              if (!response.ok) {
                  return response.json().then(errData => { throw new Error(errData.message || `Erreur HTTP ${response.status}`); })
                                   .catch(() => { throw new Error(`Erreur HTTP ${response.status}`); });
              }
              return response.json();
          })
          .then(data => {
              if (data.success) {
                  formMessageContactDiv.innerHTML = `<div class="alert alert-success" role="alert">${data.message || 'Votre question a bien été envoyée !'}</div>`;
                  contactQuestionForm.reset();
              } else {
                  formMessageContactDiv.innerHTML = `<div class="alert alert-danger" role="alert">${data.message || "Une erreur s'est produite."}</div>`;
              }
          })
          .catch(error => {
              console.error('Erreur:', error);
              formMessageContactDiv.innerHTML = `<div class="alert alert-danger" role="alert">Impossible d'envoyer: ${error.message}</div>`;
          })
          .finally(() => {
              setTimeout(() => {
                  submitButton.disabled = false;
                  submitButton.innerHTML = originalButtonText;
              }, 1000);
          });
      });
  }
}

function showFormMessage(message, type, formElement) {
  const formMessageContainer = formElement.parentNode.querySelector('.form-message-container') || formElement.parentNode;
  const existingMessage = formMessageContainer.querySelector('.form-message-dynamic');
  if (existingMessage) existingMessage.remove();
  const messageEl = document.createElement('div');
  messageEl.className = `form-message-dynamic alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
  messageEl.textContent = message;
  messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
  if (formMessageContainer === formElement.parentNode) {
      formElement.parentNode.insertBefore(messageEl, formElement);
  } else {
      formMessageContainer.appendChild(messageEl);
  }
  messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (type === 'success') setTimeout(() => messageEl.remove(), 7000);
}

function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;
  const observerCallback = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  };
  const observerOptions = { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  animatedElements.forEach(el => observer.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            el.classList.add('animated');
        }
    });
  }, 300);
}

function initializeLazyLoading() {
  const customLazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && customLazyImages.length > 0) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    customLazyImages.forEach(img => imgObserver.observe(img));
  } else if (customLazyImages.length > 0) { 
    customLazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
    });
  }
}

function fixMobileImages() { /* Placeholder */ }
function initScienceSection() { /* Placeholder */ }
function improveScienceSectionMobile() { /* Placeholder */ }
function addTouchInteractions() { /* Placeholder */ }
function improveMobileAnimations() { /* Placeholder */ }

function initializeAnimatedStats() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200; 
    const animateCounter = (counter) => {
        const targetText = counter.getAttribute('data-target');
        if (!targetText) return;
        const isPercentage = targetText.includes('%');
        const isRange = targetText.includes('à') || targetText.includes('-'); 
        const isSign = targetText.startsWith('+') || targetText.startsWith('-');
        const isSimpleText = !/[0-9]/.test(targetText); 
        if (isSimpleText) { counter.innerText = targetText; return; }
        let targetNum;
        if (isRange) {
            setTimeout(() => { counter.innerText = targetText; }, speed / 2);
            return;
        } else {
            targetNum = parseFloat(targetText.replace(/[^0-9.,-]+/g,"").replace(',', '.'));
        }
        if (isNaN(targetNum)) { counter.innerText = targetText; return; }
        const updateCount = () => {
            const currentNumText = counter.innerText.replace(/[^0-9.,-]+/g,"").replace(',', '.');
            const currentNum = parseFloat(currentNumText) || 0;
            const increment = targetNum / speed; 
            if ( (increment > 0 && currentNum < targetNum) || (increment < 0 && currentNum > targetNum) ) {
                let nextNum = currentNum + increment;
                if ((increment > 0 && nextNum > targetNum) || (increment < 0 && nextNum < targetNum)) {
                    nextNum = targetNum;
                }
                let displayNum = parseFloat(nextNum.toFixed(1)); 
                if (Number.isInteger(targetNum) && Number.isInteger(displayNum)) { 
                    displayNum = parseInt(displayNum);
                }
                let displayText = displayNum.toString();
                if (isSign && !displayText.startsWith('+') && !displayText.startsWith('-') && targetNum !==0) {
                     displayText = targetText.substring(0,1) + displayText;
                }
                if (isPercentage) displayText += '%';
                counter.innerText = displayText;
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = targetText; 
            }
        };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('animated-stat')) {
                    counter.classList.add('animated-stat');
                    counter.innerText = targetText.includes('%') ? '0%' : '0'; 
                    updateCount();
                }
            });
        }, { threshold: 0.5 }); 
        observer.observe(counter);
    };
    counters.forEach(animateCounter);
}

function fixMobileCardPositioning() { /* Placeholder */ }

// Global vars for map and markers, ensure defined at the top if not already
// let clinicMap; 
// let clinicMarkers = {}; 

function initClinicFinder(cabinetsData) {
  if (!cabinetsData || cabinetsData.length === 0) {
    console.warn("Diaeta: Cabinets data is missing or empty for Clinic Finder init.");
    const cardContainer = document.getElementById('cabinetCardContainer');
    if (cardContainer) { /* ... error display ... */ }
    return;
  }
  
  const physicalClinics = cabinetsData.filter(cabinet => cabinet.id !== 'video' && cabinet.coordinates && cabinet.coordinates.length === 2);

  initViewToggles(); 
  initDayFilters(cabinetsData); 

  if (document.getElementById('clinicsMap')) {
    initMap(physicalClinics); 
  }
  
  initLocateMe(physicalClinics); 
  
  const allDaysButton = document.querySelector('.clinic-filters .filter-btn[data-day="all"]');
  if (allDaysButton) {
      allDaysButton.classList.add('active');
      allDaysButton.setAttribute('aria-pressed', 'true');
      setTimeout(() => {
        if (typeof filterAndDisplayClinics === "function") {
            filterAndDisplayClinics('all', cabinetsData);
        } else {
            console.error("filterAndDisplayClinics is not defined when trying to init with allDaysButton");
        }
      }, 0);
  } else {
      console.warn("Diaeta: 'All days' filter button not found.");
      if (typeof filterAndDisplayClinics === "function") {
          filterAndDisplayClinics('all', cabinetsData); 
      } else {
           console.error("filterAndDisplayClinics is not defined for default load");
      }
  }
}

function initViewToggles() {
  const viewToggles = document.querySelectorAll('.view-toggle');
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  if (!viewToggles.length || !listView || !mapView) return;
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      viewToggles.forEach(t => { /* ... remove active ... */ t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      this.classList.add('active'); this.setAttribute('aria-pressed', 'true');
      const viewType = this.getAttribute('data-view');
      listView.classList.toggle('active', viewType === 'list');
      mapView.classList.toggle('active', viewType === 'map');
      if (viewType === 'map' && typeof clinicMap !== 'undefined' && clinicMap && typeof clinicMap.invalidateSize === 'function') {
        setTimeout(() => clinicMap.invalidateSize(), 10); 
      }
    });
  });
}

function filterAndDisplayClinics(dayFilter, allCabinetsData) {
    const listCardsContainer = document.getElementById('cabinetCardContainer');
    const listCountDisplay = document.getElementById('list-count-display');
    const noResultsMsgList = listCardsContainer ? listCardsContainer.querySelector('.no-results-message') : null;
    const sidebarResults = document.querySelector('.map-sidebar .sidebar-results');
    const currentLang = window.pageLang || 'fr';
    const dayOfWeekProperty = currentLang === 'en' ? 'dayOfWeekENGLISH' : 'dayOfWeekFRENCH';

    let visibleListCabinets = allCabinetsData.filter(cabinet => {
        if (dayFilter === 'all') return true;
        // For video, check if any opening_hours match the dayFilter, using the correct language property
        if (cabinet.id === 'video') {
            return (cabinet.opening_hours || []).some(oh => oh[dayOfWeekProperty] && oh[dayOfWeekProperty].toLowerCase().trim() === dayFilter);
        }
        // For physical clinics
        const cardDays = (cabinet.opening_hours || []).map(oh => oh[dayOfWeekProperty] ? oh[dayOfWeekProperty].toLowerCase().trim() : '');
        return cardDays.includes(dayFilter);
    });

    if (typeof generateClinicCards === "function") {
        generateClinicCards(visibleListCabinets);
    } else { console.error("generateClinicCards function is not defined."); }

    const physicalClinics = allCabinetsData.filter(c => c.id !== 'video' && c.coordinates && c.coordinates.length === 2);
    let visibleMapCabinets = [];

    if (typeof clinicMap !== 'undefined' && clinicMap && typeof clinicMarkers !== 'undefined' && clinicMarkers) {
        physicalClinics.forEach(cabinet => {
            const marker = clinicMarkers[cabinet.id];
            if (!marker) return;
            const cabinetDays = (cabinet.opening_hours || []).map(oh => oh[dayOfWeekProperty] ? oh[dayOfWeekProperty].toLowerCase().trim() : '');
            const isVisibleOnMap = dayFilter === 'all' || cabinetDays.includes(dayFilter);
            if (isVisibleOnMap) {
                if (!clinicMap.hasLayer(marker)) marker.addTo(clinicMap);
                visibleMapCabinets.push(cabinet);
            } else {
                if (clinicMap.hasLayer(marker)) marker.removeFrom(clinicMap);
            }
        });
    }

    if (typeof generateSidebarCards === "function") {
        generateSidebarCards(visibleMapCabinets);
    } else { console.error("generateSidebarCards function is not defined."); }

    if (sidebarResults) {
        const count = visibleMapCabinets.length;
        if (currentLang === 'en') {
            sidebarResults.textContent = `${count} clinic${count !== 1 ? 's' : ''} found`;
        } else {
            sidebarResults.textContent = `${count} cabinet${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}`;
        }
    }
}

function initDayFilters(allCabinetsData) {
    const filterButtons = document.querySelectorAll('.clinic-filters .filter-btn');
    if (!filterButtons.length) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => { /* ... remove active ... */ btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
            this.classList.add('active'); this.setAttribute('aria-pressed', 'true');
            const dayFilter = this.getAttribute('data-day');
            if (typeof filterAndDisplayClinics === "function") {
                filterAndDisplayClinics(dayFilter, allCabinetsData);
            } else { console.error("filterAndDisplayClinics is not defined in initDayFilters"); }
        });
    });
}

function initMap(clinicsToMap) {
  if (typeof L === 'undefined') { console.error('Leaflet library is not loaded.'); return; }
  const mapElement = document.getElementById('clinicsMap');
  if (!mapElement) { console.error("Map element #clinicsMap not found."); return; }
  if (typeof clinicMap !== 'undefined' && clinicMap && typeof clinicMap.remove === 'function') { 
    clinicMap.remove(); clinicMap = null; 
  }
  clinicMap = L.map(mapElement, { scrollWheelZoom: false, fadeAnimation: true, zoomAnimation: true }).setView([50.8466, 4.3528], 12); 
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &copy; CARTO', maxZoom: 19, minZoom: 5
  }).addTo(clinicMap);
  clinicMarkers = {}; 
  clinicsToMap.forEach(cabinet => {
    if (!cabinet.coordinates || cabinet.coordinates.length !== 2) return; 
    const customIcon = L.divIcon({
      html: `<div class="marker-icon"><i class="fa-solid fa-map-marker-alt"></i></div>`, 
      className: 'diaeta-custom-marker', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    });
    const marker = L.marker(cabinet.coordinates, { icon: customIcon });
    clinicMarkers[cabinet.id] = marker; 
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e); 
      if (typeof showClinicDetails === "function") showClinicDetails(cabinet, marker); 
      if (typeof highlightSidebarCard === "function") highlightSidebarCard(cabinet.id);
      // ... rest of click logic ...
       document.querySelectorAll('.cabinet-explorer-card.active').forEach(c => c.classList.remove('active'));
      const listCard = document.querySelector(`.cabinet-explorer-card[data-clinic-id="${cabinet.id}"]`);
      if(listCard) listCard.classList.add('active');
    });
    marker.bindPopup(function() { 
        const cabinetName = cabinet.name || "Cabinet Diaeta";
        const city = cabinet.address_obj ? cabinet.address_obj.city : (cabinet.city || '');
        return `<div class="map-popup"><h4>${cabinetName}</h4><p>${city}</p><button class="popup-details-btn btn btn-xs btn-primary" data-clinicid="${cabinet.id}">${window.pageLang === 'fr' ? 'Voir détails' : window.pageLang === 'nl' ? 'Zie details' : 'See details'}</button></div>`;
    });
    marker.on('popupopen', (e) => { /* ... popup button logic ... */ 
      const button = e.popup.getElement().querySelector('.popup-details-btn');
      if (button) {
        button.onclick = (ev) => { 
            ev.stopPropagation(); 
            const clickedCabinet = clinicsToMap.find(c => c.id === button.dataset.clinicid);
            if(clickedCabinet && typeof showClinicDetails === "function") showClinicDetails(clickedCabinet, clinicMarkers[clickedCabinet.id]);
            if (clinicMap && typeof clinicMap.closePopup === 'function') clinicMap.closePopup();
        };
      }
    });
  });
}

function generateClinicCards(cabinetsDataToDisplay) {
  const cardContainer = document.getElementById('cabinetCardContainer');
  if (!cardContainer) { console.error("Diaeta: #cabinetCardContainer not found."); return; }
  const loadingMsg = cardContainer.querySelector('.loading-message');
  const noResultsMsg = cardContainer.querySelector('.no-results-message');
  cardContainer.innerHTML = ''; 
  if (loadingMsg) loadingMsg.style.display = 'none'; 
  const listCountDisplay = document.getElementById('list-count-display');
  if (listCountDisplay) listCountDisplay.textContent = cabinetsDataToDisplay.length;
      if (cabinetsDataToDisplay.length === 0) { /* ... no results message ... */ 
    let currentNoResultsMsg = noResultsMsg;
    if (!currentNoResultsMsg) {
        currentNoResultsMsg = document.createElement('div');
        currentNoResultsMsg.className = 'no-results-message text-center p-5';
        cardContainer.appendChild(currentNoResultsMsg);
    }
    
    // Language-specific no results message
    let noResultsText = "Aucun cabinet ne correspond à vos critères actuels.";
    if (currentLang === 'en') {
        noResultsText = "No clinic matches your current criteria.";
    } else if (currentLang === 'nl') {
        noResultsText = "Geen praktijk komt overeen met uw huidige criteria.";
    } else if (currentLang === 'de') {
        noResultsText = "Keine Praxis entspricht Ihren aktuellen Kriterien.";
    } else if (currentLang === 'ar') {
        noResultsText = "لا توجد عيادة تطابق معاييرك الحالية.";
    }
    
    currentNoResultsMsg.innerHTML = `<i>${noResultsText}</i>`;
    currentNoResultsMsg.style.display = 'block';
    return;
  }
    if (noResultsMsg) noResultsMsg.style.display = 'none';
    const currentLang = window.pageLang || 'fr';
    const dayOfWeekProperty = currentLang === 'en' ? 'dayOfWeekENGLISH' : 
                             currentLang === 'nl' ? 'dayOfWeekDUTCH' :
                             currentLang === 'de' ? 'dayOfWeekGERMAN' :
                             currentLang === 'ar' ? 'dayOfWeekARABIC' :
                             'dayOfWeekFRENCH';

    cabinetsDataToDisplay.forEach((cabinet, index) => { /* ... card generation logic ... */
    const card = document.createElement('div');
    card.className = 'cabinet-explorer-card';
    card.setAttribute('data-clinic-id', cabinet.id);

        let cabinetDaysAttr = (cabinet.opening_hours || [])
            .map(oh => oh[dayOfWeekProperty] ? oh[dayOfWeekProperty].toLowerCase().trim() : '')
            .filter(day => day) // remove empty strings if dayOfWeekProperty is missing
            .join(' ');

        if (cabinet.id === 'video' && cabinetDaysAttr === '') {
             const allWeekDays = currentLang === 'en'
                ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                : currentLang === 'nl'
                ? ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
                : currentLang === 'de'
                ? ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag']
                : currentLang === 'ar'
                ? ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
                : ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            cabinetDaysAttr = allWeekDays.join(' ');
    }
    card.setAttribute('data-days', cabinetDaysAttr);

        const name = cabinet.name || (currentLang === 'fr' ? "Nom non disponible" : 
                                    currentLang === 'en' ? "Name unavailable" :
                                    currentLang === 'nl' ? "Naam niet beschikbaar" :
                                    currentLang === 'de' ? "Name nicht verfügbar" :
                                    currentLang === 'ar' ? "الاسم غير متوفر" : "Name unavailable");
        
        const fullAddress = cabinet.fullAddress || (cabinet.id === 'video' ? 
            (currentLang === 'fr' ? "Consultation en ligne" : 
             currentLang === 'en' ? "Online consultation" :
             currentLang === 'nl' ? "Online consultatie" :
             currentLang === 'de' ? "Online-Beratung" :
             currentLang === 'ar' ? "استشارة عبر الإنترنت" : "Online consultation") : 
            (currentLang === 'fr' ? "Adresse non spécifiée" : 
             currentLang === 'en' ? "Address not specified" :
             currentLang === 'nl' ? "Adres niet opgegeven" :
             currentLang === 'de' ? "Adresse nicht angegeben" :
             currentLang === 'ar' ? "العنوان غير محدد" : "Address not specified"));
        
        const city = cabinet.address_obj ? cabinet.address_obj.city : (cabinet.city || (cabinet.id === 'video' ? 
            (currentLang === 'fr' ? 'À distance' : 
             currentLang === 'en' ? 'Remote' :
             currentLang === 'nl' ? 'Op afstand' :
             currentLang === 'de' ? 'Fernberatung' :
             currentLang === 'ar' ? 'عن بُعد' : 'Remote') : ''));
    const notes = cabinet.notes || '';

        // Use the correct path segment for each language
        const pathSegment =
          currentLang === 'en' ? 'locations'
          : currentLang === 'nl' ? 'locaties'
          : currentLang === 'de' ? 'praxen'
          : currentLang === 'ar' ? 'عيادات'
          : 'cabinets'; // fallback for fr and others
        const detailPageUrl = (cabinet.id && cabinet.id !== 'video')
          ? `/${currentLang}/${pathSegment}/${cabinet.id.toLowerCase().replace(/\s+/g, '-')}/`
          : '#';
    const isVideoConsult = cabinet.id === 'video';

        let hoursTeaser = currentLang === 'fr' ? "Consulter les détails pour les horaires" : 
                         currentLang === 'nl' ? 'Zie details voor uren' : 
                         currentLang === 'de' ? 'Siehe Details für Öffnungszeiten' :
                         currentLang === 'ar' ? 'راجع التفاصيل للجدول الزمني' :
                         "See details for hours";
    if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
        hoursTeaser = cabinet.opening_hours.map(day => {
            const dayName = day[dayOfWeekProperty] || (currentLang === 'fr' ? 'Jour' : 
                                                      currentLang === 'en' ? 'Day' :
                                                      currentLang === 'nl' ? 'Dag' :
                                                      currentLang === 'de' ? 'Tag' :
                                                      currentLang === 'ar' ? 'يوم' : 'Day');
            const slots = day.timeSlots.map(slot => `${slot.opens.replace(':','h')} - ${slot.closes.replace(':','h')}`).join(', ');
            return `${dayName}: ${slots}`;
        }).join('; ');
    } else if (cabinet.hours_details_note) {
        hoursTeaser = cabinet.hours_details_note;
    } else if (isVideoConsult) {
            hoursTeaser = currentLang === 'fr' ? "Flexibles, voir module de réservation." : 
                         currentLang === 'nl' ? 'Flexibel, zie boekingsmodule.' : 
                         currentLang === 'de' ? 'Flexibel, siehe Buchungsmodul.' :
                         currentLang === 'ar' ? 'مرنة، راجع وحدة الحجز.' :
                         "Flexible, see booking module.";
    }
    card.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-header">
                <h3 class="card-name">
                    ${!isVideoConsult && detailPageUrl !== '#' ? `<a href="${detailPageUrl}" class="clinic-name-link" target="_blank" title="Plus d'infos sur ${name}">${name} <i class="fas fa-info-circle fa-xs clinic-info-icon"></i></a>` : name}
                </h3>
                <p class="card-city text-muted"><i class="fas ${isVideoConsult ? 'fa-video' : 'fa-map-pin'} fa-xs me-1"></i> ${city}</p>
            </div>
            <div class="card-body-content">
                ${!isVideoConsult ? `<p class="card-address text-sm"><i class="fas fa-location-dot fa-xs me-2 text-primary"></i>${fullAddress}</p>` : ''}
                <p class="card-hours-teaser text-sm"><i class="fas fa-clock fa-xs me-2 text-primary"></i>${hoursTeaser}</p>
                ${notes ? `<p class="card-notes text-xs fst-italic mt-1"><i class="fas fa-info-circle fa-xs me-2 text-primary"></i>${notes}</p>` : ''}
            </div>
            <div class="card-footer-actions">
                ${!isVideoConsult && detailPageUrl !== '#' ? `<a href="${detailPageUrl}" target="_blank" class="btn btn-sm btn-outline-primary details-btn"><i class="fas fa-info-circle me-1"></i>${window.pageLang === 'fr' ? 'Page Cabinet' : window.pageLang === 'nl' ? 'Praktijkpagina' : window.pageLang === 'de' ? 'Praxis-Seite' : window.pageLang === 'ar' ? 'صفحة العيادة' : 'Clinic Page'}</a>` : `<span class="btn btn-sm btn-outline-secondary details-btn disabled" style="opacity:0.5; cursor:default;"><i class="fas fa-info-circle me-1"></i> ${window.pageLang === 'fr' ? 'Infos Cabinet' : window.pageLang === 'nl' ? 'Praktijkinfo' : window.pageLang === 'de' ? 'Praxis-Info' : window.pageLang === 'ar' ? 'معلومات العيادة' : 'Clinic Info'}</span>`}
                <a href="/${currentLang}/appointment/?locationId=${cabinet.doctorpracticeId || ''}${name ? '&cabinetName=' + encodeURIComponent(name) : ''}" class="btn btn-sm btn-accent rdv-btn"><i class="fas fa-calendar-check me-1"></i>${window.pageLang === 'fr' ? 'Prendre RDV' : window.pageLang === 'nl' ? 'Boek nu' : window.pageLang === 'de' ? 'Termin buchen' : window.pageLang === 'ar' ? 'احجز موعدًا' : 'Book Now'}</a>
            </div>
        </div>`;
    card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return; 
        if (!isVideoConsult && typeof showClinicDetails === "function") { 
            showClinicDetails(cabinet, (typeof clinicMarkers !== 'undefined' && clinicMarkers && clinicMarkers[cabinet.id]) ? clinicMarkers[cabinet.id] : null);
        }
        document.querySelectorAll('.cabinet-explorer-card.active').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
    cardContainer.appendChild(card);
    setTimeout(() => card.classList.add('filtered-in', 'animated'), 50 + index * 25); 
  });
}

function generateSidebarCards(cabinetsData) { /* ... as before ... */ 
  const sidebarContainer = document.querySelector('.map-sidebar .sidebar-clinics');
  if (!sidebarContainer) return;
  sidebarContainer.innerHTML = '';
  let count = 0;
  const currentLang = window.pageLang || 'fr';
  const dayOfWeekProperty = currentLang === 'en' ? 'dayOfWeekENGLISH' : 'dayOfWeekFRENCH';

  cabinetsData.forEach(cabinet => {
    if (cabinet.id === 'video' || !cabinet.coordinates || !cabinet.coordinates.length === 2) return;
    count++;
    let scheduleStr = currentLang === 'fr' ? 'Horaires non spécifiés' : currentLang === 'nl' ? 'Uren niet gespecificeerd' : 'Hours not specified';
    if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
      scheduleStr = cabinet.opening_hours.map(day => {
        const dayName = day[dayOfWeekProperty] ? day[dayOfWeekProperty].substring(0,3) : (currentLang === 'fr' ? 'Jour' : currentLang === 'nl' ? 'Dag' : 'Day');
        const slots = day.timeSlots.map(slot => `${slot.opens.replace(':','h')}-${slot.closes.replace(':','h')}`).join(', ');
        return `${dayName}: ${slots}`;
      }).join('; ');
    } else if (cabinet.hours_details_note) {
      scheduleStr = `<em>${cabinet.hours_details_note}</em>`;
    } else {
      scheduleStr = currentLang === 'fr' ? 'Voir détails' : currentLang === 'nl' ? 'Zie details voor uren' : 'See details for hours';
    }

    const cardHTML = `
        <h4>${cabinet.name}</h4>
        <div class="sidebar-clinic-address text-xs"><i class="fas fa-location-dot me-1 text-primary"></i>${cabinet.fullAddress || (currentLang === 'fr' ? 'Adresse non spécifiée' : 'Address not specified')}</div>
        <div class="sidebar-clinic-hours text-xs mt-1"><i class="fas fa-clock me-1 text-primary"></i>${scheduleStr}</div>
        <a href="/${currentLang}/appointment/?locationId=${cabinet.doctorpracticeId || ''}${cabinet.name ? '&cabinetName=' + encodeURIComponent(cabinet.name) : ''}" class="btn btn-xs btn-accent mt-2 d-block text-center">${currentLang === 'fr' ? 'Prendre RDV' : currentLang === 'nl' ? 'Boek nu' : 'Book Now'}</a>`;
    const cardElement = document.createElement('div');
    cardElement.className = 'sidebar-clinic-card';
    cardElement.setAttribute('data-clinic-id', cabinet.id);
    cardElement.innerHTML = cardHTML;
    cardElement.addEventListener('click', () => {
      if (typeof clinicMarkers !== 'undefined' && clinicMarkers && clinicMarkers[cabinet.id]) {
        if (typeof showClinicDetails === "function") showClinicDetails(cabinet, clinicMarkers[cabinet.id]);
        if (typeof clinicMap !== 'undefined' && clinicMap && typeof clinicMap.flyTo === 'function') {
            clinicMap.flyTo(clinicMarkers[cabinet.id].getLatLng(), clinicMap.getZoom() > 15 ? clinicMap.getZoom() : 15);
        }
        if (typeof clinicMarkers[cabinet.id].openPopup === 'function') {
            clinicMarkers[cabinet.id].openPopup();
        }
      }
      if (typeof highlightSidebarCard === "function") highlightSidebarCard(cabinet.id);
    });
    sidebarContainer.appendChild(cardElement);
  });

  const resultsCountElement = document.querySelector('.map-sidebar .sidebar-results');
  if (resultsCountElement) {
      if (currentLang === 'en') {
          resultsCountElement.textContent = `${count} clinic${count !== 1 ? 's' : ''} displayed`;
      } else {
          resultsCountElement.textContent = `${count} cabinet${count !== 1 ? 's' : ''} affiché${count !== 1 ? 's' : ''}`;
      }
  }
  if (count === 0 && sidebarContainer) {
      const noResultsText = currentLang === 'en' ? 'No clinics match the filters.' : 'Aucun cabinet ne correspond aux filtres.';
      sidebarContainer.innerHTML = `<p class="text-center p-3 text-muted"><i>${noResultsText}</i></p>`;
  }
}

function showClinicDetails(cabinet, marker) {
  const detailPanel = document.getElementById('clinicDetailPanel');
  if (!detailPanel) return;

  const currentLang = window.pageLang || 'fr';
  const dayOfWeekProperty = currentLang === 'en' ? 'dayOfWeekENGLISH' : currentLang === 'nl' ? 'dayOfWeekDUTCH' : 'dayOfWeekFRENCH';
  let scheduleHtml = '';

  if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
    cabinet.opening_hours.forEach(day_schedule => {
      let dayHours = day_schedule.timeSlots.map(slot => `${slot.opens.replace(":", "h")} - ${slot.closes.replace(":", "h")}`).join(', ');
      const dayName = day_schedule[dayOfWeekProperty] || (currentLang === 'fr' ? 'Jour inconnu' : currentLang === 'nl' ? 'Onbekende dag' : 'Unknown day');
      scheduleHtml += `<li><span class="day">${dayName}:</span> <span class="hours available">${dayHours}</span></li>`;
    });
  }
  if (cabinet.hours_details_note) { scheduleHtml += `<li class="mt-1"><em class="text-xs text-muted">${cabinet.hours_details_note}</em></li>`; }

  if (!scheduleHtml) { scheduleHtml = `<li><span class="day">${currentLang === 'fr' ? 'Horaires:' : 'Hours:'}</span> <span class="hours">${currentLang === 'fr' ? 'Veuillez consulter le module de réservation.' : 'Please consult the booking module.'}</span></li>`; }

  const addressDisplay = cabinet.fullAddress || (currentLang === 'fr' ? 'Lieu de consultation en ligne' : 'Online consultation location');
  const pathSegment = (currentLang === 'en') ? 'locations' : 'cabinets';
  const detailPageUrl = (cabinet.id && cabinet.id !== 'video') ? `/${currentLang}/${pathSegment}/${cabinet.id.toLowerCase().replace(/\s+/g, '-')}/` : null;
  detailPanel.innerHTML = `
    <div class="detail-panel-header"><h3>${cabinet.name}</h3><button class="close-panel-btn" id="panelCloseButtonMap" aria-label="${currentLang === 'fr' ? 'Fermer' : 'Close'}"><i class="fa-solid fa-times"></i></button></div>
    <div class="detail-panel-body">
      <div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-location-dot text-primary"></i> ${currentLang === 'fr' ? 'Adresse' : 'Address'}</h4><p class="detail-text">${addressDisplay}</p>${(cabinet.Maps_link && cabinet.id !== 'video') ? `<a href="${cabinet.Maps_link}" class="detail-action-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-directions"></i> ${currentLang === 'fr' ? 'Itinéraire' : currentLang === 'nl' ? 'Routebeschrijving' : 'Directions'}</a>` : ''} ${detailPageUrl ? `<a href="${detailPageUrl}" class="detail-action-link d-block mt-1" target="_blank"><i class="fa-solid fa-circle-info"></i> ${currentLang === 'fr' ? 'Infos Cabinet' : currentLang === 'nl' ? 'Praktijkinfo' : 'Clinic Info'}</a>` : ''}</div>
      <div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-clock text-primary"></i> ${currentLang === 'fr' ? 'Horaires (indicatifs)' : currentLang === 'nl' ? 'Uren (indicatief)' : 'Hours (indicative)'}</h4><ul class="schedule-list">${scheduleHtml}</ul></div>
      ${cabinet.notes ? `<div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-info-circle text-primary"></i> ${currentLang === 'fr' ? 'Informations' : currentLang === 'nl' ? 'Informatie' : 'Information'}</h4><p class="detail-text">${cabinet.notes}</p></div>` : ''}
      <div class="detail-action mt-3"><a href="/${currentLang}/appointment/?locationId=${cabinet.doctorpracticeId || ''}${cabinet.name ? '&cabinetName=' + encodeURIComponent(cabinet.name) : ''}" class="btn btn-primary w-100 book-btn"><i class="fa-solid fa-calendar-check"></i> ${currentLang === 'fr' ? 'RDV ici' : currentLang === 'nl' ? 'Boek hier' : 'Book here'}</a></div>
    </div>`;
  detailPanel.classList.remove('d-none');
  detailPanel.classList.add('active');
  const panelCloseButtonMap = document.getElementById('panelCloseButtonMap'); // Re-fetch after innerHTML update
  if (panelCloseButtonMap) {
      panelCloseButtonMap.onclick = function(event) {
          event.stopPropagation();
          detailPanel.classList.remove('active');
          detailPanel.classList.add('d-none');
           document.querySelectorAll('.cabinet-explorer-card.active, .sidebar-clinic-card.active').forEach(el => el.classList.remove('active'));
      };
  }
}

function highlightSidebarCard(clinicId) { /* ... as before ... */ 
  document.querySelectorAll('.map-sidebar .sidebar-clinic-card.active').forEach(c => c.classList.remove('active'));
  const targetCard = document.querySelector(`.map-sidebar .sidebar-clinic-card[data-clinic-id="${clinicId}"]`);
  if (targetCard) {
    targetCard.classList.add('active');
    if (typeof targetCard.scrollIntoView === 'function') {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function initLocateMe(physicalCabinets) { /* ... as before ... */ 
  const locateBtn = document.getElementById('locateMeMainBtn');
  if (!locateBtn) return;
  const originalBtnHTML = locateBtn.innerHTML; 
  locateBtn.addEventListener('click', () => {
    locateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Localisation...';
    locateBtn.disabled = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          if (physicalCabinets.length === 0) {
            alert('Aucun cabinet physique disponible.'); resetLocateBtn(locateBtn, originalBtnHTML); return;
          }
          const nearest = findNearestClinic(userLocation, physicalCabinets);
          if (nearest && typeof clinicMap !== 'undefined' && clinicMap && typeof clinicMarkers !== 'undefined' && clinicMarkers && clinicMarkers[nearest.id]) {
            const mapViewToggle = document.querySelector('.view-toggle[data-view="map"]');
            if (mapViewToggle && !mapViewToggle.classList.contains('active')) mapViewToggle.click();
            setTimeout(() => { 
                const marker = clinicMarkers[nearest.id];
                if(marker && typeof marker.openPopup === 'function') marker.openPopup();
                if (typeof showClinicDetails === "function") showClinicDetails(nearest, marker);
                if (clinicMap && typeof clinicMap.flyTo === 'function' && marker) {
                    clinicMap.flyTo(marker.getLatLng(), 15); 
                }
            }, 300); 
          } else if (nearest) { 
              alert(`Cabinet le plus proche: ${nearest.name} à ${nearest.fullAddress}. Sélectionnez la vue liste pour voir les détails ou activez les filtres de jour.`); 
          } else { 
              alert('Aucun cabinet trouvé à proximité.'); 
          }
          resetLocateBtn(locateBtn, originalBtnHTML);
        },
        (error) => { 
            console.error('Geolocation error:', error); 
            let message = 'Impossible de vous localiser.';
            if (error.code === error.PERMISSION_DENIED) message = 'Permission de géolocalisation refusée.';
            else if (error.code === error.POSITION_UNAVAILABLE) message = 'Information de localisation non disponible.';
            else if (error.code === error.TIMEOUT) message = 'Demande de géolocalisation expirée.';
            alert(message); 
            resetLocateBtn(locateBtn, originalBtnHTML); 
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else { alert("Géolocalisation non supportée par ce navigateur."); resetLocateBtn(locateBtn, originalBtnHTML); }
  });
}

function resetLocateBtn(btnElement, originalHTML) { /* ... as before ... */ 
    if(btnElement) { btnElement.innerHTML = originalHTML; btnElement.disabled = false; }
}
function findNearestClinic(userLoc, clinics) { /* ... as before ... */ 
    let nearest = null, shortestDist = Infinity;
    clinics.forEach(c => {
        if(!c.coordinates || c.coordinates.length !== 2) return;
        const dist = calculateDistance(userLoc[0],userLoc[1],c.coordinates[0],c.coordinates[1]);
        if(dist < shortestDist) { shortestDist = dist; nearest = c;}
    }); return nearest;
}
function calculateDistance(lat1,lon1,lat2,lon2) { /* ... as before ... */ 
    const R=6371,dLat=toRadians(lat2-lat1),dLon=toRadians(lon2-lon1);
    const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
    const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c; 
}
function toRadians(deg) { return deg*(Math.PI/180); }

function initializeRendezVousPage() {
  const iframe = document.getElementById('defaultiFrame');
  const bookingModuleDynamicTitleSpan = document.getElementById('booking-module-dynamic-title');
  const bookingModuleSubtitle = document.getElementById('booking-module-subtitle');
  const iframeLoadingIndicator = document.getElementById('iframe-loading-indicator');
  const locationCards = document.querySelectorAll('.select-cabinet-card');

  if (!iframe) {
      console.error('Doctoranytime iframe not found on RDV page');
      return;
  }

  const doctorId = '80669';
  let baseIframeSrc;
  if (currentLang === 'en') {
    baseIframeSrc = `https://www.doctoranytime.be/en/iframes/agenda?doctorId=${doctorId}`;
  } else if (currentLang === 'nl') {
    baseIframeSrc = `https://www.doctoranytime.be/nl/iframes/agenda?doctorId=${doctorId}`;
  } else {
    baseIframeSrc = `https://www.doctoranytime.be/iframes/agenda?doctorId=${doctorId}`; // French default
  }

  const showIframeLoading = () => {
      if (iframeLoadingIndicator) iframeLoadingIndicator.style.display = 'block';
      if (iframe) iframe.style.opacity = '0.5';
  };

  const hideIframeLoading = () => {
      setTimeout(() => {
          if (iframeLoadingIndicator) iframeLoadingIndicator.style.display = 'none';
          if (iframe) iframe.style.opacity = '1';
      }, 200);
  };

  const updateIframeAndTitle = (practiceId, cabinetName) => {
      showIframeLoading();
      let newSrc = baseIframeSrc;
      let titleText, subTitleText;

      if (currentLang === 'en') {
          titleText = "Select Your Schedule";
          subTitleText = "Choose a time slot for the selected location.";
          if (practiceId) {
              newSrc += `&doctorpracticeId=${practiceId}`;
              titleText = `Availability for: ${cabinetName}`;
              subTitleText = `Choose a time slot for ${cabinetName}.`;
          } else {
              titleText = "Availability: All Clinics";
              subTitleText = "Choose a time slot at one of our clinics or for a video consultation.";
          }
      } else { // French (default)
          titleText = "Sélectionnez Votre Horaire";
          subTitleText = "Choisissez un créneau pour le lieu sélectionné.";
          if (practiceId) {
              newSrc += `&doctorpracticeId=${practiceId}`;
              titleText = `Disponibilités pour : ${cabinetName}`;
              subTitleText = `Choisissez un créneau pour ${cabinetName}.`;
          } else {
              titleText = "Disponibilités : Tous les cabinets";
              subTitleText = "Choisissez un créneau dans un de nos cabinets ou en téléconsultation.";
          }
      }

      const handleLoad = () => {
          hideIframeLoading();
          iframe.removeEventListener('load', handleLoad);
          iframe.removeEventListener('error', handleError);
      };
      const handleError = () => {
          console.error("Iframe failed to load:", newSrc);
          hideIframeLoading();
          iframe.removeEventListener('load', handleLoad);
          iframe.removeEventListener('error', handleError);
      };

      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      iframe.src = newSrc;
      if (bookingModuleDynamicTitleSpan) bookingModuleDynamicTitleSpan.textContent = titleText;
      if (bookingModuleSubtitle) bookingModuleSubtitle.textContent = subTitleText;

      locationCards.forEach(card => card.classList.toggle('active', card.dataset.practiceId === practiceId));
  };

  // This handler is for genuine user clicks and will scroll
  locationCards.forEach(card => {
      card.addEventListener('click', function () {
          updateIframeAndTitle(this.dataset.practiceId, this.dataset.cabinetName);
          const bookingModuleWrapper = document.getElementById('booking-module-wrapper');
          if (bookingModuleWrapper) bookingModuleWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
  });

  // This is the corrected page load logic.
  // It calls updateIframeAndTitle directly without using .click(), so it won't scroll.
  const urlParams = new URLSearchParams(window.location.search);
  const locationIdFromUrl = urlParams.get('locationId');
  const cabinetNameFromUrl = urlParams.get('cabinetName');

  if (locationIdFromUrl) {
      const cabinetName = cabinetNameFromUrl ? decodeURIComponent(cabinetNameFromUrl) : "le cabinet sélectionné";
      updateIframeAndTitle(locationIdFromUrl, cabinetName);
  } else {
      const defaultSelectionCard = document.querySelector('.select-cabinet-card.default-selection');
      if (defaultSelectionCard) {
          updateIframeAndTitle(defaultSelectionCard.dataset.practiceId, defaultSelectionCard.dataset.cabinetName);
      } else if (locationCards.length > 0) {
          updateIframeAndTitle(locationCards[0].dataset.practiceId, locationCards[0].dataset.cabinetName);
      }
  }


  if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
      hideIframeLoading();
  } else {
      iframe.addEventListener('load', hideIframeLoading, { once: true });
      iframe.addEventListener('error', hideIframeLoading, { once: true });
  }
}

function initializeScrollToLinks() { /* ... as before ... */ 
  const scrollToButtons = document.querySelectorAll('.scroll-to');
  scrollToButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1); 
          const targetElement = document.getElementById(targetId);
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;
          if (targetElement) {
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; 
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
      });
  });
}

// === INSTANT SEARCH/AUTOCOMPLETE FOR HEADER SEARCH ===
// (Removed: rollback to simple search form)
// ... existing code ...

// Consolidated Navigation Helper Functions
function setActiveNavLink(link) {
  if (!mainNav) return;
  
  // Remove active class from all nav items
  mainNav.querySelectorAll('.nav-link, .dropdown-item').forEach(l => l.classList.remove('active'));
  
  // Add active class to clicked item
  link.classList.add('active');
  
  // If it's a dropdown item, also activate parent dropdown
  if (link.classList.contains('dropdown-item')) {
    const parentDropdown = link.closest('.nav-item.dropdown');
    if (parentDropdown) {
      const parentToggle = parentDropdown.querySelector('.nav-link.dropdown-toggle');
      if (parentToggle) parentToggle.classList.add('active');
    }
  }
}

function closeMobileMenu() {
  if (header.classList.contains('menu-open') && menuToggle) {
    menuToggle.click();
  }
}

function initializeNavigationListeners() {
  if (!mainNav) return;

  // Add click listeners to main nav links
  mainNav.querySelectorAll('.nav-list > .nav-item > .nav-link').forEach(link => {
    link.addEventListener('click', function() {
      if (!this.classList.contains('dropdown-toggle')) {
        setActiveNavLink(this);
        closeMobileMenu();
      }
    });
  });

  // Add click listeners to dropdown items
  mainNav.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
      setActiveNavLink(this);
      closeMobileMenu();
    });
  });
}

// Legacy function removed - all references updated to use setActiveNavLink