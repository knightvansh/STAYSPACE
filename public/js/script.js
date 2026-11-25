// Example starter JavaScript for disabling form submissions if there are invalid fields
// Function for form validation.
(() => {
  'use strict'
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')
  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

const themeToggle = document.getElementById('darkModeToggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement; // Targets the <html> tag

const currentTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
htmlElement.setAttribute('data-bs-theme', currentTheme);
updateIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
}

function updateIcon(theme) {
    if (!themeIcon || !themeToggle) return;

    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('aria-pressed', 'false');
    }
}

