
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || "🌧️ Wetterwarnung!";
  const options = {
    body: data.body || "Regen im Anmarsch – bitte Pferd eindecken!",
    icon: "icon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
