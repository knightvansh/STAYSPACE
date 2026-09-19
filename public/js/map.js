// In public/js/map.js (NO EJS TAGS ALLOWED HERE)

// Safely extract coordinates, fallback to Prayagraj if missing
const lat = listing.geometry?.coordinates[1] || 25.4358;
const lng = listing.geometry?.coordinates[0] || 81.8463;

const map = L.map('map').setView([lat, lng], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([lat, lng])
 .addTo(map)
 .bindPopup(`<b>${listing.title}</b><br>${listing.location}`) // Using JS template literals, not EJS
 .openPopup();