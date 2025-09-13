document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');

    function renderCartPage() {
        if (!cartItemsContainer || !cartSummaryContainer) return;
        
        if (window.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
            cartSummaryContainer.innerHTML = '';
            return;
        }
        cartItemsContainer.innerHTML = window.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details"><h4>${item.name}</h4><p>${item.price.toLocaleString('fa-IR')} تومان</p></div>
                <div class="cart-item-quantity"><button class="quantity-btn decrease-btn">-</button><span>${item.quantity}</span><button class="quantity-btn increase-btn">+</button></div>
                <div class="cart-item-total"><p>${(item.price * item.quantity).toLocaleString('fa-IR')} تومان</p></div>
                <div class="cart-item-remove"><button class="remove-btn">&times;</button></div>
            </div>
        `).join('');

        const subtotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    async function placeOrder() {
        if (!window.currentUser) {
            alert('برای ثبت سفارش، لطفاً ابتدا وارد شوید.');
            // FIX: Redirect is now relative to the root
            window.location.href = '/user/login.html';
            return;
        }
        if (window.cart.length === 0) {
            alert('سبد خرید شما خالی است.');
            return;
        }
        const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50000;
        const result = await window.api.request('place_order', 'POST', { items: window.cart, total });
        
        alert(result.message);
        if (result.success) {
            window.cart = [];
            window.saveCart();
            localStorage.setItem('lastOrderId', result.orderId);
            // FIX: Redirect is now relative to the root
            window.location.href = '/checkout-success.html';
        }
    }
    
    renderCartPage();

    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (e) => {
            const target = e.target;
            const itemElement = target.closest('.cart-item');
            if (!itemElement) return;

            const itemId = itemElement.dataset.id;
            const cartItem = window.cart.find(item => item.id === itemId);

            if (target.classList.contains('increase-btn')) {
                cartItem.quantity++;
            } else if (target.classList.contains('decrease-btn')) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                } else {
                    window.cart = window.cart.filter(item => item.id !== itemId);
                }
            } else if (target.classList.contains('remove-btn')) {
                window.cart = window.cart.filter(item => item.id !== itemId);
            }
            
            window.saveCart();
            renderCartPage();
        });
        
        cartContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkout-btn')) {
                placeOrder();
            }
        });
    }
});