// js/pages/login.js

import { auth } from '/js/firebase/firebase.js'; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
   sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
    
    console.log("login.js script loaded and DOM is ready.");

    // --- Feature: Categories Dropdown Navigation ---
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoriesWrapper = document.getElementById('categories-wrapper');

    if (categoriesBtn && dropdownMenu && categoriesWrapper) {
        const links = dropdownMenu.getElementsByTagName('a');
        const specialtiesLink = links.length > 0 ? links[0] : null;
        const diseasesLink = links.length > 1 ? links[1] : null;
        
        if (specialtiesLink) specialtiesLink.href = '/pages/user/medicineByCategory.html';
        if (diseasesLink) diseasesLink.href = '/pages/user/medicineByDisease.html';

        categoriesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!categoriesWrapper.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
        console.log("Categories dropdown initialized.");
    }

    // --- Feature: Login/Register Panel Toggle ---
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => container.classList.add('active'));
        loginBtn.addEventListener('click', () => container.classList.remove('active'));
    }

    // --- Feature: Admin Key Input Logic ---
    const adminKeyInputs = document.querySelectorAll(".adminKey-digit");
    if (adminKeyInputs.length > 0) {
        adminKeyInputs.forEach((input, idx) => {
            input.addEventListener("input", (e) => {
                const val = e.target.value.replace(/\D/g, "");
                e.target.value = val;
                if (val && adminKeyInputs[idx + 1]) {
                    adminKeyInputs[idx + 1].focus();
                }
            });
            input.addEventListener("keydown", (e) => {
                const key = e.key;
                if (key === "Backspace" && !input.value && idx > 0) adminKeyInputs[idx - 1].focus();
                if (!/^\d$/.test(key) && key.length === 1 && key !== "Backspace") e.preventDefault();
                if (key === "ArrowLeft" && idx > 0) adminKeyInputs[idx - 1].focus();
                if (key === "ArrowRight" && idx < adminKeyInputs.length - 1) adminKeyInputs[idx + 1].focus();
            });
            input.addEventListener("paste", (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
                paste.split("").forEach((char, i) => { if (adminKeyInputs[idx + i]) adminKeyInputs[idx + i].value = char; });
                const next = adminKeyInputs[idx + paste.length];
                if (next) next.focus();
            });
        });
        adminKeyInputs.forEach(input => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "") input.classList.add("filled");
                else input.classList.remove("filled");
            });
        });
    }

    // --- Feature: Admin Login Form ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const idTokenResult = await user.getIdTokenResult();
                if (idTokenResult.claims.admin === true) {
                    alert('✅ Login Successful!');
                    window.location.href = '/pages/admin/admindashboard.html'; // Use absolute path
                } else {
                    alert('❌ Access Denied: This account is not an administrator.');
                    await auth.signOut();
                }
            } catch (error) {
                console.error("Login error:", error.message);
                alert("Login failed: " + error.message);
            }
        });
    }
    // =======================================================
    // --- NEW: Forgot Password Functionality ---
    // =======================================================
    const forgotPasswordLink = document.querySelector('.forgot-link a');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from trying to navigate

            const email = prompt("Please enter your registered email address to receive a password reset link:");

            if (email) { // Check if the user entered an email
                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        alert("Password reset email sent! Please check your inbox (and spam folder).");
                    })
                    .catch((error) => {
                        console.error("Password reset error:", error);
                        alert("Error sending password reset email: " + error.message);
                    });
            } else {
                alert("Password reset cancelled.");
            }
        });
        console.log("Forgot Password link initialized.");
    }


    // --- Feature: Admin Registration Form ---
    const registerForm = document.querySelector('.form-box.register form');
    if (registerForm) {
        const ADMIN_KEY = '207387';
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            

            const emailInput = registerForm.querySelector('input[type="email"]');
            const passwordInput = registerForm.querySelector('input[type="password"]');
            const confirmPasswordInput = registerForm.querySelectorAll('input[type="password"]')[1];
            
            const email = emailInput?.value;
            const password = passwordInput?.value;
            const confirmPassword = confirmPasswordInput?.value;

            let adminKey = '';
            const adminKeyInputs = registerForm.querySelectorAll('.adminKey-digit');
            adminKeyInputs.forEach(input => { adminKey += input.value; });

            if (!email || !password || !confirmPassword || !adminKey) {
                alert('Please fill all fields.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            if (adminKey !== ADMIN_KEY) {
                alert('Invalid admin key.');
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                alert('Registration successful! Please contact the developer to grant you admin privileges.');
                if (container) container.classList.remove('active');
            } catch (error) {
                alert('Registration failed: ' + error.message);
                console.error('Registration error:', error);
            }
        });
    }
});