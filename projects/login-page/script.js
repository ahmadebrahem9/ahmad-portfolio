const form = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const eyeButton = document.querySelector('.eye-button');
const message = document.querySelector('.form-message');

eyeButton.addEventListener('click', () => {
  const isVisible = password.type === 'text';
  password.type = isVisible ? 'password' : 'text';
  eyeButton.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
  eyeButton.setAttribute('aria-pressed', String(!isVisible));
});

function validate(input) {
  const field = input.closest('.field');
  const valid = input.checkValidity();
  field.classList.toggle('invalid', !valid);
  input.setAttribute('aria-invalid', String(!valid));
  return valid;
}

[email, password].forEach((input) => {
  input.addEventListener('blur', () => validate(input));
  input.addEventListener('input', () => {
    if (input.closest('.field').classList.contains('invalid')) validate(input);
    message.textContent = '';
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const isValid = [email, password].map(validate).every(Boolean);
  if (!isValid) return;
  message.textContent = 'Welcome back — your sign-in details are ready to submit.';
});
