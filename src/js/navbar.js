// Floating Capsule Pill Navbar with Elastic Fluid Blob Indicator & ScrollSpy
// Includes Mobile-only Smart Hide-on-Scroll-Down Navigation

export function initNavbar() {
  const track = document.getElementById('nav-links-track');
  const blob = document.getElementById('nav-active-blob');
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('section[id], div[id]'));
  const ctaBtn = document.querySelector('.nav-cta-btn');
  const mobileHeader = document.getElementById('mobile-site-header');
  
  if (!track || !blob || links.length === 0) return;

  let activeLink = links[0];
  let isHovering = false;
  let isManualScroll = false;
  let manualScrollTimeout = null;

  // Move blob to target element and ensure text color sync
  function setBlobTarget(targetElement) {
    const el = targetElement || activeLink || links[0];
    if (!el) return;

    // Keep text colors strictly in sync with where the blob is
    links.forEach(l => {
      l.classList.remove('has-blob');
    });
    el.classList.add('has-blob');

    const trackRect = track.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();

    const leftOffset = linkRect.left - trackRect.left;
    const width = linkRect.width;

    blob.style.opacity = '1';
    blob.style.transform = `translate3d(${leftOffset}px, 0, 0)`;
    blob.style.width = `${width}px`;
  }

  function setActiveLink(newActiveLink, updateBlob = true) {
    if (!newActiveLink) return;
    
    links.forEach(l => l.classList.remove('is-active'));
    newActiveLink.classList.add('is-active');
    activeLink = newActiveLink;

    if (updateBlob && !isHovering) {
      setBlobTarget(activeLink);
    }
  }

  // Hover transitions on desktop nav track
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      isHovering = true;
      setBlobTarget(link);
    });

    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          // Lock scrollspy during smooth scroll animation
          isManualScroll = true;
          if (manualScrollTimeout) clearTimeout(manualScrollTimeout);
          manualScrollTimeout = setTimeout(() => {
            isManualScroll = false;
          }, 850);

          setActiveLink(link, true);
          setBlobTarget(link);

          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  track.addEventListener('mouseleave', () => {
    isHovering = false;
    setBlobTarget(activeLink);
  });

  // Initial placement after layout is stable
  setTimeout(() => {
    setActiveLink(activeLink, true);
    setBlobTarget(activeLink);
  }, 100);

  window.addEventListener('resize', () => {
    if (!isHovering && activeLink) {
      setBlobTarget(activeLink);
    }
  });

  // Mapping from all page section IDs to the appropriate nav link selector
  const sectionToLinkMap = {
    'hero': '#hero',
    'highlights': '#highlights',
    'story': '#story',
    'brunch': '#story',
    'menu': '#menu',
    'order': '#menu',
    'specialties': '#menu',
    'about': '#about',
    'reservations': '#about'
  };

  // Real-time ScrollSpy & Mobile Auto-Hide on Scroll Down
  let lastScrollY = window.scrollY;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // --- MOBILE ONLY: Hide on scroll down, show on scroll up ---
    if (window.innerWidth <= 900 && mobileHeader) {
      const drawer = document.getElementById('mobile-menu-drawer');
      const isDrawerOpen = drawer && drawer.classList.contains('is-open');

      if (!isDrawerOpen) {
        if (currentScrollY < 40) {
          // Near the very top: always visible
          mobileHeader.classList.remove('is-hidden');
        } else if (currentScrollY > lastScrollY + 8 && currentScrollY > 70) {
          // Scrolling down: hide mobile nav bar
          mobileHeader.classList.add('is-hidden');
        } else if (currentScrollY < lastScrollY - 6) {
          // Scrolling up: reveal mobile nav bar
          mobileHeader.classList.remove('is-hidden');
        }
      }
    }
    lastScrollY = currentScrollY;

    // --- DESKTOP SCROLLSPY ---
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      if (isHovering || isManualScroll) return;

      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);
      const scrollPosition = window.scrollY + 200;

      let currentSectionId = '';
      for (const section of sections) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
          break;
        }
      }

      // If at bottom or in reservations, keep About active and highlight CTA
      if (isAtBottom || currentSectionId === 'reservations') {
        const aboutLink = links.find(l => l.getAttribute('href') === '#about');
        if (aboutLink && aboutLink !== activeLink) {
          setActiveLink(aboutLink, true);
        } else if (!isHovering) {
          setBlobTarget(aboutLink || activeLink);
        }
        if (ctaBtn) ctaBtn.classList.add('is-active');
        return;
      } else {
        if (ctaBtn) ctaBtn.classList.remove('is-active');
      }

      if (currentSectionId && sectionToLinkMap[currentSectionId]) {
        const targetHref = sectionToLinkMap[currentSectionId];
        const matchingLink = links.find(l => l.getAttribute('href') === targetHref);
        if (matchingLink && matchingLink !== activeLink) {
          setActiveLink(matchingLink, true);
        }
      }
    }, 40);
  }, { passive: true });

  // Mobile Drawer Toggle
  initMobileNav();
}

function initMobileNav() {
  const toggleBtns = document.querySelectorAll('.mobile-toggle-btn, #mobile-toggle-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
  const mobileHeader = document.getElementById('mobile-site-header');

  if (!drawer) return;

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', String(isOpen)));

    // When drawer is opened, ensure mobile header is visible
    if (isOpen && mobileHeader) {
      mobileHeader.classList.remove('is-hidden');
    }
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleDrawer(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target)) {
      let clickedBtn = false;
      toggleBtns.forEach(btn => {
        if (btn.contains(e.target)) clickedBtn = true;
      });
      if (!clickedBtn) {
        toggleDrawer(false);
      }
    }
  });
}
