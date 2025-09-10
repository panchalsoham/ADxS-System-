document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const statusMessage = document.getElementById('statusMessage');

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Show loading state
            showStatus('Sending reset link...', 'info');
            
            const response = await fetch('http://127.0.0.1:5500/Template/forgot%20password.html?email=admin%40gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showStatus('Password reset link sent! Please check your email.', 'success');
                resetForm.reset();
            } else {
                showStatus(data.message || 'Failed to send reset link', 'error');
            }
        } catch (error) {
            showStatus('Connection error. Please try again.', 'error');
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
});