// js/pages/addmedicine.js
import { auth, db } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the back arrow
    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            window.location.href = '../../pages/admin/adminDashboard.html'; 
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
           
            console.log("Authentication confirmed on client-side.");
            console.log("User Object:", user);
            console.log("User UID:", user.uid);

            initializePage(user); // Pass the user object
        } else {
            console.log("Authentication check failed. No user found. Redirecting...");
            alert("You must be logged in to access this page.");
            window.location.href = '/pages/auth/login.html';
        }
    });
});

// Pass the user object to the function
function initializePage(currentUser) {
    const medicineForm = document.getElementById("medicineForm");

    // Ensure the form-box is visible when the page initializes after authentication
    const formBox = document.querySelector(".form-box");
    if (formBox) {
        formBox.classList.add("active");
        console.log("Added 'active' class to form-box, making it visible.");
    }

    medicineForm.addEventListener("submit", async function (event) {
        event.preventDefault();

       
        console.log("'Add' button clicked. Verifying user state again.");
        if (auth.currentUser) {
            console.log("auth.currentUser is valid. UID:", auth.currentUser.uid);
        } else {
            
            console.error("CRITICAL ERROR: auth.currentUser is NULL right before write operation!");
            alert("Your session seems to have expired just now. Please try again.");
            return;
        }

        const medID = document.getElementById("medID").value.trim();
        const medName = document.getElementById("medName").value.trim();
        // Get all other form fields
        const genericName = document.getElementById("genericName").value.trim();
        const chemicalFormula = document.getElementById("chemicalFormula").value.trim();
        const medCategory = document.getElementById("medCategory").value.trim();
        const symptoms = document.getElementById("symptoms").value.trim();
        const usedInDisease = document.getElementById("usedInDisease").value.trim();
        const dosage = document.getElementById("dosage").value.trim();
        const description = document.getElementById("description").value.trim();
        const warningRadio = document.querySelector('input[name="warning"]:checked');


        if (!medID || !medName || !genericName || !chemicalFormula || !medCategory || !symptoms || !usedInDisease || !dosage || !description || !warningRadio) {
            alert("❌ Please fill in all fields.");
            return;
        }
        if (!/^\d+$/.test(medID)) {
            alert("❌ Medicine ID must be numeric.");
            return;
        }

        try {
            console.log(`Attempting to write to 'medicines/${medID}'...`);
            const docRef = doc(db, "medicines", medID);

            // This is the read operation
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                alert("⚠ A medicine with this ID already exists.");
                return;
            }

            const medicineData = {
                medName,
                genericName,
                chemicalFormula,
                medCategory,
                symptoms,
                usedInDisease,
                dosage,
                description,
                warningAlert: warningRadio.value === "yes" ? "Do not exceed recommended dose." : "No specific warning.",
                reviews: [],
                alternatives: []
            };

            // This is the write operation
            await setDoc(docRef, medicineData);

            alert("✅ Medicine added successfully!");
            medicineForm.reset();

        } catch (error) {
            console.error("❌ FIRESTORE OPERATION FAILED:", error.code, error.message);
            alert(`Operation failed. Please check the console for details. Error: ${error.message}`);
        }
    });
}