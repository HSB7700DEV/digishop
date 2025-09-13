document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.querySelector('.auth-form form');

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const page = window.location.pathname;
            const endpoint = page.includes('signup.html') ? 'signup' : 'login';
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const result = await window.api.request(endpoint, 'POST', data);
            
            alert(result.message);
            if (result.success) {
                // FIX: All redirects are now relative to the root
                if (page.includes('login.html') && result.user && result.user.role === 'admin') {
                    window.location.href = '/admin/index.html';
                } else {
                    window.location.href = page.includes('signup.html') ? 'login.html' : '/index.html';
                }
            }
        });
    }
});