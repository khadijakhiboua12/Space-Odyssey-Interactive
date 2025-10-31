// // Charger le fichier JSON dynamiquement
// fetch('missions.json')
//   .then(response => response.json())
//   .then(data => {
//     afficherMissions(data);
//     activerRechercheEtFiltres(data);
//   })
//   .catch(error => console.error("Erreur de chargement JSON :", error));

// // Fonction pour afficher les cartes des missions
// function afficherMissions(missions) {
//   const container = document.querySelector(".parg77");
//   container.innerHTML = ""; // vider avant d’ajouter

//   missions.forEach(mission => {
//     const card = document.createElement("div");
//     card.classList.add("sect1");

//     card.innerHTML = `
//       <div class="sect2"><h1>${mission.name}</h1></div>
//       <div class="i1"><img src="${mission.image}" alt="${mission.name}"></div>
//       <div class="pg1">
//         <p>
//           <strong>Agency:</strong> ${mission.agency}<br>
//           <strong>Objective:</strong> ${mission.objective}<br>
//           <strong>Launch Date:</strong> ${mission.launchDate}
//         </p>
//       </div>
//     `;
//     container.appendChild(card);
//   });
// }

// // === Recherche et filtrage dynamiques ===
// function activerRechercheEtFiltres(missions) {
//   const searchInput = document.getElementById("searchInput");
//   const agencyFilter = document.getElementById("agencyFilter");
//   const yearFilter = document.getElementById("yearFilter");

//   function filtrer() {
//     const searchText = searchInput.value.toLowerCase();
//     const agency = agencyFilter.value.toLowerCase();
//     const year = yearFilter.value;

//     const filtered = missions.filter(mission => {
//       const matchText =
//         mission.name.toLowerCase().includes(searchText) ||
//         mission.agency.toLowerCase().includes(searchText) ||
//         mission.objective.toLowerCase().includes(searchText);

//       const matchAgency = agency === "" || mission.agency.toLowerCase().includes(agency);
//       const matchYear = year === "" || mission.launchDate.includes(year);

//       return matchText && matchAgency && matchYear;
//     });

//     afficherMissions(filtered);
//   }

//   searchInput.addEventListener("input", filtrer);
//   agencyFilter.addEventListener("change", filtrer);
//   yearFilter.addEventListener("change", filtrer);
// }

"use strict";

// Json Data Link------------------------
fetch("/js/missions.json")
  .then((response) => response.json()) .then((data) => {
    const missionsContainer = document.getElementById("mission-cards");
    data.forEach((mission) => {
    console.log(mission.launchDate);
    const card = document.createElement("div");
    card.classList.add("mission-card");

      // ✅ Utilisation des backticks ``
    card.innerHTML = `
        <img src="${mission.image}" alt="${mission.name}">
        <h2>${mission.name}</h2>
        <p>Agency: ${mission.agency}</p>
        <p>Objective: ${mission.objective}</p>
        <p>Launch Date: ${mission.launchDate}</p>
      `;

      missionsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching missions:", error));
