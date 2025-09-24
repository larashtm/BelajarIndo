let slideIndex = 1;

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
function saveAccount(name, email, password) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const newAccount = { name, email, password };
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

function validateLogin(email, password) {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    return accounts.find(account => account.email === email && account.password === password);
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
    
    // Form submission handlers
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate login credentials
        const user = validateLogin(email, password);
        
        if (user) {
            showModal('Login Berhasil!', `Selamat datang kembali, ${user.name}!`, 'success');
        } else {
            showModal('Login Gagal!', 'Email atau password salah. Silakan daftar akun terlebih dahulu.', 'error');
        }
    };
    
    document.getElementById('signupForm').onsubmit = function(e) {
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
        saveAccount(name, email, password);
        showModal('Account Created!', `Selamat bergabung, ${name}! Akun berhasil dibuat.`, 'success');
    };
});
