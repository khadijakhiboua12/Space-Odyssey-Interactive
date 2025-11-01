"use strict";

/* -------------------------------------------------
   🛰️ 1. Sélection des éléments HTML
   ------------------------------------------------- */
const missionsContainer = document.getElementById("mission-cards");
const searchInput = document.querySelector(".search");
const searchButton = document.querySelector(".btn-search");
const filterAgency = document.querySelector(".filter-agency");
const filterYear = document.querySelector(".filter-year");
const filterType = document.querySelector(".filter-type");

let allMissions = []; // 📋 Stockage global de toutes les missions

/* -------------------------------------------------
   🛰️ 2. Charger les missions depuis le JSON
   ------------------------------------------------- */
fetch("/js/missions.json")
  .then(res => res.json())
  .then(data => {
    allMissions = data;
    displayMissions(allMissions); // Affichage initial de toutes les missions
  })
  .catch(err => console.error("Erreur JSON:", err));

/* -------------------------------------------------
   🧱 3. Fonction d’affichage des missions
   ------------------------------------------------- */
function displayMissions(missions) {
  missionsContainer.innerHTML = ""; // Vider le container

  if (missions.length === 0) {
    missionsContainer.innerHTML = "<p>Aucune mission trouvée 🚫</p>";
    return;
  }

  missions.forEach(mission => {
    const card = document.createElement("div");
    card.classList.add("mission-card");

    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h2>${mission.name}</h2>
      <p><strong>Agency:</strong> ${mission.agency}</p>
      <p><strong>Objective:</strong> ${mission.objective}</p>
      <p><strong>Launch Date:</strong> ${mission.launchDate}</p>
      <p><strong>Type:</strong> ${mission.type || "N/A"}</p>
    `;

    missionsContainer.appendChild(card);
  });
}

/* -------------------------------------------------
   🔎 4. Fonction de recherche et filtrage avancé
   ------------------------------------------------- */
function filterMissions() {
  const searchText = searchInput.value.toLowerCase();
  const agencyValue = filterAgency.value;
  const yearValue = filterYear.value;
  const typeValue = filterType ? filterType.value : ""; // si pas de type

  const filtered = allMissions.filter(mission => {
    const matchesText =
      mission.name.toLowerCase().includes(searchText) ||
      mission.agency.toLowerCase().includes(searchText) ||
      mission.objective.toLowerCase().includes(searchText) ||
      mission.launchDate.toLowerCase().includes(searchText);

    const matchesAgency = agencyValue === "" || mission.agency === agencyValue;

    const missionYear = mission.launchDate.split("-")[0];
    const matchesYear = yearValue === "" || missionYear === yearValue;

    const matchesType = typeValue === "" || (mission.type && mission.type === typeValue);

    return matchesText && matchesAgency && matchesYear && matchesType;
  });

  displayMissions(filtered);
}

/* -------------------------------------------------
   🎧 5. Événement : recherche au clic
   ------------------------------------------------- */
searchButton.addEventListener("click", filterMissions);
