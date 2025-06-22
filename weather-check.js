
const lat = 54.740486;
const lon = 9.443811;
const apiKey = '3b30f0ec369c94c3584c440f1e1654d8';
const statusEl = document.getElementById('status');
const iconEl = document.getElementById('icon');
const alertBox = document.getElementById('alert-box');

async function checkWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    const weatherDesc = data.weather[0].main.toLowerCase();
    const weatherId = data.weather[0].id;
    statusEl.textContent = `Aktuelles Wetter: ${weatherDesc}`;
    iconEl.textContent = getWeatherIcon(weatherId);

    if (weatherDesc.includes("rain")) {
      alertBox.classList.remove("hidden");
      pushNotification("Regen angekündigt im Stall, bitte Pferd eindecken");
    } else {
      alertBox.classList.add("hidden");
    }
  } catch (err) {
    console.error('Fehler beim Abrufen der Wetterdaten', err);
    statusEl.textContent = "Fehler beim Abrufen der Wetterdaten";
    iconEl.textContent = "❌";
    alertBox.classList.add("hidden");
  }
}

function getWeatherIcon(code) {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 800) return "☀️";
  if (code > 800) return "☁️";
  return "❓";
}

function pushNotification(message) {
  messaging.getToken().then((token) => {
    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Authorization": "key=BCwiYM8-LCQLd8L_bs8haEYMgDhitbf-hdeAmUcKZSGaIp-xCI1wDevGtmaU43FgdXe0eLaBITUOjPyMzXdQSNM",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: "Stall Wetterwächter",
          body: message
        }
      })
    });
  });
}

checkWeather();
setInterval(checkWeather, 15 * 60 * 1000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js');
}
