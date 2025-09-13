document.addEventListener('DOMContentLoaded', async () => {
    const userOrdersContainer = document.getElementById('user-orders-container');

    if (userOrdersContainer) {
        const result = await window.api.request('get_user_orders');
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
});