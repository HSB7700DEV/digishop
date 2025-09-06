document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const cartCountElement = document.getElementById('cart-count');

    // --- Carousel Logic ---
    const carousel = document.getElementById('product-carousel');
    if (carousel) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        const smoothScroll = (element, distance) => {
            element.scrollBy({
                left: distance,
                behavior: 'smooth'
            });
        };

        nextBtn.addEventListener('click', () => {
            const scrollAmount = carousel.clientWidth * 0.8;
            smoothScroll(carousel, -scrollAmount); // Negative for RTL "next"
        });

        prevBtn.addEventListener('click', () => {
            const scrollAmount = carousel.clientWidth * 0.8;
            smoothScroll(carousel, scrollAmount); // Positive for RTL "previous"
        });
    }

    // --- Core Cart Logic ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function addToCart(product, button) {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        saveCart();

        // Visual feedback on the button
        const originalText = button.textContent;
        button.textContent = 'اضافه شد!';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    function updateQuantity(productId, newQuantity) {
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex > -1) {
            if (newQuantity > 0) {
                cart[productIndex].quantity = newQuantity;
            } else {
                cart.splice(productIndex, 1); // Remove if quantity is 0 or less
            }
        }
        saveCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    }

    // --- UI Update Functions ---
    function updateCartDisplay() {
        renderCartItems();
        renderCartSummary();
        updateCartIconCount();
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.style.gridColumn = "1 / -1";
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
            if(cartSummaryContainer) cartSummaryContainer.style.display = 'none';
            return;
        }
        
        if(cartSummaryContainer) cartSummaryContainer.style.display = 'block';
        cartItemsContainer.style.gridColumn = "auto";

        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = (parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString();
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price} تومان</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-btn">+</button>
                    </div>
                    <div class="cart-item-total">
                        <p>${itemTotal} تومان</p>
                    </div>
                    <div class="cart-item-remove">
                        <button class="remove-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderCartSummary() {
        if (!cartSummaryContainer) return;

        if (cart.length === 0) {
            cartSummaryContainer.innerHTML = '';
            return;
        }

        const subtotal = cart.reduce((total, item) => {
            return total + (parseFloat(item.price.replace(/,/g, '')) * item.quantity);
        }, 0);

        const shipping = 50000;
        const total = subtotal + shipping;

        cartSummaryContainer.innerHTML = `
            <button class="checkout-btn">ادامه فرآیند خرید</button>
        `;
    }

    function updateCartIconCount() {
        if (!cartCountElement) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }

    // --- Event Listeners ---
    document.body.addEventListener('click', event => {
        const button = event.target;

        if (button.classList.contains('add-to-cart-btn')) {
            const card = button.closest('.product-card');
            const product = {
                id: card.querySelector('h4').textContent,
                name: card.querySelector('h4').textContent,
                price: card.querySelector('.price').textContent.replace(' تومان', ''),
                image: card.querySelector('img').src
            };
            addToCart(product, button);
        }

        if (cartItemsContainer) {
            const cartItem = button.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.id;
            const product = cart.find(item => item.id === productId);

            if (button.classList.contains('increase-btn')) {
                updateQuantity(productId, product.quantity + 1);
            }
            if (button.classList.contains('decrease-btn')) {
                updateQuantity(productId, product.quantity - 1);
            }
            if (button.closest('.remove-btn')) {
                removeFromCart(productId);
            }
        }
    });

    // Initial load
    updateCartDisplay();
});

