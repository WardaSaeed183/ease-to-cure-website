import { db } from '/js/firebase/firebase.js'; 
import { collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// --- Global variable to hold all medicine data for client-side search ---
let allMedicines = [];

// --- Function to pre-fetch all medicine data on page load ---
async function preloadAllMedicines() {
    try {
        const querySnapshot = await getDocs(collection(db, "medicines"));
        querySnapshot.forEach(doc => {
            allMedicines.push({ id: doc.id, name: doc.data().medName });
        });
        console.log(`Preloaded ${allMedicines.length} medicines for live suggestions.`);
    } catch (error) {
        console.error("Failed to preload medicines:", error);
    }
}

// Main function that runs after the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // Start pre-loading medicine data immediately
    preloadAllMedicines();
    
    // --- Categories Dropdown Logic ---
    const categoriesBtn = document.getElementById('categoriesBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoriesWrapper = document.getElementById('categories-wrapper');
    if (categoriesBtn && dropdownMenu && categoriesWrapper) {
        const links = dropdownMenu.getElementsByTagName('a');
        if (links.length > 0) links[0].href = '/pages/user/medicineByCategory.html';
        if (links.length > 1) links[1].href = '/pages/user/medicineByDisease.html';
        categoriesBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('hidden'); });
        document.addEventListener('click', (e) => { if (!categoriesWrapper.contains(e.target)) { dropdownMenu.classList.add('hidden'); }});
    }

    // --- Search Bar with Live Suggestions ---
    const searchInput = document.querySelector('.searchInput');
    const searchIcon = document.querySelector('.searchIcon');
    const suggestionsBox = document.getElementById('suggestionsBox');
    const searchBarWrapper = document.querySelector('.searchBarWrapper');

    if (searchInput && searchIcon && suggestionsBox && searchBarWrapper) {
        
        // Listen for typing to show suggestions
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length > 0) {
                displaySuggestions(searchTerm);
            } else {
                suggestionsBox.style.display = 'none';
            }
        });
        
        // Function to perform the final search
        const performSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                suggestionsBox.style.display = 'none';
                searchMedicineByName(searchTerm);
            } else {
                alert("Please enter a medicine name to search.");
            }
        };
        
        // Add listeners for Enter key and icon click
        searchInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); performSearch(); } });
        searchIcon.addEventListener('click', performSearch);
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBarWrapper.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // --- 3D Carousel Logic ---
    const cubeCarousel = document.getElementById("carousel");
    const dots = document.querySelectorAll(".dots .dot");
    if (cubeCarousel && dots.length > 0) {
        let currentSlide = 0, autoScrollInterval, isHovered = false, isDotClicked = false, dotClickTimeout;
        const goToSlide = (index) => { currentSlide = index; cubeCarousel.style.transform = `rotateX(-${90 * index}deg)`; dots.forEach((d, i) => d.classList.toggle("active", i === index)); };
        const stopAutoScroll = () => clearInterval(autoScrollInterval);
        const startAutoScroll = () => { stopAutoScroll(); autoScrollInterval = setInterval(() => { if (!isHovered && !isDotClicked) { goToSlide((currentSlide + 1) % dots.length); } }, 5000); };
        dots.forEach((dot, i) => { dot.addEventListener("click", () => { goToSlide(i); isDotClicked = true; clearTimeout(dotClickTimeout); dotClickTimeout = setTimeout(() => { isDotClicked = false; }, 7000); }); });
        cubeCarousel.addEventListener("mouseenter", () => isHovered = true);
        cubeCarousel.addEventListener("mouseleave", () => { isHovered = false; isDotClicked = false; });
        startAutoScroll();
    }

    // --- Health Cards Logic ---
    const infoCards = document.querySelectorAll('.info-card');
    if (infoCards.length > 0) {
        infoCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const pages = ['./bmi.html', './bpChart.html', './SugarChart.html'];
                if(pages[index]) window.location.href = pages[index];
            });
        });
    }
});

// Filters the local 'allMedicines' array and displays suggestions.
function displaySuggestions(searchTerm) {
    const suggestionsBox = document.getElementById('suggestionsBox');
    if (!suggestionsBox || allMedicines.length === 0) return;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchingMedicines = allMedicines.filter(med => med.name.toLowerCase().startsWith(lowerCaseSearchTerm));
    const limitedSuggestions = matchingMedicines.slice(0, 7);
    suggestionsBox.innerHTML = '';
    if (limitedSuggestions.length === 0) { suggestionsBox.style.display = 'none'; return; }
    limitedSuggestions.forEach(med => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-item';
        const regex = new RegExp(`^(${searchTerm})`, 'i');
        suggestionDiv.innerHTML = med.name.replace(regex, '<strong>$1</strong>');
        suggestionDiv.addEventListener('click', () => {
            document.querySelector('.searchInput').value = med.name;
            suggestionsBox.style.display = 'none';
            redirectToDetailsPage(med.id);
        });
        suggestionsBox.appendChild(suggestionDiv);
    });
    suggestionsBox.style.display = 'block';
}

// Searches for a medicine name if the user *doesn't* click a suggestion.
async function searchMedicineByName(searchTerm) {
    alert(`Searching for "${searchTerm}"...`);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const foundMedicine = allMedicines.find(med => med.name.toLowerCase() === lowerCaseSearchTerm);

    if (foundMedicine) {
        redirectToDetailsPage(foundMedicine.id);
    } else {
        alert(`Sorry, no medicine found with the name "${searchTerm}".`);
    }
}

// A simple helper function for redirection to avoid repeating the URL.
function redirectToDetailsPage(medicineId) {
    if (medicineId) {
        window.location.href = `/pages/user/medicineDetails.html?id=${medicineId}`;
    }
}