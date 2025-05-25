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
           noResultsMsg.innerHTML = "<i>Impossible de charger les informations des cabinets. Données non disponibles ou vides. Veuillez <a href='/fr/contact/'>nous contacter</a>.</i>";
           noResultsMsg.style.display = 'block';
        }
    }
  }
  
  initializeAnimatedStats();

  if (document.querySelector('.clinic-card')) { // Old card class, potentially remove if not used
    fixMobileCardPositioning();
    window.addEventListener('resize', fixMobileCardPositioning);
  }

  const defaultIframe = document.getElementById('defaultiFrame');
  if (defaultIframe && document.getElementById('booking-module-wrapper')) { // Check if on rendez-vous.html
    initializeRendezVousPage();
  }
});

function initializeHeader() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  if (!header) return;

  const scrollHandler = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', scrollHandler);
  scrollHandler(); // Initial check
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
      const isOpen = header.classList.contains('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
      }
    });
  }
  
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      const langSelector = this.closest('.lang-selector');
      if (!langSelector) return;
      const currentlyOpen = langSelector.classList.contains('open');
      document.querySelectorAll('.lang-selector.open').forEach(sel => sel.classList.remove('open'));
      if (!currentlyOpen) langSelector.classList.add('open');
      this.setAttribute('aria-expanded', String(!currentlyOpen));
    });
  });
  
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const pageLang = document.documentElement.lang || 'fr';
      const targetLang = this.getAttribute('href').split('/')[1] || pageLang;

      document.querySelectorAll('.lang-toggle span').forEach(span => span.textContent = targetLang.toUpperCase());
      document.querySelectorAll('.lang-option.active').forEach(opt => {
        opt.classList.remove('active');
        opt.removeAttribute('aria-current');
      });
      this.classList.add('active');
      this.setAttribute('aria-current', 'true');
      document.querySelectorAll('.lang-selector.open').forEach(selector => selector.classList.remove('open'));
      document.querySelectorAll('.lang-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
      // Actual redirect:
      // window.location.href = this.href;
    });
  });
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-selector')) {
      document.querySelectorAll('.lang-selector.open').forEach(selector => selector.classList.remove('open'));
      document.querySelectorAll('.lang-toggle').forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
    }
  });
  
  document.querySelectorAll('.main-nav .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.main-nav .nav-link.active').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (header.classList.contains('menu-open') && menuToggle) {
        menuToggle.click();
      }
      const href = this.getAttribute('href');
      const currentPath = window.location.pathname;
      const targetPath = href.split('#')[0];
      const targetId = href.includes('#') ? href.split('#')[1] : null;

      if (targetId && (currentPath === targetPath || (currentPath + '/') === targetPath || currentPath === (targetPath + '/'))) {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // Extra offset
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
      // Else, allow default navigation to other pages
    });
  });
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
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10 + window.scrollY}px`; // 10px offset from element
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

function initializeSpecialties() { /* Currently empty, add logic if needed */ }

function initializeContactForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Basic validation & feedback logic as previously provided
    showFormMessage('Votre demande de rendez-vous a été envoyée (simulation).', 'success', form);
    form.reset();
  });
}

function showFormMessage(message, type, formElement) {
  const existingMessage = formElement.querySelector('.form-message');
  if (existingMessage) existingMessage.remove();
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message-${type} mt-3 p-3 rounded`;
  messageEl.textContent = message;
  const submitButtonContainer = formElement.querySelector('.form-submit');
  if (submitButtonContainer) formElement.insertBefore(messageEl, submitButtonContainer);
  else formElement.appendChild(messageEl);
  messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
  messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (type === 'success') setTimeout(() => messageEl.remove(), 7000);
}

function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animatedElements.forEach(el => observer.observe(el));
  setTimeout(() => { // Fallback for elements in viewport on load
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('animated');
            observer.unobserve(el);
        }
    });
  }, 300);
}

function initializeLazyLoading() {
  const lazyElements = document.querySelectorAll('img[data-src], .lazy-background[data-bg-src]');
  if (!lazyElements.length) return;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.tagName === 'IMG' && el.dataset.src) {
            el.src = el.dataset.src; el.removeAttribute('data-src');
          } else if (el.classList.contains('lazy-background') && el.dataset.bgSrc) {
            el.style.backgroundImage = `url('${el.dataset.bgSrc}')`;
            el.classList.remove('lazy-background'); el.removeAttribute('data-bg-src');
          }
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    lazyElements.forEach(el => observer.observe(el));
  } else { /* Fallback */ lazyElements.forEach(el => { /* ... immediate load ... */ }); }
}

function fixMobileImages() { /* Placeholder for specific mobile image fixes if needed */ }
function initScienceSection() { /* Placeholder for science section JS */ }
function improveScienceSectionMobile() { /* Placeholder */ }
function addTouchInteractions() { /* Placeholder */ }
function improveMobileAnimations() { /* Placeholder */ }
function initializeAnimatedStats() { /* Placeholder */ }
function fixMobileCardPositioning() { /* Placeholder for old .clinic-card, if any */ }

// ----------------------------------------------------------------------------------
// Clinic Finder Functionality for cabinets-bruxelles.html
// ----------------------------------------------------------------------------------
let clinicMap; 
let clinicMarkers = {}; 

function initClinicFinder(cabinetsData) {
  if (!cabinetsData || cabinetsData.length === 0) {
    console.warn("Diaeta: Cabinets data is missing or empty for Clinic Finder init.");
    const cardContainer = document.getElementById('cabinetCardContainer');
    if (cardContainer) {
        const loadingMsg = cardContainer.querySelector('.loading-message');
        const noResultsMsg = cardContainer.querySelector('.no-results-message');
        if(loadingMsg) loadingMsg.style.display = 'none';
        if(noResultsMsg) {
            noResultsMsg.innerHTML = "<i>Aucune information de cabinet disponible pour le moment.</i>";
            noResultsMsg.style.display = 'block';
        }
    }
    return;
  }
  
  const physicalClinics = cabinetsData.filter(cabinet => cabinet.id !== 'video' && cabinet.coordinates && cabinet.coordinates.length === 2);

  initViewToggles();
  initDayFilters(physicalClinics); 

  if (document.getElementById('clinicsMap')) {
    initMap(physicalClinics);
  }
  
  initLocateMe(physicalClinics);
  generateClinicCards(physicalClinics);
  
  // Ensure the "All Days" filter is active by default and triggers a display update
  const allDaysButton = document.querySelector('.clinic-filters .filter-btn[data-day="all"]');
  if (allDaysButton) {
      allDaysButton.classList.add('active'); // Ensure it looks active
      // Simulate a click if needed to ensure initial population based on "all"
      // This might be redundant if generateClinicCards already shows all, but good for consistency
      // allDaysButton.click(); // Be cautious if this causes double processing
  } else {
      console.warn("Diaeta: 'All days' filter button not found.");
  }
}

function initViewToggles() {
  const viewToggles = document.querySelectorAll('.view-toggle');
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  
  if (!viewToggles.length || !listView || !mapView) return;
  
  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      viewToggles.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      const viewType = this.getAttribute('data-view');
      
      listView.classList.toggle('active', viewType === 'list');
      mapView.classList.toggle('active', viewType === 'map');
      
      if (viewType === 'map' && clinicMap) {
        setTimeout(() => clinicMap.invalidateSize(), 10);
      }
    });
  });
}

function initDayFilters(allPhysicalClinics) {
    const filterButtons = document.querySelectorAll('.clinic-filters .filter-btn');
    const listCountDisplay = document.getElementById('list-count-display');
    const noResultsMsgList = document.querySelector('#cabinetCardContainer .no-results-message');
    const sidebarResults = document.querySelector('.map-sidebar .sidebar-results');


    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            const dayFilter = this.getAttribute('data-day');

            // Filter list view
            const listCards = document.querySelectorAll('#cabinetCardContainer .cabinet-explorer-card');
            let visibleListCount = 0;
            listCards.forEach(card => {
                card.classList.remove('filtered-in'); // Prepare for animation
                const cardDays = card.getAttribute('data-days');
                const isVisible = dayFilter === 'all' || (cardDays && cardDays.includes(dayFilter));
                
                if (isVisible) {
                    card.style.display = ''; // Or 'flex', 'grid' if that's the card's display type
                    visibleListCount++;
                    // Add animation class with a slight delay for staggered effect or just to ensure display is set
                    setTimeout(() => card.classList.add('filtered-in'), 10); 
                } else {
                    card.style.display = 'none';
                }
            });
            if (listCountDisplay) listCountDisplay.textContent = visibleListCount;
            if (noResultsMsgList) noResultsMsgList.style.display = visibleListCount === 0 ? 'block' : 'none';


            // Filter map markers
            let visibleMapCount = 0;
            if (clinicMap && clinicMarkers) {
                allPhysicalClinics.forEach(cabinet => {
                    const marker = clinicMarkers[cabinet.id];
                    if (!marker) return;

                    const cabinetDays = (cabinet.opening_hours || []).map(oh => oh.dayOfWeekFRENCH.toLowerCase().trim());
                    const isVisibleOnMap = dayFilter === 'all' || cabinetDays.includes(dayFilter);
                    
                    if (isVisibleOnMap) {
                        if (!clinicMap.hasLayer(marker)) marker.addTo(clinicMap);
                        visibleMapCount++;
                    } else {
                        if (clinicMap.hasLayer(marker)) marker.removeFrom(clinicMap);
                    }
                });
            }
            if (sidebarResults) sidebarResults.textContent = `${visibleMapCount} cabinet${visibleMapCount !== 1 ? 's' : ''} trouvé${visibleMapCount !== 1 ? 's' : ''}`;
        });
    });
}

function initMap(clinicsToMap) {
  if (typeof L === 'undefined') { console.error('Leaflet library is not loaded.'); return; }
  const mapElement = document.getElementById('clinicsMap');
  if (!mapElement || clinicMap) return; 

  clinicMap = L.map(mapElement, { scrollWheelZoom: false, fadeAnimation: true, zoomAnimation: true }).setView([50.8466, 4.3528], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }).addTo(clinicMap);
  
  clinicMarkers = {};
  clinicsToMap.forEach(cabinet => {
    if (!cabinet.coordinates || cabinet.coordinates.length !== 2) return;
    const customIcon = L.divIcon({
      html: `<div class="marker-icon" style="background-color: var(--primary-500);"><i class="fa-solid fa-map-marker-alt"></i></div>`,
      className: 'diaeta-custom-marker', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36]
    });
    const marker = L.marker(cabinet.coordinates, { icon: customIcon }).addTo(clinicMap);
    clinicMarkers[cabinet.id] = marker;
    
    marker.on('click', () => {
      showClinicDetails(cabinet, marker); 
      highlightSidebarCard(cabinet.id);
      document.querySelectorAll('.cabinet-explorer-card.active').forEach(c => c.classList.remove('active'));
      const listCard = document.querySelector(`.cabinet-explorer-card[data-clinic-id="${cabinet.id}"]`);
      if(listCard) listCard.classList.add('active');
    });
    
    marker.bindPopup(`<div class="map-popup"><h4>${cabinet.name}</h4><p>${cabinet.address_obj ? cabinet.address_obj.city : (cabinet.city || '')}</p><button class="popup-details-btn" data-clinicid="${cabinet.id}">Voir détails</button></div>`);
    marker.on('popupopen', (e) => {
      const button = e.popup.getElement().querySelector('.popup-details-btn');
      if (button) {
        button.onclick = () => { 
            const clickedCabinet = clinicsToMap.find(c => c.id === button.dataset.clinicid);
            if(clickedCabinet) showClinicDetails(clickedCabinet, clinicMarkers[clickedCabinet.id]);
            clinicMap.closePopup();
        };
      }
    });
  });
  generateSidebarCards(clinicsToMap);
}

function generateClinicCards(cabinetsDataToDisplay) {
  const cardContainer = document.getElementById('cabinetCardContainer');
  if (!cardContainer) { console.error("Diaeta: #cabinetCardContainer not found."); return; }

  const loadingMsg = cardContainer.querySelector('.loading-message');
  const noResultsMsg = cardContainer.querySelector('.no-results-message');
  if (loadingMsg) loadingMsg.style.display = 'none';
  if (noResultsMsg) noResultsMsg.style.display = 'none';
  cardContainer.innerHTML = ''; 

  const listCountDisplay = document.getElementById('list-count-display');
  if (listCountDisplay) listCountDisplay.textContent = cabinetsDataToDisplay.length;

  if (cabinetsDataToDisplay.length === 0) {
    if (noResultsMsg) {
      noResultsMsg.innerHTML = "<i>Aucun cabinet ne correspond à vos critères actuels.</i>";
      noResultsMsg.style.display = 'block';
    }
    return;
  }

  cabinetsDataToDisplay.forEach((cabinet, index) => {
    const card = document.createElement('div');
    card.className = 'cabinet-explorer-card'; // Animation classes added after display
    card.setAttribute('data-clinic-id', cabinet.id);
    
    let cabinetDaysAttr = '';
    if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
        cabinetDaysAttr = cabinet.opening_hours.map(oh => oh.dayOfWeekFRENCH.toLowerCase().trim()).join(' ');
    }
    card.setAttribute('data-days', cabinetDaysAttr);
      
    const name = cabinet.name || "Nom non disponible";
    const fullAddress = cabinet.fullAddress || "Adresse non spécifiée";
    const city = cabinet.address_obj ? cabinet.address_obj.city : (cabinet.city || '');
    const notes = cabinet.notes || '';
    const detailPageUrl = (cabinet.id && cabinet.id !== 'video') ? `/fr/cabinets/${cabinet.id.toLowerCase().replace(/\s+/g, '-')}/` : '#';
      
    let hoursTeaser = "Consulter les détails pour les horaires";
    if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
        const firstDay = cabinet.opening_hours[0];
        if (firstDay.timeSlots && firstDay.timeSlots.length > 0) {
            const firstSlot = firstDay.timeSlots[0];
            hoursTeaser = `${firstDay.dayOfWeekFRENCH}: ${firstSlot.opens.replace(":", "h")} - ${firstSlot.closes.replace(":", "h")}`;
            if (cabinet.opening_hours.length > 1 || firstDay.timeSlots.length > 1) hoursTeaser += ' (et autres)';
        }
    } else if (cabinet.hours_details_note) {
        hoursTeaser = cabinet.hours_details_note;
    }

    card.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-header">
                <h3 class="card-name"><a href="${detailPageUrl}" target="_blank">${name}</a></h3>
                <p class="card-city text-muted"><i class="fas fa-map-pin fa-xs me-1"></i> ${city}</p>
            </div>
            <div class="card-body-content">
                <p class="card-address text-sm"><i class="fas fa-location-dot fa-xs me-2 text-primary"></i>${fullAddress}</p>
                <p class="card-hours-teaser text-sm"><i class="fas fa-clock fa-xs me-2 text-primary"></i>${hoursTeaser}</p>
                ${notes ? `<p class="card-notes text-xs fst-italic"><i class="fas fa-info-circle fa-xs me-2 text-primary"></i>${notes}</p>` : ''}
            </div>
            <div class="card-footer-actions">
                <a href="${detailPageUrl}" target="_blank" class="btn btn-sm btn-outline-primary details-btn"><i class="fas fa-info-circle me-1"></i>Page Cabinet</a>
                <a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}${name ? '&cabinetName=' + encodeURIComponent(name) : ''}" class="btn btn-sm btn-accent rdv-btn"><i class="fas fa-calendar-check me-1"></i>Prendre RDV</a>
            </div>
        </div>`;
    
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; 
        showClinicDetails(cabinet, clinicMarkers[cabinet.id] || null);
        document.querySelectorAll('.cabinet-explorer-card.active').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
    cardContainer.appendChild(card);
    setTimeout(() => card.classList.add('animate-on-scroll','fade-up', 'filtered-in', 'animated'), 50 + index * 30); // Staggered animation
  });
}

function generateSidebarCards(cabinetsData) {
  
  const sidebarContainer = document.querySelector('.map-sidebar .sidebar-clinics');
  
  if (!sidebarContainer) return;
  sidebarContainer.innerHTML = '';
  let count = 0;
  cabinetsData.forEach(cabinet => {
    if (cabinet.id === 'video' || !cabinet.coordinates) return;
    count++;
    let scheduleStr = 'Horaires non spécifiés';
    if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
      scheduleStr = cabinet.opening_hours.map(day => `${day.dayOfWeekFRENCH}: ${day.timeSlots.map(slot => `${slot.opens.replace(':','h')}-${slot.closes.replace(':','h')}`).join(', ')}`).join('<br>');
    } else if (cabinet.hours_details_note) { scheduleStr = `<em>${cabinet.hours_details_note}</em>`; }

    const card = document.createElement('div');
    card.className = 'sidebar-clinic-card';
    card.setAttribute('data-clinic-id', cabinet.id);
    card.innerHTML = `<h4>${cabinet.name}</h4><div class="sidebar-clinic-address text-xs"><i class="fas fa-location-dot me-1 text-primary"></i>${cabinet.fullAddress || 'Adresse non spécifiée'}</div><div class="sidebar-clinic-hours text-xs mt-1"><i class="fas fa-clock me-1 text-primary"></i>${scheduleStr}</div><a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}${cabinet.name ? '&cabinetName=' + encodeURIComponent(cabinet.name) : ''}" class="btn btn-xs btn-accent mt-2 d-block text-center">Prendre RDV</a>`;
    card.addEventListener('click', () => {
      if (clinicMarkers[cabinet.id]) {
        showClinicDetails(cabinet, clinicMarkers[cabinet.id]);
        clinicMap.flyTo(clinicMarkers[cabinet.id].getLatLng(), 15);
        clinicMarkers[cabinet.id].openPopup();
      }
      highlightSidebarCard(cabinet.id);
    });
    sidebarContainer.appendChild(card);
  });
  const resultsCountElement = document.querySelector('.map-sidebar .sidebar-results');
  if (resultsCountElement) resultsCountElement.textContent = `${count} cabinet${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}`;
  if (count === 0) sidebarContainer.innerHTML = '<p class="text-center p-3 text-muted"><i>Aucun cabinet physique à afficher.</i></p>';
}

function showClinicDetails(cabinet, marker) {
  console.log(`Diaeta Debug (v7): Entry - showClinicDetails for [${cabinet.name}]`);
  const detailPanel = document.getElementById('clinicDetailPanel');
  if (!detailPanel) {
    console.error("Diaeta Debug (v7): CRITICAL - #clinicDetailPanel NOT FOUND.");
    return;
  }

  // --- Populate Panel Content --- (Your existing innerHTML generation)
  let scheduleHtml = '';
  if (cabinet.opening_hours && cabinet.opening_hours.length > 0) {
    cabinet.opening_hours.forEach(day_schedule => {
      let dayHours = day_schedule.timeSlots.map(slot => `${slot.opens.replace(":", "h")} - ${slot.closes.replace(":", "h")}`).join(', ');
      scheduleHtml += `<li><span class="day">${day_schedule.dayOfWeekFRENCH}:</span> <span class="hours available">${dayHours}</span></li>`;
    });
  }
  if (cabinet.hours_details_note) { scheduleHtml += `<li class="mt-1"><em class="text-xs text-muted">${cabinet.hours_details_note}</em></li>`; }
  if (!scheduleHtml && cabinet.id !== 'video') { scheduleHtml = '<li><span class="day">Horaires:</span> <span class="hours">Veuillez consulter le module de réservation.</span></li>'; }
  else if (cabinet.id === 'video' && !scheduleHtml) { scheduleHtml = '<li><span class="day">Horaires:</span> <span class="hours">Flexibles, à voir sur le module de réservation.</span></li>';}
  const addressDisplay = cabinet.fullAddress || (cabinet.address_obj ? `${cabinet.address_obj.streetNumber} ${cabinet.address_obj.streetName}, ${cabinet.address_obj.postalCode} ${cabinet.address_obj.city}` : 'Lieu de consultation en ligne');
  const detailPageUrl = (cabinet.id && cabinet.id !== 'video') ? `/fr/cabinets/${cabinet.id.toLowerCase().replace(/\s+/g, '-')}/` : null;
  detailPanel.innerHTML = `
    <div class="detail-panel-header"><h3>${cabinet.name}</h3><button class="close-panel-btn" id="panelCloseButton" aria-label="Fermer"><i class="fa-solid fa-times"></i></button></div>
    <div class="detail-panel-body">
      <div class="detail-section"><h4 class="detail-title"><i class="fa-solid ${cabinet.id === 'video' ? 'fa-video' : 'fa-location-dot'} text-primary"></i> ${cabinet.id === 'video' ? 'Type' : 'Adresse'}</h4><p class="detail-text">${addressDisplay}</p>${(cabinet.Maps_link && cabinet.id !== 'video') ? `<a href="${cabinet.Maps_link}" class="detail-action-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-directions"></i> Itinéraire</a>` : ''} ${detailPageUrl ? `<a href="${detailPageUrl}" class="detail-action-link d-block mt-1" target="_blank"><i class="fa-solid fa-circle-info"></i> Infos Cabinet</a>` : ''}</div>
      ${scheduleHtml ? `<div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-clock text-primary"></i> Horaires (indicatifs)</h4><ul class="schedule-list">${scheduleHtml}</ul></div>` : ''}
      ${cabinet.notes ? `<div class="detail-section"><h4 class="detail-title"><i class="fa-solid fa-info-circle text-primary"></i> Informations</h4><p class="detail-text">${cabinet.notes}</p></div>` : ''}
      <div class="detail-action mt-3"><a href="/fr/rendez-vous/?locationId=${cabinet.doctorpracticeId}${cabinet.name ? '&cabinetName=' + encodeURIComponent(cabinet.name) : ''}" class="btn btn-primary w-100 book-btn"><i class="fa-solid fa-calendar-check"></i> RDV ${cabinet.id === 'video' ? 'en ligne' : 'ici'}</a></div>
    </div>`;
  console.log("Diaeta Debug (v7): Panel innerHTML set.");
  // --- End Populate ---

  // --- Show Panel ---
  detailPanel.classList.remove('d-none'); // Allow it to be shown
  detailPanel.classList.add('active');   // Activate custom visibility/styling
  console.log("Diaeta Debug (v7): Panel AFTER show. Classes:", detailPanel.className, "Computed display:", window.getComputedStyle(detailPanel).display);

  if (window.innerWidth >= 992 && detailPanel.classList.contains('d-lg-block')) {
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const closeButton = document.getElementById('panelCloseButton');
  if (closeButton) {
    console.log("Diaeta Debug (v7): Close button #panelCloseButton found.");
    closeButton.onclick = function(event) {
      event.stopPropagation();
      console.log(`Diaeta Debug (v7): Close CLICKED!`);
      
      detailPanel.classList.remove('active'); // Deactivate
      detailPanel.classList.add('d-none');   // Ensure it's hidden by Bootstrap utility
                                            // The new CSS rule will make sure this d-none wins.

      console.log("Diaeta Debug (v7): Panel AFTER close. Classes:", detailPanel.className);
      setTimeout(() => {
          console.log("Diaeta Debug (v7): Panel computed display (10ms after close):", window.getComputedStyle(detailPanel).display);
      }, 10);
      document.querySelectorAll('.cabinet-explorer-card.active, .sidebar-clinic-card.active').forEach(el => el.classList.remove('active'));
    };
  } else {
    console.error("Diaeta Debug (v7): CRITICAL - Close button #panelCloseButton NOT FOUND.");
  }
  
  // Highlight cards and pan map
  document.querySelectorAll('.cabinet-explorer-card.active, .sidebar-clinic-card.active').forEach(el => el.classList.remove('active'));
  const listCard = document.querySelector(`.cabinet-explorer-card[data-clinic-id="${cabinet.id}"]`);
  if(listCard) listCard.classList.add('active');
  highlightSidebarCard(cabinet.id);
  if (clinicMap && marker && typeof marker.getLatLng === 'function') {
    clinicMap.flyTo(marker.getLatLng(), clinicMap.getZoom() > 15 ? clinicMap.getZoom() : 15 , {animate: true, duration: 0.5});
  }
}

function highlightSidebarCard(clinicId) {
  document.querySelectorAll('.map-sidebar .sidebar-clinic-card.active').forEach(c => c.classList.remove('active'));
  const targetCard = document.querySelector(`.map-sidebar .sidebar-clinic-card[data-clinic-id="${clinicId}"]`);
  if (targetCard) {
    targetCard.classList.add('active');
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function initLocateMe(physicalCabinets) {
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
          if (nearest && clinicMap && clinicMarkers && clinicMarkers[nearest.id]) {
            const mapViewToggle = document.querySelector('.view-toggle[data-view="map"]');
            if (mapViewToggle && !mapViewToggle.classList.contains('active')) mapViewToggle.click();
            setTimeout(() => {
                const marker = clinicMarkers[nearest.id];
                showClinicDetails(nearest, marker); 
                marker.openPopup();
            }, 250);
          } else if (nearest) { alert(`Cabinet le plus proche: ${nearest.name} à ${nearest.fullAddress}.`); }
          else { alert('Aucun cabinet trouvé à proximité.'); }
          resetLocateBtn(locateBtn, originalBtnHTML);
        },
        (error) => { console.error('Geolocation error:', error); alert('Impossible de vous localiser.'); resetLocateBtn(locateBtn, originalBtnHTML); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else { alert("Géolocalisation non supportée."); resetLocateBtn(locateBtn, originalBtnHTML); }
  });
}

function resetLocateBtn(btnElement, originalHTML) {
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
    const R=6371,dLat=toRadians(lat2-lat1),dLon=toRadians(lon2-lon1),a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2),c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));return R*c;
}
function toRadians(deg) { return deg*(Math.PI/180); }


function initializeRendezVousPage() {
    const iframe = document.getElementById('defaultiFrame');
    const bookingModuleDynamicTitleSpan = document.getElementById('booking-module-dynamic-title');
    const bookingModuleSubtitle = document.getElementById('booking-module-subtitle');
    const iframeLoadingIndicator = document.getElementById('iframe-loading-indicator');
    const locationCards = document.querySelectorAll('.select-cabinet-card'); 

    if (!iframe) { console.error('Doctoranytime iframe not found on RDV page'); return; }

    const doctorId = '80669';
    const baseIframeSrc = `https://www.doctoranytime.be/iframes/agenda?doctorId=${doctorId}`;
    
    const showIframeLoading = () => { if (iframeLoadingIndicator) iframeLoadingIndicator.style.display = 'block'; if (iframe) iframe.style.opacity = '0.5'; };
    const hideIframeLoading = () => { setTimeout(() => { if (iframeLoadingIndicator) iframeLoadingIndicator.style.display = 'none'; if (iframe) iframe.style.opacity = '1'; }, 200); };

    const updateIframeAndTitle = (practiceId, cabinetName) => {
        showIframeLoading();
        let newSrc = baseIframeSrc;
        let titleText = "Sélectionnez Votre Horaire";
        let subTitleText = "Choisissez un créneau pour le lieu sélectionné.";

        if (practiceId) {
            newSrc += `&doctorpracticeId=${practiceId}`;
            titleText = `Disponibilités pour : ${cabinetName}`;
            subTitleText = `Choisissez un créneau pour ${cabinetName}.`;
        } else { // "Tous les cabinets"
            titleText = "Disponibilités : Tous les cabinets";
            subTitleText = "Choisissez un créneau dans un de nos cabinets ou en téléconsultation.";
        }
        
        const handleLoad = () => { hideIframeLoading(); iframe.removeEventListener('load', handleLoad); iframe.removeEventListener('error', handleError);};
        const handleError = () => { console.error("Iframe failed to load:", newSrc); hideIframeLoading(); iframe.removeEventListener('load', handleLoad); iframe.removeEventListener('error', handleError);};
        
        iframe.removeEventListener('load', handleLoad); iframe.removeEventListener('error', handleError); 
        iframe.addEventListener('load', handleLoad); iframe.addEventListener('error', handleError);
        iframe.src = newSrc;

        if (bookingModuleDynamicTitleSpan) bookingModuleDynamicTitleSpan.textContent = titleText;
        if (bookingModuleSubtitle) bookingModuleSubtitle.textContent = subTitleText;

        locationCards.forEach(card => card.classList.toggle('active', card.dataset.practiceId === practiceId));
    };

    locationCards.forEach(card => {
        card.addEventListener('click', function () {
            updateIframeAndTitle(this.dataset.practiceId, this.dataset.cabinetName);
            const bookingModuleWrapper = document.getElementById('booking-module-wrapper');
            if (bookingModuleWrapper) bookingModuleWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const locationIdFromUrl = urlParams.get('locationId');
    const cabinetNameFromUrl = urlParams.get('cabinetName');

    if (locationIdFromUrl) {
        const targetCard = document.querySelector(`.select-cabinet-card[data-practice-id="${locationIdFromUrl}"]`);
        if (targetCard) {
            targetCard.click(); // This will call updateIframeAndTitle
        } else if (cabinetNameFromUrl) { // If card not found but name exists (e.g. direct link to non-listed practiceId)
            updateIframeAndTitle(locationIdFromUrl, decodeURIComponent(cabinetNameFromUrl));
        } else { // Fallback if practice ID in URL doesn't match any card
            updateIframeAndTitle(locationIdFromUrl, "le cabinet sélectionné");
        }
    } else { // Default to "Tous les cabinets"
        const defaultSelectionCard = document.querySelector('.location-card.default-selection');
        if (defaultSelectionCard) {
           defaultSelectionCard.click(); // This will call updateIframeAndTitle for "All"
        } else if (locationCards.length > 0) {
            locationCards[0].click(); // Default to the first card if no "default-selection"
        }
    }
    
    if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') { hideIframeLoading(); }
    else { iframe.addEventListener('load', hideIframeLoading, { once: true }); iframe.addEventListener('error', hideIframeLoading, { once: true });}
}

// General purpose animation class adders (run once)
document.querySelectorAll('.section-header:not(.animate-on-scroll)').forEach(h => h.classList.add('animate-on-scroll','fade-up'));
document.querySelectorAll('.specialty-card:not(.animate-on-scroll), .success-card:not(.animate-on-scroll), .science-pillar:not(.animate-on-scroll), .contact-form-container:not(.animate-on-scroll), .cabinet-explorer-card:not(.animate-on-scroll)').forEach(e => e.classList.add('animate-on-scroll','fade-up'));
document.querySelectorAll('.contact-list:not(.animate-on-scroll), .approach-list:not(.animate-on-scroll)').forEach(l => {
  l.classList.add('animate-on-scroll','fade-in');
  l.querySelectorAll('li').forEach((i,idx) => { i.style.transitionDelay = `${idx*0.05}s`; i.style.animationDelay = `${idx*0.05}s`; });
});

// In main.js, perhaps in a general utility section or initializeHero

function initializeScrollToLinks() {
  const scrollToButtons = document.querySelectorAll('.scroll-to');
  scrollToButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1); // Get ID from href="#targetId"
          const targetElement = document.getElementById(targetId);
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;

          if (targetElement) {
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // 20px extra offset

              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
}

// Call it in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // ... your other initializations ...
  initializeScrollToLinks();
});