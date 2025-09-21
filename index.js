// Animation configuration for each section
const SECTION_CONFIG = {
    left: {
        container: '#about_container',
        showAnimation: 'slideInLeft',
        hideAnimation: 'slideOutLeft'
    },
    right: {
        container: '#work_container',
        showAnimation: 'slideInRight',
        hideAnimation: 'slideOutRight'
    },
    bottom: {
        container: '#contact_container',
        showAnimation: 'slideInUp',
        hideAnimation: 'slideOutDown'
    },
    top: {
        container: '#top_container',
        showAnimation: 'slideInDown',
        hideAnimation: 'slideOutUp'
    }
};

const ANIMATION_DURATION = 800;

// Animation state management to prevent conflicts
const animationState = {
    activeAnimations: new Set(),

    isAnimating(sectionName) {
        return this.activeAnimations.has(sectionName);
    },

    startAnimation(sectionName) {
        this.activeAnimations.add(sectionName);
    },

    endAnimation(sectionName) {
        this.activeAnimations.delete(sectionName);
    }
};

// Generic function to show any section
function showSection(sectionName) {
    const config = SECTION_CONFIG[sectionName];
    if (!config) {
        console.error(`Section "${sectionName}" not found in configuration`);
        return;
    }

    // Prevent multiple animations on same section
    if (animationState.isAnimating(sectionName)) {
        return;
    }

    const container = document.querySelector(config.container);
    if (!container) {
        console.error(`Container "${config.container}" not found in DOM`);
        return;
    }

    // Mark as animating
    animationState.startAnimation(sectionName);

    // Show container
    container.style.display = "inherit";

    // Add animation classes
    container.classList.add("animated", config.showAnimation);

    // Remove animation classes when animation ends (no jerk!)
    const handleAnimationEnd = () => {
        container.classList.remove("animated", config.showAnimation);
        container.removeEventListener('animationend', handleAnimationEnd);
        animationState.endAnimation(sectionName);
    };

    container.addEventListener('animationend', handleAnimationEnd);
}

// Generic function to close any section
function closeSection(sectionName) {
    const config = SECTION_CONFIG[sectionName];
    if (!config) {
        console.error(`Section "${sectionName}" not found in configuration`);
        return;
    }

    // Prevent multiple animations on same section
    if (animationState.isAnimating(sectionName)) {
        return;
    }

    const container = document.querySelector(config.container);
    if (!container) {
        console.error(`Container "${config.container}" not found in DOM`);
        return;
    }

    // Mark as animating
    animationState.startAnimation(sectionName);

    // Add animation classes
    container.classList.add("animated", config.hideAnimation);

    // Hide container and remove animation classes when animation ends
    const handleAnimationEnd = () => {
        container.classList.remove("animated", config.hideAnimation);
        container.style.display = "none";
        container.removeEventListener('animationend', handleAnimationEnd);
        animationState.endAnimation(sectionName);
    };

    container.addEventListener('animationend', handleAnimationEnd);
}

// Event delegation for data attributes
document.addEventListener('click', (event) => {
    // Handle navigation button clicks (show sections)
    const sectionName = event.target.dataset.section;
    if (sectionName) {
        event.preventDefault();
        showSection(sectionName);
        return;
    }

    // Handle close button clicks
    const closeSectionName = event.target.closest('[data-close]')?.dataset.close;
    if (closeSectionName) {
        event.preventDefault();
        closeSection(closeSectionName);
        return;
    }
});


// Optimized loading sequence without jQuery
setTimeout(function () {
    const loading = document.getElementById("loading");
    const box = document.getElementById("box");
    const about = document.getElementById("about");
    const contact = document.getElementById("contact");
    const work = document.getElementById("work");
    const top = document.getElementById("top");

    if (loading) {
        loading.classList.add("animated", "fadeOut");

        // Use animation event instead of setTimeout for smoother transition
        const handleLoadingEnd = () => {
            loading.classList.remove("animated", "fadeOut");
            loading.style.display = "none";

            // Hide box
            if (box) box.style.display = "none";

            // Clean up navigation button animations
            [about, contact, work, top].forEach(element => {
                if (element) {
                    element.classList.remove("animated", "fadeIn");
                }
            });

            loading.removeEventListener('animationend', handleLoadingEnd);
        };

        loading.addEventListener('animationend', handleLoadingEnd);
    }
}, 1500);
