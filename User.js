let currentUser = JSON.parse(localStorage.getItem('teambangan_user')) || null;
let posts = JSON.parse(localStorage.getItem('teambangan_posts')) || [];
let currentFilter = 'all';


const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const loginLink = document.getElementById('loginLink');
const logoutLink = document.getElementById('logoutLink');
const postsContainer = document.getElementById('postsContainer');
const postModal = document.getElementById('postModal');
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');


window.addEventListener('DOMContentLoaded', () => {
    updateNavLinks();
    renderPosts();
    
 
    if (currentUser) {
        loginSection.style.display = 'none';
        signupSection.style.display = 'none';
    }
});


mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}


function updateNavLinks() {
    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        loginSection.style.display = 'none';
        signupSection.style.display = 'none';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}


loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToSection('loginSection');
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
});


function showSignupSection() {
    signupSection.style.display = 'block';
    loginSection.style.display = 'none';
    scrollToSection('signupSection');
}


function showLoginSection() {
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
    scrollToSection('loginSection');
}


document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (!email.includes('@gmail.com') && !email.includes('@googlemail.com')) {
        alert('Please use a Gmail address for login');
        return;
    }

    currentUser = {
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    };

    localStorage.setItem('teambangan_user', JSON.stringify(currentUser));

    updateNavLinks();
    loginSection.style.display = 'none';
    e.target.reset();
    
    alert(`Welcome back, ${currentUser.name}!`);
    scrollToSection('Cboard');
});


document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (!email.includes('@gmail.com') && !email.includes('@googlemail.com')) {
        alert('Please use a Gmail address for better community interaction');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    currentUser = {
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    };

   
    localStorage.setItem('teambangan_user', JSON.stringify(currentUser));

    updateNavLinks();
    signupSection.style.display = 'none';
    e.target.reset();
    
    alert(`Welcome to Teambangan, ${name}!`);
    scrollToSection('Cboard');
});


logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('teambangan_user');
    updateNavLinks();
    alert('Logged out successfully');
    scrollToSection('home');
});


document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('contactFirstName').value.trim();
    const lastName = document.getElementById('contactLastName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    const newsletter = document.getElementById('contactNewsletter').checked;

    if (!firstName || !lastName || !email || !subject || !message) {
        alert('Please fill in all required fields');
        return;
    }

   
    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        subject: subject,
        message: message,
        newsletter: newsletter,
        timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('teambangan_contact_submissions')) || [];
    submissions.push(formData);
    localStorage.setItem('teambangan_contact_submissions', JSON.stringify(submissions));

    alert(`Thank you ${firstName} for your message! We'll get back to you at ${email} soon.`);
    
   
    document.getElementById('contactForm').reset();
    document.getElementById('contactNewsletter').checked = true;
    
    scrollToSection('home');
});

document.getElementById('addPostBtn').addEventListener('click', () => {
    if (!currentUser) {
        scrollToSection('loginSection');
        loginSection.style.display = 'block';
        alert('Please login to create a post');
        return;
    }
    
   
    document.getElementById('postEmail').value = currentUser.email;
    postModal.classList.add('active');
});


document.querySelector('.close-modal').addEventListener('click', () => {
    postModal.classList.remove('active');
    document.getElementById('postForm').reset();
});

// Post Form Submission
document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to post');
        scrollToSection('loginSection');
        return;
    }

    const title = document.getElementById('postTitle').value.trim();
    const type = document.getElementById('postType').value;
    const email = document.getElementById('postEmail').value.trim();
    const location = document.getElementById('postLocation').value.trim();
    const description = document.getElementById('postDescription').value.trim();

    if (!title || !email || !description) {
        alert('Please fill in all required fields');
        return;
    }

    if (!email.includes('@gmail.com') && !email.includes('@googlemail.com')) {
        alert('Please use a Gmail address for better communication');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        description: description,
        type: type,
        email: email,
        location: location,
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    posts.unshift(newPost);
    
   
    localStorage.setItem('teambangan_posts', JSON.stringify(posts));
    
    renderPosts();
    postModal.classList.remove('active');
    document.getElementById('postForm').reset();
    
    alert('Your post has been added to the community board!');
});


document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderPosts();
    });
});


function renderPosts() {
    postsContainer.innerHTML = '';
    
    const filteredPosts = currentFilter === 'all' 
        ? posts 
        : posts.filter(post => post.type === currentFilter);
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No posts yet</h3>
                <p>Be the first to post in the community!</p>
            </div>
        `;
        return;
    }
    
    filteredPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = `
            <div class="post-header">
                <div class="post-title">${post.title}</div>
                <span class="post-type ${post.type}">
                    ${post.type === 'help' ? 'Needs Help' : 'Offering Help'}
                </span>
            </div>
            <p>${post.description}</p>
            
            ${post.location ? `
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${post.location}</span>
                </div>
            ` : ''}
            
            <div class="post-meta">
                <div class="avatar">
                    <img src="${post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}" alt="${post.author}">
                </div>
                <span>${post.author}</span>
                <span>•</span>
                <span>${post.date}</span>
                
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(post.email)}&su=${encodeURIComponent('Teambangan: ' + post.title)}&body=${encodeURIComponent('Hi ' + post.author + ',\n\nI saw your post on Teambangan and would like to ' + (post.type === 'help' ? 'help you!' : 'take you up on your offer!') + '\n\nBest regards,')}" 
                   target="_blank"
                   class="btn" style="margin-left: auto; padding: 8px 16px; font-size: 0.9rem;">
                    <i class="fas fa-envelope"></i> Contact via Gmail
                </a>
            </div>
        `;
        postsContainer.appendChild(postEl);
    });
}


postModal.addEventListener('click', (e) => {
    if (e.target === postModal) {
        postModal.classList.remove('active');
        document.getElementById('postForm').reset();
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && postModal.classList.contains('active')) {
        postModal.classList.remove('active');
        document.getElementById('postForm').reset();
    }
});
