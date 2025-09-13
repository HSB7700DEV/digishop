document.addEventListener('DOMContentLoaded', () => {
    // --- Global State ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let currentUser = null;

    // --- Element Selectors ---
    const userActionsContainer = document.getElementById('user-actions');
    const authForm = document.querySelector('.auth-form form');
    const userOrdersContainer = document.getElementById('user-orders-container');
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');

    // --- Helper function to convert Persian/Arabic numerals to English/Western numerals ---
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const englishNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    function toEnglishNumbers(str) {
        if (typeof str !== 'string') return str;
        for (let i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], englishNumbers[i]);
        }
        return str;
    }

    // --- API Communication ---
    const api = {
        async request(endpoint, method = 'GET', data = null) {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            try {
                const response = await fetch(`/api/${endpoint}.php`, options);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error(`API Error (${endpoint}):`, error);
                return { success: false, message: 'خطای ارتباط با سرور.' };
            }
        }
    };

    // --- Authentication ---
    async function checkLoginStatus() {
        const result = await api.request('check_session');
        currentUser = (result.success && result.loggedIn) ? result.user : null;
        updateHeader();
    }

    function updateHeader() {
        if (!userActionsContainer) return;
        userActionsContainer.innerHTML = currentUser ?
            `<a href="/user/panel.html" class="user-panel-btn">سلام، ${currentUser.name}</a><button id="logout-btn" class="logout-btn">خروج</button>` :
            `<a href="/user/login.html" class="login-btn">ورود / ثبت‌نام</a>`;
    }
    
    // --- Cart & Orders ---
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartUI();
    }

    function addToCart(product, button) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        button.textContent = 'اضافه شد!';
        setTimeout(() => { button.textContent = 'افزودن به سبد'; }, 1500);
        saveCart();
    }

    async function placeOrder() {
        if (!currentUser) {
            alert('برای ثبت سفارش، لطفاً ابتدا وارد شوید.');
            window.location.href = '/user/login.html';
            return;
        }
        if (cart.length === 0) {
            alert('سبد خرید شما خالی است.');
            return;
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50000;
        const result = await api.request('place_order', 'POST', { items: cart, total });
        alert(result.message);
        if (result.success) {
            cart = [];
            saveCart();
            localStorage.setItem('lastOrderId', result.orderId);
            window.location.href = '/checkout-success.html';
        }
    }

    // --- UI Rendering ---
    function renderCartItems() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
            return;
        }
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details"><h4>${item.name}</h4><p>${item.price.toLocaleString('fa-IR')} تومان</p></div>
                <div class="cart-item-quantity"><button class="quantity-btn decrease-btn">-</button><span>${item.quantity}</span><button class="quantity-btn increase-btn">+</button></div>
                <div class="cart-item-total"><p>${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</p></div>
                <div class="cart-item-remove"><button class="remove-btn">&times;</button></div>
            </div>
        `).join('');
    }

    function renderCartSummary() {
        if (!cartSummaryContainer) return;
        if (cart.length === 0) {
            cartSummaryContainer.innerHTML = '';
            return;
        }
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 50000;
        const total = subtotal + shipping;
        cartSummaryContainer.innerHTML = `
            <h3>خلاصه سفارش</h3>
            <div class="summary-row"><span>جمع کل</span><span>${subtotal.toLocaleString('fa-IR')} تومان</span></div>
            <div class="summary-row"><span>هزینه ارسال</span><span>${shipping.toLocaleString('fa-IR')} تومان</span></div>
            <div class="summary-total"><span>مبلغ قابل پرداخت</span><span>${total.toLocaleString('fa-IR')} تومان</span></div>
            <button class="checkout-btn">ادامه فرآیند خرید</button>
        `;
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        renderCartItems();
        renderCartSummary();
    }

    // --- Homepage Interactive Elements ---
    function initializeSlider() {
        const slider = document.querySelector('.slider');
        if (!slider) return;
        const slides = slider.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dots .dot');
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);

        function goToSlide(n) {
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        document.querySelector('.slider-nav.next')?.addEventListener('click', () => {
            nextSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        document.querySelector('.slider-nav.prev')?.addEventListener('click', () => {
            prevSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        dots.forEach(dot => dot.addEventListener('click', (e) => {
            goToSlide(parseInt(e.target.dataset.slide));
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }));
    }

    function initializeCarousel() {
        const carousel = document.getElementById('product-carousel');
        if (!carousel) return;
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        nextBtn.addEventListener('click', () => carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' }));
    }

    // --- Event Handlers ---
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const page = window.location.pathname;
            const endpoint = page.includes('signup.html') ? 'signup' : 'login';
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const result = await api.request(endpoint, 'POST', data);
            alert(result.message);
            if (result.success) {
                window.location.href = page.includes('signup.html') ? 'login.html' : '../index.html';
            }
        });
    }

    document.body.addEventListener('click', async (e) => {
        if (e.target.id === 'logout-btn') {
            const result = await api.request('logout');
            alert(result.message);
            window.location.href = '/index.html';
        }
        if (e.target.classList.contains('checkout-btn')) placeOrder();
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.product-card');
            const priceString = card.querySelector('.price').textContent.replace(' تومان', '').trim();
            const cleanedPrice = parseFloat(toEnglishNumbers(priceString).replace(/,/g, ''));
            
            addToCart({
                id: card.querySelector('h4').textContent,
                name: card.querySelector('h4').textContent,
                price: cleanedPrice,
                image: card.querySelector('img').src
            }, e.target);
        }
    });

    // --- Initial Load ---
    async function initialize() {
        await checkLoginStatus();
        updateCartUI();
        initializeSlider();
        initializeCarousel();
        if (userOrdersContainer) {
            const result = await api.request('get_user_orders');
            if (result.success && result.orders.length > 0) {
                userOrdersContainer.innerHTML = result.orders.map(order => `
                    <div class="user-order-card">
                        <div class="order-header"><h4>شماره سفارش: ${order.id}</h4><span>${new Date(order.order_date).toLocaleDateString('fa-IR')}</span></div>
                        <div class="order-footer"><strong>مبلغ نهایی: ${parseFloat(order.total_amount).toLocaleString('fa-IR')} تومان</strong></div>
                    </div>`).join('');
            } else if (result.success) {
                userOrdersContainer.innerHTML = '<p style="text-align:center;">شما هنوز سفارشی ثبت نکرده‌اید.</p>';
            }
        }
    }

    initialize();
});

