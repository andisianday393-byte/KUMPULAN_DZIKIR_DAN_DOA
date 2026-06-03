// global.js
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('themeToggle');
  
  if (!toggleButton) return;

  const htmlElement = document.documentElement;
  const toggleIcon = toggleButton.querySelector('.toggle-icon');
  const toggleText = toggleButton.querySelector('span:last-child');

  // Cek preferensi pengguna yang tersimpan
  const currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);
  updateToggleButton(currentTheme);

  toggleButton.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
  });

  function updateToggleButton(theme) {
    if (theme === 'dark') {
      toggleIcon.textContent = '☀️';
      toggleText.textContent = 'Mode Terang';
    } else {
      toggleIcon.textContent = '🌙';
      toggleText.textContent = 'Mode Gelap';
    }
  }
});