// Dataset expanded with 10 Premium Products including professional Laptops, flagships, and luxury lifestyle accessories.
let products = [
    { 
        id: 1, 
        name: "Quantum OLED Gaming Laptop", 
        price: 1899.00, 
        category: "Electronics",
        rating: 5,
        desc: "Next-gen RTX 4080 powerhouse laptop with an ultra-responsive 240Hz OLED display panel.", 
        img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 2, 
        name: "ZenBook Ultrabook Slim", 
        price: 1149.99, 
        category: "Electronics",
        rating: 4,
        desc: "Feather-light machined aerospace aluminum chassis paired with exceptional all-day battery life.", 
        img: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 3, 
        name: "Studio Pro Headphones", 
        price: 299.00, 
        category: "Electronics",
        rating: 5,
        desc: "High-fidelity sound engineered with deep acoustic active noise cancellation technology.", 
        img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 4, 
        name: "Minimalist Chrono Watch", 
        price: 185.50, 
        category: "Lifestyle",
        rating: 4,
        desc: "Sleek matte design profile equipped with luxury grade quartz movement tracking systems.", 
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 5, 
        name: "Mechanical Compact Deck", 
        price: 129.99, 
        category: "Electronics",
        rating: 5,
        desc: "Hot-swappable tactile linear switches with stunning contextual custom RGB backlighting architecture.", 
        img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 6, 
        name: "Anodized Wireless Mouse", 
        price: 79.00, 
        category: "Electronics",
        rating: 4,
        desc: "Ergonomic workspace optimization mouse carrying flawless optical sensor tracking accuracy.", 
        img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 7, 
        name: "UltraWide 4K Productivity Monitor", 
        price: 449.00, 
        category: "Electronics",
        rating: 5,
        desc: "34-inch curved workspace real estate offering vivid HDR400 accurate color profiles.", 
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 8, 
        name: "Premium Leather Daily Backpack", 
        price: 120.00, 
        category: "Lifestyle",
        rating: 4,
        desc: "Waterproof sleek design accents with modular internal pockets built for device protection.", 
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 9, 
        name: "MagSafe Minimalist Card Wallet", 
        price: 45.00, 
        category: "Lifestyle",
        rating: 5,
        desc: "Top-grain genuine protective leather shield with robust snap alignment arrays.", 
        img: "https://images.unsplash.com/photo-1627124139265-7f4b9430c02e?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 10, 
        name: "Titanium Flagship Smartphone", 
        price: 999.00, 
        category: "Electronics",
        rating: 5,
        desc: "Pro camera configuration array backed by cinematic stabilization and 120Hz refresh rates.", 
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" 
    }
];

let cart = [];
let wishlist = []; 
let orderHistory = []; 
let currentUser = null;
let appliedDiscount = 0;
let currentCategoryFilter = 'All';
let currentSearchQuery = '';

// FEATURE 10: Custom Native Popups alerts
function showToast(message, iconClass = "bi-info-circle-fill") {
    const msgEl = document.getElementById('toast-msg');
    const iconEl = document.getElementById('toast-icon');
    const toastNode = document.getElementById('app-toast');
    if (!toastNode) return;
    
    msgEl.innerText = message;
    iconEl.className = `bi ${iconClass} me-2`;
    
    const bsToast = new bootstrap.Toast(toastNode, { delay: 2800 });
    bsToast.show();
}

// Single Page View Router
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(viewId);
    if (targetSection) targetSection.classList.add('active');
    window.scrollTo(0, 0);
}

// FEATURE 9: Live Switch Theme Manager
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    if (body.classList.contains('bg-light-mode')) {
        body.classList.remove('bg-light-mode');
        body.classList.add('bg-dark-mode');
        icon.className = "bi bi-sun-fill text-warning";
        showToast("Theme switched to Dark Mode", "bi-moon-fill");
    } else {
        body.classList.remove('bg-dark-mode');
        body.classList.add('bg-light-mode');
        icon.className = "bi bi-moon-stars-fill";
        showToast("Theme switched to Light Mode", "bi-sun-fill");
    }
}

// FEATURE 2: Tab selection logic
function filterCategory(category) {
    currentCategoryFilter = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('btn-dark', 'active');
        btn.classList.add('btn-outline-dark');
    });
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.remove('btn-outline-dark');
    clickedBtn.classList.add('btn-dark', 'active');
    renderProducts();
}

// FEATURE 1: Fast string query match lookup execution
function handleSearch() {
    currentSearchQuery = document.getElementById('global-search').value.toLowerCase();
    renderProducts();
}

// Dynamic Card Engine Rendering loop
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return; 
    container.innerHTML = '';
    
    const filtered = products.filter(p => {
        const matchesCategory = (currentCategoryFilter === 'All' || p.category === currentCategoryFilter);
        const matchesSearch = p.name.toLowerCase().includes(currentSearchQuery) || p.desc.toLowerCase().includes(currentSearchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-emoji-frown display-4 d-block mb-2"></i>No matching items found.</div>`;
        return;
    }

    filtered.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        const heartClass = isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart text-muted';
        
        // FEATURE 4: Ratings layout calculation
        let starRatingHTML = '';
        for (let i = 1; i <= 5; i++) {
            starRatingHTML += `<i class="bi bi-star-fill ${i <= product.rating ? 'text-warning' : 'text-light-star'} small"></i>`;
        }

        container.innerHTML += `
            <div class="col">
                <div class="card h-100 product-card shadow-sm position-relative">
                    <button class="btn wishlist-toggle-btn position-absolute top-0 end-0 m-2 bg-white rounded-circle shadow-sm px-2 py-1" onclick="toggleWishlist(${product.id})">
                        <i class="bi ${heartClass}"></i>
                    </button>
                    <div class="img-wrapper">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column p-4">
                        <span class="badge bg-secondary mb-2 align-self-start text-uppercase small" style="font-size:0.6rem; letter-spacing: 0.5px;">${product.category || 'General'}</span>
                        <h6 class="fw-bold mb-1 fs-5 card-title-text text-truncate">${product.name}</h6>
                        <div class="mb-2">${starRatingHTML}</div>
                        <p class="card-text text-muted small flex-grow-1 mb-3">${product.desc}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light">
                            <span class="fs-5 fw-bold text-dark-title">$${product.price.toFixed(2)}</span>
                            <div class="d-flex align-items-center bg-light rounded-3 p-1">
                                <button class="btn btn-sm btn-light px-1.5 py-0 border-0 fw-bold" onclick="quickCardModify(${product.id}, -1)">-</button>
                                <span class="mx-2 fw-bold small text-dark" id="card-qty-${product.id}">0</span>
                                <button class="btn btn-sm btn-light px-1.5 py-0 border-0 fw-bold" onclick="quickCardModify(${product.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    syncCardQuantities();
}

function syncCardQuantities() {
    products.forEach(p => {
        const countEl = document.getElementById(`card-qty-${p.id}`);
        if (countEl) {
            const cartItem = cart.find(item => item.product.id === p.id);
            countEl.innerText = cartItem ? cartItem.quantity : 0;
        }
    });
}

function quickCardModify(productId, delta) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        cartItem.quantity += delta;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.product.id !== productId);
            showToast(`${product.name} removed from shopping cart.`);
        } else if (delta > 0) {
            showToast(`Increased quantity for ${product.name}`);
        }
    } else if (delta > 0) {
        cart.push({ product, quantity: 1 });
        showToast(`${product.name} added to cart!`, "bi-cart-plus-fill");
    }
    updateCartUI();
    syncCardQuantities();
}

// FEATURE 3: Wishlist Mutation Management
function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast("Item removed from wishlist.", "bi-heart text-muted");
    } else {
        wishlist.push(productId);
        showToast("Item bookmarked into Wishlist!", "bi-heart-fill text-danger");
    }
    document.getElementById('wishlist-count').innerText = wishlist.length;
    renderProducts();
    renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById('wishlist-container');
    if (!container) return;
    container.innerHTML = '';

    const favs = products.filter(p => wishlist.includes(p.id));
    if (favs.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-heart display-4 d-block mb-2"></i>Your wishlist is empty.</div>`;
        return;
    }

    favs.forEach(product => {
        container.innerHTML += `
            <div class="col">
                <div class="card h-100 product-card shadow-sm p-2">
                    <img src="${product.img}" class="card-img-top rounded" style="height:140px; object-fit:cover;">
                    <div class="card-body d-flex flex-column p-2">
                        <h6 class="fw-bold mb-1 text-truncate card-title-text">${product.name}</h6>
                        <span class="fw-bold text-primary small mb-2">$${product.price.toFixed(2)}</span>
                        <div class="row g-1 mt-auto">
                            <div class="col-8"><button class="btn btn-sm btn-primary w-100 py-1" onclick="quickCardModify(${product.id}, 1)">+ Add to Cart</button></div>
                            <div class="col-4"><button class="btn btn-sm btn-outline-danger w-100 py-1" onclick="toggleWishlist(${product.id})"><i class="bi bi-trash"></i></button></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = totalCount;

    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="p-5 text-center text-muted"><i class="bi bi-cart-x display-4 d-block mb-3"></i>Your cart is empty.</div>`;
        calculateCartTotals();
        return;
    }

    container.innerHTML = '';
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="d-flex align-items-center justify-content-between cart-row border-bottom py-3 row g-0">
                <div class="col-md-2 text-center"><img src="${item.product.img}" style="width:65px; height:65px; object-fit:cover;" class="rounded-3 shadow-sm" /></div>
                <div class="col-md-4 px-2"><h6 class="mb-0 fw-semibold text-dark-title">${item.product.name}</h6><small class="text-muted">$${item.product.price.toFixed(2)}</small></div>
                <div class="col-md-3 d-flex align-items-center justify-content-center">
                    <button class="btn btn-sm btn-light border py-1" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="mx-3 fw-bold small text-dark-title">${item.quantity}</span>
                    <button class="btn btn-sm btn-light border py-1" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <div class="col-md-3 text-end fw-bold text-dark-title">$${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    calculateCartTotals();
}

function changeQuantity(index, modifier) {
    cart[index].quantity += modifier;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
    syncCardQuantities();
}

function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * (appliedDiscount / 100);
    const total = subtotal - discountAmount;

    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById('discount-row');
    if (discountRow) {
        if (appliedDiscount > 0) {
            discountRow.style.setProperty("display", "flex", "important");
            document.getElementById('coupon-percent').innerText = appliedDiscount;
            document.getElementById('cart-discount').innerText = `-$${discountAmount.toFixed(2)}`;
        } else {
            discountRow.style.setProperty("display", "none", "important");
        }
    }

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    
    const checkoutTotalEl = document.getElementById('checkout-final-total');
    if (checkoutTotalEl) checkoutTotalEl.innerText = `$${total.toFixed(2)}`;
}

// FEATURE 8: Robust Discount Validation Badge Panel Controller
function applyCoupon() {
    const codeEl = document.getElementById('coupon-input');
    if (!codeEl) return;
    
    const rawValue = codeEl.value.replace(/[^0-9.]/g, '');
    const percent = parseFloat(rawValue);
    const msgElement = document.getElementById('coupon-message');

    if (!isNaN(percent) && percent > 0 && percent <= 100) {
        appliedDiscount = percent;
        msgElement.className = "badge bg-success p-2 fw-medium d-block w-100 mt-2";
        msgElement.innerText = `✓ Discount code of ${appliedDiscount}% verified and applied!`;
        calculateCartTotals();
        showToast(`Coupon applied: ${appliedDiscount}% reduction active.`, "bi-tag-fill");
    } else {
        appliedDiscount = 0;
        msgElement.className = "badge bg-danger p-2 fw-medium d-block w-100 mt-2";
        msgElement.innerText = "✕ Error: Please input a real percentage number between 1 and 100.";
        calculateCartTotals();
    }
}

// FEATURE 7: Invoice breakdown mapping framework for checkout page
function goToCheckout() {
    if (cart.length === 0) {
        alert("Your shopping cart is currently empty.");
        return;
    }
    const receiptContainer = document.getElementById('checkout-breakdown-items');
    if (receiptContainer) {
        receiptContainer.innerHTML = '';
        cart.forEach(item => {
            receiptContainer.innerHTML += `
                <div class="d-flex justify-content-between mb-1 small">
                    <span>${item.product.name} (x${item.quantity})</span>
                    <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
    }
    showView('checkout-page');
}

// FEATURE 6: Archiving transaction data history row
function renderOrderHistory() {
    const tbody = document.getElementById('orders-history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (orderHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No past records logged.</td></tr>`;
        return;
    }

    orderHistory.forEach(order => {
        tbody.innerHTML += `
            <tr class="table-row-item">
                <td class="fw-bold text-primary">#TRX-${order.id}</td>
                <td class="text-secondary small">${order.date}</td>
                <td><span class="badge bg-secondary px-2 py-1">${order.itemsCount} Items</span></td>
                <td class="fw-bold text-dark-title">$${order.total}</td>
                <td><span class="badge bg-success-subtle text-success border border-success px-2 py-1 small"><i class="bi bi-check-circle-fill me-1"></i> Dispatched</span></td>
            </tr>
        `;
    });
}

// Runtime Mounting Inits
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();

    // Account Creation Event
    document.getElementById('signup-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("Account Registry Created successfully!", "bi-person-check-fill");
        showView('login-page');
    });

    // Account Secure Verification Login
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser = document.getElementById('login-email').value.split('@')[0];
        document.getElementById('user-display').innerText = `Hi, ${currentUser}`;
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-signup').style.display = 'none';
        document.getElementById('nav-user').style.display = 'block';
        document.getElementById('nav-logout').style.display = 'block';
        document.getElementById('nav-add-product').style.display = 'block';
        document.getElementById('nav-orders').style.display = 'block';
        showToast(`Logged in safely as ${currentUser}`, "bi-shield-check");
        showView('landing-page');
    });

    // Dynamic Inventory Upload File Reader Controller
    document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('prod-name').value;
        const price = parseFloat(document.getElementById('prod-price').value);
        const category = document.getElementById('prod-category').value;
        const desc = document.getElementById('prod-desc').value;
        const fileInput = document.getElementById('prod-image-file');

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                products.unshift({
                    id: products.length + 1,
                    name: name,
                    price: price,
                    category: category,
                    rating: 5,
                    desc: desc,
                    img: event.target.result
                });
                renderProducts();
                document.getElementById('add-product-form').reset();
                showToast("New product added to catalog!", "bi-cloud-check-fill");
                showView('landing-page');
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // Secure Payment Authorization Event
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const finalTotalStr = document.getElementById('checkout-final-total').innerText;
        const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        orderHistory.unshift({
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleString(),
            itemsCount: itemsCount,
            total: finalTotalStr.replace('$', '')
        });

        renderOrderHistory();
        cart = []; 
        appliedDiscount = 0;
        if (document.getElementById('coupon-input')) document.getElementById('coupon-input').value = '';
        if (document.getElementById('coupon-message')) {
            document.getElementById('coupon-message').className = '';
            document.getElementById('coupon-message').innerText = '';
        }
        
        updateCartUI();
        syncCardQuantities();
        
        showToast("Transaction Approved! Order Logged.", "bi-bag-check-fill");
        showView('orders-page');
    });
});

function handleLogout() {
    currentUser = null;
    document.getElementById('nav-login').style.display = 'block';
    document.getElementById('nav-signup').style.display = 'block';
    document.getElementById('nav-user').style.display = 'none';
    document.getElementById('nav-logout').style.display = 'none';
    document.getElementById('nav-add-product').style.display = 'none';
    document.getElementById('nav-orders').style.display = 'none';
    showToast("Session disconnected successfully.");
    showView('landing-page');
}