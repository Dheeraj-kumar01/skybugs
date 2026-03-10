const mapDiv = document.getElementById("map");

if (mapDiv) {
  var map = L.map("map").setView([coordinates[1], coordinates[0]], 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
}

L.marker([coordinates[1], coordinates[0]]).addTo(map);

var popup = L.popup()
    .setLatLng([coordinates[1], coordinates[0]])
    .setContent('<p>Exact location will be provided after booking.</p>')
    .openOn(map);



marker.bindPopup(popupContent).openPopup();
