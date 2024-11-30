// Importation des modules Firebase nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBODslZ0PEgPfaoYd9Cmalvg7ubiwnO6nI",
  authDomain: "site-web-2-3021e.firebaseapp.com",
  projectId: "site-web-2-3021e",
  storageBucket: "site-web-2-3021e.appspot.com",
  messagingSenderId: "992702393992",
  appId: "1:992702393992:web:cbadca1f8ecb8b134db93d",
  measurementId: "G-EQ8LQVWX7N"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Sélecteurs HTML
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignUp = document.getElementById("showSignUp");
const authDiv = document.getElementById("authDiv");
const userHome = document.getElementById("userHome");
const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

// Fonction pour afficher l'écran utilisateur
function displayUserHome(user) {
  authDiv.style.display = "none";
  userHome.style.display = "block";
  welcomeMessage.textContent = `Bienvenue, ${user.email}`;
}

// Fonction pour revenir à l'écran de connexion
function displayAuth() {
  authDiv.style.display = "block";
  userHome.style.display = "none";
}

// Gestion des erreurs Firebase
function handleFirebaseError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      alert("Cet email est déjà utilisé. Veuillez en essayer un autre.");
      break;
    case "auth/weak-password":
      alert("Le mot de passe est trop faible. Utilisez au moins 6 caractères.");
      break;
    case "auth/user-not-found":
      alert("Aucun utilisateur trouvé avec cet email.");
      break;
    case "auth/wrong-password":
      alert("Mot de passe incorrect.");
      break;
    default:
      alert("Erreur : " + error.message);
  }
}

// Inscription
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert("Compte créé avec succès !");
    displayUserHome(user);
  } catch (error) {
    console.error(error);
    handleFirebaseError(error);
  }
});

// Connexion
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert("Connexion réussie !");
    displayUserHome(user);
  } catch (error) {
    console.error(error);
    handleFirebaseError(error);
  }
});

// Déconnexion
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Déconnexion réussie !");
    displayAuth();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la déconnexion : " + error.message);
  }
});

// Surveillance de l'état de connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    displayUserHome(user);
  } else {
    displayAuth();
  }
});

// Afficher le formulaire d'inscription
showSignUp.addEventListener("click", (e) => {
  e.preventDefault(); // Empêche l'action par défaut du lien
  signupForm.style.display = "block";
  loginForm.style.display = "none";
});




