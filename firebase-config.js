
const firebaseConfig = {
  apiKey: "FAKE-KEY-NICHT-NÖTIG",
  authDomain: "stall-wetterwaechter.firebaseapp.com",
  projectId: "stall-wetterwaechter",
  messagingSenderId: "776991059305",
  appId: "1:776991059305:web:dummyid",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    messaging.getToken({
      vapidKey: "BCwiYM8-LCQLd8L_bs8haEYMgDhitbf-hdeAmUcKZSGaIp-xCI1wDevGtmaU43FgdXe0eLaBITUOjPyMzXdQSNM"
    }).then((token) => {
      console.log("FCM Token:", token);
    });
  }
});
