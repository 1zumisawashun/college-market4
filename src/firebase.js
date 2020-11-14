import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyA38Isy2a4vF7sJhptF8cMpv_7KUktLxHw",
    authDomain: "college-market-c83c3.firebaseapp.com",
    databaseURL: "https://college-market-c83c3.firebaseio.com",
    projectId: "college-market-c83c3",
    storageBucket: "college-market-c83c3.appspot.com",
    messagingSenderId: "329940446147",
    appId: "1:329940446147:web:f4eab42581db3da8ceab76",
    measurementId: "G-ZNS469B9H6"
  };
  firebase.initializeApp(config);
}

const db = firebase.firestore();
export { firebase, db };

// xporet const add = collection().doc
// のようにデータをあらかじめ決めることで省略で書くことができる
