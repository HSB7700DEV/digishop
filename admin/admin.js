document.addEventListener('DOMContentLoaded', () => {
    // Simulate fetching data from a database using localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // --- Dashboard Page ---
    const totalUsersEl = document.getElementById('total-users');
    const totalOrdersEl = document.getElementById('total-orders');
    const totalRevenueEl = document.getElementById('total-revenue');
    const recentOrdersContainer = document.getElementById('recent-orders-container');

    if (totalUsersEl) {
        totalUsersEl.textContent = users.length;
        totalOrdersEl.textContent = orders.length;

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        totalRevenueEl.textContent = totalRevenue.toLocaleString();

        const recentOrders = orders.slice(-5).reverse();
        recentOrdersContainer.innerHTML = createOrdersTable(recentOrders);
    }

    // --- Users Page ---
    const usersTableContainer = document.getElementById('users-table-container');
    if (usersTableContainer) {
        usersTableContainer.innerHTML = createUsersTable(users);
    }

    // --- Orders Page ---
    const ordersTableContainer = document.getElementById('orders-table-container');
    if (ordersTableContainer) {
        ordersTableContainer.innerHTML = createOrdersTable(orders.reverse());
    }

    // --- Helper Functions to create tables ---
    function createUsersTable(usersData) {
        if (usersData.length === 0) return '<p style="text-align: center; padding: 2rem;">کاربری یافت نشد.</p>';
        return `
            <table>
                <thead>
                    <tr>
                        <th>نام</th>
                        <th>ایمیل</th>
                        <th>تاریخ ثبت‌نام</th>
                    </tr>
                </thead>
                <tbody>
                    ${usersData.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.signupDate).toLocaleDateString('fa-IR')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function createOrdersTable(ordersData) {
        if (ordersData.length === 0) return '<p style="text-align: center; padding: 2rem;">سفارشی یافت نشد.</p>';
        return `
            <table>
                <thead>
                    <tr>
                        <th>شماره سفارش</th>
                        <th>مشتری</th>
                        <th>تاریخ</th>
                        <th>مبلغ کل (تومان)</th>
                        <th>تعداد اقلام</th>
                    </tr>
                </thead>
                <tbody>
                    ${ordersData.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.user.name || order.user.email}</td>
                            <td>${new Date(order.date).toLocaleDateString('fa-IR')}</td>
                            <td>${order.total.toLocaleString()}</td>
                            <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
});

