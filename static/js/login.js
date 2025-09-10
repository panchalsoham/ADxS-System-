document.addEventListener('DOMContentLoaded', () => {
    // Create floating hearts
    createFloatingHearts();

    // Handle form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
});

function createFloatingHearts() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        const randomDelay = Math.random() * 5;
        const randomDuration = 6 + Math.random() * 4;

        heart.style.left = `${randomX}px`;
        heart.style.top = `${randomY}px`;
        heart.style.animationDelay = `${randomDelay}s`;
        heart.style.animationDuration = `${randomDuration}s`;
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const button = e.target.querySelector('.login-btn');
    const buttonText = button.querySelector('span');
    const buttonHeart = button.querySelector('.btn-heart');

    try {
        // Show loading state
        buttonText.textContent = 'Logging in...';
        buttonHeart.style.animation = 'pulse 0.5s infinite';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success state
        buttonText.textContent = 'Welcome!';
        buttonHeart.style.animation = 'bounce 0.5s infinite';
        button.style.backgroundColor = '#4CAF50';

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        // Error state
        buttonText.textContent = 'Error';
        buttonHeart.style.animation = 'none';
        button.style.backgroundColor = '#f44336';

        setTimeout(() => {
            buttonText.textContent = 'Login';
            buttonHeart.style.animation = 'bounce 1s infinite';
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 2000);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    createFloatingHearts();
});

// Add ripple effect to button
document.querySelector('.login-btn').addEventListener('mousedown', function(e) {
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
