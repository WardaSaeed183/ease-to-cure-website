// js/pages/medicineByCategory.js

// Import necessary Firestore functions and the shared DB instance
import { db } from '/js/firebase/firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// List of available medicine categories
const pharmaCategories = [
    "Analgesics", "Antibiotics", "Antiseptics", "Antipyretics", "Mood Stabilizers", "Hormone Replacements", 
    "Antidepressants", "Stimulants", "Tranquilizers", "Antacids", "Antihistamines", "Bronchodilators", 
    "Cough Suppressants", "Decongestants", "Expectorants", "Laxatives", "Diuretics", "Antidiabetics"
];

// Wait for the HTML document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Setup Navigation Buttons (Home and Admin) ---
    const homeButton = document.getElementById("homeBtn");
    const adminButton = document.getElementById("adminBtn");

    if (homeButton) homeButton.addEventListener('click', () => { window.location.href = '/pages/user/homePage.html'; });
    if (adminButton) adminButton.addEventListener('click', () => { window.location.href = '/pages/auth/login.html'; });

    // --- NEW: Setup Navbar Categories Dropdown ---
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoriesWrapper = document.getElementById('categories-wrapper');

    if (categoriesBtn && dropdownMenu && categoriesWrapper) {
        const links = dropdownMenu.getElementsByTagName('a');
        // Set the correct redirection paths for the dropdown links
        if (links.length > 0) links[0].href = '/pages/user/medicineByCategory.html';
        if (links.length > 1) links[1].href = '/pages/user/medicineByDisease.html';

        // Add click listener to show/hide the dropdown
        categoriesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Add a global click listener to hide the dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!categoriesWrapper.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // --- Setup Main Page Search Functionality ---
    const categoryInput = document.getElementById("diseaseSearch");
    const categoryDropdown = document.getElementById("diseaseDropdown");
    const searchButton = document.getElementById("searchBtn");

    if (categoryInput && categoryDropdown && searchButton) {
        categoryInput.addEventListener("click", (e) => {
            e.stopPropagation();
            populateCategoryDropdown(categoryInput, categoryDropdown);
            categoryDropdown.style.display = "block";
        });
        // We need to adjust this to avoid conflicts with the navbar dropdown
        document.addEventListener("click", (event) => {
             if (!categoryDropdown.contains(event.target) && event.target !== categoryInput) {
                categoryDropdown.style.display = "none";
            }
        });
        searchButton.addEventListener("click", () => fetchMedicinesByCategory(categoryInput));
    }
});

/**
 * Fills the main search dropdown with category options.
 */
function populateCategoryDropdown(inputElement, dropdownElement) {
    dropdownElement.innerHTML = "";
    pharmaCategories.forEach(category => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = category;
        optionDiv.className = "category-option";
        optionDiv.addEventListener("click", () => { inputElement.value = category; dropdownElement.style.display = "none"; });
        dropdownElement.appendChild(optionDiv);
    });
}

/**
 * Fetches medicines from Firestore based on the selected category.
 */
async function fetchMedicinesByCategory(inputElement) {
    const medicineBox = document.getElementById("medicineBox");
    if (!medicineBox) return;
    const selectedCategory = inputElement.value.trim();
    if (!selectedCategory) { alert("Please choose a specialty first."); return; }
    medicineBox.innerHTML = '<p class="placeholder-text">Loading...</p>';
    try {
        const q = query(collection(db, "medicines"), where("medCategory", "==", selectedCategory));
        const snapshot = await getDocs(q);
        medicineBox.innerHTML = "";
        if (snapshot.empty) {
            medicineBox.innerHTML = '<p class="placeholder-text">No medicines found for this category.</p>';
        } else {
            snapshot.forEach(doc => {
                const med = doc.data();
                const div = document.createElement("div");
                div.className = "medicine-item";
                div.textContent = med.medName;
                div.addEventListener("click", () => { window.location.href = `medicineDetails.html?id=${doc.id}`; });
                medicineBox.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Fetch error:", err);
        medicineBox.innerHTML = '<p class="placeholder-text">Error fetching medicines.</p>';
    }
}