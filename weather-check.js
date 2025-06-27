
const apiKey = '3b30f0ec369c94c3584c440f1e1654d8';
const statusEl = document.getElementById('status');
const iconEl = document.getElementById('icon');
const alertBox = document.getElementById('alert-box');

// Speicher Standort in localStorage
function saveLocation() {
  const lat = document.getElementById('latitude').value;
  const lon = document.getElementById('longitude').value;
  localStorage.setItem('stall_lat', lat);
  localStorage.setItem('stall_lon', lon);
  checkWeather(); // Sofort checken nach Speicherung
}

// Hole gespeicherten Standort oder Default
function getLocation() {
  const lat = localStorage.getItem('stall_lat') || "54.740486";
  const lon = localStorage.getItem('stall_lon') || "9.443811";
  return { lat, lon };
}

async function checkWeather() {
  const { lat, lon } = getLocation();
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
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

checkWeather();
setInterval(checkWeather, 15 * 60 * 1000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js');
}
