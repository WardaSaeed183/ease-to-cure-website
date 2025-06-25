import { db } from '/js/firebase/firebase.js'; 
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// The one and only DOMContentLoaded listener for this page.
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Navbar Navigation Logic (Corrected) ---
    console.log("Initializing navigation...");

    // For Home and Admin, we'll ensure their parent <a> tag has the correct link.
    const homeLink = document.getElementById('homeBtn');
    if (homeLink) {
        homeLink.href = '/pages/user/homePage.html'; 
        console.log("Home button link set.");
    } else {
        console.error("Home button link (id='homeBtn') not found!");
    }

    const adminLink = document.getElementById('adminBtn');
    if (adminLink) {
        adminLink.href = '/pages/auth/login.html'; 
        console.log("Admin button link set.");
    } else {
        console.error("Admin button link (id='adminBtn') not found!");
    }

   
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoriesWrapper = document.getElementById('categories-wrapper');

    if (categoriesBtn && dropdownMenu && categoriesWrapper) {
        
        const links = dropdownMenu.getElementsByTagName('a');
        if (links.length > 0) links[0].href = '/pages/user/medicineByCategory.html';
        if (links.length > 1) links[1].href = '/pages/user/medicineByDisease.html';

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
    } else {
        console.error("Categories dropdown components not found!");
    }


    // --- 2. Main Page Logic (Unchanged) ---
    const reviewBox = document.getElementById("reviewBox");
    const reviewInput = document.getElementById("reviewInput");
    const submitReviewBtn = document.getElementById("submitReview");
    let currentMedicineId = null;

    const loadMedicineDetails = async () => {
        const params = new URLSearchParams(window.location.search);
        currentMedicineId = params.get("id");
        if (!currentMedicineId) { 
            document.body.innerHTML = "<h1>Error: No Medicine ID Provided.</h1>"; 
            return; 
        }
        
        try {
            const medRef = doc(db, "medicines", currentMedicineId);
            const docSnap = await getDoc(medRef);
            if (docSnap.exists()) {
                populatePage(docSnap.data());
                displayReviews(docSnap.data().reviews || []);
            } else { 
                document.body.innerHTML = "<h1>Error: Medicine Not Found.</h1>"; 
            }
        } catch (error) { 
            console.error("Error loading medicine details:", error); 
            document.body.innerHTML = "<h1>Error: Could not load details.</h1>"; 
        }
    };

    function populatePage(data) {
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value ?? 'N/A';
        };
        setText("medName", data.medName);
        setText("genericName", data.genericName);
        setText("chemFormula", data.chemicalFormula);
        setText("Category", data.medCategory);
        setText("dosage", data.dosage);
        setText("Symptoms", data.symptoms);
        setText("Description", data.description);
    }

    function displayReviews(reviews) {
        reviewBox.innerHTML = "";
        if (reviews.length === 0) {
            reviewBox.innerHTML = "<p class='placeholder-text'>No reviews yet. Be the first!</p>";
            return;
        }
        reviews.forEach(review => {
            const reviewDiv = document.createElement("div");
            reviewDiv.className = "review-item";
            reviewDiv.textContent = `"${review.text}"`; 
            reviewBox.appendChild(reviewDiv);
        });
    }

    const handleAddReview = async () => {
        const reviewText = reviewInput.value.trim();
        if (!reviewText) { alert("Please write a review."); return; }
        if (!currentMedicineId) { alert("Error: Missing ID."); return; }
        const newReview = { text: reviewText };
        try {
            const medRef = doc(db, "medicines", currentMedicineId);
            await updateDoc(medRef, { reviews: arrayUnion(newReview) });
            if (reviewBox.querySelector('.placeholder-text')) { reviewBox.innerHTML = ''; }
            const reviewDiv = document.createElement("div");
            reviewDiv.className = "review-item";
            reviewDiv.textContent = `"${newReview.text}"`;
            reviewBox.prepend(reviewDiv);
            reviewInput.value = "";
            alert("Thank you! Your review has been added.");
        } catch (error) { console.error("Error adding review:", error); alert("Error submitting review."); }
    };

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', handleAddReview);
    }
    
    // Initial page load
    loadMedicineDetails();
});