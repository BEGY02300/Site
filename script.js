import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "siteweb-721ed.firebaseapp.com",
  projectId: "siteweb-721ed",
  storageBucket: "siteweb-721ed.appspot.com",
  messagingSenderId: "224755625406",
  appId: "1:224755625406:web:b5791b1a99a6ee55329def",
  measurementId: "G-NR4Y9DTMR6"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Gestion des formulaires
const authDiv = document.getElementById("authDiv");
const userHome = document.getElementById("userHome");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutButton = document.getElementById("logoutButton");

// Connexion utilisateur
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Connexion réussie !");
      displayUserHome(userCredential.user);
    })
    .catch((error) => console.error("Erreur de connexion :", error.message));
});

// Inscription utilisateur
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Compte créé avec succès !"))
    .catch((error) => console.error("Erreur d'inscription :", error.message));
});

// Déconnexion utilisateur
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Déconnecté !");
      displayAuth();
    })
    .catch((error) => console.error("Erreur de déconnexion :", error.message));
});

// Vérification de l'état de connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    displayUserHome(user);
  } else {
    displayAuth();
  }
});

// Fonctions d'affichage
function displayAuth() {
  authDiv.style.display = "block";
  userHome.style.display = "none";
}

function displayUserHome(user) {
  authDiv.style.display = "none";
  userHome.style.display = "block";
  document.getElementById("welcomeMessage").textContent = `Bonjour, ${user.email}`;
}


