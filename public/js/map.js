

const mapDiv = document.getElementById("map");

if(mapDiv){

var map = L.map('map').setView([coordinates[1], coordinates[0]], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© OpenStreetMap'
}).addTo(map);

}