"use strict";

/* -------------------------------------------------
   🛰️ 1. Sélection des éléments HTML
------------------------------------------------- */
const missionsContainer = document.getElementById("mission-cards");
const searchInput = document.querySelector(".search");
const searchButton = document.querySelector("#searchButton");
const filterAgency = document.querySelector(".filter-agency");
const filterYear = document.querySelector(".filter-year");
const filterType = document.querySelector(".filter-type");

let allMissions = []; 

/* -------------------------------------------------
    2. Charger les missions depuis le JSON
------------------------------------------------- */

const savedMissions = JSON.parse(localStorage.getItem("missions"));
if (savedMissions && savedMissions.length > 0) {
  allMissions = savedMissions;
  displayMissions(allMissions);
} else {
  
  fetch("missions.json")
    .then(res => res.json())
    .then(data => {
      allMissions = data;
      localStorage.setItem("missions", JSON.stringify(allMissions));
      displayMissions(allMissions);
    })
    .catch(err => console.error("Erreur JSON:", err));
}

/* -------------------------------------------------
    3. Fonction d’affichage des missions
------------------------------------------------- */
function displayMissions(missions) {
  missionsContainer.innerHTML = ""; 

  if (missions.length === 0) {
    missionsContainer.innerHTML = "<p>Aucune mission trouvée </p>";
    return;
  }

  missions.forEach(mission => {
    const card = document.createElement("div");
    card.classList.add("mission-card");

    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const isFav = favoris.some(fav => fav.name === mission.name);

    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h2>${mission.name}</h2>
      <p><strong>Agency:</strong> ${mission.agency}</p>
      <p><strong>Objective:</strong> ${mission.objective}</p>
      <p><strong>Launch Date:</strong> ${mission.launchDate}</p>
     
      <button class="btn-fav">
        <i class="${isFav ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
        ${isFav ? "Favori" : "Ajouter aux favoris"}
      </button>
      <button class="btn-edit">Modifier</button>
      <button class="btn-delete">Supprimer</button>
    `;

    const btnFav = card.querySelector(".btn-fav");
    btnFav.addEventListener("click", () => toggleFavorite(mission, btnFav));
     
     // Bouton Modifier
    const btnEdit = card.querySelector(".btn-edit");
    btnEdit.addEventListener("click", () => openEditForm(mission));
    //Button supprimer
    const btnDelete = card.querySelector(".btn-delete");
    btnDelete.addEventListener("click", () => deleteMission(mission.id));

      
    missionsContainer.appendChild(card);
  });
}

const searchInputt = document.getElementById('searchInput');
const agencyInputt = document.getElementById('agencyFilter');
const yearInputt = document.getElementById('yearInput');
const subjectInput = document.getElementById('subjectInput');
function filterMissions() {
  const search = searchInputt.value.toLowerCase();
  const agency = agencyInputt.value.toLowerCase();
  const year = yearInputt.value;
  const subject = subjectInput.value.toLowerCase();
  const filtered =   allMissions.filter(m => {
    return (m.name.toLowerCase().includes(search)) &&
           (!agency || m.agency.toLowerCase().includes(agency)) &&
           (!year || m.launchDate.includes(year)) &&
          (!subject || m.objective.toLowerCase().includes(subject));
  });

  displayMissions(filtered);
}

searchInputt.oninput = filterMissions;
agencyInputt.onchange = filterMissions;
yearInputt.oninput = filterMissions;
subjectInput.oninput = filterMissions;


displayMissions(allMissions);
/* -------------------------------------------------
    Gestion des favoris
------------------------------------------------- */
function toggleFavorite(mission, btnElement) {
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  const index = favoris.findIndex(fav => fav.name === mission.name);

  if (index === -1) {
    favoris.push(mission);
    btnElement.style.color = "gold";
    btnElement.innerHTML = `<i class="fa-solid fa-star"></i> Favori`;
  } else {
    favoris.splice(index, 1);
    btnElement.style.color = "";
    btnElement.innerHTML = `<i class="fa-regular fa-star"></i> Ajouter aux favoris`;
  }

  localStorage.setItem("favoris", JSON.stringify(favoris));
}

/* -------------------------------------------------
    Affichage des favoris dans une autre section
------------------------------------------------- */
fetch('missions.json')
  .then(res => res.json())
  .then(missions => {
    const container = document.getElementById('mission_sec');
    const btnFavoris = document.getElementById('btn-favoris');

    if (!container || !btnFavoris) return;

    function getFavoris() {
      return JSON.parse(localStorage.getItem('favoris')) || [];
    }

    function setFavoris(favoris) {
      localStorage.setItem('favoris', JSON.stringify(favoris));
    }

    function displayFavoris() {
      const favoris = getFavoris();
      container.innerHTML = "";

      if (favoris.length === 0) {
        container.innerHTML = "<p>Aucun favori pour le moment.</p>";
        return;
      }

      favoris.forEach(fav => {
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.padding = "5px 10px";
        div.style.borderBottom = "1px solid #ffff";

        const p = document.createElement('span');
        p.textContent = fav.name;

        const btnRemove = document.createElement('button');
        btnRemove.textContent = "Supprimer";
        btnRemove.style.background = "none";
        btnRemove.style.border = "none";
        btnRemove.style.color = "red";
        btnRemove.style.cursor = "pointer";

        btnRemove.addEventListener('click', () => {
          const updatedFavoris = getFavoris().filter(f => f.name !== fav.name);
          setFavoris(updatedFavoris);
          displayFavoris();
        });

        div.appendChild(p);
        div.appendChild(btnRemove);
        container.appendChild(div);
      });
    }

    btnFavoris.addEventListener('click', displayFavoris);

  })
  .catch(err => console.error("Erreur JSON :", err));


/*-----------------------------------
Ajouter des Missions
---------------------------------*/
const btnAdd = document.querySelector(".btn-add");
const addForm = document.getElementById("addMissionForm")
const btnCancel=document.getElementById("btnCancel");
btnAdd.addEventListener("click", () => {
  addForm.style.display = getComputedStyle(addForm).display === "none" ? "block" : "none";
});

addForm.addEventListener("submit", e => {
  e.preventDefault();
  const newMission = {
    id: allMissions.length + 1,
    name: document.getElementById("missionName").value.trim(),
    agency: document.getElementById("missionAgency").value.trim(),
    objective: document.getElementById("missionObjective").value.trim(),
    launchDate: document.getElementById("missionDate").value,
    image: document.getElementById("missionImage").value.trim() || "Images/default.png"
  };


  allMissions.push(newMission);
  localStorage.setItem("missions", JSON.stringify(allMissions));
  displayMissions(allMissions);

  addForm.reset();
  addForm.style.display = "none";
  });
  btnCancel.addEventListener("click",()=>{
        addForm.reset();
        addForm.style.display="none";
  });


//Fonction de modification

const editForm = document.getElementById("editMissionForm");
const editIdInput = document.getElementById("editMissionId");
const editNameInput = document.getElementById("editMissionName");
const editAgencyInput = document.getElementById("editMissionAgency");
const editObjectiveInput = document.getElementById("editMissionObjective");
const editDateInput = document.getElementById("editMissionDate");
const editImageInput = document.getElementById("editMissionImage");
const btnCancel1=document.getElementById("btnCancelEdit");

// Fonction pour ouvrir le formulaire avec les infos de la mission
function openEditForm(mission) {
  editForm.style.display = "block"; // afficher le formulaire
  editIdInput.value = mission.id;
  editNameInput.value = mission.name;
  editAgencyInput.value = mission.agency;
  editObjectiveInput.value = mission.objective;
  editDateInput.value = mission.launchDate;
  editImageInput.value = mission.image;
}  

//  Quand on valide la modification
editForm.addEventListener("submit", e => {
  e.preventDefault();

  const id = parseInt(editIdInput.value);
  const index = allMissions.findIndex(m => m.id === id);
  if (index === -1) return; 

  // Mettre à jour les données
  allMissions[index] = {
    ...allMissions[index],
    name: editNameInput.value.trim(),
    agency: editAgencyInput.value.trim(),
    objective: editObjectiveInput.value.trim(),
    launchDate: editDateInput.value,
    image: editImageInput.value.trim() || "Images/default.png"
  };

  // Sauvegarder et recharger
  localStorage.setItem("missions", JSON.stringify(allMissions));
  displayMissions(allMissions);


  editForm.reset();
  editForm.style.display = "none";
});
 btnCancel1.addEventListener("click",()=>{
        editForm.reset();
       editForm.style.display="none";
  });
//Fonction pour la supprimer

function deleteMission(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
    allMissions = allMissions.filter(mission => mission.id !== id);
    localStorage.setItem("missions", JSON.stringify(allMissions));
    displayMissions(allMissions);
  }
}

const btnFavoris = document.querySelector(".btn-favoris");
const favorisContainer = document.getElementById("favorisContainer");
const favorisList = document.getElementById("favorisList");
btnFavoris.addEventListener("click", () => {
const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  favorisContainer.style.display =
    favorisContainer.style.display === "none" ? "block" : "none";
  if (favoris.length === 0) {
    favorisList.innerHTML = "<p>Aucun favori trouvé</p>";
    return;
  }
  favorisList.innerHTML = "";
  favoris.forEach(fav => {
    const card = document.createElement("div");
    card.classList.add("mission-card");
    card.innerHTML = `
      <img src="${fav.image}" alt="${fav.name}">
      <h3>${fav.name}</h3>
      <p><strong>Agence:</strong> ${fav.agency}</p>
      <p><strong>Objectif:</strong> ${fav.objective}</p>
      <p><strong>Date:</strong> ${fav.launchDate}</p>
      <button class="btn-remove-fav">Retirer</button>
    `;
    const btnRemove = card.querySelector(".btn-remove-fav");
    btnRemove.addEventListener("click", () => {
      removeFromFavoris(fav.name);
      card.remove(); 
      displayMissions(allMissions);
    });

    favorisList.appendChild(card);
  });
});


function removeFromFavoris(name) {
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  favoris = favoris.filter(fav => fav.name !== name);
  localStorage.setItem("favoris", JSON.stringify(favoris));
}
