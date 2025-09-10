document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });

  // Navbar scroll effect
  let navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
      }
  });

  // Animate service cards on scroll
  const serviceCards = document.querySelectorAll('.service-card');
  const observerOptions = {
      threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
          }
      });
  }, observerOptions);

  serviceCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = 'all 0.5s ease-out';
      observer.observe(card);
  });

  // Contact form handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          // Add your form submission logic here
          alert('Message sent successfully!');
          contactForm.reset();
      });
  }

  // Animate medical symbols
  const symbols = document.querySelectorAll('.symbol');
  symbols.forEach((symbol, index) => {
      symbol.style.animationDelay = `${index * 0.5}s`;
  });
});