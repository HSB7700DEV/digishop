document.addEventListener('DOMContentLoaded', () => {
    // --- Global State & API ---
    window.cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    window.currentUser = null;

    window.api = {
        async request(endpoint, method = 'GET', data = null) {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            try {
                // FIX: Path is now relative to the root
                const [path, queryString] = endpoint.split('?');
                let finalUrl = `/api/${path}.php`;
                if (queryString) {
                    finalUrl += `?${queryString}`;
                }

                const response = await fetch(finalUrl, options);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error(`API Error (${endpoint}):`, error);
                return { success: false, message: 'خطای ارتباط با سرور.' };
            }
        }
    };

    // --- Core Functions ---
    window.saveCart = function() {
        localStorage.setItem('shoppingCart', JSON.stringify(window.cart));
        updateCartUI();
    }

    async function checkLoginStatus() {
        const result = await api.request('check_session');
        window.currentUser = (result.success && result.loggedIn) ? result.user : null;
        updateHeader();
    }

    function updateHeader() {
        const userActionsContainer = document.getElementById('user-actions');
        if (!userActionsContainer) return;

        if (window.currentUser) {
            // FIX: Panel link is now relative to the root
            const panelLink = window.currentUser.role === 'admin' 
                ? '/admin/index.html' 
                : '/user/panel.html';

            userActionsContainer.innerHTML = 
                `<a href="${panelLink}" class="user-panel-btn">سلام، ${window.currentUser.name}</a><button id="logout-btn" class="logout-btn">خروج</button>`;
        } else {
            // FIX: Login link is now relative to the root
            userActionsContainer.innerHTML = 
                `<a href="/user/login.html" class="login-btn">ورود / ثبت‌نام</a>`;
        }
    }

    function updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // --- Global Event Listeners ---
    document.body.addEventListener('click', async (e) => {
        if (e.target.id === 'logout-btn') {
            const result = await api.request('logout');
            alert(result.message);
            // FIX: Logout redirect is now relative to the root
            window.location.href = '/index.html';
        }
    });

    // --- Initial Load ---
    async function initialize() {
        await checkLoginStatus();
        updateCartUI();
    }

    initialize();
});