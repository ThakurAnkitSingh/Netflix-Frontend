import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration


const firebaseConfig = {
    apiKey: "AIzaSyC1Jlxs6_ABcwPpwzC5-IJjIA83SuK7kao",
    authDomain: "netflix-clone-a9e85.firebaseapp.com",
    projectId: "netflix-clone-a9e85",
    storageBucket: "netflix-clone-a9e85.appspot.com",
    messagingSenderId: "804426691188",
    appId: "1:804426691188:web:a555b411dddc914b0d5721",
    measurementId: "G-YXWQEW6PVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
