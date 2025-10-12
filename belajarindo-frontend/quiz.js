// Tambahkan di bagian atas file quiz.js atau di file terpisah yang di-load sebelumnya
window.quizData = window.quizData || [];
window.quizScore = window.quizScore || 0;
window.quizStartTime = window.quizStartTime || Date.now();

// Fungsi bantuan jika tidak ada
if (typeof calculateScore !== 'function') {
  window.calculateScore = function() {
    return window.quizScore || 0;
  };
}

if (typeof getTimeSpent !== 'function') {
  window.getTimeSpent = function() {
    return window.quizStartTime ? Math.round((Date.now() - window.quizStartTime) / 1000) : 0;
  };
}
// quiz.js — handles visible submit and programmatic submit integration
(function(){
  // Initialize global variables if they don't exist
  window.quizData = window.quizData || [];
  window.quizScore = window.quizScore || 0;
  window.quizStartTime = window.quizStartTime || Date.now();

  // Helper to safely parse user from localStorage
  function getUser() {
    try { 
      return JSON.parse(localStorage.getItem('user')); 
    } catch(e) { 
      return null; 
    }
  }

  // Fallback functions if not defined
  if (typeof calculateScore !== 'function') {
    window.calculateScore = function() {
      const totalQ = Array.isArray(window.quizData) ? window.quizData.length : 0;
      const correct = typeof window.quizScore === 'number' ? window.quizScore : 0;
      return totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
    };
  }

  if (typeof getTimeSpent !== 'function') {
    window.getTimeSpent = function() {
      return window.quizStartTime ? Math.round((Date.now() - window.quizStartTime) / 1000) : 0;
    };
  }

  async function submitViaFetch(payload) {
    const token = localStorage.getItem('token');
    // Determine API URL - try multiple possibilities
    let apiUrl = 'https://belajar-indo.vercel.app';
    if (typeof API_URL !== 'undefined') apiUrl = API_URL;
    else if (window.API_URL) apiUrl = window.API_URL;
    
    try {
      // Debug: print payload and token presence so frontend console shows exactly what's sent
      try {
        console.log('quiz.js: submitting to', `${apiUrl}/api/quiz/submit`, 'payload:', payload, 'tokenPresent:', !!token);
      } catch (e) { /* ignore logging errors */ }
      const res = await fetch(`${apiUrl}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json().catch(() => ({ error: 'Failed to parse response' }));
      console.log('Quiz Submission Response:', { status: res.status, body: data });
      
      return { 
        ok: res.ok, 
        status: res.status, 
        body: data 
      };
    } catch (err) {
      console.error('Network error submitting quiz:', err);
      return { 
        ok: false, 
        error: err.message || 'Network error' 
      };
    }
  }

  // Save quiz progress to server
  async function saveProgress(opts = {}) {
    try {
      const totalQuestions = Array.isArray(window.quizData) ? window.quizData.length : 0;
      const correctAnswers = typeof window.quizScore === 'number' ? window.quizScore : 0;
      const progress = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      const currentQuestion = typeof window.currentQuestion === 'number' ? window.currentQuestion : (opts.currentQuestion || 0);
      const quizCategory = opts.quizCategory || 'vocab';
      const state = opts.state !== undefined ? opts.state : (window.__quiz_state || null);

      const payload = { quizCategory, progress, currentQuestion, state, updatedAt: new Date().toISOString() };
      const key = `quiz_progress:${quizCategory}`;
      try { localStorage.setItem(key, JSON.stringify(payload)); } catch (e) { console.warn('Failed to write progress to localStorage', e); }
      console.log('Saved quiz progress to localStorage', key, payload);
      return { ok: true, body: payload };
    } catch (err) {
      console.error('saveProgress error', err);
      return { ok: false, error: err && err.message ? err.message : String(err) };
    }
  }

  // Load last saved quiz progress for this user and category
  async function loadProgress(opts = {}) {
    try {
      const quizCategory = opts.quizCategory || 'vocab';
      const key = `quiz_progress:${quizCategory}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const recent = JSON.parse(raw);
      if (!recent) return null;
      if (typeof recent.progress === 'number') {
        const total = Array.isArray(window.quizData) ? window.quizData.length : 0;
        window.quizScore = total > 0 ? Math.round((recent.progress / 100) * total) : window.quizScore || 0;
      }
      if (typeof recent.currentQuestion === 'number') {
        window.currentQuestion = recent.currentQuestion;
      }
      if (recent.state && typeof recent.state === 'object') {
        try { window.__quiz_state = recent.state; } catch(e) { console.warn('failed to restore quiz state', e); }
      }
      console.log('Loaded quiz progress from localStorage', key, recent);
      return recent;
    } catch (err) {
      console.error('loadProgress error', err);
      return null;
    }
  }

  function computePayload() {
    const score = calculateScore();
    const totalQuestions = Array.isArray(window.quizData) ? window.quizData.length : 0;
    const correctAnswers = typeof window.quizScore === 'number' ? window.quizScore : 0;
    const timeSpent = getTimeSpent();
    // include userId from localStorage.user when available so backend can associate the result
    const user = getUser();
    let userId = null;
    if (user) {
      userId = user.id ?? user.userId ?? user.user_id ?? user.uid ?? null;
      if (typeof userId === 'string' && /^\d+$/.test(userId)) {
        userId = parseInt(userId, 10);
      }
    }

    const payload = {
      quizType: 'vocab',
      score,
      totalQuestions,
      correctAnswers,
      timeSpent
    };

    if (userId != null) {
      payload.userId = userId;
      return payload;
    }

    // Fallback: try to extract user id from JWT token payload (no signature check)
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(atob(b64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const claims = JSON.parse(json);
          let idFromToken = claims.userId ?? claims.user_id ?? claims.uid ?? claims.sub ?? claims.id ?? null;
          if (typeof idFromToken === 'string' && /^\d+$/.test(idFromToken)) idFromToken = parseInt(idFromToken, 10);
          if (idFromToken != null) {
            payload.userId = idFromToken;
            return payload;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse token for user id fallback', err);
    }

    return payload;
  }

  async function onVisibleSubmitClick(e) {
    const token = localStorage.getItem('token');
    const user = getUser();
    let currentUser = user;

    // If user object missing but token exists, try to extract minimal user info from the JWT
    if (!currentUser && token) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(atob(b64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const claims = JSON.parse(json);
          const idFromToken = claims.userId ?? claims.user_id ?? claims.uid ?? claims.sub ?? claims.id ?? null;
          if (idFromToken != null) {
            currentUser = { id: idFromToken, name: claims.name || claims.email || null };
            try { localStorage.setItem('user', JSON.stringify(currentUser)); } catch(e) { /* ignore */ }
          }
        }
      } catch (err) {
        console.warn('Failed to parse token for user fallback', err);
      }
    }

    // Only block if neither token nor user info exist
    if (!token && !currentUser) {
      console.warn('No user token or user info found - login required');
      try {
        showModal('Login required', 'You must be logged in to submit the quiz.', 'warning');
      } catch (err) {
        alert('You must be logged in to submit the quiz.');
      }
      return;
    }

  const payload = computePayload();
    console.log('Submitting quiz result...', payload);

    // Disable button to avoid double submits
    const button = e.currentTarget;
    button.disabled = true;
    button.textContent = 'Submitting...';

  // Attempt to save final progress before submit (best-effort)
  try { await saveProgress({ quizCategory: payload.quizType, currentQuestion: window.currentQuestion || 0 }); } catch(e){ console.warn('saveProgress failed before submit', e); }

  const res = await submitViaFetch(payload);
    
    if (res.ok) {
      console.log('Quiz submitted successfully!');
      try { 
        showModal('Success', 'Quiz submitted successfully!', 'success'); 
      } catch(e) { 
        alert('Quiz submitted successfully!'); 
      }
      // On success, navigate to profile where history is fetched from DB
      try { window.location.href = 'profile.html'; } catch(e) { console.warn('Redirect to profile failed', e); }
    } else {
      console.error('Submission failed:', res);
      // Re-enable button on error
      button.disabled = false;
      button.textContent = 'Submit Quiz';
      
      try { 
        showModal('Error', `Failed to submit quiz: ${res.body?.error || res.error || 'Unknown error'}`, 'danger'); 
      } catch(e) { 
        alert(`Failed to submit quiz: ${res.body?.error || res.error || 'Unknown error'}`); 
      }
    }
  }

  // Attach handler
  document.addEventListener('DOMContentLoaded', function(){
    const submitButton = document.getElementById('submitQuiz');
    if (submitButton) {
      submitButton.addEventListener('click', onVisibleSubmitClick);
      console.log('quiz.js: attached submit handler to #submitQuiz');
    } else {
      console.warn('quiz.js: #submitQuiz button not found on page');
    }
  });

  // Expose progress helpers for other scripts
  window.saveQuizProgress = saveProgress;
  window.loadQuizProgress = loadProgress;

  // Autobackup: if a quiz is active, periodically save progress (best-effort)
  try {
    setInterval(function(){
      if (Array.isArray(window.quizData) && window.quizData.length > 0) {
        saveProgress({ quizCategory: 'vocab', currentQuestion: window.currentQuestion || 0 }).catch(()=>{});
      }
    }, 20000); // every 20s
  } catch(e) { /* ignore */ }
})();