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
  .then(res => res.json()) .then(data => {
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

    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const isFav = favoris.some(fav => fav.name === mission.name);

    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h2>${mission.name}</h2>
      <p><strong>Agency:</strong> ${mission.agency}</p>
      <p><strong>Objective:</strong> ${mission.objective}</p>
      <p><strong>Launch Date:</strong> ${mission.launchDate}</p>
      <p><strong>Type:</strong> ${mission.type || "N/A"}</p>
      <button class="btn-fav">
        <i class="${isFav ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
        ${isFav ? "Favori" : "Ajouter aux favoris"}
      </button>
    `;

    const btnFav = card.querySelector(".btn-fav");
    btnFav.addEventListener("click", () => toggleFavorite(mission, btnFav));

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
  const typeValue = filterType ? filterType.value : "";

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
if (searchButton) {
  searchButton.addEventListener("click", filterMissions);
}

/* -------------------------------------------------
   ⭐ Gestion des favoris
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
   💾 Affichage des favoris dans une autre section
------------------------------------------------- */
fetch('/js/missions.json')
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
        div.style.borderBottom = "1px solid #ddd";

        const p = document.createElement('span');
        p.textContent = fav.name;

        const btnRemove = document.createElement('button');
        btnRemove.textContent = "Retirer";
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

/* -------------------------------------------------
   📝 Validation du formulaire
------------------------------------------------- */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const date = document.getElementById("date");
    const message = document.getElementById("message");

    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,}$/;
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[0-2])[\/\-]\d{4}$/;

    function setError(input, message) {
      const errorMsg = input.parentElement.querySelector(".error-message");
      errorMsg.textContent = message;
      input.classList.add("invalid");
      input.classList.remove("valid");
      isValid = false;
    }

    function setSuccess(input) {
      const errorMsg = input.parentElement.querySelector(".error-message");
      errorMsg.textContent = "";
      input.classList.add("valid");
      input.classList.remove("invalid");
    }

    // Validation
    if (name.value.trim() === "") setError(name, "Le nom est requis");
    else if (!nameRegex.test(name.value.trim())) setError(name, "Le nom n'est pas valide");
    else setSuccess(name);

    if (email.value.trim() === "") setError(email, "L'email est requis");
    else if (!emailRegex.test(email.value.trim())) setError(email, "Format d'email invalide");
    else setSuccess(email);

    if (phone.value.trim() === "") setError(phone, "Le téléphone est requis");
    else if (!phoneRegex.test(phone.value.trim())) setError(phone, "Format du téléphone invalide");
    else setSuccess(phone);

    if (date.value.trim() === "") setError(date, "La date est requise");
    else if (!dateRegex.test(date.value.trim())) setError(date, "Format attendu : JJ/MM/AAAA");
    else setSuccess(date);

    if (message.value.trim() === "") setError(message, "Le message est requis");
    else if (message.value.trim().length < 10) setError(message, "Le message doit contenir au moins 10 caractères");
    else setSuccess(message);

    if (isValid) {
      alert("Formulaire envoyé avec succès !");
      contactForm.reset();
      document.querySelectorAll("input, textarea").forEach(el => el.classList.remove("valid"));
    }
  });
}
