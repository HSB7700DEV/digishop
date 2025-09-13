document.addEventListener('DOMContentLoaded', () => {
    // This API object is specific to the admin panel
    const api = {
        async request(endpoint) {
            try {
                const response = await fetch(`/api/${endpoint}.php`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`API Error (${endpoint}):`, error);
                return { success: false, message: 'خطای ارتباط با سرور.' };
            }
        }
    };

    // --- Page Initializers ---
    // Check which page we are on and load the appropriate data
    if (document.getElementById('total-users')) {
        loadDashboardData();
    }
    if (document.getElementById('users-table-container')) {
        loadUsersData();
    }
    if (document.getElementById('orders-table-container')) {
        loadOrdersData();
    }

    // --- Data Loading Functions ---
    async function loadDashboardData() {
        const statsResult = await api.request('admin_get_dashboard_stats');
        if (statsResult.success) {
            document.getElementById('total-users').textContent = statsResult.stats.total_users;
            document.getElementById('total-orders').textContent = statsResult.stats.total_orders;
            document.getElementById('total-revenue').textContent = parseFloat(statsResult.stats.total_revenue).toLocaleString('fa-IR');
        }

        // Also load recent orders for the dashboard
        const recentOrdersContainer = document.getElementById('recent-orders-container');
        const ordersResult = await api.request('admin_get_orders');
        if (ordersResult.success) {
            const recentOrders = ordersResult.orders.slice(0, 5); // Get the first 5 recent orders
            recentOrdersContainer.innerHTML = createOrdersTable(recentOrders);
        }
    }

    async function loadUsersData() {
        const container = document.getElementById('users-table-container');
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">در حال بارگذاری کاربران...</p>';
        const result = await api.request('admin_get_users');

        if (result.success) {
            container.innerHTML = createUsersTable(result.users);
        } else {
            container.innerHTML = `<p style="text-align: center; padding: 2rem;">خطا در بارگذاری کاربران.</p>`;
        }
    }

    async function loadOrdersData() {
        const container = document.getElementById('orders-table-container');
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">در حال بارگذاری سفارشات...</p>';
        const result = await api.request('admin_get_orders');

        if (result.success) {
            container.innerHTML = createOrdersTable(result.orders);
        } else {
            container.innerHTML = `<p style="text-align: center; padding: 2rem;">خطا در بارگذاری سفارشات.</p>`;
        }
    }

    // --- HTML Table Generators ---
    function createUsersTable(usersData) {
        if (usersData.length === 0) return '<p style="text-align: center; padding: 2rem;">هیچ کاربری یافت نشد.</p>';
        return `
            <table>
                <thead>
                    <tr><th>نام</th><th>ایمیل</th><th>تاریخ ثبت‌نام</th></tr>
                </thead>
                <tbody>
                    ${usersData.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.signup_date).toLocaleDateString('fa-IR')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function createOrdersTable(ordersData) {
        if (ordersData.length === 0) return '<p style="text-align: center; padding: 2rem;">هیچ سفارشی یافت نشد.</p>';
        return `
            <table>
                <thead>
                    <tr><th>شماره سفارش</th><th>مشتری</th><th>تاریخ سفارش</th><th>مبلغ کل (تومان)</th></tr>
                </thead>
                <tbody>
                    ${ordersData.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.customer_name}</td>
                            <td>${new Date(order.order_date).toLocaleDateString('fa-IR')}</td>
                            <td>${parseFloat(order.total_amount).toLocaleString('fa-IR')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
});