// script.js
// Product Data
const products = {
    masculino: [
        { id: 1, name: "Zapatillas Running Pro Max", category: "Masculino", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", isOffer: false },
        { id: 2, name: "Zapatillas Training Ultra", category: "Masculino", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", isOffer: false },
        { id: 3, name: "Zapatillas Casual Street", category: "Masculino", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop", isOffer: true },
        { id: 4, name: "Zapatillas Baloncesto Air", category: "Masculino", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop", isOffer: false }
    ],
    femenino: [
        { id: 5, name: "Zapatillas Running Pro Mujer", category: "Femenino", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop", isOffer: false },
        { id: 6, name: "Zapatillas Chunky Platform", category: "Femenino", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop", isOffer: false },
        { id: 7, name: "Bailarinas Plegables Soft", category: "Femenino", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop", isOffer: true },
        { id: 8, name: "Botines Chelsea Piel", category: "Femenino", image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&h=400&fit=crop", isOffer: false }
    ],
    infantil: [
        { id: 9, name: "Zapatillas LED Intermitentes", category: "Infantil", image: "https://images.unsplash.com/photo-1514989940723-e81e61645e1a?w=400&h=400&fit=crop", isOffer: false },
        { id: 10, name: "Zapatillas Colegio Resistentes", category: "Infantil", image: "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=400&h=400&fit=crop", isOffer: false },
        { id: 11, name: "Zapatillas Superhéroes Velcro", category: "Infantil", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop", isOffer: true },
        { id: 12, name: "Botas de Agua Impermeables", category: "Infantil", image: "https://images.unsplash.com/photo-1514989940723-e81e61645e1a?w=400&h=400&fit=crop", isOffer: false }
    ]
};

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let popupTimer = null;

// Google Sheets Web App URL (REPLACE WITH YOUR URL AFTER DEPLOYING)
const GOOGLE_SHEETS_URL = "YOUR_GOOGLE_SCRIPT_URL";

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
        const productList = items.map(item => `- ${item.name}`).join('\n');
        return `Hola vendedor, coloqué estos items en la cesta:%0A${productList}%0A%0A¿Podría confirmar si tienen stock disponible? También me gustaría saber el valor total y el costo de envío hasta mi dirección. ¡Gracias!`;
    } else {
        return `¡Hola! Me interesa este producto: ${items.name}. ¿Podría darme más información? ¡Gracias!`;
    }
}

function sendWhatsApp(message) {
    const phone = "34912345678"; // Replace with actual business WhatsApp
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
        showNotification(`${product.name} añadido a deseos`);
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
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render Products
function renderProducts() {
    for (const [category, items] of Object.entries(products)) {
        const container = document.getElementById(`${category}Grid`);
        if (container) {
            container.innerHTML = items.map(product => `
                <article class="product-card">
                    <div class="product-image-container">
                        <img data-src="${product.image}" alt="${product.name}" class="product-image lazy" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h4 class="product-title">${product.name}</h4>
                        <button class="whatsapp-button" data-product='${JSON.stringify(product)}'>
                            <span class="material-icons">whatsapp</span>
                            Llamar al vendedor por WhatsApp
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
    
    // Render Ofertas
    const ofertasContainer = document.getElementById('ofertasGrid');
    if (ofertasContainer) {
        const allProducts = [...products.masculino, ...products.femenino, ...products.infantil];
        const offers = allProducts.filter(p => p.isOffer);
        ofertasContainer.innerHTML = offers.map(product => `
            <article class="product-card">
                <div class="product-image-container">
                    <img data-src="${product.image}" alt="${product.name}" class="product-image lazy" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category} 🔥 OFERTA</div>
                    <h4 class="product-title">${product.name}</h4>
                    <button class="whatsapp-button" data-product='${JSON.stringify(product)}'>
                        <span class="material-icons">whatsapp</span>
                        Llamar al vendedor por WhatsApp
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

// Render Cart Sidebar
function renderCartSidebar() {
    const container = document.getElementById('cartItems');
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:2rem;">Tu cesta está vacía</p>';
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <button class="share-button" style="margin-top:0.5rem;" data-product='${JSON.stringify(item)}'>
                            <span class="material-icons">share</span>
                            Compartir
                        </button>
                        <button class="whatsapp-button" style="margin-top:0.5rem; background:var(--accent);" data-product='${JSON.stringify(item)}'>
                            <span class="material-icons">whatsapp</span>
                            Consultar
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Render Wishlist Sidebar
function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItems');
    if (container) {
        if (wishlist.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:2rem;">No tienes productos en deseos</p>';
        } else {
            container.innerHTML = wishlist.map(item => `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-title">${item.name}</div>
                        <div class="wishlist-quantity">
                            <button class="wishlist-qty-btn" data-id="${item.id}" data-change="-1">-</button>
                            <span>${item.quantity}</span>
                            <button class="wishlist-qty-btn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                        <button class="send-to-cart" data-id="${item.id}">Enviar a la cesta</button>
                        <button class="share-button" style="margin-top:0.5rem;" data-product='${JSON.stringify(item)}'>
                            <span class="material-icons">share</span>
                            Compartir
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Add event listeners for wishlist buttons
        document.querySelectorAll('.wishlist-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const change = parseInt(btn.dataset.change);
                updateWishlistQuantity(id, change);
            });
        });
        
        document.querySelectorAll('.send-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                sendWishlistToCart(id);
            });
        });
    }
}

// Search functionality with autocomplete
const searchInput = document.getElementById('searchInput');
const suggestionsDiv = document.getElementById('searchSuggestions');

const allProductsList = [...products.masculino, ...products.femenino, ...products.infantil];

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length > 0) {
        const matches = allProductsList.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term)
        );
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(m => `
                <div class="suggestion-item" data-name="${m.name}" data-category="${m.category.toLowerCase()}">
                    ${m.name} - ${m.category}
                </div>
            `).join('');
            suggestionsDiv.classList.add('active');
            
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const category = item.dataset.category;
                    searchInput.value = item.dataset.name;
                    suggestionsDiv.classList.remove('active');
                    // Redirect to section
                    document.getElementById(category).scrollIntoView({ behavior: 'smooth' });
                });
            });
        } else {
            suggestionsDiv.classList.remove('active');
        }
    } else {
        suggestionsDiv.classList.remove('active');
    }
});

document.querySelector('.search-icon').addEventListener('click', () => {
    const term = searchInput.value.toLowerCase();
    if (term) {
        const match = allProductsList.find(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term)
        );
        if (match) {
            document.getElementById(match.category.toLowerCase()).scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Event Listeners for product buttons (delegation)
document.addEventListener('click', (e) => {
    // WhatsApp button
    if (e.target.closest('.whatsapp-button')) {
        const btn = e.target.closest('.whatsapp-button');
        const product = JSON.parse(btn.dataset.product);
        const message = generateWhatsAppMessage(product, 'single');
        sendWhatsApp(message);
    }
    
    // Share button
    if (e.target.closest('.share-button')) {
        const btn = e.target.closest('.share-button');
        const product = JSON.parse(btn.dataset.product);
        shareProduct(product);
    }
});

// Cart Sidebar
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.querySelector('.close-cart');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderCartSidebar();
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Wishlist Sidebar
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const closeWishlist = document.querySelector('.close-wishlist');

wishlistBtn.addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderWishlistSidebar();
});

closeWishlist.addEventListener('click', () => {
    wishlistSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Consultar Stock Button
const consultarStockBtn = document.getElementById('consultarStockBtn');
consultarStockBtn.addEventListener('click', () => {
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
    mobileMenu.classList.add('active');
    mobileOverlay.style.display = 'block';
}

function closeMenuFn() {
    mobileMenu.classList.remove('active');
    mobileOverlay.style.display = 'none';
}

hamburger.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
mobileOverlay.addEventListener('click', closeMenuFn);

// Smooth scroll for anchor links
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

// Ver Colección button - anchor to colecciones section
document.getElementById('verColeccionBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('colecciones').scrollIntoView({ behavior: 'smooth' });
});

// Ofertas button
document.getElementById('ofertasBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('ofertas').scrollIntoView({ behavior: 'smooth' });
});

// Auth Modal
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.close-modal');

authBtn.addEventListener('click', () => {
    authModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    authModal.classList.remove('active');
});

// Google Sheets Registration
async function sendToGoogleSheets(userData) {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return true;
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        return false;
    }
}

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        consent: document.getElementById('consent').checked,
        userId: Date.now().toString(),
        timestamp: new Date().toISOString()
    };
    
    await sendToGoogleSheets(userData);
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    authBtn.innerHTML = `<span class="material-icons">person</span><span>${userData.name.split(' ')[0]}</span>`;
    authModal.classList.remove('active');
    showNotification('¡Registro exitoso! Bienvenido a Gusmar Shoes');
});

// Popup after 30 seconds
setTimeout(() => {
    if (!localStorage.getItem('popupShown')) {
        document.getElementById('offerPopup').classList.add('active');
        localStorage.setItem('popupShown', 'true');
    }
}, 30000);

document.querySelector('.close-popup').addEventListener('click', () => {
    document.getElementById('offerPopup').classList.remove('active');
});

document.getElementById('popupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const popupName = document.getElementById('popupName').value;
    const popupEmail = document.getElementById('popupEmail').value;
    const popupPhone = document.getElementById('popupPhone').value;
    const popupConsent = document.getElementById('popupConsent').checked;
    
    if (popupName && popupEmail && popupPhone && popupConsent) {
        await sendToGoogleSheets({
            name: popupName,
            email: popupEmail,
            phone: popupPhone,
            consent: popupConsent,
            source: 'popup',
            timestamp: new Date().toISOString()
        });
        document.getElementById('offerPopup').classList.remove('active');
        showNotification('¡Gracias! Recibirás nuestras ofertas');
    }
});

// Phone input mask
function phoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = value;
    });
}

phoneMask(document.getElementById('userPhone'));
phoneMask(document.getElementById('popupPhone'));

// Lazy loading images
const lazyImages = document.querySelectorAll('.lazy');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Initialize
renderProducts();
updateCartBadge();
updateWishlistBadge();

// CSS animations
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
