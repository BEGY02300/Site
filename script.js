import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBODslZ0PEgPfaoYd9Cmalvg7ubiwnO6nI",
  authDomain: "site-web-2-3021e.firebaseapp.com",
  projectId: "site-web-2-3021e",
  storageBucket: "site-web-2-3021e.appspot.com",
  messagingSenderId: "992702393992",
  appId: "1:992702393992:web:cbadca1f8ecb8b134db93d",
  measurementId: "G-EQ8LQVWX7N",
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Éléments DOM
const authDiv = document.getElementById("authDiv");
const userHome = document.getElementById("userHome");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const logoutButton = document.getElementById("logoutButton");
const updateForm = document.getElementById("updateForm");

// Gestion de l'inscription
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    console.log("Tentative d'inscription avec :", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Message de confirmation et redirection
    console.log("Compte créé avec succès :", user);
    alert("Votre compte a été créé avec succès !");
    displayUserHome(user);
  } catch (error) {
    console.error("Erreur d'inscription :", error.message);
    alert("Erreur : " + error.message);
  }
});

// Gestion de la connexion
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    console.log("Tentative de connexion avec :", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Connexion réussie
    console.log("Connexion réussie :", user);
    displayUserHome(user);
  } catch (error) {
    console.error("Erreur de connexion :", error.message);
    alert("Erreur : " + error.message);
  }
});

// Gestion de la déconnexion
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Vous avez été déconnecté.");
    displayAuth();
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error.message);
    alert("Erreur : " + error.message);
  }
});

// Mise à jour des informations utilisateur
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newUsername = document.getElementById("newUsername").value;
  const newAvatar = document.getElementById("newAvatar").files[0];

  try {
    const user = auth.currentUser;

    if (newAvatar) {
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, newAvatar);
      const avatarURL = await getDownloadURL(avatarRef);
      await updateProfile(user, { displayName: newUsername, photoURL: avatarURL });
    } else {
      await updateProfile(user, { displayName: newUsername });
    }

    alert("Profil mis à jour !");
    displayUserHome(user);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error.message);
    alert("Erreur : " + error.message);
  }
});

// État de l'utilisateur
onAuthStateChanged(auth, (user) => {
  if (user) {
    displayUserHome(user);
  } else {
    displayAuth();
  }
});

// Affichage des sections
function displayAuth() {
  authDiv.style.display = "block";
  userHome.style.display = "none";
}

function displayUserHome(user) {
  authDiv.style.display = "none";
  userHome.style.display = "block";

  document.getElementById("welcomeMessage").textContent = `Bonjour, ${user.displayName || user.email}`;
  document.getElementById("userAvatar").src = user.photoURL || "default-avatar.png";
}



