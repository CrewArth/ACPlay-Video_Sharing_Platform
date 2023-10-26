import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx66PAwmAKD8RvCSZbmwC97wAeNgrX2sM",
  authDomain: "acplay-e64d4.firebaseapp.com",
  projectId: "acplay-e64d4",
  storageBucket: "acplay-e64d4.appspot.com",
  messagingSenderId: "501356850543",
  appId: "1:501356850543:web:7e34a2ad4fbf499d3c4c9a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();

export default app;
