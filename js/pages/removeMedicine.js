import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAe4ZDUJKZYq7badfWxOe5qqPBK6k4eX98",
  authDomain: "ease-to-cure.firebaseapp.com",
  projectId: "ease-to-cure",
  storageBucket: "ease-to-cure.appspot.com",
  messagingSenderId: "76396678816",
  appId: "1:76396678816:web:e39fd82bf59d97da8b83c5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const searchInput = document.getElementById('medSearchInput');
const searchButton = document.getElementById('searchBtn');
const searchForm = document.getElementById('searchForm');
const removeForm = document.getElementById('removeForm');
const medForm = document.getElementById('medForm');
const removeButton = document.getElementById('removeBtn');

const formFields = {
  medID: document.getElementById('medID'),
  medName: document.getElementById('medName'),
  genericName: document.getElementById('genericName'),
  chemicalFormula: document.getElementById('chemicalFormula'),
  medCategory: document.getElementById('medCategory'),
  symptoms: document.getElementById('symptoms'),
  usedInDisease: document.getElementById('usedInDisease'),
  dosage: document.getElementById('dosage'),
  description: document.getElementById('description'),
  warningYes: document.querySelector('input[name="warning"][value="yes"]'),
  warningNo: document.querySelector('input[name="warning"][value="no"]')
};

document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            window.location.href = '../../pages/admin/adminDashboard.html';
        });
    }

   
    searchForm.style.display = 'block';
    removeForm.style.display = 'none';
});

searchButton.addEventListener('click', async () => {
  const searchValue = searchInput.value.trim();
  if (!searchValue) {
    alert('Please enter a medicine name or ID to search.');
    return;
  }

  try {
    let medDoc = null;
    let docId = searchValue;

    // Try fetching by ID first
    const docRef = doc(db, 'medicines', searchValue);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      medDoc = docSnap;
    } else {
      // If not found by ID, try searching by medicine name
      const q = query(collection(db, 'medicines'), where('medName', '==', searchValue));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        medDoc = querySnapshot.docs[0];
        docId = medDoc.id; 
      }
    }

    if (medDoc) {
      displayMedicine(medDoc.data(), docId);
    } else {
      alert('Medicine not found!');
     
      searchForm.style.display = 'block';
      removeForm.style.display = 'none';
    }
  } catch (error) {
    console.error('Error searching for medicine:', error);
    alert('Error searching for medicine.');
   
    searchForm.style.display = 'block';
    removeForm.style.display = 'none';
  }
});

function displayMedicine(med, docId) {
  searchForm.style.display = 'none';
  removeForm.style.display = 'flex'; 

  removeButton.dataset.docId = docId;

  formFields.medID.value = med.medID || docId;
  formFields.medName.value = med.medName || "";
  formFields.genericName.value = med.genericName || "";
  formFields.chemicalFormula.value = med.chemicalFormula || "";
  formFields.medCategory.value = med.medCategory || ""; 
  formFields.symptoms.value = med.symptoms || "";
  formFields.usedInDisease.value = med.usedInDisease || "";
  formFields.dosage.value = med.dosage || "";
  formFields.description.value = med.description || "";

  
  if (med.warningAlert === "Do not exceed recommended dose.") {
    formFields.warningYes.checked = true;
  } else {
    formFields.warningNo.checked = true;
  }
}

removeButton.addEventListener("click", async () => {
  const docId = removeButton.dataset.docId;
  if (!docId) {
    alert("No medicine selected for removal.");
    return;
  }

  if (!confirm("Are you sure you want to remove this medicine?")) return;

  try {
    await deleteDoc(doc(db, "medicines", docId));
    alert("Medicine removed successfully!");
    // After successful removal, reset the forms
    medForm.reset();
    searchInput.value = ''; // Clear search input
    searchForm.style.display = 'block'; // Show search form
    removeForm.style.display = 'none'; // Hide remove form
  } catch (error) {
    console.error("Error removing medicine:", error);
    alert("Error removing medicine.");
  }
});