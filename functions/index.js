const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const apiKey = functions.config().weather.key;

exports.saveToken = functions.https.onRequest(async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).send("Kein Token übergeben.");
  await db.collection("tokens").doc(token).set({ created: Date.now() });
  return res.status(200).send("Token gespeichert.");
});

exports.weatherAlert = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async () => {
    const lat = "54.740486";
    const lon = "9.443811";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const weather = response.data.weather[0].main.toLowerCase();

      if (weather.includes("rain")) {
        const tokensSnap = await db.collection("tokens").get();
        const tokens = tokensSnap.docs.map(doc => doc.id);

        if (tokens.length === 0) return null;

        const payload = {
          notification: {
            title: "🌧️ Regen im Anmarsch",
            body: "Bitte Pferd eindecken!",
            icon: "icon.png"
          }
        };

        await admin.messaging().sendToDevice(tokens, payload);
        console.log(`Push an ${tokens.length} Gerät(e) gesendet.`);
      } else {
        console.log("Kein Regen erkannt.");
      }
    } catch (err) {
      console.error("Fehler beim Wetterabruf oder Push:", err);
    }

    return null;
  });