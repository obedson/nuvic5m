console.log('script.js loaded');
/* 
========================================
SCRIPT.JS - NUVIC5M Tech Website
========================================
This file contains the JavaScript for the website, including:
- Supabase integration for fetching and adding courses.
- User Authentication (Sign Up, Login, Password Reset).
- Mobile hamburger menu functionality.
- Hero slider for the homepage.
- Admin form for adding video courses.
- Displaying video courses on the courses page.
========================================
*/

/* 
----------------------------------------
TABLE OF CONTENTS
----------------------------------------
1. Supabase Configuration
2. Helper Functions
3. Page-Specific Logic
    - Homepage Logic
    - Admin Page Logic
    - Courses Page Logic
    - Register Page Logic
    - Login Page Logic
    - Forgot Password Page Logic
    - Update Password Page Logic
4. Initialization
----------------------------------------
*/

// 1. Supabase Configuration
// ----------------------------------------
const SUPABASE_URL = 'https://pfxgyuamkddxceprcmpe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeGd5dWFta2RkeGNlcHJjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjU5MTMsImV4cCI6MjA2OTUwMTkxM30.Iu6S7y7p-N7be90kGcxQ1zTKhxbaTqUrEW5PTAiFta0';

let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error("Supabase client library not loaded.");
    }
} catch (e) {
    console.error("Supabase initialization failed:", e);
}

// 2. Helper Functions
// ----------------------------------------

/**
 * Toggles the mobile navigation menu.
 */
function setupHamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }
}

/**
 * Extracts the YouTube video ID from a URL.
 * @param {string} url - The full YouTube URL.
 * @returns {string|null} The video ID or null if not found.
 */
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Displays a message on a form.
 * @param {string} message - The message to display.
 * @param {boolean} isError - Whether the message is an error.
 */
function showFormMessage(message, isError = false) {
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = isError ? 'red' : 'green';
    }
}

// 3. Page-Specific Logic
// ----------------------------------------

function initializeHomepage() {
    // Initialize hero slider regardless of courses container
    initializeHeroSlider();
    
    // Initialize courses if container exists
    const coursesContainer = document.getElementById('courses-container');
    if (coursesContainer) {
        fetchAndDisplayCourses(coursesContainer);
    }
}

function initializeAdminPage() {
    console.log('Initializing admin page...');
    
    // Check authentication status on page load
    checkAdminAuth();
    
    // Set up event listeners
    const adminLoginForm = document.getElementById('admin-login-form');
    const addCourseForm = document.getElementById('add-course-form');
    const logoutBtnNav = document.getElementById('logout-btn');
    const logoutBtnMain = document.getElementById('logout-btn-main');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', handleAddCourse);
    }
    
    if (logoutBtnNav) {
        logoutBtnNav.addEventListener('click', handleLogout);
    }
    
    if (logoutBtnMain) {
        logoutBtnMain.addEventListener('click', handleLogout);
    }
    
    // Load courses for management
    loadAdminCourses();
}

async function checkAdminAuth() {
    console.log('Checking admin authentication...');
    
    if (!supabase) {
        showAccessDenied();
        return;
    }
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Auth error:', error);
            showAdminLogin();
            return;
        }
        
        if (!user) {
            console.log('No user logged in');
            showAdminLogin();
            return;
        }
        
        // Check if user has admin role
        const isAdmin = user.user_metadata && user.user_metadata.role === 'admin';
        
        if (isAdmin) {
            console.log('User is admin, showing admin panel');
            showAdminPanel(user);
        } else {
            console.log('User is not admin');
            showAccessDenied();
        }
        
    } catch (error) {
        console.error('Error checking auth:', error);
        showAdminLogin();
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();
    
    if (!supabase) {
        showAdminMessage("Supabase is not configured.", true);
        return;
    }
    
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
    try {
        showAdminMessage("Logging in...", false);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Check if user has admin role
        if (data.user && data.user.user_metadata && data.user.user_metadata.role === 'admin') {
            showAdminMessage("Login successful! Loading admin panel...", false);
            setTimeout(() => {
                showAdminPanel(data.user);
            }, 1000);
        } else {
            throw new Error('You do not have admin privileges');
        }
        
    } catch (error) {
        console.error('Admin login error:', error);
        showAdminMessage(`Login failed: ${error.message}`, true);
    }
}

async function handleLogout() {
    if (!supabase) return;
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        console.log('User logged out');
        showAdminLogin();
        
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showAdminLogin() {
    document.getElementById('admin-login-section').style.display = 'block';
    document.getElementById('admin-panel-section').style.display = 'none';
    document.getElementById('access-denied-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function showAdminPanel(user) {
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-panel-section').style.display = 'block';
    document.getElementById('access-denied-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    
    // Update user email display
    const userEmailElement = document.getElementById('admin-user-email');
    if (userEmailElement && user) {
        userEmailElement.textContent = user.email;
    }
}

function showAccessDenied() {
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-panel-section').style.display = 'none';
    document.getElementById('access-denied-section').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none';
}

function showAdminMessage(message, isError = false) {
    const messageElement = document.getElementById('admin-login-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = isError ? 'red' : 'green';
        messageElement.style.display = 'block';
    }
}

function initializeCoursesPage() {
    const videoCoursesContainer = document.getElementById('video-courses-container');
    if (videoCoursesContainer) {
        fetchAndDisplayVideoCourses(videoCoursesContainer);
    }
}

function initializeRegisterPage() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function initializeForgotPasswordPage() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
}

function initializeUpdatePasswordPage() {
    const updatePasswordForm = document.getElementById('update-password-form');
    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', handleUpdatePassword);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    if (!supabase) return showFormMessage("Supabase is not configured.", true);
    const form = event.target;
    try {
        const { data, error } = await supabase.auth.signUp({ email: form.email.value, password: form.password.value });
        if (error) throw error;
        if (data.user && data.user.identities && data.user.identities.length === 0) {
             showFormMessage("Registration failed: This user may already exist.", true);
        } else {
             showFormMessage("Registration successful! Please check your email to confirm your account.", false);
             form.reset();
        }
    } catch (error) {
        showFormMessage(`Registration failed: ${error.message}`, true);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    if (!supabase) return showFormMessage("Supabase is not configured.", true);
    const form = event.target;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email.value, password: form.password.value });
        if (error) throw error;
        if (data.user && data.user.user_metadata && data.user.user_metadata.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'courses.html';
        }
    } catch (error) {
        showFormMessage(`Login failed: ${error.message}`, true);
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    if (!supabase) return showFormMessage("Supabase is not configured.", true);
    const form = event.target;
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email.value, {
            redirectTo: window.location.origin + '/update-password.html',
        });
        if (error) throw error;
        showFormMessage("Password reset link sent! Please check your email.", false);
        form.reset();
    } catch (error) {
        showFormMessage(`Error: ${error.message}`, true);
    }
}

async function handleUpdatePassword(event) {
    event.preventDefault();
    if (!supabase) return showFormMessage("Supabase is not configured.", true);
    const form = event.target;
    const password = form.password.value;

    // The access token is expected to be in the URL hash
    // Supabase redirects with #access_token=...
    const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (!accessToken) {
        showFormMessage("Invalid or missing token. Please request a new password reset link.", true);
        return;
    }

    try {
        // First, set the session from the token
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
        if (sessionError) throw sessionError;

        // Now, update the user's password
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;

        showFormMessage("Password updated successfully! You can now log in.", false);
        form.reset();

    } catch (error) {
        showFormMessage(`Error: ${error.message}`, true);
    }
}

async function loadAdminCourses() {
    const container = document.getElementById('admin-courses-container');
    if (!container || !supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="no-courses">No courses found. Add your first course above!</p>';
            return;
        }
        
        container.innerHTML = '';
        data.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'admin-course-card';
            courseCard.innerHTML = `
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    ${course.youtube_video_id ? `<a href="https://www.youtube.com/watch?v=${course.youtube_video_id}" target="_blank" class="youtube-link">View on YouTube</a>` : ''}
                </div>
                <div class="course-actions">
                    <button class="edit-btn" onclick="editCourse(${course.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteCourse(${course.id})">Delete</button>
                </div>
            `;
            container.appendChild(courseCard);
        });
        
    } catch (error) {
        console.error('Error loading admin courses:', error);
        container.innerHTML = '<p class="error">Failed to load courses.</p>';
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        return;
    }
    
    if (!supabase) {
        alert('Supabase is not configured.');
        return;
    }
    
    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId);
        
        if (error) throw error;
        
        alert('Course deleted successfully!');
        loadAdminCourses(); // Reload the courses list
        
    } catch (error) {
        console.error('Error deleting course:', error);
        alert(`Failed to delete course: ${error.message}`);
    }
}

async function editCourse(courseId) {
    // For now, we'll just show an alert. You can implement a full edit modal later
    alert(`Edit functionality for course ID ${courseId} will be implemented soon. For now, you can delete and re-add the course.`);
}

// Update the existing handleAddCourse function to reload courses after adding
async function handleAddCourse(event) {
    event.preventDefault();
    if (!supabase) return showFormMessage("Supabase is not configured.", true);
    const form = event.target;
    const videoId = getYouTubeVideoId(form.youtube_url.value);
    if (!videoId) return showFormMessage("Invalid YouTube URL.", true);
    
    try {
        const courseData = {
            title: form.title.value,
            description: form.description.value,
            youtube_video_id: videoId
        };
        
        const { error } = await supabase.from('courses').insert([courseData]);
        if (error) throw error;
        
        showFormMessage("Course added successfully!", false);
        form.reset();
        
        // Reload the admin courses list
        loadAdminCourses();
        
    } catch (error) {
        console.error('Error adding course:', error);
        showFormMessage('Failed to add course. Make sure you have admin rights.', true);
    }
}

function initializeHeroSlider() {
    console.log('initializeHeroSlider called');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        const slidesContainer = document.querySelector('.slides');
        if (!slidesContainer) {
            console.log('Hero slider container (.slides) not found.');
            return;
        }
        console.log('slidesContainer found:', slidesContainer);

        const slideElements = document.querySelectorAll('.slide');
        console.log('Found ' + slideElements.length + ' slides.');
        if (slideElements.length === 0) {
            console.log('No slide elements found.');
            return;
        }

        // Log each slide element for debugging
        slideElements.forEach((slide, index) => {
            console.log(`Slide ${index}:`, slide, 'has active class:', slide.classList.contains('active'));
        });

        const prevBtn = document.querySelector('.slider-nav.prev');
        const nextBtn = document.querySelector('.slider-nav.next');
        const indicators = document.querySelectorAll('.indicator');
        console.log('prevBtn found:', !!prevBtn, 'nextBtn found:', !!nextBtn);
        console.log('indicators found:', indicators.length);

        let currentIndex = 0;
        let slideInterval;

        function updateIndicators(activeIndex) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        function showSlide(index) {
            console.log('showSlide called with index:', index);
            slideElements.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                    console.log('Added active to slide:', i);
                }
            });
            updateIndicators(index);
        }

        function goToSlide(index) {
            currentIndex = index;
            console.log('goToSlide: new currentIndex', currentIndex);
            showSlide(currentIndex);
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideElements.length;
            console.log('nextSlide: new currentIndex', currentIndex);
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideElements.length) % slideElements.length;
            console.log('prevSlide: new currentIndex', currentIndex);
            showSlide(currentIndex);
        }

        function startSlideShow() {
            console.log('startSlideShow called');
            stopSlideShow();
            if (slideElements.length > 1) {
                slideInterval = setInterval(nextSlide, 5000);
                console.log('Slideshow started with interval:', slideInterval);
            }
        }

        function stopSlideShow() {
            console.log('stopSlideShow called');
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Add event listeners for navigation buttons if they exist
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => { 
                e.preventDefault();
                console.log('Prev button clicked');
                prevSlide(); 
                startSlideShow(); 
            });
            console.log('Prev button event listener added');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => { 
                e.preventDefault();
                console.log('Next button clicked');
                nextSlide(); 
                startSlideShow(); 
            });
            console.log('Next button event listener added');
        }

        // Add event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Indicator clicked:', index);
                goToSlide(index);
                startSlideShow();
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                startSlideShow();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                startSlideShow();
            }
        });

        // Pause slideshow on hover
        slidesContainer.addEventListener('mouseenter', stopSlideShow);
        slidesContainer.addEventListener('mouseleave', startSlideShow);

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe right - go to previous slide
                    prevSlide();
                } else {
                    // Swipe left - go to next slide
                    nextSlide();
                }
                startSlideShow();
            }
        }

        // Initialize first slide and start slideshow
        console.log('Initializing slider with', slideElements.length, 'slides');
        
        // Ensure first slide is active
        slideElements.forEach(slide => slide.classList.remove('active'));
        if (slideElements[0]) {
            slideElements[0].classList.add('active');
            console.log('Set first slide as active');
        }
        
        // Preload images for better performance
        slideElements.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('load', () => {
                    console.log(`Image ${index} loaded successfully`);
                });
                img.addEventListener('error', () => {
                    console.warn(`Failed to load image ${index}:`, img.src);
                    // You could add a fallback image here
                    // img.src = 'assets/images/fallback.jpg';
                });
            }
        });
        
        showSlide(currentIndex);
        startSlideShow();
        
        console.log('Hero slider initialization complete');
    }, 100);
}

async function fetchAndDisplayCourses(container) {
    if (!supabase) return container.innerHTML = '<p>Supabase is not configured.</p>';
    try {
        const { data, error } = await supabase.from('courses').select('title, description, category');
        if (error) throw error;
        if (!data || data.length === 0) return container.innerHTML = '<p>No courses available yet.</p>';
        container.innerHTML = '';
        data.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `<h4>${course.title}</h4><p>${course.description}</p>${course.category ? `<span class="category">${course.category}</span>` : ''}`;
            container.appendChild(courseCard);
        });
    } catch (error) {
        container.innerHTML = '<p>Failed to load courses.</p>';
    }
}

async function fetchAndDisplayVideoCourses(container) {
    if (!supabase) return container.innerHTML = '<p>Supabase is not configured.</p>';
    try {
        const { data, error } = await supabase.from('courses').select('title, description, youtube_video_id');
        if (error) throw error;
        if (!data || data.length === 0) return container.innerHTML = '<p>No video courses available yet.</p>';
        container.innerHTML = '';
        data.forEach(course => {
            if (!course.youtube_video_id) return;
            const videoCard = document.createElement('div');
            videoCard.className = 'video-course-card';
            videoCard.innerHTML = `<div class="video-embed-container"><iframe src="https://www.youtube.com/embed/${course.youtube_video_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="video-course-content"><h4>${course.title}</h4><p>${course.description}</p></div>`;
            container.appendChild(videoCard);
        });
    } catch (error) {
        container.innerHTML = '<p>Failed to load video courses.</p>';
    }
}

// 4. Initialization
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    try {
        setupHamburgerMenu();
        
        // Check if we're on the homepage by looking for hero section or courses container
        const heroSection = document.querySelector('#hero');
        const coursesContainer = document.getElementById('courses-container');
        console.log('script.js: heroSection element (querySelector):', heroSection);
        console.log('script.js: coursesContainer element:', coursesContainer);
        
        if (heroSection || coursesContainer) {
            console.log('Homepage detected, initializing homepage...');
            initializeHomepage();
        }
        
        if (document.getElementById('admin-form-section')) initializeAdminPage();
        if (document.getElementById('video-courses-container')) initializeCoursesPage();
        if (document.getElementById('register-form-section')) initializeRegisterPage();
        if (document.getElementById('login-form-section')) initializeLoginPage();
        if (document.getElementById('forgot-password-form-section')) initializeForgotPasswordPage();
        if (document.getElementById('update-password-form-section')) initializeUpdatePasswordPage();
    } catch (error) {
        console.error("Error during DOMContentLoaded initialization:", error);
    }
});