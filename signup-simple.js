// Simple Backend Registration
const BACKEND_URL = 'http://localhost:5000/api';

// DOM Elements
const signupForm = document.getElementById('signup-form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const signupBtn = document.getElementById('signup-btn');
const togglePasswordBtn = document.getElementById('toggle-password');
const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
const termsCheckbox = document.getElementById('terms');
const alertContainer = document.getElementById('alert-container');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');

// Password visibility toggles
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

toggleConfirmPasswordBtn.addEventListener('click', () => {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    toggleConfirmPasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Show alert
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

// Loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<span class="loading-spinner"></span> Creating account...';
    } else {
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
}

// Update password strength indicator
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    
    if (password.length === 0) {
        strengthText.textContent = '';
        strengthFill.style.width = '0%';
    } else if (strength <= 2) {
        strengthFill.classList.add('strength-weak');
        strengthText.textContent = '❌ Weak password';
        strengthText.style.color = '#f44336';
    } else if (strength <= 3) {
        strengthFill.classList.add('strength-medium');
        strengthText.textContent = '⚠️ Medium password';
        strengthText.style.color = '#ff9800';
    } else {
        strengthFill.classList.add('strength-strong');
        strengthText.textContent = '✅ Strong password';
        strengthText.style.color = '#4caf50';
    }
});

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Store user session
function storeUserSession(authData) {
    localStorage.setItem('user', JSON.stringify({
        id: authData.userId,
        email: authData.email,
        name: authData.fullName || authData.email.split('@')[0]
    }));
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('authenticated', 'true');
}

// Form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (!termsCheckbox.checked) {
        showAlert('Please agree to the Terms of Service', 'error');
        return;
    }
    
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength <= 2) {
        const confirmWeak = confirm('Your password is weak. Continue anyway?');
        if (!confirmWeak) return;
    }
    
    setLoadingState(true);
    
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName: fullname })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        showAlert('Account created successfully! Redirecting...', 'success');
        storeUserSession(data);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        showAlert(error.message || 'Failed to create account. Please try again.', 'error');
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    fullnameInput.focus();
});

// Real-time password match validation
confirmPasswordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
            confirmPasswordInput.style.borderColor = '#4caf50';
        } else {
            confirmPasswordInput.style.borderColor = '#f44336';
        }
    } else {
        confirmPasswordInput.style.borderColor = '#e0e0e0';
    }
});
