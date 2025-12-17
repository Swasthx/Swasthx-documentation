// Swasthx Documentation Navigation Enhancement
document.addEventListener('DOMContentLoaded', function () {

    // Add active page highlighting
    highlightActivePage();

    // Add smooth scrolling to anchor links
    addSmoothScrolling();

    // Add sidebar scroll restoration
    restoreSidebarScroll();

    // Add keyboard navigation support
    addKeyboardNavigation();

    // Add search functionality
    addSearchFunctionality();

    // Add mobile navigation behavior
    addMobileNavBehavior();
});

// Auto-close sidebar on mobile when link is clicked
function addMobileNavBehavior() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-nav-toggle');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-nav-open');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

// Highlight the current page in the sidebar
function highlightActivePage() {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');

    sidebarLinks.forEach(link => {
        let linkPath = link.getAttribute('href');

        // Skip empty links or hash links
        if (!linkPath || linkPath === '#' || linkPath.endsWith('/#')) {
            return;
        }

        // Normalize link path
        linkPath = linkPath.replace(/\/$/, '');

        // Check for exact match
        if (currentPath === linkPath) {
            link.classList.add('active');
            link.closest('li').classList.add('active');

            // Should also expand parent section if we had collapsible sections
        }
    });
}

// Add smooth scrolling to anchor links
function addSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Restore sidebar scroll position
function restoreSidebarScroll() {
    const sidebar = document.querySelector('.sidebar');
    const scrollKey = 'sidebar-scroll-position';

    // Save scroll position before page unload
    window.addEventListener('beforeunload', function () {
        if (sidebar) {
            localStorage.setItem(scrollKey, sidebar.scrollTop);
        }
    });

    // Restore scroll position on page load
    if (sidebar) {
        const savedPosition = localStorage.getItem(scrollKey);
        if (savedPosition) {
            sidebar.scrollTop = parseInt(savedPosition);
        }
    }
}

// Add keyboard navigation support
function addKeyboardNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');

    sidebarLinks.forEach((link, index) => {
        link.setAttribute('tabindex', '0');

        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextLink = sidebarLinks[index + 1];
                if (nextLink) nextLink.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevLink = sidebarLinks[index - 1];
                if (prevLink) prevLink.focus();
            }
        });
    });
}

// Add search functionality
function addSearchFunctionality() {
    // Create search input if it doesn't exist
    if (!document.querySelector('.sidebar-search')) {
        const sidebar = document.querySelector('.sidebar nav');
        const searchHTML = `
            <div class="sidebar-search">
                <input type="text" placeholder="Search documentation..." id="doc-search">
                <i class="fas fa-search search-icon"></i>
            </div>
        `;
        sidebar.insertAdjacentHTML('beforebegin', searchHTML);

        const searchInput = document.getElementById('doc-search');
        searchInput.addEventListener('input', filterSidebarLinks);
    }
}

// Filter sidebar links based on search input
function filterSidebarLinks() {
    const searchTerm = this.value.toLowerCase();
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    const sections = document.querySelectorAll('.sidebar .section');

    sidebarLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        const linkItem = link.closest('li');

        if (linkText.includes(searchTerm)) {
            linkItem.style.display = 'block';
            linkItem.style.opacity = '1';
        } else {
            linkItem.style.display = 'none';
            linkItem.style.opacity = '0.3';
        }
    });

    // Show/hide sections based on visible links
    sections.forEach(section => {
        const sectionLinks = section.nextElementSibling;
        let hasVisibleLinks = false;

        while (sectionLinks && !sectionLinks.classList.contains('section')) {
            if (sectionLinks.style.display !== 'none') {
                hasVisibleLinks = true;
                break;
            }
            sectionLinks = sectionLinks.nextElementSibling;
        }

        section.style.display = hasVisibleLinks ? 'flex' : 'none';
    });
}

// Add CSS for search functionality
const searchStyles = `
<style>
.sidebar-search {
    position: relative;
    margin-bottom: 1rem;
    padding: 0 1rem;
}

.sidebar-search input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    font-size: 0.9rem;
    background: white;
    transition: all 0.2s ease;
}

.sidebar-search input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--light-text);
    pointer-events: none;
}

.sidebar nav a.active {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
}

.sidebar nav a.active:hover {
    background-color: var(--secondary-color);
    transform: none;
}

.sidebar nav li.active {
    background-color: rgba(37, 99, 235, 0.1);
    border-radius: 0.5rem;
}

/* Responsive search */
@media (max-width: 768px) {
    .sidebar-search {
        padding: 0 0.5rem;
    }
}
</style>
`;

// Inject search styles
document.head.insertAdjacentHTML('beforeend', searchStyles);

// Add utility functions for documentation
window.SwasthxDocs = {
    // Scroll to section
    scrollToSection: function (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // Copy code blocks
    copyCodeBlock: function (codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const message = document.createElement('div');
            message.textContent = 'Code copied to clipboard!';
            message.className = 'copy-success';
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 3000);
        });
    },

    // Toggle sidebar on mobile
    toggleSidebar: function () {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-open');
    }
};

// Add copy button to code blocks
document.addEventListener('DOMContentLoaded', function () {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.className = 'copy-code-btn';
        copyButton.title = 'Copy code';
        copyButton.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            font-size: 0.8rem;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        copyButton.addEventListener('click', function () {
            SwasthxDocs.copyCodeBlock(codeBlock);
        });

        const preElement = codeBlock.closest('pre');
        if (preElement) {
            preElement.style.position = 'relative';
            preElement.appendChild(copyButton);

            preElement.addEventListener('mouseenter', function () {
                copyButton.style.opacity = '1';
            });

            preElement.addEventListener('mouseleave', function () {
                copyButton.style.opacity = '0';
            });
        }
    });
});

// Add animation keyframes
