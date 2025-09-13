document.addEventListener('DOMContentLoaded', () => {
    const orderIdElement = document.getElementById('order-id');
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (orderIdElement && lastOrderId) {
        orderIdElement.textContent = lastOrderId;
        localStorage.removeItem('lastOrderId'); // Clean up after displaying
    }
});