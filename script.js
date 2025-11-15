document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const toastContainer = document.getElementById('toast-container');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Switch between login and register forms
    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });

    function showLoginForm() {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        hideMessages();
    }

    function showRegisterForm() {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        hideMessages();
    }

    function hideMessages() {
        loginMessage.classList.remove('show', 'success', 'error');
        registerMessage.classList.remove('show', 'success', 'error');
    }

    function showMessage(messageElement, message, type) {
        messageElement.textContent = message;
        messageElement.classList.remove('success', 'error');
        messageElement.classList.add(type, 'show');
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 5000);
    }

    // Toast notification system
    function showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            ${message}
            <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove after duration
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }

    function removeToast(toast) {
        if (toast && toast.parentElement) {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }
    }

    // Make removeToast globally accessible
    window.removeToast = removeToast;

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    function validatePassword(password) {
        return password.length >= 6;
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Validation
        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!password) {
            showToast('Please enter your password', 'error');
            return;
        }

        // Simulate login process (in real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            showToast(`Welcome back, ${user.username}!`, 'success');
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Clear form
            loginForm.reset();
            
            // Redirect to dashboard after 2 seconds (in real app)
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
            }, 2000);
        } else {
            showToast('Invalid email or password', 'error');
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Validation
        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!username) {
            showToast('Please enter a username', 'error');
            return;
        }

        if (username.length < 3) {
            showToast('Username must be at least 3 characters long', 'warning');
            return;
        }

        if (!password) {
            showToast('Please enter a password', 'error');
            return;
        }

        if (!validatePassword(password)) {
            showToast('Password must be at least 6 characters long', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email || u.username === username);

        if (existingUser) {
            if (existingUser.email === email) {
                showToast('An account with this email already exists', 'warning');
            } else {
                showToast('This username is already taken', 'warning');
            }
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            email: email,
            username: username,
            password: password, // In real app, this should be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showToast('Registration successful! You can now login.', 'success');
        
        // Clear form
        registerForm.reset();
        
        // Switch to login form after 2 seconds
        setTimeout(() => {
            showLoginForm();
        }, 2000);
    });

    // Add input validation feedback
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showToast('Please enter a valid email address', 'warning', 3000);
            }
        });
    });

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                showToast('Password must be at least 6 characters long', 'warning', 3000);
            }
        });
    });

    const usernameInput = document.getElementById('register-username');
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 3) {
                showToast('Username must be at least 3 characters long', 'warning', 3000);
            }
        });
    }
});
