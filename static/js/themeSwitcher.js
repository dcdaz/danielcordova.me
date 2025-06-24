if (!localStorage.theme) {
  localStorage.theme = document.documentElement.getAttribute('data-theme');
} else {
  document.documentElement.setAttribute('data-theme', localStorage.theme);
}

function toggleTheme() {
  document.getElementById('theme-switcher').addEventListener('click', () => {
    if (localStorage.theme === 'light') {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', localStorage.theme);
  });
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  toggleTheme();
} else {
  document.addEventListener("DOMContentLoaded", toggleTheme);
}