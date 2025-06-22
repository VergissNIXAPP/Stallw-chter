
const firebaseConfig = {
  apiKey: "AIzaSyAA3cGdQ6wx36qhM8mkeFihxYCrgH7pRmM",
  authDomain: "stallwaechter-a4dcd.firebaseapp.com",
  projectId: "stallwaechter-a4dcd",
  storageBucket: "stallwaechter-a4dcd.firebasestorage.app",
  messagingSenderId: "776991059305",
  appId: "1:776991059305:web:e410175f5f722564f321f8"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.getToken({
  vapidKey: "BCwiYM8-LCQLd8L_bs8haEYMgDhitbf-hdeAmUcKZSGaIp-xCI1wDevGtmaU43FgdXe0eLaBITUOjPyMzXdQSNM"
}).then((currentToken) => {
  if (currentToken) {
    console.log("Token erhalten:", currentToken);
  } else {
    console.warn("Kein Token erhalten – Benutzer hat evtl. keine Berechtigung erteilt.");
  }
}).catch((err) => {
  console.error("Fehler beim Abrufen des Tokens:", err);
});
