import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBODslZ0PEgPfaoYd9Cmalvg7ubiwnO6nI",
  authDomain: "site-web-2-3021e.firebaseapp.com",
  projectId: "site-web-2-3021e",
  storageBucket: "site-web-2-3021e.firebasestorage.app",
  messagingSenderId: "992702393992",
  appId: "1:992702393992:web:cbadca1f8ecb8b134db93d",
  measurementId: "G-EQ8LQVWX7N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignUp = document.getElementById("showSignUp");
const userHome = document.getElementById("userHome");
const authDiv = document.getElementById("authDiv");
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");
const updateForm = document.getElementById("updateForm");
const newUsername = document.getElementById("newUsername");
const newAvatar = document.getElementById("newAvatar");
const userAvatar = document.getElementById("userAvatar");

showSignUp.addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loadUserHome();
  } catch (error) {
    console.error("Erreur de connexion", error);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  } catch (error) {
    console.error("Erreur d'inscription", error);
  }
});

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  authDiv.style.display = "block";
  userHome.style.display = "none";
});

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = newUsername.value;
  if (!username || username.length < 3) {
    alert("Le nom d'utilisateur doit comporter au moins 3 caractères.");
    return;
  }

  // Vérification si le nom d'utilisateur est déjà pris
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    alert("Ce nom d'utilisateur est déjà pris.");
    return;
  }

  // Vérification de l'image (pas de contenu PEGI 18)
  const avatarFile = newAvatar.files[0];
  if (avatarFile) {
    const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(avatarRef, avatarFile);
    const avatarURL = await getDownloadURL(avatarRef);

    // Mise à jour des données utilisateur
    const userRef = collection(db, "users");
    await addDoc(userRef, {
      username,
      avatar: avatarURL
    });

    alert("Votre profil a été mis à jour avec succès!");
  }
});

async function loadUserHome() {
  authDiv.style.display = "none";
  userHome.style.display = "block";
  welcomeMessage.innerText = `Bienvenue ${auth.currentUser.email}`;

  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", auth.currentUser.email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    userAvatar.src = userData.avatar;
  }
}





