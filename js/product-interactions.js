document.addEventListener('DOMContentLoaded', () => {
    // --- Helper function to convert Persian/Arabic numerals ---
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const englishNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    function toEnglishNumbers(str) {
        if (typeof str !== 'string') return str;
        for (let i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], englishNumbers[i]);
        }
        return str;
    }

    function addToCart(product, button) {
        const existingProduct = window.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            window.cart.push({ ...product, quantity: 1 });
        }
        button.textContent = 'اضافه شد!';
        setTimeout(() => { button.textContent = 'افزودن به سبد'; }, 1500);
        window.saveCart();
    }

    document.body.addEventListener('click', (e) => {
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
});