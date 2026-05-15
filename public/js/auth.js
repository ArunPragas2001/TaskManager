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

            localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
            
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

            localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
            
            showToast('Success', 'Login successful! Redirecting...', false);
            setTimeout(() => window.location.href = '/', 1500);
        } catch (error) {
            showToast('Error', error.message, true);
        }
    });
}

// Toast Notification System (copied from app.js for consistency)
function showToast(title, message, isError = false) {
    const toast = document.createElement('div');
    let toastTypeClass = isError ? 'toast-error' : 'toast-success';
    let iconSvg = isError 
        ? '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        : '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    
    toast.className = `toast ${toastTypeClass}`;
    toast.innerHTML = `
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="toast-header">${iconSvg} ${title}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
