import firebase from 'firebase/app';
import 'firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCQqEx83VQQs2p3Cdjph2o_b5_Z6yv616c',
//   authDomain: 'beverix.firebaseapp.com',
//   databaseURL: 'https://beverix.firebaseio.com',
//   projectId: 'beverix',
//   storageBucket: 'beverix.appspot.com',
//   messagingSenderId: '682224474661',
//   appId: '1:682224474661:web:011b18397918dcfc6bfdcc',
//   measurementId: 'G-PV596FT0B2',
// };

// firebase.initializeApp(firebaseConfig);

const firebaseConfig = {
  apiKey: "AIzaSyCcxYe_6QH7uwDkXiAPdoNXaynvDmeaZNc",
  authDomain: "osher-19100.firebaseapp.com",
  projectId: "osher-19100",
  storageBucket: "osher-19100.firebasestorage.app",
  messagingSenderId: "189774323965",
  appId: "1:189774323965:web:4784c0f45a62ff05789e94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
