// js/pages/adminDashboard.js

// Import the shared 'auth' instance from your central firebase.js file.
import { auth } from '../firebase/firebase.js'; 

// Import the necessary functions from the Firebase Auth SDK.
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// Wait for the HTML document to be fully loaded before executing any script.
document.addEventListener('DOMContentLoaded', () => {

    // Get references to all the buttons on the dashboard using their IDs.
    const btnAdd = document.getElementById('btnAdd');
    const btnUpdate = document.getElementById('btnUpdate');
    const btnDelete = document.getElementById('btnDelete');
    const btnLogout = document.getElementById('btnLogout');

    // Use onAuthStateChanged to protect the page and its functionality.
    // This code runs only after Firebase has confirmed the user's login status.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // If 'user' exists, it means an admin is successfully logged in.
            console.log('Admin verified. Setting up dashboard controls.');

            // --- Set Redirection for Each Button ---

            // 1. Add Medicine Button
            btnAdd.addEventListener('click', () => {
                // Redirects to the page for adding new medicines.
                window.location.href = '/pages/admin/addMedicine.html'; 
            });

            // 2. Update Medicine Button
            btnUpdate.addEventListener('click', () => {
                // Redirects to the page for updating existing medicines.
                window.location.href = '/pages/admin/updateMedicine.html';
            });

            // 3. Delete Medicine Button
            btnDelete.addEventListener('click', () => {
                // Redirects to the page for deleting medicines.
                window.location.href = '/pages/admin/removeMedicine.html'; 
            });

            // 4. Logout Button
            btnLogout.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    alert("You have been logged out.");
                    // Redirect to the login page after a successful logout.
                    window.location.href = '/pages/auth/login.html'; 
                } catch (error) {
                    console.error('Logout Error:', error);
                    alert('An error occurred during logout.');
                }
            });

        } else {
            // If 'user' is null, no one is logged in.
            // Protect the page by redirecting them away.
            alert('Your session has expired. Please log in again.');
            window.location.href = '/pages/auth/login.html';
        }
    });
});