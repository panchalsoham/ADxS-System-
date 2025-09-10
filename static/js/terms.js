document.addEventListener('DOMContentLoaded', () => {
    const acceptCheckbox = document.getElementById('acceptTerms');
    const continueBtn = document.getElementById('continueBtn');

    // Handle checkbox change
    acceptCheckbox.addEventListener('change', (e) => {
        continueBtn.disabled = !e.target.checked;
    });

    // Handle continue button click
    continueBtn.addEventListener('click', () => {
        // Add smooth transition effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        // Store acceptance in localStorage
        localStorage.setItem('termsAccepted', 'true');
        localStorage.setItem('termsAcceptedDate', new Date().toISOString());

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    });

    // Smooth scroll for section links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll highlight effect
    const sections = document.querySelectorAll('.terms-section');
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

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease';
        observer.observe(section);
    });
    
});

