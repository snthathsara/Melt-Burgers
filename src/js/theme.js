const THEME_STORAGE_KEY = 'melt-theme-preference';

export function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Strictly default to light mode unless the user explicitly toggled it
  let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  
  applyTheme(currentTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      currentTheme = nextTheme;
      
      // Animate icon with a quick spring flip on all visible icons
      const iconContainers = document.querySelectorAll('.theme-icon-container, #theme-icon');
      iconContainers.forEach(iconContainer => {
        iconContainer.classList.remove('theme-icon-animate');
        void iconContainer.offsetWidth; // Force reflow
        iconContainer.classList.add('theme-icon-animate');
      });

      applyTheme(nextTheme);
    });
  });
}

export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const iconContainers = document.querySelectorAll('.theme-icon-container, #theme-icon');
  iconContainers.forEach(iconContainer => {
    if (theme === 'dark') {
      // Show Moon icon when in Dark Mode
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      `;
    } else {
      // Show Sun icon when in Light Mode
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      `;
    }
  });
}
