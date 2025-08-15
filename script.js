// Initialize Lucide icons
lucide.createIcons();

// Menu Data
const menuData = [
    // Appetizers
    {
        id: 1,
        name: "Bruschetta Trio",
        description: "Three varieties of our signature bruschetta with tomato basil, mushroom, and olive tapenade",
        price: 14.99,
        category: "appetizers",
        icon: "🍅"
    },
    {
        id: 2,
        name: "Antipasto Platter",
        description: "Selection of cured meats, artisanal cheeses, olives, and roasted vegetables",
        price: 18.99,
        category: "appetizers",
        icon: "🧀"
    },
    {
        id: 3,
        name: "Calamari Fritti",
        description: "Crispy fried squid rings served with marinara sauce and lemon",
        price: 16.99,
        category: "appetizers",
        icon: "🦑"
    },
    
    // Pasta
    {
        id: 4,
        name: "Spaghetti Carbonara",
        description: "Classic Roman pasta with eggs, pancetta, pecorino cheese, and black pepper",
        price: 22.99,
        category: "pasta",
        icon: "🍝"
    },
    {
        id: 5,
        name: "Lasagna della Casa",
        description: "Traditional layered pasta with meat sauce, béchamel, and mozzarella",
        price: 24.99,
        category: "pasta",
        icon: "🥘"
    },
    {
        id: 6,
        name: "Fettuccine Alfredo",
        description: "Fresh fettuccine in our rich, creamy Parmesan sauce",
        price: 21.99,
        category: "pasta",
        icon: "🍜"
    },
    {
        id: 7,
        name: "Penne Arrabbiata",
        description: "Penne pasta in spicy tomato sauce with garlic and red chili flakes",
        price: 19.99,
        category: "pasta",
        icon: "🌶️"
    },
    
    // Pizza
    {
        id: 8,
        name: "Margherita",
        description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil",
        price: 18.99,
        category: "pizza",
        icon: "🍕"
    },
    {
        id: 9,
        name: "Quattro Stagioni",
        description: "Four seasons pizza with artichokes, mushrooms, ham, and olives",
        price: 24.99,
        category: "pizza",
        icon: "🍄"
    },
    {
        id: 10,
        name: "Diavola",
        description: "Spicy salami, mozzarella, tomato sauce, and chili oil",
        price: 22.99,
        category: "pizza",
        icon: "🔥"
    },
    
    // Main Courses
    {
        id: 11,
        name: "Osso Buco",
        description: "Braised veal shanks with vegetables, white wine, and saffron risotto",
        price: 32.99,
        category: "mains",
        icon: "🥩"
    },
    {
        id: 12,
        name: "Branzino al Sale",
        description: "Mediterranean sea bass baked in sea salt with herbs and lemon",
        price: 28.99,
        category: "mains",
        icon: "🐟"
    },
    {
        id: 13,
        name: "Pollo Parmigiana",
        description: "Breaded chicken breast with marinara sauce and melted mozzarella",
        price: 26.99,
        category: "mains",
        icon: "🍗"
    },
    
    // Desserts
    {
        id: 14,
        name: "Tiramisu",
        description: "Classic coffee-flavored dessert with mascarpone and ladyfingers",
        price: 8.99,
        category: "desserts",
        icon: "☕"
    },
    {
        id: 15,
        name: "Panna Cotta",
        description: "Vanilla bean panna cotta with berry compote",
        price: 7.99,
        category: "desserts",
        icon: "🍮"
    },
    {
        id: 16,
        name: "Cannoli Siciliani",
        description: "Crispy shells filled with sweet ricotta and chocolate chips",
        price: 9.99,
        category: "desserts",
        icon: "🥧"
    }
];

// Cart functionality
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCountElement = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.querySelector('.navbar');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    setupEventListeners();
    handleScroll();
});

// Render menu items
function renderMenu(category = 'all') {
    const filteredItems = category === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === category);
    
    menuGrid.innerHTML = '';
    
    filteredItems.forEach((item, index) => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.style.animationDelay = `${index * 0.1}s`;
        
        menuItemElement.innerHTML = `
            <div class="menu-item-image">
                <span style="font-size: 4rem;">${item.icon}</span>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p>${item.description}</p>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    Add to Cart
                </button>
            </div>
        `;
        
        menuGrid.appendChild(menuItemElement);
    });
    
    // Re-animate items
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuData.find(menuItem => menuItem.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showCartAnimation();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Update cart display
function updateCart() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    cartCountElement.textContent = cartCount;
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    renderCartItems();
    
    checkoutBtn.disabled = cartCount === 0;
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-cart"></i>
                <p>Your cart is empty</p>
                <p class="empty-cart-sub">Add some delicious items to get started!</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i data-lucide="minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i data-lucide="plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// Show cart animation
function showCartAnimation() {
    cartBtn.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 300);
}

// Setup event listeners
function setupEventListeners() {
    // Cart functionality
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderMenu(e.target.dataset.category);
        });
    });
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll event
    window.addEventListener('scroll', handleScroll);
}

// Cart functions
function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) return;
    
    // Simulate checkout process
    const orderSummary = cart.map(item => 
        `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Order Placed Successfully!\n\nOrder Summary:\n${orderSummary}\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order! We'll prepare it with love.`);
    
    // Clear cart
    cart = [];
    updateCart();
    closeCart();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Handle scroll effects
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero && scrollY < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
}

// Smooth scroll functions
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Intersection Observer for animations
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

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.section-header, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle form submissions (if any forms are added later)
function handleFormSubmit(event, formType) {
    event.preventDefault();
    
    switch(formType) {
        case 'reservation':
            alert('Reservation request submitted! We\'ll contact you soon to confirm.');
            break;
        case 'contact':
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            break;
        default:
            alert('Form submitted successfully!');
    }
}

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.nav-logo h1').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🎉 You found our secret! Enjoy 10% off your next order with code: BELLAVISTA10');
        clickCount = 0;
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(handleScroll, 10);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', debouncedScroll);