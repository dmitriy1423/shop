// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDoPqHwU1NrHSRDVERi0bXqtKbCKLv92bo',
	authDomain: 'e-shop-48efb.firebaseapp.com',
	projectId: 'e-shop-48efb',
	storageBucket: 'e-shop-48efb.appspot.com',
	messagingSenderId: '196285909220',
	appId: '1:196285909220:web:c0142a6e59e9c0a386c4f1'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
