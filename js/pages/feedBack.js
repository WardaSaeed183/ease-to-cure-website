// js/pages/feedBack.js

// It's best practice to wrap all your code in this listener.
// This ensures the HTML is fully loaded before the script tries to find any elements.
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Feature 1: Navbar Dropdown and Redirection ---
    const homeBtn = document.querySelector('a[href="homePage.html"]');
    if (homeBtn) homeBtn.href = '/pages/user/homePage.html'; 

    const adminBtn = document.querySelector('a[href="login.html"]');
    if (adminBtn) adminBtn.href = '/pages/auth/login.html'; // Set correct path for Admin

    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoriesWrapper = document.getElementById('categories-wrapper');

    if (categoriesBtn && dropdownMenu && categoriesWrapper) {
        // Set correct paths for dropdown links
        const links = dropdownMenu.getElementsByTagName('a');
        if (links.length > 0) links[0].href = '/pages/user/medicineByCategory.html';
        if (links.length > 1) links[1].href = '/pages/user/medicineByDisease.html';

        // Add event listener to toggle dropdown
        categoriesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Add global listener to close dropdown
        document.addEventListener('click', function (e) {
            if (!categoriesWrapper.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // --- Feature 2: Survey Slide Change ---
    const slides = document.querySelectorAll('.question-slide');
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');
    let current = 0;

    if (slides.length > 0 && prevArrow && nextArrow) {
        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'left', 'right');
                if (index === current) slide.classList.add('active');
                else if (index < current) slide.classList.add('left');
                else slide.classList.add('right');
            });
        }

        prevArrow.addEventListener('click', () => {
            if (current > 0) {
                current--;
                updateSlides();
            }
        });

        nextArrow.addEventListener('click', () => {
            if (current < slides.length - 1) {
                current++;
                updateSlides();
            }
        });

        updateSlides(); // Initialize
    }

    // --- Feature 3: Star Rating ---
    document.querySelectorAll('.rating-stars').forEach(starContainer => {
        const stars = starContainer.querySelectorAll('.star');
        const counter = starContainer.querySelector('.rating-counter');
        if (stars.length > 0 && counter) {
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    stars.forEach((s, i) => s.classList.toggle('filled', i < rating));
                    counter.textContent = rating;
                });
            });
        }
    });

    // --- Feature 4: Form Submission ---
    const feedbackForm = document.querySelector('.form-box form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const allRated = [...document.querySelectorAll('.rating-counter')]
                .every(counter => parseInt(counter.textContent) > 0);

            if (!allRated) {
                showAlert();
                return;
            }

            showSuccessOverlay();
            
            // Reset star ratings
            document.querySelectorAll('.rating-stars').forEach(starContainer => {
                starContainer.querySelectorAll('.star').forEach(star => star.classList.remove('filled'));
                const counter = starContainer.querySelector('.rating-counter');
                if (counter) counter.textContent = "0";
            });

            // Reset all input fields
            feedbackForm.querySelectorAll('input, textarea').forEach(input => input.value = '');
            
            // Reset survey to first slide
            current = 0;
            if (slides.length > 0) updateSlides();
        });
    }
});

// --- Helper functions can live outside the DOMContentLoaded listener ---

function showAlert() {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) alertBox.style.display = 'block';
}

function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) alertBox.style.display = 'none';
}

// Make closeAlert globally accessible for the onclick attribute
window.closeAlert = closeAlert;

async function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.style.display = 'flex'; // Use style to show it
        setTimeout(() => overlay.classList.add('active'), 10); // Then add active class for transition

        await new Promise(resolve => setTimeout(resolve, 4200));

        overlay.classList.remove('active');
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for fade out
        overlay.style.display = 'none';
    }
}