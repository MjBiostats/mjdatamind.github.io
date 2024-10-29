// Modern Tab Navigation System
class TabNavigator {
    constructor() {
        this.tabs = document.getElementsByClassName("tab-content");
        this.buttons = document.getElementsByClassName("tab-button");
        this.activeTab = null;
        this.isAnimating = false;
        this.initializeEventListeners();
        this.setupIntersectionObserver();
    }

    initializeEventListeners() {
        // Add click listeners to all tab buttons
        Array.from(this.buttons).forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });

            // Add hover animation
            button.addEventListener('mouseenter', this.handleButtonHover.bind(this));
            button.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleKeyboardNavigation(e.key);
            }
        });
    }

    setupIntersectionObserver() {
        // Create observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe tab contents
        Array.from(this.tabs).forEach(tab => {
            observer.observe(tab);
        });
    }

    async switchTab(tabId) {
        if (this.isAnimating || tabId === this.activeTab) return;
        this.isAnimating = true;

        const targetTab = document.getElementById(tabId);
        const currentTab = this.activeTab ? 
            document.getElementById(this.activeTab) : null;

        // Update button states
        this.updateButtonStates(tabId);

        // Perform smooth transition
        await this.animateTabTransition(currentTab, targetTab);

        this.activeTab = tabId;
        this.isAnimating = false;

        // Dispatch custom event
        this.dispatchTabChangeEvent(tabId);
    }

    updateButtonStates(tabId) {
        Array.from(this.buttons).forEach(button => {
            const isActive = button.getAttribute('data-tab') === tabId;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive);
        });
    }

    async animateTabTransition(currentTab, targetTab) {
        // Define animation properties
        const timing = {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        };

        // Animate out current tab if it exists
        if (currentTab) {
            await currentTab.animate([
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(20px)' }
            ], timing).finished;
            currentTab.style.display = 'none';
        }

        // Animate in new tab
        targetTab.style.display = 'block';
        targetTab.style.opacity = '0';
        await targetTab.animate([
            { opacity: 0, transform: 'translateY(-20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], timing).finished;
        targetTab.style.opacity = '1';
    }

    handleButtonHover(event) {
        const button = event.target;
        if (!button.classList.contains('active')) {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    handleButtonLeave(event) {
        const button = event.target;
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    handleKeyboardNavigation(key) {
        const currentIndex = Array.from(this.buttons).findIndex(
            button => button.classList.contains('active')
        );
        let nextIndex;

        if (key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % this.buttons.length;
        } else {
            nextIndex = (currentIndex - 1 + this.buttons.length) % this.buttons.length;
        }

        const nextTabId = this.buttons[nextIndex].getAttribute('data-tab');
        this.switchTab(nextTabId);
    }

    dispatchTabChangeEvent(tabId) {
        const event = new CustomEvent('tabChanged', {
            detail: { tabId, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
}

// Initialize tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tabNavigator = new TabNavigator();
    tabNavigator.switchTab('home');

    // Optional: Add tab change listener
    document.addEventListener('tabChanged', (e) => {
        console.log(`Tab changed to: ${e.detail.tabId} at ${new Date(e.detail.timestamp).toLocaleTimeString()}`);
    });
});

// Add smooth scroll to tabs if they're below the fold
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabsContainer = document.querySelector('.tabs-container');
        if (tabsContainer) {
            const containerTop = tabsContainer.getBoundingClientRect().top + window.pageYOffset;
            if (containerTop < window.pageYOffset) {
                window.scrollTo({
                    top: containerTop - 100, // Adjust offset as needed
                    behavior: 'smooth'
                });
            }
        }
    });
});
