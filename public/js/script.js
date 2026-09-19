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

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement; // Targets the <html> tag

// 1. Check if the user previously chose a theme (stored in the browser)
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-bs-theme', currentTheme);
updateIcon(currentTheme);

// 2. Listen for clicks on the toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Check current theme and swap it
        const currentAttr = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentAttr === 'light' ? 'dark' : 'light';
        
        // Apply the new theme to the HTML tag
        htmlElement.setAttribute('data-bs-theme', newTheme);
        
        // Save the choice so it doesn't reset when they change pages
        localStorage.setItem('theme', newTheme);
        
        // Update the sun/moon icon
        updateIcon(newTheme);
    });
}

// Helper function to swap the FontAwesome icon
function updateIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun', 'text-warning'); // Sun icon with yellow color
    } else {
        themeIcon.classList.remove('fa-sun', 'text-warning');
        themeIcon.classList.add('fa-moon'); // Moon icon
    }
}



// JavaScript for Tax Switch Toggle.
let taxSwitchToggle = document.getElementById("flexSwitchCheckDefault");
let texSwitchToggle = () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
        if (taxSwitchToggle.checked) info.style.display = "inline";
        else info.style.display = "none";
    }
};

