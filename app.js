/**
 * ÉCOLE PRIVÉE FRANCO-ARABE ZAYD IBN THABIT
 * Logique JavaScript & Interactivité
 */

// Tarifs par défaut
const DEFAULT_TARIFS = {
  collegeInternat: { inscription: 100000, mensualite: 135000, tenues: 25000, gouter: 15000 },
  collegeExternat: { inscription: 70000, mensualite: 70000, tenues: 25000, gouter: 0 },
  elementaireInternat: { inscription: 100000, mensualite: 100000, tenues: 35000, gouter: 0 },
  elementaireDemiPension: { inscription: 45000, mensualite: 45000, tenues: 12500, gouter: 0 },
  lyceeInternat: { inscription: 100000, mensualite: 100000, tenues: 25000, gouter: 0 },
  karate: { inscription: 10000, tenue: 7000, mensualite: 5000, combo: 15000 }
};

// Initialisation des données de tarifs depuis le localStorage ou par défaut
let currentTarifs = JSON.parse(localStorage.getItem('zayd_tarifs_2026_v2')) || DEFAULT_TARIFS;

// Numéros de téléphone de l'école
const PHONE_WHATSAPP = '221700038475'; // +221 70 003 84 75
const ALL_PHONES = ['+221 70 003 84 75', '+221 78 138 19 86', '78 597 36 54'];

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  renderTarifs();
  initCalculator();
  initAdmissionsForm();
  initGalleryFilter();
  initCountdown();
  initModals();
});

// 1. Menu Mobile
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// 2. Affichage des Tarifs
function renderTarifs() {
  // Collège Internat
  setElementText('tarif-ci-inscr', formatFCFA(currentTarifs.collegeInternat.inscription));
  setElementText('tarif-ci-mens', formatFCFA(currentTarifs.collegeInternat.mensualite));
  setElementText('tarif-ci-tenue', formatFCFA(currentTarifs.collegeInternat.tenues));
  setElementText('tarif-ci-gouter', formatFCFA(currentTarifs.collegeInternat.gouter));

  // Collège Externat / Demi-pension
  setElementText('tarif-ce-inscr', formatFCFA(currentTarifs.collegeExternat.inscription));
  setElementText('tarif-ce-mens', formatFCFA(currentTarifs.collegeExternat.mensualite));
  setElementText('tarif-ce-tenue', formatFCFA(currentTarifs.collegeExternat.tenues));

  // Élémentaire Internat
  setElementText('tarif-ei-inscr', formatFCFA(currentTarifs.elementaireInternat.inscription));
  setElementText('tarif-ei-mens', formatFCFA(currentTarifs.elementaireInternat.mensualite));
  setElementText('tarif-ei-tenue', formatFCFA(currentTarifs.elementaireInternat.tenues));

  // Élémentaire Demi-Pension
  setElementText('tarif-ed-inscr', formatFCFA(currentTarifs.elementaireDemiPension.inscription));
  setElementText('tarif-ed-mens', formatFCFA(currentTarifs.elementaireDemiPension.mensualite));
  setElementText('tarif-ed-tenue', formatFCFA(currentTarifs.elementaireDemiPension.tenues));

  // Lycée Internat
  setElementText('tarif-li-inscr', formatFCFA(currentTarifs.lyceeInternat.inscription));
  setElementText('tarif-li-mens', formatFCFA(currentTarifs.lyceeInternat.mensualite));
  setElementText('tarif-li-tenue', formatFCFA(currentTarifs.lyceeInternat.tenues));

  // Karaté
  setElementText('tarif-k-inscr', formatFCFA(currentTarifs.karate.inscription));
  setElementText('tarif-k-tenue', formatFCFA(currentTarifs.karate.tenue));
  setElementText('tarif-k-mens', formatFCFA(currentTarifs.karate.mensualite));
  setElementText('tarif-k-combo', formatFCFA(currentTarifs.karate.combo));
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// 3. Simulateur de Frais de Scolarité
function initCalculator() {
  const levelSelect = document.getElementById('calcLevel');
  const regimeSelect = document.getElementById('calcRegime');
  const karateCheckbox = document.getElementById('calcKarate');
  const gouterCheckbox = document.getElementById('calcGouter');
  const gouterWrapper = document.getElementById('calcGouterWrapper');

  if (!levelSelect || !regimeSelect) return;

  function updateRegimeOptions() {
    const level = levelSelect.value;
    regimeSelect.innerHTML = '';

    if (level === 'elementaire') {
      regimeSelect.innerHTML = `
        <option value="internat">Internat Complet</option>
        <option value="demi_pension" selected>Demi-Pension</option>
      `;
      if (gouterWrapper) gouterWrapper.classList.add('hidden');
    } else if (level === 'college') {
      regimeSelect.innerHTML = `
        <option value="internat" selected>Internat (Franco-Arabe / Classique)</option>
        <option value="externat">Externat / Demi-Pension</option>
      `;
      if (gouterWrapper) gouterWrapper.classList.remove('hidden');
    } else if (level === 'lycee') {
      regimeSelect.innerHTML = `
        <option value="internat" selected>Internat</option>
      `;
      if (gouterWrapper) gouterWrapper.classList.add('hidden');
    }
    calculateTotal();
  }

  function calculateTotal() {
    const level = levelSelect.value;
    const regime = regimeSelect.value;
    const hasKarate = karateCheckbox && karateCheckbox.checked;
    const hasGouter = gouterCheckbox && gouterCheckbox.checked && level === 'college' && regime === 'internat';

    let inscr = 0;
    let mens = 0;
    let tenue = 0;

    if (level === 'college') {
      if (regime === 'internat') {
        inscr = currentTarifs.collegeInternat.inscription;
        mens = currentTarifs.collegeInternat.mensualite + (hasGouter ? currentTarifs.collegeInternat.gouter : 0);
        tenue = currentTarifs.collegeInternat.tenues;
      } else {
        inscr = currentTarifs.collegeExternat.inscription;
        mens = currentTarifs.collegeExternat.mensualite;
        tenue = currentTarifs.collegeExternat.tenues;
      }
    } else if (level === 'elementaire') {
      if (regime === 'internat') {
        inscr = currentTarifs.elementaireInternat.inscription;
        mens = currentTarifs.elementaireInternat.mensualite;
        tenue = currentTarifs.elementaireInternat.tenues;
      } else {
        inscr = currentTarifs.elementaireDemiPension.inscription;
        mens = currentTarifs.elementaireDemiPension.mensualite;
        tenue = currentTarifs.elementaireDemiPension.tenues;
      }
    } else if (level === 'lycee') {
      inscr = currentTarifs.lyceeInternat.inscription;
      mens = currentTarifs.lyceeInternat.mensualite;
      tenue = currentTarifs.lyceeInternat.tenues;
    }

    if (hasKarate) {
      inscr += currentTarifs.karate.combo; // inscription + tenue karate
      mens += currentTarifs.karate.mensualite;
    }

    const firstMonthTotal = inscr + tenue + mens;
    const annualTotal = inscr + tenue + (mens * 10); // 10 mois scolaires

    setElementText('calcResultInscr', formatFCFA(inscr));
    setElementText('calcResultTenue', formatFCFA(tenue));
    setElementText('calcResultMens', formatFCFA(mens) + ' / mois');
    setElementText('calcResultFirstMonth', formatFCFA(firstMonthTotal));
    setElementText('calcResultAnnual', formatFCFA(annualTotal));
  }

  levelSelect.addEventListener('change', updateRegimeOptions);
  regimeSelect.addEventListener('change', calculateTotal);
  if (karateCheckbox) karateCheckbox.addEventListener('change', calculateTotal);
  if (gouterCheckbox) gouterCheckbox.addEventListener('change', calculateTotal);

  updateRegimeOptions();
}

// 4. Formulaire d'Admissions avec Redirection WhatsApp & Enregistrement Local
function initAdmissionsForm() {
  const form = document.getElementById('admissionsForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const parentName = document.getElementById('admParentName').value.trim();
    const phone = document.getElementById('admPhone').value.trim();
    const childName = document.getElementById('admChildName').value.trim();
    const childAge = document.getElementById('admChildAge').value.trim();
    const targetClass = document.getElementById('admClass').value;
    const regime = document.getElementById('admRegime').value;
    const comments = document.getElementById('admMessage').value.trim();

    if (!parentName || !phone || !childName || !targetClass || !regime) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // Sauvegarde de la demande en local
    const applicationData = {
      id: 'ADM-' + Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      parentName,
      phone,
      childName,
      childAge,
      targetClass,
      regime,
      comments
    };

    const existingApps = JSON.parse(localStorage.getItem('zayd_admissions') || '[]');
    existingApps.push(applicationData);
    localStorage.setItem('zayd_admissions', JSON.stringify(existingApps));

    // Préparation du message WhatsApp
    const message = `*DEMANDE D'INSCRIPTION 2026-2027* 
*École Privée Franco-Arabe Zayd Ibn Thabit (Malika)*

👤 *Parent :* ${parentName}
📞 *Téléphone :* ${phone}
🧒 *Nom de l'enfant :* ${childName}
🎂 *Âge :* ${childAge || 'Non spécifié'} ans
📚 *Classe souhaitée :* ${targetClass}
🏠 *Régime :* ${regime}
${comments ? `📝 *Remarque :* ${comments}` : ''}

Assalamou alaykoum, je souhaite finaliser l'inscription de mon enfant pour l'année 2026–2027.`;

    const whatsappUrl = `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;

    showToast('Votre demande a été préparée avec succès ! Redirection vers WhatsApp...', 'success');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 1200);
  });
}

// 5. Galerie & Filtres
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
      btn.classList.add('active', 'bg-primary', 'text-white');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 6. Compte à Rebours Inscriptions (5 Août au 10 Octobre 2026)
function initCountdown() {
  const targetDate = new Date('2026-10-10T23:59:59').getTime();
  const countdownEl = document.getElementById('inscriptionsCountdown');
  if (!countdownEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.innerHTML = '<span class="text-amber-300 font-bold">Inscriptions en cours - Clôture imminente</span>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.innerHTML = `
      <div class="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wide">
        <span class="bg-amber-400 text-slate-950 px-2 py-0.5 rounded">${days}j</span>
        <span class="bg-amber-400 text-slate-950 px-2 py-0.5 rounded">${hours}h</span>
        <span class="bg-amber-400 text-slate-950 px-2 py-0.5 rounded">${minutes}m</span>
        <span class="text-amber-200">avant la clôture</span>
      </div>
    `;
  }

  update();
  setInterval(update, 60000);
}

// 7. Modales (Vidéo & Administration des Tarifs & Lightbox)
function initModals() {
  // Modal Vidéo
  const videoModal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('modalVideoPlayer');
  const videoTitle = document.getElementById('modalVideoTitle');
  const closeVideoBtn = document.getElementById('closeVideoModal');

  window.openVideoModal = function(videoSrc, title) {
    if (videoModal && videoPlayer) {
      videoPlayer.src = videoSrc;
      if (videoTitle) videoTitle.textContent = title;
      videoModal.classList.add('active');
      videoPlayer.play();
    }
  };

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
      if (videoModal && videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
        videoModal.classList.remove('active');
      }
    });
  }

  // Modal Image Lightbox
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxModal');

  window.openLightbox = function(src, caption) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    }
  };

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', () => {
      if (lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // Modal Admin Tarifs
  const adminModal = document.getElementById('adminTarifModal');
  const openAdminBtn = document.getElementById('openAdminTarifBtn');
  const closeAdminBtn = document.getElementById('closeAdminTarifBtn');
  const adminForm = document.getElementById('adminTarifForm');

  if (openAdminBtn && adminModal) {
    openAdminBtn.addEventListener('click', () => {
      populateAdminFields();
      adminModal.classList.add('active');
    });
  }

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal.classList.remove('active');
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAdminTarifs();
      adminModal.classList.remove('active');
      renderTarifs();
      initCalculator();
      showToast('Les tarifs ont été mis à jour avec succès !', 'success');
    });
  }

  // Fermeture en cliquant sur l'arrière-plan
  window.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoPlayer.pause();
      videoPlayer.src = '';
      videoModal.classList.remove('active');
    }
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
    if (e.target === adminModal) {
      adminModal.classList.remove('active');
    }
  });
}

function populateAdminFields() {
  document.getElementById('adm_ci_inscr').value = currentTarifs.collegeInternat.inscription;
  document.getElementById('adm_ci_mens').value = currentTarifs.collegeInternat.mensualite;
  document.getElementById('adm_ci_tenue').value = currentTarifs.collegeInternat.tenues;
  document.getElementById('adm_ci_gouter').value = currentTarifs.collegeInternat.gouter;

  document.getElementById('adm_ce_inscr').value = currentTarifs.collegeExternat.inscription;
  document.getElementById('adm_ce_mens').value = currentTarifs.collegeExternat.mensualite;
  document.getElementById('adm_ce_tenue').value = currentTarifs.collegeExternat.tenues;

  document.getElementById('adm_ei_inscr').value = currentTarifs.elementaireInternat.inscription;
  document.getElementById('adm_ei_mens').value = currentTarifs.elementaireInternat.mensualite;
  document.getElementById('adm_ei_tenue').value = currentTarifs.elementaireInternat.tenues;

  document.getElementById('adm_ed_inscr').value = currentTarifs.elementaireDemiPension.inscription;
  document.getElementById('adm_ed_mens').value = currentTarifs.elementaireDemiPension.mensualite;
  document.getElementById('adm_ed_tenue').value = currentTarifs.elementaireDemiPension.tenues;

  document.getElementById('adm_li_inscr').value = currentTarifs.lyceeInternat.inscription;
  document.getElementById('adm_li_mens').value = currentTarifs.lyceeInternat.mensualite;
  document.getElementById('adm_li_tenue').value = currentTarifs.lyceeInternat.tenues;

  document.getElementById('adm_k_inscr').value = currentTarifs.karate.inscription;
  document.getElementById('adm_k_tenue').value = currentTarifs.karate.tenue;
  document.getElementById('adm_k_mens').value = currentTarifs.karate.mensualite;
  document.getElementById('adm_k_combo').value = currentTarifs.karate.combo;
}

function saveAdminTarifs() {
  currentTarifs = {
    collegeInternat: {
      inscription: parseInt(document.getElementById('adm_ci_inscr').value) || 0,
      mensualite: parseInt(document.getElementById('adm_ci_mens').value) || 0,
      tenues: parseInt(document.getElementById('adm_ci_tenue').value) || 0,
      gouter: parseInt(document.getElementById('adm_ci_gouter').value) || 0
    },
    collegeExternat: {
      inscription: parseInt(document.getElementById('adm_ce_inscr').value) || 0,
      mensualite: parseInt(document.getElementById('adm_ce_mens').value) || 0,
      tenues: parseInt(document.getElementById('adm_ce_tenue').value) || 0,
      gouter: 0
    },
    elementaireInternat: {
      inscription: parseInt(document.getElementById('adm_ei_inscr').value) || 0,
      mensualite: parseInt(document.getElementById('adm_ei_mens').value) || 0,
      tenues: parseInt(document.getElementById('adm_ei_tenue').value) || 0,
      gouter: 0
    },
    elementaireDemiPension: {
      inscription: parseInt(document.getElementById('adm_ed_inscr').value) || 0,
      mensualite: parseInt(document.getElementById('adm_ed_mens').value) || 0,
      tenues: parseInt(document.getElementById('adm_ed_tenue').value) || 0,
      gouter: 0
    },
    lyceeInternat: {
      inscription: parseInt(document.getElementById('adm_li_inscr').value) || 0,
      mensualite: parseInt(document.getElementById('adm_li_mens').value) || 0,
      tenues: parseInt(document.getElementById('adm_li_tenue').value) || 0,
      gouter: 0
    },
    karate: {
      inscription: parseInt(document.getElementById('adm_k_inscr').value) || 0,
      tenue: parseInt(document.getElementById('adm_k_tenue').value) || 0,
      mensualite: parseInt(document.getElementById('adm_k_mens').value) || 0,
      combo: parseInt(document.getElementById('adm_k_combo').value) || 0
    }
  };

  localStorage.setItem('zayd_tarifs_2026_v2', JSON.stringify(currentTarifs));
}

// 8. Notification Toast
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  
  if (type === 'success') {
    toast.style.borderLeftColor = '#10B981';
    if (toastIcon) toastIcon.className = 'fas fa-check-circle text-emerald-400 text-xl';
  } else if (type === 'error') {
    toast.style.borderLeftColor = '#EF4444';
    if (toastIcon) toastIcon.className = 'fas fa-exclamation-circle text-red-400 text-xl';
  } else {
    toast.style.borderLeftColor = '#D4AF37';
    if (toastIcon) toastIcon.className = 'fas fa-info-circle text-amber-400 text-xl';
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 400);
  }, 3500);
}

// 9. Export pour réinitialiser les tarifs si besoin
window.resetTarifsToDefault = function() {
  if (confirm('Voulez-vous restaurer les tarifs initiaux officiels ?')) {
    localStorage.removeItem('zayd_tarifs_2026');
    currentTarifs = DEFAULT_TARIFS;
    renderTarifs();
    initCalculator();
    populateAdminFields();
    showToast('Tarifs réinitialisés aux valeurs officielles.', 'info');
  }
};
