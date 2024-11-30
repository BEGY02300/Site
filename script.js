import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Références aux éléments HTML
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const userHome = document.getElementById("userHome");
const authDiv = document.getElementById("authDiv");

// Vérification pseudo unique
async function isUsernameTaken(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Sauvegarde des données utilisateur
async function saveUserData(userId, username, avatarUrl) {
  await setDoc(doc(db, "users", userId), {
    username: username,
    avatar: avatarUrl || "./default-avatar.png",
    createdAt: new Date().toISOString()
  });
}

// Gestion de l'inscription
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const username = document.getElementById("signupUsername").value;
  const avatarFile = document.getElementById("signupAvatar").files[0];

  if (await isUsernameTaken(username)) {
    alert("Ce pseudo est déjà pris !");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    let avatarUrl = "./default-avatar.png";
    if (avatarFile) {
      const avatarRef = ref(storage, `avatars/${userId}`);
      await uploadBytes(avatarRef, avatarFile);
      avatarUrl = await getDownloadURL(avatarRef);
    }

    await saveUserData(userId, username, avatarUrl);
    alert("Compte créé avec succès !");
    signupForm.reset();
  } catch (error) {
    console.error(error.message);
    alert("Erreur lors de la création du compte !");
  }
});

// Gestion de la connexion
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById("welcomeMessage").innerText = `Bienvenue, ${userData.username}!`;
      document.getElementById("userAvatar").src = userData.avatar;
      authDiv.style.display = "none";
      userHome.style.display = "block";
    }
  } catch (error) {
    console.error(error.message);
    alert("Erreur de connexion !");
  }
});

// Gestion de la déconnexion
document.getElementById("logoutButton").addEventListener("click", async () => {
  await signOut(auth);
  authDiv.style.display = "block";
  userHome.style.display = "none";
});





