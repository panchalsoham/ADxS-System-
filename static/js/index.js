document.addEventListener('DOMContentLoaded', () => {
    // Create floating hearts
    createFloatingHearts();

    // Navbar scroll effect
    handleNavbarScroll();

    // Initialize diagnosis cards
    initializeDiagnosisCards();

    // Add smooth scroll
    initializeSmoothScroll();
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

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });
}

function initializeDiagnosisCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.pulse-ring').style.animation = 'none';
            setTimeout(() => {
                card.querySelector('.pulse-ring').style.animation = 'pulseRing 2s infinite';
            }, 10);
        });

        const button = card.querySelector('.diagnose-btn');
        button.addEventListener('click', () => {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            button.disabled = true;

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    createFloatingHearts();
});

// Add intersection observer for animations
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

document.querySelectorAll('.feature, .card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.5s ease';
    observer.observe(element);
});
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const chatContainer = document.getElementById('chatContainer');
    const chatTrigger = document.querySelector('.chat-trigger');
    const closeChat = document.querySelector('.close-chat');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Toggle chat visibility
    window.toggleChat = function() {
        if (!chatContainer) return;
        chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-time">${time}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        userInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const response = "I understand your concern. How can I assist you further?";
            addMessage(response, false);
        }, 1000);
    }

    // Event listeners
    chatTrigger?.addEventListener('click', toggleChat);
    closeChat?.addEventListener('click', toggleChat);
    sendButton?.addEventListener('click', handleUserInput);
    userInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });
});