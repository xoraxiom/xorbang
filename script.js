// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply observer to feature cards and workflow cards
document.querySelectorAll('.feature-card, .workflow-card, .problem-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Copy code functionality
document.querySelectorAll('pre code').forEach(block => {
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.5);
        border-radius: 4px;
        color: #3b82f6;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, background 0.3s;
    `;
    
    // Wrap code block in relative container
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    // Show button on hover
    pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
    });
    
    // Copy functionality
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            button.style.background = 'rgba(16, 185, 129, 0.2)';
            button.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            button.style.color = '#10b981';
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.style.background = 'rgba(59, 130, 246, 0.2)';
                button.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                button.style.color = '#3b82f6';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Add typing effect to hero title (preserving HTML)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    // Store the original HTML
    const originalHTML = heroTitle.innerHTML;
    
    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    // Get text nodes and elements
    const processNode = (node) => {
        const fragments = [];
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                // Split text into words
                const words = child.textContent.split(/(\s+)/);
                words.forEach(word => {
                    if (word.trim()) {
                        fragments.push({ type: 'text', content: word });
                    } else if (word) {
                        fragments.push({ type: 'space', content: word });
                    }
                });
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // Keep HTML elements intact
                fragments.push({ type: 'element', content: child.outerHTML });
            }
        });
        return fragments;
    };
    
    const fragments = processNode(tempDiv);
    heroTitle.innerHTML = '';
    
    // Rebuild with animation
    let delay = 0;
    fragments.forEach(fragment => {
        if (fragment.type === 'text' || fragment.type === 'element') {
            const span = document.createElement('span');
            span.innerHTML = fragment.content;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.animation = `fadeInUp 0.5s ease-out ${delay * 0.1}s forwards`;
            heroTitle.appendChild(span);
            delay++;
        } else if (fragment.type === 'space') {
            heroTitle.appendChild(document.createTextNode(fragment.content));
        }
    });
}

// Mobile menu functionality
const initMobileMenu = () => {
    // Check if menu button already exists
    let menuButton = document.querySelector('.mobile-menu-toggle');
    
    if (!menuButton) {
        // Create the menu button only once
        menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        
        // Add the button to navbar
        const navbar = document.querySelector('.navbar .container');
        if (navbar) {
            navbar.appendChild(menuButton);
        }
        
        // Add click handler
        menuButton.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('mobile-active');
            }
        });
    }
};

// Initialize mobile menu only once on load
window.addEventListener('DOMContentLoaded', initMobileMenu);