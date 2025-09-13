document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.querySelector('.product-grid');
    const productCarousel = document.getElementById('product-carousel');

    // A reusable function to create a product card's HTML
    function createProductCard(product) {
        const price = parseFloat(product.price).toLocaleString('fa-IR');
        return `
            <div class="product-card">
                <img src="${product.image_url}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="price-action">
                    <span class="price">${price} تومان</span>
                    <button class="add-to-cart-btn">افزودن به سبد</button>
                </div>
            </div>
        `;
    }

    // Function to fetch and display products
    async function loadProducts() {
        // If we are on the homepage, fetch only featured products
        if (productCarousel) {
            const result = await window.api.request('get_products?featured=true');
            if (result.success) {
                productCarousel.innerHTML = result.products.map(createProductCard).join('');
            }
        }

        // If we are on the products page, fetch all products
        if (productGrid) {
            const result = await window.api.request('get_products');
            if (result.success) {
                productGrid.innerHTML = result.products.map(createProductCard).join('');
            }
        }
    }

    loadProducts();
});