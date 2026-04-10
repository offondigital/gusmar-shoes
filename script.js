// Performance optimizations
const products = {
    masculino: [
        { id: 1, name: "Zapatillas Running Pro Max", category: "Masculino", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 2, name: "Zapatillas Training Ultra", category: "Masculino", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 3, name: "Zapatillas Casual Street", category: "Masculino", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format&q=75", isOffer: true },
        { id: 4, name: "Zapatillas Baloncesto Air", category: "Masculino", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false }
    ],
    femenino: [
        { id: 5, name: "Zapatillas Running Pro Mujer", category: "Femenino", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 6, name: "Zapatillas Chunky Platform", category: "Femenino", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 7, name: "Bailarinas Plegables Soft", category: "Femenino", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop&auto=format&q=75", isOffer: true },
        { id: 8, name: "Botines Chelsea Piel", category: "Femenino", image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false }
    ],
    infantil: [
        { id: 9, name: "Zapatillas LED Intermitentes", category: "Infantil", image: "https://images.unsplash.com/photo-1514989940723-e81e61645e1a?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 10, name: "Zapatillas Colegio Resistentes", category: "Infantil", image: "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false },
        { id: 11, name: "Zapatillas Superhéroes Velcro", category: "Infantil", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&auto=format&q=75", isOffer: true },
        { id: 12, name: "Botas de Agua Impermeables", category: "Infantil", image: "https://images.unsplash.com/photo-1514989940723-e81e61645e1a?w=400&h=400&fit=crop&auto=format&q=75", isOffer: false }
    ]
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const WHATSAPP_NUMBER = "5493757326174";
const POPUP_DELAY_SECONDS = 15;
const COUNTDOWN_SECONDS = 300;

let countdownInterval = null;
let isPopupVisible = false;

// Helper Functions
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = cart.length;
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) badge.textContent = wishlist.length;
}

function generateWhatsAppMessage(items, type = 'stock') {
    if (type === 'stock') {
        const productList = items.map(item => `- ${item.name}`).join('%0A');
        return `Hola vendedor, coloqué estos items en la cesta:%0A${productList}%0A%0A¿Podría confirmar si tienen stock disponible? También me gustaría saber el valor total y el costo de envío hasta mi dirección. ¡Gracias!`;
    } else {
        return `¡Hola! Me interesa este producto: ${items.name}. ¿Podría darme más información? ¡Gracias!`;
    }
}

function sendWhatsApp(message) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function addToCart(product) {
    if (!cart.find(item => item.id === product.id)) {
        cart.push({ ...product, quantity: 1 });
        saveCart();
        showNotification(`${product.name} añadido a la cesta`);
        renderCartSidebar();
    } else {
        showNotification(`${product.name} ya está en la cesta`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartSidebar();
}

function addToWishlist(product) {
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push({ ...product, quantity: 1 });
        saveWishlist();
        showNotification(`${product.name} añadido a favoritos`);
        renderWishlistSidebar();
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    renderWishlistSidebar();
}

function updateWishlistQuantity(productId, change) {
    const item = wishlist.find(i => i.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveWishlist();
        renderWishlistSidebar();
    }
}

function sendWishlistToCart(productId) {
    const item = wishlist.find(i => i.id === productId);
    if (item) {
        if (!cart.find(c => c.id === item.id)) {
            cart.push({ ...item });
            saveCart();
            showNotification(`${item.name} enviado a la cesta`);
            renderCartSidebar();
        }
        removeFromWishlist(productId);
    }
}

function shareProduct(product) {
    const text = `¡Mira este producto increíble! ${product.name} - Gusmar Shoes`;
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: product.name, text: text, url: url });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        showNotification('Enlace copiado al portapapeles');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="material-icons">check_circle</span>${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: var(--primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: var(--shadow-lg);
        font-weight: 600;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render Products with lazy loading
function renderProducts() {
    for (const [category, items] of Object.entries(products)) {
        const container = document.getElementById(`${category}Grid`);
        if (container) {
            container.innerHTML = items.map(product => `
                <article class="product-card">
                    <div class="product-image-container">
                        <img data-src="${product.image}" 
                             alt="${product.name}" 
                             class="product-image lazy" 
                             loading="lazy"
                             width="400"
                             height="400">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h4 class="product-title">${product.name}</h4>
                        <button class="whatsapp-button" data-product='${JSON.stringify(product)}'>
                            <span class="material-icons">whatsapp</span>
                            Llamar al vendedor
                        </button>
                        <button class="share-button" data-product='${JSON.stringify(product)}'>
                            <span class="material-icons">share</span>
                            Compartir
                        </button>
                    </div>
                </article>
            `).join('');
        }
    }
    
    const ofertasContainer = document.getElementById('ofertasGrid');
    if (ofertasContainer) {
        const allProducts = [...products.masculino, ...products.femenino, ...products.infantil];
        const offers = allProducts.filter(p => p.isOffer);
        ofertasContainer.innerHTML = offers.map(product => `
            <article class="product-card">
                <div class="product-image-container">
                    <img data-src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image lazy" 
                         loading="lazy"
                         width="400"
                         height="400">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category} 🔥 OFERTA</div>
                    <h4 class="product-title">${product.name}</h4>
                    <button class="whatsapp-button" data-product='${JSON.stringify(product)}'>
                        <span class="material-icons">whatsapp</span>
                        Llamar al vendedor
                    </button>
                    <button class="share-button" data-product='${JSON.stringify(product)}'>
                        <span class="material-icons">share</span>
                        Compartir
                    </button>
                </div>
            </article>
        `).join('');
    }
    
    setupProductButtons();
    setupLazyLoading();
}

function setupProductButtons() {
    document.querySelectorAll('.whatsapp-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = JSON.parse(btn.dataset.product);
            const message = generateWhatsAppMessage(product, 'product');
            sendWhatsApp(message);
        });
    });
    
    document.querySelectorAll('.share-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = JSON.parse(btn.dataset.product);
            shareProduct(product);
        });
    });
}

function renderCartSidebar() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-secondary);">Tu cesta está vacía</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" width="80" height="80">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div style="color:var(--text-secondary);font-size:0.85rem;">${item.category}</div>
            </div>
            <button class="remove-item material-icons" data-id="${item.id}">delete</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.id));
        });
    });
}

function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-secondary);">Sin favoritos</p>';
        return;
    }
    
    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image" width="80" height="80">
            <div class="wishlist-item-info">
                <div class="wishlist-item-title">${item.name}</div>
                <div class="wishlist-quantity">
                    <button class="wishlist-qty-btn" data-id="${item.id}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button class="wishlist-qty-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
                <button class="send-to-cart" data-id="${item.id}">Enviar a cesta</button>
            </div>
            <button class="remove-wishlist-item material-icons" data-id="${item.id}">delete</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.wishlist-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateWishlistQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.change));
        });
    });
    
    document.querySelectorAll('.send-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            sendWishlistToCart(parseInt(btn.dataset.id));
        });
    });
    
    document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromWishlist(parseInt(btn.dataset.id));
        });
    });
}

// Cart and Wishlist Sidebar
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');
const cartOverlay = document.getElementById('cartOverlay');

cartBtn?.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderCartSidebar();
});

closeCart?.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay?.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    wishlistSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const closeWishlist = document.querySelector('.close-wishlist');

wishlistBtn?.addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderWishlistSidebar();
});

closeWishlist?.addEventListener('click', () => {
    wishlistSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

const consultarStockBtn = document.getElementById('consultarStockBtn');
consultarStockBtn?.addEventListener('click', () => {
    if (cart.length > 0) {
        const message = generateWhatsAppMessage(cart, 'stock');
        sendWhatsApp(message);
    } else {
        showNotification('Agrega productos a la cesta primero');
    }
});

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const closeMenu = document.querySelector('.mobile-menu-close');

function openMenu() {
    mobileMenu?.classList.add('active');
    if (mobileOverlay) mobileOverlay.style.display = 'block';
}

function closeMenuFn() {
    mobileMenu?.classList.remove('active');
    if (mobileOverlay) mobileOverlay.style.display = 'none';
}

hamburger?.addEventListener('click', openMenu);
closeMenu?.addEventListener('click', closeMenuFn);
mobileOverlay?.addEventListener('click', closeMenuFn);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMenuFn();
            }
        }
    });
});

// Auth Modal
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.close-modal');

authBtn?.addEventListener('click', () => {
    authModal?.classList.add('active');
});

closeModal?.addEventListener('click', () => {
    authModal?.classList.remove('active');
});

document.getElementById('authForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        userId: Date.now().toString(),
        timestamp: new Date().toISOString()
    };
    
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    authBtn.innerHTML = `<span class="material-icons">person</span><span>${userData.name.split(' ')[0]}</span>`;
    authModal.classList.remove('active');
    showNotification('¡Registro exitoso! Bienvenido a Gusmar Shoes');
});

// Popup after 30 seconds
setTimeout(() => {
    if (!localStorage.getItem('popupShown')) {
        document.getElementById('offerPopup')?.classList.add('active');
        localStorage.setItem('popupShown', 'true');
    }
}, 30000);

document.querySelector('.close-popup')?.addEventListener('click', () => {
    document.getElementById('offerPopup')?.classList.remove('active');
});

document.getElementById('popupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('offerPopup')?.classList.remove('active');
    showNotification('¡Gracias! Recibirás nuestras ofertas');
});

// Lead Popup Functions
function saveLeadToLocalStorage(leadData) {
    const existingLeads = JSON.parse(localStorage.getItem('gusmarLeads')) || [];
    existingLeads.push({ ...leadData, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem('gusmarLeads', JSON.stringify(existingLeads));
}

function sendLeadToWhatsApp(leadData) {
    const message = `Hola, quiero comprar al por mayor 👇%0A%0A📌 *DATOS DEL REVENDEDOR*:%0A👤 Nombre: ${encodeURIComponent(leadData.nome)}%0A📧 Email: ${encodeURIComponent(leadData.email)}%0A📱 WhatsApp: ${encodeURIComponent(leadData.phone)}%0A%0A🔥 *INTERESADO EN PRECIOS MAYORISTAS*%0A%0A¡Contactar lo antes posible! 🚀`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function startCountdown(seconds) {
    const timerElement = document.getElementById('countdownTimer');
    if (!timerElement) return;
    let remainingSeconds = seconds;
    if (countdownInterval) clearInterval(countdownInterval);
    
    function updateDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    updateDisplay();
    countdownInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            clearInterval(countdownInterval);
            timerElement.textContent = "00:00";
        }
    }, 1000);
}

function showLeadPopup() {
    if (isPopupVisible) return;
    const popup = document.getElementById('leadPopup');
    if (popup) {
        popup.classList.add('active');
        isPopupVisible = true;
        startCountdown(COUNTDOWN_SECONDS);
        localStorage.setItem('leadPopupShown', 'true');
        localStorage.setItem('leadPopupShownAt', Date.now());
    }
}

function closeLeadPopup() {
    const popup = document.getElementById('leadPopup');
    if (popup) {
        popup.classList.remove('active');
        isPopupVisible = false;
        if (countdownInterval) clearInterval(countdownInterval);
    }
}

function shouldShowPopup() {
    const popupShown = localStorage.getItem('leadPopupShown');
    const popupShownAt = localStorage.getItem('leadPopupShownAt');
    if (!popupShown) return true;
    if (popupShownAt && (Date.now() - parseInt(popupShownAt)) > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('leadPopupShown');
        localStorage.removeItem('leadPopupShownAt');
        return true;
    }
    return false;
}

function setupExitIntent() {
    let mouseLeaveTimer = null;
    document.addEventListener('mouseleave', (event) => {
        if (event.clientY <= 0 && !isPopupVisible && shouldShowPopup()) {
            if (mouseLeaveTimer) clearTimeout(mouseLeaveTimer);
            mouseLeaveTimer = setTimeout(() => { showLeadPopup(); }, 100);
        }
    });
}

function setupDelayedPopup() {
    setTimeout(() => {
        if (shouldShowPopup() && !isPopupVisible) showLeadPopup();
    }, POPUP_DELAY_SECONDS * 1000);
}

function setupLeadForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('leadName')?.value.trim() || '';
        const email = document.getElementById('leadEmail')?.value.trim() || '';
        const phone = document.getElementById('leadPhone')?.value.trim() || '';
        const consent = document.getElementById('leadConsent')?.checked || false;
        
        if (!nome || !email || !phone) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        if (!consent) {
            alert('Debes aceptar recibir comunicaciones para continuar.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        const leadData = { nome, email, phone, consent };
        saveLeadToLocalStorage(leadData);
        sendLeadToWhatsApp(leadData);
        closeLeadPopup();
        showNotification('✅ ¡Gracias! En breve recibirás los precios mayoristas.');
        form.reset();
    });
}

function initLeadPopup() {
    setupLeadForm();
    setupDelayedPopup();
    setupExitIntent();
    
    const closeBtn = document.getElementById('closeLeadPopup');
    if (closeBtn) closeBtn.addEventListener('click', closeLeadPopup);
    
    const overlay = document.getElementById('leadPopup');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLeadPopup();
        });
    }
    
    const phoneInput = document.getElementById('leadPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 15) value = value.slice(0, 15);
            e.target.value = value;
        });
    }
}

// Phone mask
function phoneMask(input) {
    if (!input) return;
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 15) value = value.slice(0, 15);
        e.target.value = value;
    });
}

phoneMask(document.getElementById('userPhone'));
phoneMask(document.getElementById('popupPhone'));

// Search functionality
const allItems = [...products.masculino, ...products.femenino, ...products.infantil];
const searchInput = document.getElementById('searchInput');
const suggestionsDiv = document.getElementById('searchSuggestions');

searchInput?.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    if (term.length > 0) {
        const matches = allItems.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term)
        );
        suggestionsDiv.innerHTML = matches.slice(0, 5).map(m => 
            `<div class="suggestion-item" data-cat="${m.category.toLowerCase()}">${m.name} - ${m.category}</div>`
        ).join('');
        suggestionsDiv.classList.add('active');
        
        document.querySelectorAll('.suggestion-item').forEach(el => {
            el.onclick = () => {
                searchInput.value = el.innerText.split(' -')[0];
                suggestionsDiv.classList.remove('active');
                const target = document.getElementById(el.dataset.cat);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            };
        });
    } else {
        suggestionsDiv.classList.remove('active');
    }
});

// Lazy loading with Intersection Observer
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src && !img.src.includes(img.dataset.src)) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.querySelectorAll('.lazy').forEach(img => imageObserver.observe(img));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
    updateWishlistBadge();
    renderCartSidebar();
    renderWishlistSidebar();
    initLeadPopup();
    setupLazyLoading();
});
