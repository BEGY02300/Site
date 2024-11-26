// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Config Firebase
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_DOMAINE.firebaseapp.com",
    projectId: "TON_ID_PROJET",
    storageBucket: "TON_STORAGE_BUCKET.appspot.com",
    messagingSenderId: "TON_ID_MESSAGERIE",
    appId: "TON_APP_ID"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");

const userInfo = document.getElementById("user-info");
const welcomeMessage = document.getElementById("welcome-message");
const logoutButton = document.getElementById("logout-button");

// Inscription
registerButton.addEventListener("click", () => {
    const email = registerEmail.value;
    const password = registerPassword.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Inscription réussie !");
        })
        .catch(error => {
            alert("Erreur : " + error.message);
        });
});

// Connexion
loginButton.addEventListener("click", () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            welcomeMessage.innerText = `Bienvenue, ${user.email}`;
            document.getElementById("auth").style.display = "none";
            userInfo.style.display = "block";
        })
        .catch(error => {
            alert("Erreur : " + error.message);
        });
});

// Déconnexion
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            document.getElementById("auth").style.display = "block";
            userInfo.style.display = "none";
        })
        .catch(error => {
            alert("Erreur : " + error.message);
        });
});
