const map = L.map("map").setView([lat, lng], 13);

L.tileLayer(
  `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`
).addTo(map);

L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
  .openPopup();