document.querySelector('.hero-button')?.addEventListener('click', event => {
  const target = document.querySelector(event.currentTarget.getAttribute('href'));
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
});
