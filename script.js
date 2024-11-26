// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const authDiv = document.getElementById("auth");
const userHome = document.getElementById("user-home");
const welcomeMessage = document.getElementById("welcome-message");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const updateForm = document.getElementById("update-form");
const newUsername = document.getElementById("new-username");
const newAvatar = document.getElementById("new-avatar");

// Inscription
document.getElementById("register-button").addEventListener("click", async () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crée une entrée dans Firestore pour ce nouvel utilisateur
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: "Anonyme",
            avatar: "default-avatar.png"
        });

        alert("Inscription réussie !");
    } catch (error) {
        alert("Erreur : " + error.message);
    }
});

// Connexion
document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Erreur : " + error.message);
    }
});

// Gestion de l'état utilisateur
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Récupère les données de l'utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        welcomeMessage.textContent = `Bienvenue, ${userData.email}`;
        userAvatar.src = userData.avatar;
        userName.textContent = `Nom d'utilisateur

        .catch(error => {
            alert("Erreur : " + error.message);
        });
});
