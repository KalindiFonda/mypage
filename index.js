// Animation configuration for each section
const SECTION_CONFIG = {
    left: {
        container: '#left_container',
        showAnimation: 'slideInLeft',
        hideAnimation: 'slideOutLeft',
        anchor: '#offers'
    },
    right: {
        container: '#right_container',
        showAnimation: 'slideInRight',
        hideAnimation: 'slideOutRight',
        anchor: '#asks'
    },
    bottom: {
        container: '#bottom_container',
        showAnimation: 'slideInUp',
        hideAnimation: 'slideOutDown',
        anchor: '#about'
    },
    top: {
        container: '#top_container',
        showAnimation: 'slideInDown',
        hideAnimation: 'slideOutUp',
        anchor: '#contact'
    }
};

const ANIMATION_DURATION = 800;

// Update active navigation states
function updateNavActiveStates(activeSectionName) {
    // Update all section navbars
    document.querySelectorAll('.section-navbar .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === activeSectionName) {
            link.classList.add('active');
        }
    });
}

// Generic function to show any section
function showSection(sectionName) {
    const config = SECTION_CONFIG[sectionName];
    if (!config) return;

    const container = document.querySelector(config.container);
    if (!container) return;

    // Update active navigation states
    updateNavActiveStates(sectionName);

    // Update URL with anchor
    if (config.anchor) {
        history.pushState(null, null, config.anchor);
    }

    // Show container
    container.style.display = "block";

    // Add animation classes
    container.classList.add("animated", config.showAnimation);

    // Remove animation classes when animation ends
    const handleAnimationEnd = () => {
        container.classList.remove("animated", config.showAnimation);
        container.removeEventListener('animationend', handleAnimationEnd);
    };

    container.addEventListener('animationend', handleAnimationEnd);
}

// Generic function to close any section
function closeSection(sectionName) {
    const config = SECTION_CONFIG[sectionName];
    if (!config) return;

    const container = document.querySelector(config.container);
    if (!container) return;

    // Add animation classes
    container.classList.add("animated", config.hideAnimation);

    // Hide container and remove animation classes when animation ends
    const handleAnimationEnd = () => {
        container.classList.remove("animated", config.hideAnimation);
        container.style.display = "none";
        container.removeEventListener('animationend', handleAnimationEnd);
    };

    container.addEventListener('animationend', handleAnimationEnd);
}

// Event delegation for data attributes
document.addEventListener('click', (event) => {
    // Handle navigation button clicks (show sections)
    const clickedElement = event.target.closest('[data-section]');
    const sectionName = clickedElement ? clickedElement.dataset.section : null;

    if (sectionName) {
        event.preventDefault();

        if (sectionName === 'home') {
            // Handle home - hide all sections and update URL
            hideAllSections();
            updateNavActiveStates('home');
            history.pushState(null, null, '/');
        } else {
            // Close all other sections first, then show the new one
            hideAllSections();
            showSection(sectionName);
        }
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

// Handle URL anchors - find section by anchor
function getSectionByAnchor(anchor) {
    for (const [sectionName, config] of Object.entries(SECTION_CONFIG)) {
        if (config.anchor === anchor) {
            return sectionName;
        }
    }
    return null;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Reset all containers on page load
    Object.keys(SECTION_CONFIG).forEach(sectionName => {
        const config = SECTION_CONFIG[sectionName];
        const container = document.querySelector(config.container);

        if (container) {
            container.style.display = 'none';
            container.classList.remove('animated', config.showAnimation, config.hideAnimation);
        }
    });

    // Check if there's an anchor in the URL and open the corresponding section
    const currentHash = window.location.hash;
    if (currentHash) {
        const sectionName = getSectionByAnchor(currentHash);
        if (sectionName) {
            // Small delay to ensure DOM is fully ready
            setTimeout(() => {
                showSection(sectionName);
            }, 100);
        }
    }
});

// Handle browser back/forward navigation and hash changes
window.addEventListener('hashchange', function () {
    const currentHash = window.location.hash;
    if (currentHash) {
        const sectionName = getSectionByAnchor(currentHash);
        if (sectionName) {
            hideAllSections();
            showSection(sectionName);
        }
    } else {
        // No hash means home
        hideAllSections();
        updateNavActiveStates('home');
    }
});

// Function to hide all sections (for home)
function hideAllSections() {
    Object.keys(SECTION_CONFIG).forEach(sectionName => {
        const config = SECTION_CONFIG[sectionName];
        const container = document.querySelector(config.container);
        if (container && container.style.display !== 'none') {
            closeSection(sectionName);
        }
    });
}


// Optimized loading sequence without jQuery
setTimeout(function () {
    const loading = document.getElementById("loading");
    const box = document.getElementById("box");
    const left = document.getElementById("left");
    const bottom = document.getElementById("bottom");
    const right = document.getElementById("right");
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
            [left, bottom, right, top].forEach(element => {
                if (element) {
                    element.classList.remove("animated", "fadeIn");
                }
            });

            loading.removeEventListener('animationend', handleLoadingEnd);
        };

        loading.addEventListener('animationend', handleLoadingEnd);
    }
}, 1500);
