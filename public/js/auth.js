const API_AUTH_URL = '/api/auth';
const toastContainer = document.getElementById('toast-container');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Handle Registration
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_AUTH_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Registration failed');

            // Store user info and token
            localStorage.setItem('user', JSON.stringify({ 
                name: data.name, 
                email: data.email,
                token: data.token 
            }));
            
            showToast('Success', 'Account created! Redirecting...', false);
            setTimeout(() => window.location.href = '/', 1500);
        } catch (error) {
            showToast('Error', error.message, true);
        }
    });
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_AUTH_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            // Store user info and token
            localStorage.setItem('user', JSON.stringify({ 
                name: data.name, 
                email: data.email,
                token: data.token 
            }));
            
            showToast('Success', 'Login successful! Redirecting...', false);
            setTimeout(() => window.location.href = '/', 1500);
        } catch (error) {
            showToast('Error', error.message, true);
        }
    });
}

// Toast Notification System
function showToast(title, message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
        <div style="font-weight: 700; font-size: 0.9rem;">${title}</div>
        <div style="font-size: 0.8rem; opacity: 0.8;">${message}</div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
