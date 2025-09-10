document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = e.target.querySelector('.login-btn');
        const buttonText = button.querySelector('span');
        const buttonHeart = button.querySelector('.btn-heart');

        try {
            // Show loading state
            buttonText.textContent = 'Creating Account...';
            buttonHeart.style.animation = 'pulse 0.5s infinite';
            button.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success state
            buttonText.textContent = 'Account Created!';
            buttonHeart.style.animation = 'bounce 0.5s infinite';
            button.style.backgroundColor = '#4CAF50';

            // Redirect to login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            // Error state
            buttonText.textContent = 'Error';
            buttonHeart.style.animation = 'none';
            button.style.backgroundColor = '#f44336';

            setTimeout(() => {
                buttonText.textContent = 'Sign Up';
                buttonHeart.style.animation = 'bounce 1s infinite';
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 2000);
        }
    });
});