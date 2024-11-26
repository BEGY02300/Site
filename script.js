import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_AUTH_DOMAIN",
  projectId: "TON_PROJECT_ID",
  storageBucket: "TON_STORAGE_BUCKET",
  messagingSenderId: "TON_MESSAGING_SENDER_ID",
  appId: "TON_APP_ID",
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Références aux éléments du DOM
const authDiv = document.getElementById("authDiv");
const userHome = document.getElementById("userHome");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const updateForm = document.getElementById("updateForm");
const newUsername = document.getElementById("newUsername");
const newAvatar = document.getElementById("newAvatar");
const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");
const userAvatar = document.getElementById("userAvatar");

// Événement pour afficher le formulaire d'inscription
document.getElementById("showSignUp").addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "block";
  loginForm.style.display = "none";
});

// Connexion utilisateur
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
});

// Inscription utilisateur
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.signupEmail.value;
  const password = e.target.signupPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Créer un document utilisateur dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: "Nouvel utilisateur",
      avatar: "./images/default-avatar.png",
    });
  } catch (error) {
    alert("Erreur d'inscription : " + error.message);
  }
});

// Déconnexion utilisateur
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert("Erreur de déconnexion : " + error.message);
  }
});

// Mise à jour des données utilisateur
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  try {
    if (newUsername.value) {
      await updateDoc(userRef, { username: newUsername.value });
    }

    if (newAvatar.files[0]) {
      const avatarFile = newAvatar.files[0];
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, avatarFile);
      const avatarURL = await getDownloadURL(avatarRef);
      await updateDoc(userRef, { avatar: avatarURL });
      userAvatar.src = avatarURL;
    }

    alert("Mise à jour réussie !");
  } catch (error) {
    alert("Erreur lors de la mise à jour : " + error.message);
  }
});

// Gestion de l'état utilisateur
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authDiv.style.display = "none";
    userHome.style.display = "block";

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      welcomeMessage.textContent = `Bienvenue, ${userData.username || user.email}`;
      userAvatar.src = userData.avatar || "./images/default-avatar.png";
    }
  } else {
    authDiv.style.display = "block";
    userHome.style.display = "none";
  }
});

