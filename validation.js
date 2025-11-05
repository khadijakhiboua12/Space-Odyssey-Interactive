"use strict";

// ======= Ciblage des éléments du formulaire =======
const form = document.querySelector("#contactForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const messageInput = document.querySelector("#message");
const passwordInput = document.querySelector("#password");

// ======= Ciblage des éléments pour afficher les erreurs =======
const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const phoneError = document.querySelector("#phoneError");
const messageError = document.querySelector("#messageError");
const successMessage = document.querySelector("#successMessage");
const passwordError = document.querySelector("#passwordError");

// ======= Regex pour validation =======
const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/; // seulement lettres
const emailRegex = /^\w+@\w+\.\w+$/; // format email simple
const phoneRegex = /^0[6-7]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?$/; // téléphone FR avec ou sans espaces
const messageRegex = /^.{10,}$/; // message minimum 10 caractères
const passwordRegex = /^(?=.*[a-z])+(?=.*[A-Z])+(?=.*[!@#$% ]).{8,}$/;

// ======= Fonction de validation =======
function validateInput(input, regex, errorElement, errorMessage) {
  if (!regex.test(input.value)) {
    // Si le champ n'est pas valide
    input.classList.add("invalid"); // ajoute bordure rouge
    errorElement.textContent = errorMessage; // message d'erreur
    return false;
  } else {
    // Si le champ est valide
    input.classList.remove("invalid");
    errorElement.textContent = ""; // efface l'erreur
    return true;
  }
}

// ======= Validation en temps réel (oninput) =======
nameInput.addEventListener("input", () =>
  validateInput(nameInput, nameRegex, nameError, "Nom invalide")
);
emailInput.addEventListener("input", () =>
  validateInput(emailInput, emailRegex, emailError, "Email invalide")
);
phoneInput.addEventListener("input", () =>
  validateInput(phoneInput, phoneRegex, phoneError, "Téléphone invalide")
);
messageInput.addEventListener("input", () =>
  validateInput(messageInput, messageRegex, messageError, "Message trop court")
);
passwordInput.addEventListener("input", () =>
  validateInput(
    passwordInput,
    passwordRegex,
    passwordError,
    "Mot de passe faible ou trop court"
  )
);

// ======= Validation au submit =======
form.addEventListener("submit", function (event) {
  event.preventDefault(); // empêche l'envoi automatique du formulaire

  // Vérifie tous les champs
  const isNameValid = validateInput(
    nameInput,
    nameRegex,
    nameError,
    "Nom invalide"
  );
  const isEmailValid = validateInput(
    emailInput,
    emailRegex,
    emailError,
    "Email invalide"
  );
  const isPhoneValid = validateInput(
    phoneInput,
    phoneRegex,
    phoneError,
    "Téléphone invalide"
  );
  const isMessageValid = validateInput(
    messageInput,
    messageRegex,
    messageError,
    "Message trop court"
  );
  const isPasswordValid = validateInput(
    passwordInput,
    passwordRegex,
    passwordError,
    "Weak and short password"
  );

  // Si tout est valide
  if (
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isMessageValid &&
    isPasswordValid
  ) {
    successMessage.textContent = "Formulaire envoyé avec succès !";
    form.reset(); // réinitialise le formulaire
  } else {
    successMessage.textContent = ""; // sinon, aucun message de succès
  }
});
