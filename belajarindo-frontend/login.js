let slideIndex = 1;
window.API_URL = "http://localhost:3000";

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    document.querySelectorAll('.tab')[0].classList.add('active');
    document.querySelectorAll('.tab')[1].classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.querySelectorAll('.tab')[0].classList.remove('active');
    document.querySelectorAll('.tab')[1].classList.add('active');
}

function currentSlide(n) { showSlide(slideIndex = n); }
function nextSlide() { showSlide(slideIndex += 1); }
function prevSlide() { showSlide(slideIndex -= 1); }

function showSlide(n) {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    if (n > images.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = images.length; }
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    images[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

function showModal(title, message, type = 'success') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    
    const modalIcon = document.querySelector('.modal-icon');
    
    // Change icon and color based on type
    if (type === 'error') {
        modalIcon.textContent = '✗';
        modalIcon.style.background = 'linear-gradient(135deg, #f44336, #e57373)';
    } else if (type === 'warning') {
        modalIcon.textContent = '!';
        modalIcon.style.background = 'linear-gradient(135deg, #ff9800, #ffb74d)';
    } else {
        modalIcon.textContent = '✓';
        modalIcon.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
    }
    
    document.getElementById('customModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
    
    const modalTitle = document.getElementById('modalTitle').textContent;
    
    if (modalTitle === 'Login Berhasil!') {
        // Redirect to main page after successful login
        window.location.href = 'index.html';
    } else if (modalTitle === 'Account Created!') {
        // Switch to Sign In tab after account creation
        showLogin();
        // Clear signup form
        document.getElementById('signupForm').reset();
    }
    // For error/warning modals, just close and stay on current tab
}

// Account management functions
async function saveAccount(name, email, password) {
    const res = await fetch((window.API_URL || '') + '/api/auth/register', {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    });

    if (!res.ok) {
        throw Error("Register Error")
    }

    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const newAccount = { name, email, password };
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

async function validateLogin(email, password) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

    const res = await fetch(`${window.API_URL}/api/auth/login`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!res.ok) {
        throw Error('Could not login user');
    }
    
    const { user, token } = await res.json();

    localStorage.setItem('token', token);

    return user;
}

function checkEmailExists(email) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    return accounts.some(account => account.email === email);
}

function createDefaultAccounts() {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    
    // Only create demo accounts if no accounts exist
    if (accounts.length === 0) {
        const demoAccounts = [
            { name: 'Demo User', email: 'demo@belajarindo.com', password: '123456' },
            { name: 'Test User', email: 'test@gmail.com', password: 'test123' },
            { name: 'Admin', email: 'admin@belajarindo.com', password: 'admin123' }
        ];
        
        localStorage.setItem('accounts', JSON.stringify(demoAccounts));
        console.log('Demo accounts created successfully!');
        console.log('Available demo accounts:');
        demoAccounts.forEach(acc => {
            console.log(`Email: ${acc.email}, Password: ${acc.password}`);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Create default demo accounts if none exist
    createDefaultAccounts();
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    let startX = 0, startY = 0;
    const imageSlider = document.querySelector('.image-slider');
    
    imageSlider.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    imageSlider.addEventListener('touchend', e => {
        if (!startX || !startY) return;
        let endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;
        if (Math.abs(diffX) > Math.abs(startY - e.changedTouches[0].clientY)) {
            if (diffX > 50) nextSlide();
            else if (diffX < -50) prevSlide();
        }
        startX = 0; startY = 0;
    });
    
    imageSlider.addEventListener('click', nextSlide);
    
    // Server readiness: disable login while backend not reachable
    async function checkServerReady() {
        // find a submit button inside login form if present
        const form = document.getElementById('loginForm');
        if (!form) return; // defensive
        const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('loginBtn');
        const serverMessage = document.getElementById('serverMessage');
        try {
            // try a lightweight endpoint; prefer /api/health or /api/auth/me (HEAD)
            const res = await fetch((window.API_URL || '') + '/api/health', { method: 'GET' });
            if (res && res.ok) {
                if (submitBtn) submitBtn.disabled = false;
                if (serverMessage) serverMessage.textContent = '';
                return true;
            }
        } catch (err) {
            // ignore
        }
        // fallback: server not ready
        if (submitBtn) submitBtn.disabled = true;
        if (serverMessage) serverMessage.textContent = 'Server belum aktif. Silakan tunggu atau hubungi administrator.';
        return false;
    }

    // run initial readiness check and re-run periodically
    checkServerReady();
    setInterval(checkServerReady, 5000);

    // Form submission handlers with password-length validation
    const loginFormEl = document.getElementById('loginForm');
    if (loginFormEl) {
        loginFormEl.onsubmit = async function(e) {
            e.preventDefault();
            const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
            const password = document.getElementById('password') ? document.getElementById('password').value : '';

            // Enforce client-side password minimum length
            if (password.length < 6) {
                showModal('Login Gagal!', 'Password harus minimal 6 karakter.', 'error');
                return;
            }

            try {
                // Validate login credentials (local fallback)
                const user = await validateLogin(email, password);
                if (!user) throw Error("No User");

                // store a simple local token for UI (demo behavior)
                localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
                // localStorage.setItem('token', 'local-demo-token');
                showModal('Login Berhasil!', `Selamat datang kembali, ${user.name}!`, 'success');
            } catch(e) {
                showModal('Login Gagal!', 'Email atau password salah. Silakan daftar akun terlebih dahulu.', 'error');
            }
        };
    }
    
    document.getElementById('signupForm').onsubmit = async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Check if email already exists
        if (checkEmailExists(email)) {
            showModal('Pendaftaran Gagal!', 'Email sudah terdaftar. Silakan gunakan email lain atau login.', 'warning');
            return;
        }
        
        // Save new account
        try {
            await saveAccount(name, email, password);
            showModal('Account Created!', `Selamat bergabung, ${name}! Akun berhasil dibuat.`, 'success');
        } catch (e) {
            showModal('Cannot Create Account!', `Pembuatan akun ${name} gagal!`, 'error');
        }
    };
});
