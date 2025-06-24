// js/pages/medicineByDisease.js

// Import necessary Firestore functions and the shared DB instance
import { db } from '/js/firebase/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// The list of diseases
const diseaseList = [
    "Asthma", "Diabetes Mellitus", "Hypertension (High Blood Pressure)", "Coronary Artery Disease", "COPD", 
    "Stroke", "Alzheimer's Disease", "Parkinson's Disease", "Osteoarthritis", "Rheumatoid Arthritis", 
    "Influenza (Flu)", "Pneumonia", "Tuberculosis", "Hepatitis B and C", "HIV/AIDS", "Malaria", "Dengue Fever", 
    "Cholera", "Measles", "Mumps", "Chickenpox (Varicella)", "Ebola Virus Disease", "Zika Virus Infection", 
    "Lyme Disease", "Celiac Disease", "IBD", "IBS", "Common Cold", "Fever", "Headache"
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
    const diseaseInput = document.getElementById("diseaseSearch");
    const diseaseDropdown = document.getElementById("diseaseDropdown");
    const searchButton = document.getElementById("searchBtn");

    if (diseaseInput && diseaseDropdown && searchButton) {
        diseaseInput.addEventListener("click", (e) => {
            e.stopPropagation();
            populateDiseaseDropdown(diseaseInput, diseaseDropdown);
            diseaseDropdown.style.display = "block";
        });
        document.addEventListener("click", () => { diseaseDropdown.style.display = "none"; });
        searchButton.addEventListener("click", () => fetchMedicinesByDisease(diseaseInput));
    }
});


/**
 * Fills the main search dropdown with disease options.
 */
function populateDiseaseDropdown(inputElement, dropdownElement) {
    dropdownElement.innerHTML = "";
    diseaseList.forEach(disease => {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = disease;
        optionDiv.className = "category-option";
        optionDiv.addEventListener("click", () => { inputElement.value = disease; dropdownElement.style.display = "none"; });
        dropdownElement.appendChild(optionDiv);
    });
}

/**
 * Fetches medicines from Firestore based on the selected disease.
 */
async function fetchMedicinesByDisease(inputElement) {
    const medicineBox = document.getElementById("medicineBox");
    if (!medicineBox) return;
    const selectedDisease = inputElement.value.trim();
    if (!selectedDisease) { alert("Please choose a disease first."); return; }
    medicineBox.innerHTML = '<p class="placeholder-text">Loading...</p>';
    try {
        const snapshot = await getDocs(collection(db, "medicines"));
        const medicinesFound = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.usedInDisease && data.usedInDisease.toLowerCase().includes(selectedDisease.toLowerCase())) {
                medicinesFound.push({ id: doc.id, ...data });
            }
        });
        medicineBox.innerHTML = "";
        if (medicinesFound.length === 0) {
            medicineBox.innerHTML = '<p class="placeholder-text">No medicines found for this disease.</p>';
        } else {
            medicinesFound.forEach(med => {
                const div = document.createElement("div");
                div.className = "medicine-item";
                div.textContent = med.medName;
                div.addEventListener("click", () => { window.location.href = `medicineDetails.html?id=${med.id}`; });
                medicineBox.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error fetching medicines:", error);
        medicineBox.innerHTML = '<p class="placeholder-text">An error occurred.</p>';
    }
}