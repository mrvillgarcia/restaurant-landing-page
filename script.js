// Initialize Lucide icons
lucide.createIcons();

// Global state management
const AppState = {
    user: null,
    courts: [],
    events: [],
    news: [],
    membership: null,
    bookings: []
};

// Mock data
const mockData = {
    courts: [
        { id: 1, name: 'Court 1', type: 'standard', price: 20, available: true },
        { id: 2, name: 'Court 2', type: 'standard', price: 20, available: true },
        { id: 3, name: 'Court 3', type: 'premium', price: 30, available: false },
        { id: 4, name: 'Court 4', type: 'premium', price: 30, available: true },
        { id: 5, name: 'Court 5', type: 'vip', price: 40, available: true },
        { id: 6, name: 'Court 6', type: 'vip', price: 40, available: true },
        { id: 7, name: 'Court 7', type: 'standard', price: 20, available: true },
        { id: 8, name: 'Court 8', type: 'premium', price: 30, available: false }
    ],
    
    events: [
        {
            id: 1,
            title: "Spring Championship 2024",
            date: "March 15-17, 2024",
            description: "Annual spring tournament featuring singles and doubles competitions across all skill levels.",
            participants: "32/64 registered",
            price: "$45",
            icon: "trophy"
        },
        {
            id: 2,
            title: "Beginner's Workshop",
            date: "March 22, 2024",
            description: "Learn the fundamentals of badminton with our professional coaches. All equipment provided.",
            participants: "15/20 registered",
            price: "Free",
            icon: "book-open"
        },
        {
            id: 3,
            title: "Members Social Night",
            date: "March 28, 2024",
            description: "Monthly social gathering with mini-tournaments, food, and prizes. Members only event.",
            participants: "25/40 registered",
            price: "$15",
            icon: "users"
        },
        {
            id: 4,
            title: "Youth Development Camp",
            date: "April 5-7, 2024",
            description: "3-day intensive training camp for young players aged 12-18. Professional coaching included.",
            participants: "18/25 registered",
            price: "$120",
            icon: "zap"
        }
    ],
    
    news: [
        {
            id: 1,
            title: "New Court Booking System Launched",
            date: "March 10, 2024",
            excerpt: "We're excited to announce our new real-time court booking system with instant confirmation and mobile-friendly interface.",
            icon: "smartphone"
        },
        {
            id: 2,
            title: "Spring Tournament Registration Open",
            date: "March 8, 2024",
            excerpt: "Registration is now open for our annual Spring Championship. Early bird discount available until March 12th.",
            icon: "calendar"
        },
        {
            id: 3,
            title: "New Premium Courts Available",
            date: "March 5, 2024",
            excerpt: "Two brand new premium courts with professional-grade flooring and lighting are now available for booking.",
            icon: "star"
        },
        {
            id: 4,
            title: "Coaching Staff Expansion",
            date: "March 1, 2024",
            excerpt: "Welcome our two new certified coaches! Now offering more private lessons and group coaching sessions.",
            icon: "award"
        },
        {
            id: 5,
            title: "Member Appreciation Week",
            date: "February 28, 2024",
            excerpt: "Thank you to all our members! Enjoy special discounts and free guest passes during appreciation week.",
            icon: "heart"
        },
        {
            id: 6,
            title: "Facility Upgrades Complete",
            date: "February 25, 2024",
            excerpt: "Our locker room and café renovations are complete. Come check out the new facilities!",
            icon: "home"
        }
    ],
    
    timeSlots: [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00'
    ]
};

// DOM Elements
const elements = {
    authBtn: document.getElementById('authBtn'),
    authText: document.getElementById('authText'),
    authModal: document.getElementById('authModal'),
    bookingModal: document.getElementById('bookingModal'),
    overlay: document.getElementById('overlay'),
    menuToggle: document.getElementById('menuToggle'),
    navMenu: document.getElementById('navMenu'),
    navbar: document.getElementById('navbar'),
    
    // Booking elements
    bookingDate: document.getElementById('bookingDate'),
    bookingTime: document.getElementById('bookingTime'),
    courtType: document.getElementById('courtType'),
    courtsGrid: document.getElementById('courtsGrid'),
    
    // Auth elements
    authForm: document.getElementById('authForm'),
    authModalTitle: document.getElementById('authModalTitle'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),
    authFooterText: document.getElementById('authFooterText'),
    
    // Payment elements
    paymentForm: document.getElementById('paymentForm'),
    bookingSummary: document.getElementById('bookingSummary'),
    
    // Content grids
    eventsGrid: document.getElementById('eventsGrid'),
    newsGrid: document.getElementById('newsGrid')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateContent();
    setMinDate();
    populateTimeSlots();
});

// Initialize application
function initializeApp() {
    // Check for saved user data
    const savedUser = localStorage.getItem('badmintonUser');
    if (savedUser) {
        AppState.user = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Set initial data
    AppState.courts = mockData.courts;
    AppState.events = mockData.events;
    AppState.news = mockData.news;
    
    // Initialize icons
    lucide.createIcons();
}

// Setup event listeners
function setupEventListeners() {
    // Auth button
    elements.authBtn?.addEventListener('click', openAuthModal);
    
    // Mobile menu toggle
    elements.menuToggle?.addEventListener('click', toggleMobileMenu);
    
    // Modal close events
    document.addEventListener('click', handleModalClose);
    
    // Form submissions
    elements.authForm?.addEventListener('submit', handleAuthSubmit);
    elements.paymentForm?.addEventListener('submit', handlePaymentSubmit);
    
    // Booking form changes
    elements.bookingDate?.addEventListener('change', updateTimeSlots);
    elements.bookingTime?.addEventListener('change', checkAvailability);
    elements.courtType?.addEventListener('change', checkAvailability);
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Scroll event
    window.addEventListener('scroll', handleScroll);
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', selectPaymentMethod);
    });
}

// Authentication functions
function openAuthModal() {
    if (AppState.user) {
        handleLogout();
    } else {
        elements.authModal.classList.add('active');
        elements.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    elements.authModal.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    const loginTab = document.querySelector('.tab-btn:first-child');
    const registerTab = document.querySelector('.tab-btn:last-child');
    const nameGroup = document.getElementById('nameGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        nameGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        elements.authModalTitle.textContent = 'Login';
        elements.authSubmitBtn.textContent = 'Login';
        elements.authFooterText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchAuthTab(\'register\')">Sign up</a>';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        nameGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        elements.authModalTitle.textContent = 'Register';
        elements.authSubmitBtn.textContent = 'Create Account';
        elements.authFooterText.innerHTML = 'Already have an account? <a href="#" onclick="switchAuthTab(\'login\')">Login</a>';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const formData = new FormData(elements.authForm);
    const isRegister = elements.authSubmitBtn.textContent === 'Create Account';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isRegister) {
        const fullName = document.getElementById('fullName').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Mock registration
        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            membership: null,
            joinDate: new Date().toISOString()
        };
        
        AppState.user = newUser;
        localStorage.setItem('badmintonUser', JSON.stringify(newUser));
        
        alert('Account created successfully! Welcome to Elite Badminton Club!');
    } else {
        // Mock login
        const user = {
            id: Date.now(),
            name: 'John Doe',
            email: email,
            membership: 'premium',
            joinDate: '2023-01-15T00:00:00.000Z'
        };
        
        AppState.user = user;
        localStorage.setItem('badmintonUser', JSON.stringify(user));
        
        alert('Login successful! Welcome back!');
    }
    
    updateAuthUI();
    closeAuthModal();
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        AppState.user = null;
        AppState.membership = null;
        localStorage.removeItem('badmintonUser');
        updateAuthUI();
        alert('Logged out successfully!');
    }
}

function updateAuthUI() {
    if (AppState.user) {
        elements.authText.textContent = `Hi, ${AppState.user.name.split(' ')[0]}`;
        elements.authBtn.innerHTML = `
            <i data-lucide="user"></i>
            <span>${AppState.user.name.split(' ')[0]}</span>
        `;
    } else {
        elements.authText.textContent = 'Login';
        elements.authBtn.innerHTML = `
            <i data-lucide="user"></i>
            <span>Login</span>
        `;
    }
    lucide.createIcons();
}

// Court booking functions
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    elements.bookingDate.min = tomorrow.toISOString().split('T')[0];
    elements.bookingDate.value = tomorrow.toISOString().split('T')[0];
}

function populateTimeSlots() {
    elements.bookingTime.innerHTML = '<option value="">Select time slot</option>';
    mockData.timeSlots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = `${time} - ${addHour(time)}`;
        elements.bookingTime.appendChild(option);
    });
}

function addHour(time) {
    const [hours] = time.split(':');
    const nextHour = parseInt(hours) + 1;
    return `${nextHour.toString().padStart(2, '0')}:00`;
}

function updateTimeSlots() {
    // In a real app, this would filter based on existing bookings for the selected date
    populateTimeSlots();
}

function checkAvailability() {
    if (!elements.bookingDate.value || !elements.bookingTime.value) {
        showCourtPlaceholder();
        return;
    }
    
    const selectedType = elements.courtType.value;
    const filteredCourts = AppState.courts.filter(court => 
        selectedType === 'all' || court.type === selectedType
    );
    
    renderCourts(filteredCourts);
}

function showCourtPlaceholder() {
    elements.courtsGrid.innerHTML = `
        <div class="courts-placeholder">
            <i data-lucide="calendar"></i>
            <p>Select date and time to view available courts</p>
        </div>
    `;
    lucide.createIcons();
}

function renderCourts(courts) {
    if (courts.length === 0) {
        elements.courtsGrid.innerHTML = `
            <div class="courts-placeholder">
                <i data-lucide="x-circle"></i>
                <p>No courts available for the selected criteria</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    elements.courtsGrid.innerHTML = courts.map(court => `
        <div class="court-item ${court.available ? 'available' : 'occupied'}" 
             onclick="${court.available ? `selectCourt(${court.id})` : ''}">
            <div class="court-header">
                <h4 class="court-name">${court.name}</h4>
                <span class="court-status ${court.available ? 'available' : 'occupied'}">
                    ${court.available ? 'Available' : 'Occupied'}
                </span>
            </div>
            <div class="court-details">
                <span class="court-type">${court.type.charAt(0).toUpperCase() + court.type.slice(1)} Court</span>
                <span class="court-price">$${court.price}/hour</span>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function selectCourt(courtId) {
    if (!AppState.user) {
        alert('Please login to book a court.');
        openAuthModal();
        return;
    }
    
    const court = AppState.courts.find(c => c.id === courtId);
    const booking = {
        court: court,
        date: elements.bookingDate.value,
        time: elements.bookingTime.value,
        duration: 1,
        price: court.price
    };
    
    showBookingModal(booking);
}

function showBookingModal(booking) {
    const membershipDiscount = AppState.user?.membership ? getMembershipDiscount(AppState.user.membership) : 0;
    const discountAmount = booking.price * membershipDiscount;
    const finalPrice = booking.price - discountAmount;
    
    elements.bookingSummary.innerHTML = `
        <div class="summary-item">
            <span>Court:</span>
            <span>${booking.court.name} (${booking.court.type})</span>
        </div>
        <div class="summary-item">
            <span>Date:</span>
            <span>${formatDate(booking.date)}</span>
        </div>
        <div class="summary-item">
            <span>Time:</span>
            <span>${booking.time} - ${addHour(booking.time)}</span>
        </div>
        <div class="summary-item">
            <span>Duration:</span>
            <span>${booking.duration} hour</span>
        </div>
        <div class="summary-item">
            <span>Base Price:</span>
            <span>$${booking.price.toFixed(2)}</span>
        </div>
        ${membershipDiscount > 0 ? `
        <div class="summary-item">
            <span>Member Discount (${(membershipDiscount * 100).toFixed(0)}%):</span>
            <span>-$${discountAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="summary-item">
            <span>Total:</span>
            <span>$${finalPrice.toFixed(2)}</span>
        </div>
    `;
    
    // Store booking for payment processing
    AppState.currentBooking = { ...booking, finalPrice };
    
    elements.bookingModal.classList.add('active');
    elements.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function getMembershipDiscount(membership) {
    const discounts = {
        basic: 0.15,
        premium: 0.25,
        elite: 1.0 // Unlimited for elite members
    };
    return discounts[membership] || 0;
}

function closeBookingModal() {
    elements.bookingModal.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Payment functions
function selectPaymentMethod(e) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    if (!AppState.currentBooking) {
        alert('No booking found. Please try again.');
        return;
    }
    
    // Mock payment processing
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<div class="loading"></div> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful payment
        AppState.bookings.push({
            id: Date.now(),
            ...AppState.currentBooking,
            status: 'confirmed',
            paymentDate: new Date().toISOString()
        });
        
        alert(`Booking confirmed! Court ${AppState.currentBooking.court.name} is reserved for ${formatDate(AppState.currentBooking.date)} at ${AppState.currentBooking.time}.`);
        
        // Reset form and close modal
        elements.paymentForm.reset();
        closeBookingModal();
        
        // Update court availability
        const court = AppState.courts.find(c => c.id === AppState.currentBooking.court.id);
        if (court) court.available = false;
        
        // Clear current booking
        AppState.currentBooking = null;
        
        // Refresh courts display
        checkAvailability();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Membership functions
function selectMembership(plan) {
    if (!AppState.user) {
        alert('Please login to select a membership plan.');
        openAuthModal();
        return;
    }
    
    const plans = {
        basic: { name: 'Basic', price: 29 },
        premium: { name: 'Premium', price: 59 },
        elite: { name: 'Elite', price: 99 }
    };
    
    const selectedPlan = plans[plan];
    
    if (confirm(`Subscribe to ${selectedPlan.name} membership for $${selectedPlan.price}/month?`)) {
        AppState.user.membership = plan;
        localStorage.setItem('badmintonUser', JSON.stringify(AppState.user));
        alert(`Welcome to ${selectedPlan.name} membership! Your benefits are now active.`);
    }
}

// Content population functions
function populateContent() {
    populateEvents();
    populateNews();
}

function populateEvents() {
    if (!elements.eventsGrid) return;
    
    elements.eventsGrid.innerHTML = AppState.events.map(event => `
        <div class="event-card">
            <div class="event-image">
                <i data-lucide="${event.icon}"></i>
            </div>
            <div class="event-content">
                <div class="event-date">${event.date}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <span class="event-participants">${event.participants}</span>
                    <span class="event-price">${event.price}</span>
                </div>
                <button class="btn btn-primary" onclick="registerForEvent(${event.id})">
                    Register Now
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function populateNews() {
    if (!elements.newsGrid) return;
    
    elements.newsGrid.innerHTML = AppState.news.map(news => `
        <div class="news-card">
            <div class="news-image">
                <i data-lucide="${news.icon}"></i>
            </div>
            <div class="news-content">
                <div class="news-date">${news.date}</div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="#" class="read-more" onclick="readFullNews(${news.id})">Read More</a>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function registerForEvent(eventId) {
    if (!AppState.user) {
        alert('Please login to register for events.');
        openAuthModal();
        return;
    }
    
    const event = AppState.events.find(e => e.id === eventId);
    if (event) {
        alert(`Registration successful for ${event.title}! Check your email for details.`);
    }
}

function readFullNews(newsId) {
    const news = AppState.news.find(n => n.id === newsId);
    if (news) {
        alert(`Full article: ${news.title}\n\n${news.excerpt}\n\nThis would open the full article in a real implementation.`);
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
}

function handleModalClose(e) {
    if (e.target === elements.overlay) {
        closeAuthModal();
        closeBookingModal();
    }
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 100) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

// Input formatting
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }
    
    if (e.target.id === 'expiryDate') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }
    
    if (e.target.id === 'cvv') {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
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

// Initialize courts display
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    showCourtPlaceholder();
});

// Export functions for HTML onclick handlers
window.switchAuthTab = switchAuthTab;
window.closeAuthModal = closeAuthModal;
window.closeBookingModal = closeBookingModal;
window.checkAvailability = checkAvailability;
window.selectCourt = selectCourt;
window.selectMembership = selectMembership;
window.registerForEvent = registerForEvent;
window.readFullNews = readFullNews;
window.scrollToSection = scrollToSection;