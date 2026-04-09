// ============================================
// GUSMAR SHOES - SCRIPT COMPLETO
// ============================================

// Productos base
const baseProducts = {
    masculino: [
        { id: 1, name: "Zapatillas Running Pro Max", category: "Masculino", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", isOffer: false, ref: "M001" },
        { id: 2, name: "Zapatillas Training Ultra", category: "Masculino", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", isOffer: false, ref: "M002" },
        { id: 3, name: "Zapatillas Casual Street", category: "Masculino", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop", isOffer: true, ref: "M003" },
        { id: 4, name: "Zapatillas Baloncesto Air", category: "Masculino", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop", isOffer: false, ref: "M004" }
    ],
    femenino: [
        { id: 5, name: "Zapatillas Running Pro Mujer", category: "Femenino", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop", isOffer: false, ref: "F001" },
        { id: 6, name: "Zapatillas Chunky Platform", category: "Femenino", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop", isOffer: false, ref: "F002" },
        { id: 7, name: "Bailarinas Plegables Soft", category: "Femenino", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop", isOffer: true, ref: "F003" },
        { id: 8, name: "Botines Chelsea Piel", category: "Femenino", image: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=400&h=400&fit=crop", isOffer: false, ref: "F004" }
    ],
    infantil: [
        { id: 9, name: "Zapatillas LED Intermitentes", category: "Infantil", image: "https://images.unsplash.com/photo-1514989940723-e81e61645e1a?w=400&h=400&fit=crop", isOffer: false, ref: "I001" },
        { id: 10, name: "Zapatillas Colegio Resistentes", category: "Infantil", image: "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=400&h=400&fit=crop", isOffer: false, ref: "I002" },
        { id: 11, name: "Zapatillas Superhéroes Velcro", category: "Infantil", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop", isOffer: true, ref: "I003" }
    ]
};

let outrosProdutos = JSON.parse(localStorage.getItem('outrosProdutos')) || [
    { id: 101, name: "Mocasines de Cuero", category: "Outros", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop", isOffer: false, ref: "REF001" },
    { id: 102, name: "Sandalias Tropical", category: "Outros", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop", isOffer: false, ref: "REF002" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartSidebar();
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    renderWishlistSidebar();
}

function updateCartBadge() {
    document.getElementById('cartBadge').textContent = cart.length;
}

function updateWishlistBadge() {
    document.getElementById('wishlistBadge').textContent = wishlist.length;
}

function showNotification(msg) {
    let n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `<span class="material-icons">check_circle</span>${msg}`;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'slideOut 0.3s';
        setTimeout(() => n.remove(), 300);
    }, 3000);
}

function flyToTarget(element, targetId) {
    const rect = element.getBoundingClientRect();
    const clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = '40px';
    clone.style.height = '40px';
    clone.style.borderRadius = '50%';
    clone.style.objectFit = 'cover';
    clone.style.zIndex = '99999';
    clone.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    document.body.appendChild(clone);
    const target = document.getElementById(targetId);
    const targetRect = target.getBoundingClientRect();
    clone.style.transition = 'all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    requestAnimationFrame(() => {
        clone.style.left = targetRect.left + targetRect.width / 2 - 20 + 'px';
        clone.style.top = targetRect.top + targetRect.height / 2 - 20 + 'px';
        clone.style.width = '30px';
        clone.style.height = '30px';
        clone.style.opacity = '0.5';
    });
    setTimeout(() => { clone.remove(); }, 500);
}

function addToCart(product, ev) {
    if (!cart.find(i => i.id === product.id)) {
        cart.push({ ...product, quantity: 1 });
        saveCart();
        showNotification(`Producto añadido a la cesta`);
        if (ev && ev.target) flyToTarget(ev.target, 'cartBtn');
    } else showNotification(`Ya está en la cesta`);
}

function addToWishlist(product, ev) {
    if (!wishlist.find(i => i.id === product.id)) {
        wishlist.push({ ...product, quantity: 1 });
        saveWishlist();
        showNotification(`Añadido a lista de deseos`);
        if (ev && ev.target) flyToTarget(ev.target, 'wishlistBtn');
    } else showNotification(`Ya está en deseos`);
}

function shareProduct(product) {
    if (navigator.share) navigator.share({ title: product.name, text: `Mira este calzado en Gusmar Shoes` });
    else {
        navigator.clipboard.writeText(`${product.name} - Gusmar Shoes`);
        showNotification('Enlace copiado');
    }
}

function sendWhatsAppProduct(product) {
    const msg = `Hola vendedor, me interesa este calzado *"${product.ref || product.id}"*. ¿Podría darme más información? ¡Gracias!`;
    const fullMsg = `${msg} %0A%0A🔗 Vista previa: ${product.image}`;
    window.open(`https://wa.me/5493757326174?text=${fullMsg}`, '_blank');
}

function renderProductCard(p, hideText = false) {
    const hiddenClass = hideText ? 'no-text' : '';
    const refCode = p.ref ? p.ref : `REF${String(p.id).padStart(3, '0')}`;
    return `<article class="product-card ${hiddenClass}" data-id="${p.id}">
                <div class="product-image-container" data-product='${JSON.stringify(p)}'>
                    <img data-src="${p.image}" alt="Calzado" class="product-image lazy" loading="lazy">
                    <div class="floating-buttons">
                        <button class="floating-icon wishlist-float" data-action="wishlist"><span class="material-icons">favorite_border</span></button>
                        <button class="floating-icon cart-float" data-action="cart"><span class="material-icons">add_shopping_cart</span></button>
                        <button class="floating-icon share-float" data-action="share"><span class="material-icons">share</span></button>
                    </div>
                </div>
                <div class="product-info">
                    ${!hideText ? `<div class="product-category">${p.category} ${p.isOffer ? '🔥 OFERTA' : ''}</div><div class="product-title">${p.name}</div>` : ''}
                    <div><span class="product-ref">📌 ${refCode}</span></div>
                    <button class="whatsapp-button" data-action="whatsapp"><span class="material-icons">whatsapp</span> Chamar Vendedor</button>
                    <div class="horizontal-buttons">
                        <button class="horiz-btn wishlist-horiz" data-action="wishlist"><span class="material-icons">favorite_border</span> Deseo</button>
                        <button class="horiz-btn cart-horiz" data-action="cart"><span class="material-icons">add_shopping_cart</span> Cesta</button>
                        <button class="horiz-btn share-horiz" data-action="share"><span class="material-icons">share</span> Compartir</button>
                    </div>
                </div>
            </article>`;
}

function renderProducts() {
    for (let cat of ['masculino', 'femenino', 'infantil']) {
        let container = document.getElementById(`${cat}Grid`);
        if (container) container.innerHTML = baseProducts[cat].map(p => renderProductCard(p, false)).join('');
    }
    const outrosContainer = document.getElementById('outrosGrid');
    if (outrosContainer) outrosContainer.innerHTML = outrosProdutos.map(p => renderProductCard(p, true)).join('');

    const allOffers = [...baseProducts.masculino, ...baseProducts.femenino, ...baseProducts.infantil, ...outrosProdutos].filter(p => p.isOffer);
    document.getElementById('ofertasGrid').innerHTML = allOffers.map(p => renderProductCard(p, false)).join('');
    attachEvents();
}

function attachEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        const imgContainer = card.querySelector('.product-image-container');
        if (!imgContainer) return;
        const productData = JSON.parse(imgContainer.dataset.product);

        card.querySelectorAll('[data-action="whatsapp"]').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); sendWhatsAppProduct(productData); });
        card.querySelectorAll('[data-action="wishlist"]').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); addToWishlist(productData, e); });
        card.querySelectorAll('[data-action="cart"]').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); addToCart(productData, e); });
        card.querySelectorAll('[data-action="share"]').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); shareProduct(productData); });
        imgContainer.onclick = (e) => { if (e.target === imgContainer || e.target.classList.contains('product-image')) sendWhatsAppProduct(productData); };
    });
    document.querySelectorAll('.lazy').forEach(img => {
        if (img.dataset.src && !img.src) { img.src = img.dataset.src; img.classList.add('loaded'); }
    });
}

function renderCartSidebar() {
    const container = document.getElementById('cartItems');
    if (container) container.innerHTML = cart.length ? cart.map(i => `<div class="cart-item"><img src="${i.image}" class="cart-item-image"><div><div>${i.name} (${i.ref || i.id})</div><button class="whatsapp-button" style="margin-top:8px; padding:0.4rem;" data-cart-whatsapp='${i.id}'>WhatsApp</button></div></div>`).join('') : '<p style="text-align:center; padding:2rem;">Vacía</p>';
    document.querySelectorAll('[data-cart-whatsapp]').forEach(btn => {
        btn.onclick = () => { const id = parseInt(btn.dataset.cartWhatsapp); const prod = cart.find(p => p.id === id); if (prod) sendWhatsAppProduct(prod); };
    });
}

function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItems');
    if (container) container.innerHTML = wishlist.length ? wishlist.map(i => `<div class="wishlist-item"><img src="${i.image}" class="wishlist-item-image"><div><div>${i.name} (${i.ref || i.id})</div><button class="whatsapp-button" style="margin-top:8px; padding:0.4rem;" data-wish-to-cart='${i.id}'>Enviar a cesta</button></div></div>`).join('') : '<p style="text-align:center;">Vacía</p>';
    document.querySelectorAll('[data-wish-to-cart]').forEach(btn => {
        btn.onclick = () => { const id = parseInt(btn.dataset.wishToCart); const item = wishlist.find(w => w.id === id); if (item) { addToCart(item); wishlist = wishlist.filter(w => w.id !== id); saveWishlist(); renderWishlistSidebar(); } };
    });
}

// Sidebar
document.getElementById('cartBtn').onclick = () => { document.getElementById('cartSidebar').classList.add('active'); document.getElementById('cartOverlay').classList.add('active'); renderCartSidebar(); };
document.querySelector('.close-cart').onclick = () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); };
document.getElementById('wishlistBtn').onclick = () => { document.getElementById('wishlistSidebar').classList.add('active'); document.getElementById('cartOverlay').classList.add('active'); renderWishlistSidebar(); };
document.querySelector('.close-wishlist').onclick = () => { document.getElementById('wishlistSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); };
document.getElementById('cartOverlay').onclick = () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('wishlistSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); };
document.getElementById('consultarStockBtn').onclick = () => { if (cart.length) { const msg = cart.map(i => `- ${i.name} (${i.ref || i.id})`).join('%0A'); window.open(`https://wa.me/5493757326174?text=Hola%20vendedor,%20consulto%20stock%20de:%0A${msg}`, '_blank'); } else showNotification('Cesta vacía'); };

// Auth
const authBtn = document.getElementById('authBtn'), authModal = document.getElementById('authModal'), closeModal = document.querySelector('.close-modal');
authBtn.onclick = () => authModal.classList.add('active');
closeModal.onclick = () => authModal.classList.remove('active');
document.getElementById('authForm').onsubmit = async (e) => { e.preventDefault(); authModal.classList.remove('active'); showNotification('Registro exitoso'); };

// Popup ofertas
setTimeout(() => { if (!localStorage.getItem('popupShown')) { document.getElementById('offerPopup').classList.add('active'); localStorage.setItem('popupShown', 'true'); } }, 30000);
document.querySelector('.close-popup').onclick = () => document.getElementById('offerPopup').classList.remove('active');
document.getElementById('popupForm').onsubmit = (e) => { e.preventDefault(); document.getElementById('offerPopup').classList.remove('active'); showNotification('¡Gracias!'); };

// Buscador
const allItems = [...baseProducts.masculino, ...baseProducts.femenino, ...baseProducts.infantil, ...outrosProdutos];
const searchInput = document.getElementById('searchInput'), suggestionsDiv = document.getElementById('searchSuggestions');
searchInput.addEventListener('input', () => {
    let term = searchInput.value.toLowerCase();
    if (term.length > 0) {
        let matches = allItems.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
        suggestionsDiv.innerHTML = matches.map(m => `<div class="suggestion-item" data-cat="${m.category.toLowerCase()}">${m.name} - ${m.category}</div>`).join('');
        suggestionsDiv.classList.add('active');
        document.querySelectorAll('.suggestion-item').forEach(el => {
            el.onclick = () => {
                searchInput.value = el.innerText.split(' -')[0];
                suggestionsDiv.classList.remove('active');
                let target = document.getElementById(el.dataset.cat);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            };
        });
    } else suggestionsDiv.classList.remove('active');
});

// Lazy loading
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            let img = e.target;
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        }
    });
});
document.querySelectorAll('.lazy').forEach(img => observer.observe(img));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        let targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            let target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                closeMenuFn();
            }
        }
    });
});

// Mobile menu
const hamburger = document.querySelector('.hamburger'), mobileMenu = document.querySelector('.mobile-menu'), mobileOverlay = document.querySelector('.mobile-menu-overlay'), closeMenuBtn = document.querySelector('.mobile-menu-close');
function openMenu() { mobileMenu.classList.add('active'); mobileOverlay.style.display = 'block'; }
function closeMenuFn() { mobileMenu.classList.remove('active'); mobileOverlay.style.display = 'none'; }
hamburger?.addEventListener('click', openMenu);
closeMenuBtn?.addEventListener('click', closeMenuFn);
mobileOverlay?.addEventListener('click', closeMenuFn);

renderProducts();
updateCartBadge();
updateWishlistBadge();
renderCartSidebar();
renderWishlistSidebar();

// ============================================
// POPUP DE LEAD - ALTA CONVERSÃO
// ============================================

const WHATSAPP_NUMBER = "5493757326174";
const POPUP_DELAY_SECONDS = 15;
const COUNTDOWN_SECONDS = 300;

let countdownInterval = null;
let isPopupVisible = false;

function saveLeadToLocalStorage(leadData) {
    const existingLeads = JSON.parse(localStorage.getItem('gusmarLeads')) || [];
    existingLeads.push({
        ...leadData,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('gusmarLeads', JSON.stringify(existingLeads));
}

function sendLeadToWhatsApp(leadData) {
    const message = `Hola, quiero comprar al por mayor 👇%0A%0A📌 *DATOS DEL REVENDEDOR*:%0A👤 Nombre: ${encodeURIComponent(leadData.nome)}%0A📧 Email: ${encodeURIComponent(leadData.email)}%0A📱 WhatsApp: ${encodeURIComponent(leadData.phone)}%0A%0A🔥 *INTERESADO EN PRECIOS MAYORISTAS*%0A%0A¡Contactar lo antes posible! 🚀`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function trackFacebookLead() {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
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
        if (shouldShowPopup() && !isPopupVisible) {
            showLeadPopup();
        }
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
        const leadData = { nome: nome, email: email, phone: phone, consent: consent };
        saveLeadToLocalStorage(leadData);
        sendLeadToWhatsApp(leadData);
        trackFacebookLead();
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
            if (value.length > 12) value = value.slice(0, 12);
            e.target.value = value;
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeadPopup);
} else {
    initLeadPopup();
}
