
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAk4d9d8p_N5TG2PnuUSk2iGclxDnymFGM",
  authDomain: "gtl-beatplace.firebaseapp.com",
  projectId: "gtl-beatplace",
  storageBucket: "gtl-beatplace.firebasestorage.app",
  messagingSenderId: "18982102662",
  appId: "1:18982102662:web:e573cc6d82ae82038e1307",
  measurementId: "G-6T5WNB1DRN"
};

const app = initializeApp(firebaseConfig);

// Export instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Re-export Firestore methods to ensure they share the same version/context
export { 
  collection, doc, setDoc, getDoc, getDocs, query, orderBy, onSnapshot, deleteDoc,
  ref, uploadBytes, getDownloadURL
};
