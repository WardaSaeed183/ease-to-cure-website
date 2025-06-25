// js/pages/adminDashboard.js
import { auth } from '../firebase/firebase.js'; 
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {

    
    const btnAdd = document.getElementById('btnAdd');
    const btnUpdate = document.getElementById('btnUpdate');
    const btnDelete = document.getElementById('btnDelete');
    const btnLogout = document.getElementById('btnLogout');


    // This code runs only after Firebase has confirmed the user's login status.
    onAuthStateChanged(auth, (user) => {
        if (user) {
           
            console.log('Admin verified. Setting up dashboard controls.');

            btnAdd.addEventListener('click', () => {
                window.location.href = '/pages/admin/addMedicine.html'; 
            });

            btnUpdate.addEventListener('click', () => {
                window.location.href = '/pages/admin/updateMedicine.html';
            });

            btnDelete.addEventListener('click', () => {
                window.location.href = '/pages/admin/removeMedicine.html'; 
            });

            btnLogout.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    alert("You have been logged out.");
                    window.location.href = '/pages/auth/login.html'; 
                } catch (error) {
                    console.error('Logout Error:', error);
                    alert('An error occurred during logout.');
                }
            });

        } else {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/pages/auth/login.html';
        }
    });
});