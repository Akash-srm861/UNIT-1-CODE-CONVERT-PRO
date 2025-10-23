// Simple Backend Authentication
const BACKEND_URL = 'http://localhost:5000/api';

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const togglePasswordBtn = document.getElementById('toggle-password');
const rememberMeCheckbox = document.getElementById('remember-me');
const alertContainer = document.getElementById('alert-container');

// Password visibility toggle
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} show`;
    alertDiv.textContent = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Show loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading-spinner"></span> Signing in...';
    } else {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
}

// Store user session
function storeUserSession(authData, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify({
        id: authData.userId,
        email: authData.email,
        name: authData.fullName || authData.email.split('@')[0]
    }));
    storage.setItem('authToken', authData.token);
    storage.setItem('authenticated', 'true');
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    setLoadingState(true);
    
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        showAlert('Login successful! Redirecting...', 'success');
        storeUserSession(data, rememberMe);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
});

// Check if already logged in
async function checkAuthStatus() {
    const authenticated = localStorage.getItem('authenticated') || sessionStorage.getItem('authenticated');
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (authenticated && token) {
        showAlert('You are already logged in. Redirecting...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authenticated');
    window.location.href = 'login.html';
}

window.logout = logout;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    emailInput.focus();
    
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

// Save email when remember me is checked
rememberMeCheckbox.addEventListener('change', () => {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});
