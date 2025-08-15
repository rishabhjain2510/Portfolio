// Loading Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const counter = document.getElementById('counter');
    const blinkingSquare = document.getElementById('blinkingSquare');
    
    let currentCount = 0;
    const targetCount = 100;
    const increment = 1;
    const baseDelay = 45; // Faster counting
    
    // Function to calculate dynamic delay for smooth animation
    function getDelay(progress) {
        if (progress < 10 || progress > 90) {
            return baseDelay * 1.5; // Slower at start and end
        } else if (progress > 30 && progress < 70) {
            return baseDelay * 0.4; // Faster in middle
        } else {
            return baseDelay; // Normal speed
        }
    }
    
    // Counter animation function
    function animateCounter() {
        if (currentCount <= targetCount) {
            // Update counter display
            counter.textContent = currentCount;
            
            // Add subtle scale effect at milestones
            if (currentCount === 25 || currentCount === 50 || currentCount === 75) {
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Continue animation
            if (currentCount < targetCount) {
                currentCount += increment;
                const delay = getDelay(currentCount);
                setTimeout(animateCounter, delay);
            } else {
                // Loading complete - stop blinking and transition to main page
                blinkingSquare.style.animation = 'none';
                blinkingSquare.style.opacity = '1';
                setTimeout(transitionToMainPage, 1000);
            }
        }
    }
    
    // Function to transition to main page
    function transitionToMainPage() {
        const loadingContainer = document.querySelector('.loading-container');
        
        // Create black overlay to prevent white flash
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
        `;
        document.body.appendChild(overlay);
        
        // Start fade out
        loadingContainer.classList.add('fade-out');
        
        // Show black overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        // Navigate to main page
        setTimeout(() => {
            window.location.href = '/home';
        }, 1200);
    }
    
    // Start the loading animation after a brief delay
    setTimeout(animateCounter, 1000);
    
    // Add smooth transition to counter
    counter.style.transition = 'transform 0.3s ease';
});
