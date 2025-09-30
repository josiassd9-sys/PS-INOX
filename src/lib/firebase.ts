// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "ps-inox-87453539-229a9",
  "appId": "1:561284818527:web:5b1a0d605b15f6973addea",
  "apiKey": "AIzaSyDeE3LbUdpVY6HB6bNgAi4R7G0ZlC84Fq8",
  "authDomain": "ps-inox-87453539-229a9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "561284818527"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { firebaseApp };
