// main.js
// Mobile Menu Functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const closeMenu = document.getElementById('closeMenu');

function openMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenuFn() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && mobileMenu && mobileOverlay && closeMenu) {
    hamburger.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuFn);
    mobileOverlay.addEventListener('click', closeMenuFn);
}

// Toggle Submenu for Mobile
function toggleSubmenu(header) {
    const submenu = header.nextElementSibling;
    const icon = header.querySelector('.material-icons');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    if (submenu) {
        submenu.classList.toggle('active');
        header.setAttribute('aria-expanded', !isExpanded);
        if (icon) {
            icon.style.transform = submenu.classList.contains('active') ? 'rotate(180deg)' : '';
        }
    }
}

// Make toggleSubmenu globally available
window.toggleSubmenu = toggleSubmenu;

// Size Selection
document.querySelectorAll('.size-options').forEach(group => {
    const buttons = group.querySelectorAll('.size-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                buttons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            }
        });
    });
});

// Quantity Controls
document.querySelectorAll('.quantity-selector').forEach(selector => {
    const minusBtn = selector.querySelector('.qty-btn:first-child');
    const plusBtn = selector.querySelector('.qty-btn:last-child');
    const input = selector.querySelector('.qty-input');
    
    if (minusBtn && plusBtn && input) {
        minusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
        });
        
        // Ensure input value is valid
        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 1) {
                input.value = 1;
            }
        });
    }
});

// Add to Cart with Notification
function addToCart(productName) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease-out;
        font-family: 'Roboto', sans-serif;
    `;
    notification.innerHTML = `
        <span class="material-icons">check_circle</span>
        ${productName} añadido al carrito
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Update cart count
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = parseInt(cartBadge.textContent) + 1;
    }
}

// Make addToCart globally available
window.addToCart = addToCart;

// Add Review Functionality
document.querySelectorAll('.add-review').forEach(button => {
    button.addEventListener('click', () => {
        const reviewText = prompt('Escribe tu opinión sobre este producto:');
        if (reviewText && reviewText.trim()) {
            const reviewItem = button.previousElementSibling;
            const newReview = document.createElement('div');
            newReview.className = 'review-item';
            newReview.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">Tú</span>
                    <span class="stars" style="font-size: 0.7rem;">★★★★★</span>
                </div>
                <p class="review-text">${reviewText.substring(0, 100)}</p>
            `;
            if (reviewItem) {
                reviewItem.insertAdjacentElement('afterend', newReview);
            } else {
                button.parentElement.insertBefore(newReview, button);
            }
            alert('¡Gracias por tu opinión!');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Search functionality
const searchBar = document.querySelector('.search-bar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const productTitle = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const productCategory = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
            
            if (productTitle.includes(searchTerm) || productCategory.includes(searchTerm)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Add to Wishlist functionality
document.querySelectorAll('.action-icon .material-icons').forEach(icon => {
    if (icon.textContent === 'favorite_border') {
        icon.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            const isFavorite = icon.textContent === 'favorite';
            icon.textContent = isFavorite ? 'favorite_border' : 'favorite';
            icon.style.color = isFavorite ? '' : 'var(--accent)';
            
            const productCard = icon.closest('.product-card');
            const productName = productCard?.querySelector('.product-title')?.textContent || 'Producto';
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--accent);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideIn 0.3s ease-out;
            `;
            notification.innerHTML = `
                <span class="material-icons">${isFavorite ? 'favorite_border' : 'favorite'}</span>
                ${productName} ${isFavorite ? 'eliminado de' : 'añadido a'} favoritos
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    }
});

// View product quick view
document.querySelectorAll('.action-icon .material-icons').forEach(icon => {
    if (icon.textContent === 'visibility') {
        icon.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = icon.closest('.product-card');
            const productName = productCard?.querySelector('.product-title')?.textContent || 'Producto';
            alert(`Vista rápida: ${productName}\n\nEsta función mostrará los detalles completos del producto.`);
        });
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMenuFn();
    }
});

// Add animations styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Lazy loading images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('.product-image[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// Cart persistence (localStorage)
function saveCart() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        localStorage.setItem('cartCount', cartBadge.textContent);
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('cartCount');
    if (savedCart) {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = savedCart;
        }
    }
}

loadCart();

// Save cart when adding products
const originalAddToCart = window.addToCart;
window.addToCart = function(productName) {
    originalAddToCart(productName);
    saveCart();
};