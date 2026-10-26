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

  // 5. Booking Modal Logic
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('donorAppointmentForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your donation appointment has been successfully scheduled. A confirmation SMS with donor instructions has been sent to your mobile phone.');
      bookingForm.reset();
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }

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
});
