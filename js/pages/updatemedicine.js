import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAe4ZDUJKZYq7badfWxOe5qqPBK6k4eX98",
  authDomain: "ease-to-cure.firebaseapp.com",
  projectId: "ease-to-cure",
  storageBucket: "ease-to-cure.appspot.com",
  messagingSenderId: "76396678816",
  appId: "1:76396678816:web:e39fd82bf59d97da8b83c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get DOM elements
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.querySelector("input[name='medName']");
const searchForm = document.getElementById("searchForm"); // Get the search form element
const updateForm = document.getElementById("updateForm");
const medForm = document.getElementById("medForm");

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the back arrow
    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            window.location.href = '../../pages/admin/adminDashboard.html'; // Redirect to adminDashboard.html
        });
    }

    // Ensure only search form is visible on page load
    searchForm.style.display = "block"; // Or "flex" if its internal layout requires it
    updateForm.style.display = "none";
});


// SEARCH handler
searchBtn.addEventListener("click", async () => {
  const searchValue = searchInput.value.trim();
  if (!searchValue) {
    alert("Please enter a medicine name or ID");
    return;
  }
  try {
    let docSnap;
    let docId = searchValue; // Try by ID
    const docRef = doc(db, "medicines", searchValue);
    docSnap = await getDoc(docRef);

    // Try by medName if not found by ID
    if (!docSnap.exists()) {
      const q = query(
        collection(db, "medicines"),
        where("medName", "==", searchValue)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        docSnap = querySnapshot.docs[0];
        docId = docSnap.id;
      }
    }

    if (!docSnap.exists()) {
      alert("Medicine not found!");
      // If not found, keep search form visible and ensure update form is hidden
      searchForm.style.display = "block";
      updateForm.style.display = "none";
      return;
    }

    const data = docSnap.data();
    
    // Hide search form and show update form
    searchForm.style.display = "none";
    updateForm.style.display = "flex"; // Use "flex" as per your CSS class .update-form's display

    // Populate the form fields
    medForm.medID.value = docId;
    medForm.medName.value = data.medName || "";
    medForm.genericName.value = data.genericName || "";
    medForm.chemicalFormula.value = data.chemicalFormula || "";
    medForm.medCategory.value = data.medCategory || "";
    medForm.symptoms.value = data.symptoms || "";
    medForm.usedInDisease.value = data.usedInDisease || "";
    medForm.dosage.value = data.dosage || "";
    medForm.description.value = data.description || "";

    // Set radio button
    if (data.warningAlert === "Do not exceed recommended dose.") { // Check the actual value from Firestore
      medForm.warning[0].checked = true; // 'yes' radio button
    } else {
      medForm.warning[1].checked = true; // 'no' radio button
    }


  } catch (error) {
    console.error("Error fetching medicine:", error);
    alert("Error fetching medicine.");
    // In case of error, ensure update form is hidden and search form is visible
    searchForm.style.display = "block";
    updateForm.style.display = "none";
  }
});

// UPDATE handler
medForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const medID = medForm.medID.value;
  const medData = {
    medName: medForm.medName.value,
    genericName: medForm.genericName.value,
    chemicalFormula: medForm.chemicalFormula.value,
    medCategory: medForm.medCategory.value,
    symptoms: medForm.symptoms.value,
    usedInDisease: medForm.usedInDisease.value,
    dosage: medForm.dosage.value,
    description: medForm.description.value,
    warningAlert: medForm.warning.value === "yes" ? "Do not exceed recommended dose." : "No specific warning."
  };

  try {
    const docRef = doc(db, "medicines", medID);
    await updateDoc(docRef, medData);
    alert("Medicine updated successfully!");
    // After successful update, optionally hide the update form and show search form again
    medForm.reset(); // Clear the form
    searchForm.style.display = "block";
    updateForm.style.display = "none";
    searchInput.value = ''; // Clear search input
  } catch (error) {
    console.error("Error updating medicine:", error);
    alert("Error updating medicine.");
  }
});