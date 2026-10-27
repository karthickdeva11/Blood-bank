/**
 * RED HOPE - Main Interactive Logic
 * Features:
 * - Blood Compatibility Calculator (RBC & Plasma matrices)
 * - Live Inventory Tab Switcher & Dynamic Meters
 * - 60-Second Donor Eligibility Checker Quiz
 * - Appointment Booking Modal & Form Validation
 * - Donation Center Search Filtering
 * - Mobile Navigation Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // Area & Scroll Restoration System (When returning from 404 page)
  // ==========================================================================
  function restorePreviousScrollPosition() {
    const restoreY = sessionStorage.getItem('redhope_restore_scroll');
    if (restoreY !== null) {
      sessionStorage.removeItem('redhope_restore_scroll');
      const targetY = parseInt(restoreY, 10);
      if (!isNaN(targetY) && targetY >= 0) {
        // Immediate jump
        window.scrollTo(0, targetY);
        requestAnimationFrame(() => {
          window.scrollTo(0, targetY);
        });
        setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }, 100);
        setTimeout(() => {
          if (Math.abs(window.scrollY - targetY) > 30) {
            window.scrollTo(0, targetY);
          }
        }, 350);
      }
    }
  }

  // Restore on DOM ready, back-forward cache (pageshow), and complete load
  restorePreviousScrollPosition();
  window.addEventListener('pageshow', restorePreviousScrollPosition);
  window.addEventListener('load', restorePreviousScrollPosition);

  // Continuously record latest valid page URL & scroll position before leaving any page
  window.addEventListener('beforeunload', () => {
    if (!window.location.pathname.includes('404.html') && !window.location.pathname.endsWith('/404')) {
      sessionStorage.setItem('redhope_prev_page', window.location.href);
      sessionStorage.setItem('redhope_prev_scroll', window.scrollY.toString());
    }
  });

  window.addEventListener('pagehide', () => {
    if (!window.location.pathname.includes('404.html') && !window.location.pathname.endsWith('/404')) {
      sessionStorage.setItem('redhope_prev_page', window.location.href);
      sessionStorage.setItem('redhope_prev_scroll', window.scrollY.toString());
    }
  });

  // Global helper for 404 back navigation
  window.goBackToPreviousArea = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const prevPage = sessionStorage.getItem('redhope_prev_page');
    const prevScroll = sessionStorage.getItem('redhope_prev_scroll');
    if (prevScroll !== null) {
      sessionStorage.setItem('redhope_restore_scroll', prevScroll);
    }
    const hasHistory = window.history.length > 1;
    const ref = document.referrer;
    const isInternal = ref && !ref.includes('404.html');

    if (hasHistory && (isInternal || prevPage)) {
      window.history.back();
      setTimeout(() => {
        if (prevPage && !prevPage.includes('404.html')) {
          window.location.href = prevPage;
        } else {
          window.location.href = 'index.html';
        }
      }, 250);
    } else if (prevPage && !prevPage.includes('404.html')) {
      window.location.href = prevPage;
    } else {
      window.location.href = 'index.html';
    }
  };

  // 0. Bulletproof Image Fallback & Auto-Recovery System
  const defaultPlaceholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231A0507%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%234A0000%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23bg)%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22170%22%20r%3D%2245%22%20fill%3D%22%23C8102E%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M300%20140%20C300%20140%20325%20175%20325%20195%20C325%20208%20314%20220%20300%20220%20C286%20220%20275%20208%20275%20195%20C275%20175%20300%20140%20300%20140%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%22260%22%20fill%3D%22%23FFE4E6%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%3ERED%20HOPE%20BLOOD%20BANK%3C%2Ftext%3E%3C%2Fsvg%3E";
  const defaultLogoSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22180%22%20height%3D%2246%22%20viewBox%3D%220%200%20180%2046%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2223%22%20cy%3D%2223%22%20r%3D%2218%22%20fill%3D%22%23C8102E%22%2F%3E%3Cpath%20d%3D%22M23%2011%20C23%2011%2031%2021%2031%2026%20C31%2030%2027%2034%2023%2034%20C19%2034%2015%2030%2015%2026%20C15%2021%2023%2011%2023%2011%20Z%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Ctext%20x%3D%2248%22%20y%3D%2229%22%20fill%3D%22%238B0000%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22900%22%20letter-spacing%3D%22-0.5px%22%3ERED%20HOPE%3C%2Ftext%3E%3C%2Fsvg%3E";

  function handleImageError(img) {
    if (img.classList.contains('brand-logo-img') || img.classList.contains('auth-logo-img') || (img.src && img.src.includes('logo'))) {
      img.src = defaultLogoSvg;
    } else {
      img.src = defaultPlaceholderSvg;
    }
  }

  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
    img.addEventListener('error', () => handleImageError(img));
  });

  // 1. Mobile Menu Drawer Toggle & Enhanced Navigation
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  let mobileBackdrop = document.querySelector('.mobile-menu-backdrop');

  if (mobileToggle && mobileDrawer) {
    if (!mobileBackdrop) {
      mobileBackdrop = document.createElement('div');
      mobileBackdrop.className = 'mobile-menu-backdrop';
      document.body.appendChild(mobileBackdrop);
    }

    const setMenuState = (isOpen) => {
      mobileDrawer.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (mobileBackdrop) mobileBackdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileDrawer.classList.contains('open');
      setMenuState(isOpen);
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => setMenuState(false));
    }

    // Close when clicking any menu link or close button
    mobileDrawer.querySelectorAll('a, .mobile-drawer-close').forEach(elem => {
      elem.addEventListener('click', () => setMenuState(false));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setMenuState(false);
      }
    });
  }

  // Dashboard Sidebar Toggle for Mobile (used on admin and donor dashboards)
  const dashSidebarToggle = document.querySelector('.dash-sidebar-toggle');
  const dashSidebarClose = document.querySelector('.dash-sidebar-close');
  const dashSidebar = document.querySelector('.dash-sidebar');
  const dashBackdrop = document.querySelector('.dash-sidebar-backdrop');

  function openDashSidebar() {
    if (dashSidebar) dashSidebar.classList.add('open');
    if (dashBackdrop) dashBackdrop.classList.add('active');
  }

  function closeDashSidebar() {
    if (dashSidebar) dashSidebar.classList.remove('open');
    if (dashBackdrop) dashBackdrop.classList.remove('active');
  }

  if (dashSidebarToggle) dashSidebarToggle.addEventListener('click', openDashSidebar);
  if (dashSidebarClose) dashSidebarClose.addEventListener('click', closeDashSidebar);
  if (dashBackdrop) dashBackdrop.addEventListener('click', closeDashSidebar);

  // 2. Interactive Blood Compatibility Matrix
  const compatibilityData = {
    'O-': {
      giveRBC: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      receiveRBC: ['O-'],
      givePlasma: ['O-'],
      receivePlasma: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      title: 'Universal Red Cell Donor',
      note: 'O- Negative red blood cells can be given to patients of ANY blood type. In emergency trauma, this is the first unit reached for.'
    },
    'O+': {
      giveRBC: ['O+', 'A+', 'B+', 'AB+'],
      receiveRBC: ['O-', 'O+'],
      givePlasma: ['O+', 'O-'],
      receivePlasma: ['O+', 'A+', 'B+', 'AB+'],
      title: 'Most Common & Needed Blood Type',
      note: 'O+ is present in ~38% of the global population. Extremely vital for emergency room trauma and scheduled cardiac surgeries.'
    },
    'A-': {
      giveRBC: ['A-', 'A+', 'AB-', 'AB+'],
      receiveRBC: ['A-', 'O-'],
      givePlasma: ['A-', 'O-'],
      receivePlasma: ['A-', 'A+', 'AB-', 'AB+'],
      title: 'Rare Red Cell Type',
      note: 'A- donors are crucial for neonatal intensive care units (NICU) and cancer therapy patients needing targeted transfusions.'
    },
    'A+': {
      giveRBC: ['A+', 'AB+'],
      receiveRBC: ['A+', 'A-', 'O+', 'O-'],
      givePlasma: ['A+', 'A-'],
      receivePlasma: ['A+', 'AB+'],
      title: 'Second Most Prevalent Type',
      note: 'A+ is in constant hospital demand for orthopedic surgeries, organ transplants, and hematology treatments.'
    },
    'B-': {
      giveRBC: ['B-', 'B+', 'AB-', 'AB+'],
      receiveRBC: ['B-', 'O-'],
      givePlasma: ['B-', 'O-'],
      receivePlasma: ['B-', 'B+', 'AB-', 'AB+'],
      title: 'Very Rare Blood Type (~2%)',
      note: 'Only 2 in 100 people carry B-. Maintaining a steady buffer is one of our highest operational priorities.'
    },
    'B+': {
      giveRBC: ['B+', 'AB+'],
      receiveRBC: ['B+', 'B-', 'O+', 'O-'],
      givePlasma: ['B+', 'B-'],
      receivePlasma: ['B+', 'AB+'],
      title: 'Essential for Sickle Cell & Thalassemia',
      note: 'B+ blood is in heavy clinical demand for chronic blood disorders requiring lifelong monthly transfusions.'
    },
    'AB-': {
      giveRBC: ['AB-', 'AB+'],
      receiveRBC: ['AB-', 'A-', 'B-', 'O-'],
      givePlasma: ['AB-', 'A-', 'B-', 'O-'],
      receivePlasma: ['AB-'],
      title: 'Rarest of All Standard Types (<1%)',
      note: 'AB- is exceptionally rare. AB- plasma is universally accepted across multiple recipient categories.'
    },
    'AB+': {
      giveRBC: ['AB+'],
      receiveRBC: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      givePlasma: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
      receivePlasma: ['AB+'],
      title: 'Universal Recipient / Universal Plasma Donor',
      note: 'AB+ can receive red cells from everyone! Even more exciting: AB+ plasma can be given to ANY patient in the world.'
    }
  };

  const compatBtns = document.querySelectorAll('.type-select-btn');
  const canGiveContainer = document.getElementById('compatCanGive');
  const canReceiveContainer = document.getElementById('compatCanReceive');
  const compatHeadline = document.getElementById('compatHeadline');
  const compatNote = document.getElementById('compatNote');

  function renderCompatibility(type) {
    const data = compatibilityData[type];
    if (!data) return;

    if (compatHeadline) compatHeadline.textContent = `${type} — ${data.title}`;
    if (compatNote) compatNote.textContent = data.note;

    if (canGiveContainer) {
      canGiveContainer.innerHTML = data.giveRBC.map(b => `<span class="compat-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> ${b}</span>`).join('');
    }

    if (canReceiveContainer) {
      canReceiveContainer.innerHTML = data.receiveRBC.map(b => `<span class="compat-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> ${b}</span>`).join('');
    }
  }

  compatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedType = btn.getAttribute('data-type');
      renderCompatibility(selectedType);
    });
  });

  // 3. Live Inventory Category Filter Tabs
  const invTabs = document.querySelectorAll('.inv-tab-btn');
  const invCards = document.querySelectorAll('.inventory-card');

  const stockModifiers = {
    'all': [
      { type: 'O-', units: 14, status: 'critical', pct: 22, days: '1.2 Days' },
      { type: 'O+', units: 48, status: 'low', pct: 45, days: '2.5 Days' },
      { type: 'A-', units: 19, status: 'critical', pct: 28, days: '1.4 Days' },
      { type: 'A+', units: 82, status: 'optimal', pct: 86, days: '5.8 Days' },
      { type: 'B-', units: 11, status: 'critical', pct: 18, days: '0.9 Days' },
      { type: 'B+', units: 64, status: 'optimal', pct: 78, days: '4.6 Days' },
      { type: 'AB-', units: 8, status: 'critical', pct: 14, days: '0.7 Days' },
      { type: 'AB+', units: 52, status: 'optimal', pct: 72, days: '4.2 Days' }
    ],
    'whole': [
      { type: 'O-', units: 8, status: 'critical', pct: 16, days: '0.8 Days' },
      { type: 'O+', units: 32, status: 'low', pct: 40, days: '2.1 Days' },
      { type: 'A-', units: 12, status: 'critical', pct: 24, days: '1.1 Days' },
      { type: 'A+', units: 58, status: 'optimal', pct: 82, days: '5.2 Days' },
      { type: 'B-', units: 6, status: 'critical', pct: 12, days: '0.6 Days' },
      { type: 'B+', units: 44, status: 'optimal', pct: 70, days: '4.0 Days' },
      { type: 'AB-', units: 4, status: 'critical', pct: 10, days: '0.5 Days' },
      { type: 'AB+', units: 36, status: 'optimal', pct: 68, days: '3.8 Days' }
    ],
    'platelets': [
      { type: 'O-', units: 4, status: 'critical', pct: 12, days: '0.4 Days' },
      { type: 'O+', units: 11, status: 'critical', pct: 24, days: '0.8 Days' },
      { type: 'A-', units: 5, status: 'critical', pct: 15, days: '0.5 Days' },
      { type: 'A+', units: 16, status: 'low', pct: 42, days: '1.3 Days' },
      { type: 'B-', units: 3, status: 'critical', pct: 10, days: '0.3 Days' },
      { type: 'B+', units: 14, status: 'low', pct: 38, days: '1.1 Days' },
      { type: 'AB-', units: 2, status: 'critical', pct: 8, days: '0.2 Days' },
      { type: 'AB+', units: 12, status: 'low', pct: 34, days: '1.0 Days' }
    ],
    'plasma': [
      { type: 'O-', units: 24, status: 'low', pct: 48, days: '3.2 Days' },
      { type: 'O+', units: 56, status: 'optimal', pct: 85, days: '6.4 Days' },
      { type: 'A-', units: 22, status: 'low', pct: 44, days: '2.9 Days' },
      { type: 'A+', units: 62, status: 'optimal', pct: 90, days: '7.1 Days' },
      { type: 'B-', units: 18, status: 'low', pct: 36, days: '2.4 Days' },
      { type: 'B+', units: 48, status: 'optimal', pct: 80, days: '5.5 Days' },
      { type: 'AB-', units: 14, status: 'low', pct: 32, days: '2.0 Days' },
      { type: 'AB+', units: 75, status: 'optimal', pct: 95, days: '8.2 Days' }
    ]
  };

  invTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      invTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat') || 'all';
      updateInventoryDisplay(cat);
    });
  });

  function updateInventoryDisplay(cat) {
    const list = stockModifiers[cat] || stockModifiers['all'];
    invCards.forEach((card, idx) => {
      const item = list[idx];
      if (!item) return;

      // Update classes
      card.className = `inventory-card ${item.status}`;
      const badge = card.querySelector('.status-badge-pill');
      if (badge) {
        badge.className = `status-badge-pill ${item.status}`;
        badge.textContent = item.status.toUpperCase();
      }

      const unitsEl = card.querySelector('.inv-units-count');
      if (unitsEl) unitsEl.textContent = `${item.units} Units Available`;

      const daysEl = card.querySelector('.inv-days-count');
      if (daysEl) daysEl.textContent = item.days;

      const fill = card.querySelector('.meter-fill');
      if (fill) fill.style.width = `${item.pct}%`;
    });
  }

  // 4. 60-Second Donor Eligibility Checker Quiz
  let currentQuizStep = 1;
  const totalQuizSteps = 4;
  const userAnswers = {};

  const quizStepEl = document.getElementById('quizStepNum');
  const quizProgressFill = document.getElementById('quizProgressBarFill');
  const quizCards = document.querySelectorAll('.quiz-question-card');
  const quizResultBox = document.getElementById('quizResultBox');
  const quizResetBtn = document.getElementById('quizResetBtn');

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      const answer = btn.getAttribute('data-answer');
      userAnswers[step] = answer;

      if (step < totalQuizSteps) {
        goToQuizStep(step + 1);
      } else {
        evaluateQuizResults();
      }
    });
  });

  function goToQuizStep(step) {
    currentQuizStep = step;
    if (quizStepEl) quizStepEl.textContent = `Question ${step} of ${totalQuizSteps}`;
    if (quizProgressFill) quizProgressFill.style.width = `${(step / totalQuizSteps) * 100}%`;

    quizCards.forEach(c => c.classList.remove('active'));
    const targetCard = document.querySelector(`.quiz-question-card[data-step="${step}"]`);
    if (targetCard) targetCard.classList.add('active');
  }

  function evaluateQuizResults() {
    quizCards.forEach(c => c.classList.remove('active'));
    if (quizResultBox) {
      quizResultBox.style.display = 'block';

      const isAgeWeightGood = userAnswers[1] === 'yes';
      const isHealthGood = userAnswers[2] === 'yes';
      const isWaitPeriodGood = userAnswers[3] === 'yes';
      const isLifestyleGood = userAnswers[4] === 'no';

      const resultTitle = document.getElementById('quizResultTitle');
      const resultDesc = document.getElementById('quizResultDesc');
      const resultBadge = document.getElementById('quizResultBadge');

      if (isAgeWeightGood && isHealthGood && isWaitPeriodGood && isLifestyleGood) {
        resultTitle.textContent = '🎉 Congratulations! You Are Eligible to Donate!';
        resultDesc.textContent = 'Based on clinical guidelines, your body is ready to save up to 3 precious lives today. Book your nearest priority donor bed.';
        resultBadge.className = 'result-icon-large';
        resultBadge.style.backgroundColor = '#059669';
        resultBadge.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      } else {
        resultTitle.textContent = 'Temporary Deferral / Medical Review Required';
        resultDesc.textContent = 'You may have a temporary deferral (e.g. recent tattoo, waiting window, or minor cold). Our medical officer can provide a free 5-minute pre-screening.';
        resultBadge.className = 'result-icon-large';
        resultBadge.style.backgroundColor = '#D97706';
        resultBadge.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      }
    }
  }

  if (quizResetBtn) {
    quizResetBtn.addEventListener('click', () => {
      if (quizResultBox) quizResultBox.style.display = 'none';
      goToQuizStep(1);
    });
  }

  // 5. Booking Modal Close Handlers
  const modalOverlay = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('donorAppointmentForm');

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // Universal Form Validation & Redirection to 404
  function validateFormAndRedirectTo404(form, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Clear previous errors
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    let isValid = true;
    let firstInvalidField = null;

    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') return;

      let fieldValid = true;
      let errorMsg = '';
      const val = input.value.trim();

      // Required check
      if (input.hasAttribute('required') && (!val || (input.type === 'checkbox' && !input.checked))) {
        fieldValid = false;
        errorMsg = 'This field is required.';
      }
      // Email format check
      else if (input.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          fieldValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      }
      // Phone format check
      else if (input.type === 'tel' && val) {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10) {
          fieldValid = false;
          errorMsg = 'Please enter a valid phone number (at least 10 digits).';
        }
      }
      // Password length check
      else if (input.type === 'password' && val) {
        if (val.length < 6) {
          fieldValid = false;
          errorMsg = 'Password must be at least 6 characters.';
        }
      }

      if (!fieldValid) {
        isValid = false;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');

        const errorSpan = document.createElement('span');
        errorSpan.className = 'invalid-feedback';
        errorSpan.textContent = errorMsg;
        if (input.parentNode) {
          input.parentNode.appendChild(errorSpan);
        }

        if (!firstInvalidField) firstInvalidField = input;
      } else if (val) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });

    // Check matching passwords if there is a confirm password field
    const pwd = form.querySelector('input[type="password"]:not([id*="Confirm"]):not([placeholder*="Confirm"])');
    const confirmPwd = form.querySelector('input[type="password"][id*="Confirm"], input[type="password"][placeholder*="Confirm"]');
    if (pwd && confirmPwd && pwd.value && confirmPwd.value) {
      if (pwd.value !== confirmPwd.value) {
        isValid = false;
        confirmPwd.classList.add('is-invalid');
        confirmPwd.classList.remove('is-valid');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'invalid-feedback';
        errorSpan.textContent = 'Passwords do not match.';
        if (confirmPwd.parentNode) confirmPwd.parentNode.appendChild(errorSpan);
        if (!firstInvalidField) firstInvalidField = confirmPwd;
      }
    }

    if (!isValid) {
      form.classList.add('form-shake');
      setTimeout(() => form.classList.remove('form-shake'), 500);
      if (firstInvalidField) firstInvalidField.focus();
      return false;
    }

    // Validation succeeded! Show sleek feedback state
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('btn-validating');
      submitBtn.innerHTML = `
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:8px; animation:radarSpin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Verified! Redirecting...
      `;
    }

    // Display validation toast notification
    let toast = document.querySelector('.validation-toast-overlay');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'validation-toast-overlay';
      toast.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Information validated! Routing request to central records...</span>
      `;
      document.body.appendChild(toast);
    }
    setTimeout(() => toast.classList.add('show'), 50);

    // Redirect to custom 404 page after brief verification pause
    setTimeout(() => {
      sessionStorage.setItem('redhope_prev_page', window.location.href);
      sessionStorage.setItem('redhope_prev_scroll', window.scrollY.toString());
      window.location.href = '404.html';
    }, 700);

    return true;
  }

  window.validateFormAndRedirectTo404 = validateFormAndRedirectTo404;

  // Real-time clearance of invalid state on user input
  document.addEventListener('input', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('is-invalid')) {
      target.classList.remove('is-invalid');
      const feedback = target.parentNode?.querySelector('.invalid-feedback');
      if (feedback) feedback.remove();
    }
  });

  // Attach validation to all forms across the site
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      validateFormAndRedirectTo404(form, e);
    });
  });

  // Handle appointment booking modal form
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      validateFormAndRedirectTo404(bookingForm, e);
    });
  }

  // Universal Content Link & Button Redirection to 404 (except navbar and footer)
  document.addEventListener('click', (e) => {
    // If already on the 404 error page, allow all links and recovery buttons to work normally
    if (window.location.pathname.includes('404.html') || window.location.pathname.endsWith('/404')) {
      return;
    }

    const element = e.target.closest('a, button');
    if (!element) return;

    // 1. Check if inside navbar (header, nav links, brand logo, mobile drawer)
    const isInNavbar = element.closest('header, .header-main, nav, .mobile-menu-drawer, .nav-inner, .brand-logo');
    if (isInNavbar) return;

    // 2. Check if inside footer (including social links and footer nav)
    const isInFooter = element.closest('footer, .footer-main, .footer-bottom-bar, .footer-inner, .site-footer');
    if (isInFooter) return;

    // 3. Form submit buttons or inputs inside forms are handled by form validation
    if (element.type === 'submit' || element.closest('form')) {
      return;
    }

    // 4. Modal close buttons
    if (element.classList.contains('modal-close-btn') || element.classList.contains('dash-modal-close') || element.classList.contains('dash-sidebar-close') || element.classList.contains('dash-sidebar-toggle')) {
      return;
    }

    // 5. In-page tab / filter controls
    if (element.classList.contains('inv-tab-btn') ||
        element.classList.contains('type-select-btn') ||
        element.classList.contains('blog-filter-btn') ||
        element.classList.contains('auth-tab-btn') ||
        element.classList.contains('auth-mode-tab') ||
        element.classList.contains('role-option') ||
        element.classList.contains('password-toggle-btn') ||
        element.classList.contains('quiz-option-btn') ||
        element.id === 'quizResetBtn' ||
        element.getAttribute('role') === 'tab') {
      return;
    }

    // 6. ALL buttons like "Schedule a Donation", "Check Live Blood Stock", and all other CTA buttons/links redirect to 404!
    e.preventDefault();
    sessionStorage.setItem('redhope_prev_page', window.location.href);
    sessionStorage.setItem('redhope_prev_scroll', window.scrollY.toString());
    window.location.href = '404.html';
  });

  // 6. Donation Center Live Search Filter
  const centerSearchInput = document.getElementById('centerSearchInput');
  const centerCards = document.querySelectorAll('.center-card');

  if (centerSearchInput && centerCards.length) {
    centerSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      centerCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 7. Blog Category Filter (on Blog page)
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (blogFilterBtns.length && blogCards.length) {
    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        blogCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-cat') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 8. Auth Tabs (Login / Register / Hospital) on Login page
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const authPanels = document.querySelectorAll('.auth-form-panel');

  if (authTabs.length && authPanels.length) {
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // Initialize compatibility with O-
  renderCompatibility('O-');

  // ==========================================================================
  // AOS (Animate On Scroll) & GSAP (GreenSock) Animation Suite
  // ==========================================================================
  
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // Initialize GSAP & ScrollTrigger
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Staggered Entrance Timeline
    const heroContent = document.querySelector('.hero-content-wrap');
    if (heroContent) {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl.from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
            .from('.hero-title', { opacity: 0, y: 35, duration: 1 }, '-=0.5')
            .from('.hero-desc', { opacity: 0, y: 25, duration: 0.8 }, '-=0.6')
            .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
            .from('.hero-hint-pill', { opacity: 0, scale: 0.85, duration: 0.6 }, '-=0.4');
    }

    // Page Hero Banner entrance for subpages
    const pageHero = document.querySelector('.page-hero-banner');
    if (pageHero) {
      gsap.from('.breadcrumbs-list', { opacity: 0, y: -15, duration: 0.6, delay: 0.1, ease: 'power2.out' });
      gsap.from('.page-hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.25, ease: 'power3.out' });
      gsap.from('.page-hero-desc', { opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    }

    // 2. Floating Oscillations (Pills, blood drops, badges)
    gsap.to('.hero-hint-pill', {
      y: -8,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.hero-eyebrow svg', {
      scale: 1.25,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // 3. Heartbeat / Critical Inventory Pulse Wave
    const pulseBadges = document.querySelectorAll('.status-badge-pill.critical, .error-badge-dot');
    pulseBadges.forEach(badge => {
      gsap.to(badge, {
        scale: 1.1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });

    // 4. Dynamic Counter Number Animation with ScrollTrigger
    const statCounters = document.querySelectorAll('.stat-number, .counter-value, .dash-kpi-value');
    statCounters.forEach(counter => {
      const originalText = counter.textContent.trim();
      const match = originalText.match(/\d[\d,]*/);
      if (match) {
        const rawNumStr = match[0].replace(/,/g, '');
        const targetNum = parseInt(rawNumStr, 10);
        if (!isNaN(targetNum)) {
          const prefix = originalText.substring(0, match.index);
          const suffix = originalText.substring(match.index + match[0].length);

          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: targetNum,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: counter,
              start: 'top 88%',
              once: true
            },
            onUpdate: () => {
              counter.textContent = `${prefix}${Math.floor(counterObj.val).toLocaleString()}${suffix}`;
            }
          });
        }
      }
    });

    // 5. Interactive Card Micro-interactions
    const cards = document.querySelectorAll('.service-card, .blog-card, .center-card, .donor-passport-card, .dash-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, duration: 0.25, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    // 6. Primary Buttons Magnetic Scale
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline-white');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power1.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.out' });
      });
    });
  }
});
