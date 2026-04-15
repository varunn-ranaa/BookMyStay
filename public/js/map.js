const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],       // icon size
  iconAnchor: [20, 40],     // icon bottom center map 
  popupAnchor: [0, -40]     // popup icon
});

const map = L.map("map").setView([lat, lng], 13);

L.tileLayer(
  `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`
).addTo(map);

L.marker([lat, lng], { icon: customIcon })
  .addTo(map)
  .bindPopup(
    `<div style="width:180px">
      <img src="${listingImage}" style="width:100%; height:110px; object-fit:cover; border-radius:6px;" />
      <div style="padding: 6px 2px;">
        <b style="font-size:13px;">${listingTitle}</b><br/>
        <span style="color:#555; font-size:12px;">${listingLocation}</span><br/>
        <span style="font-weight:600; color:#e74c3c; font-size:13px;">₹${listingPrice}</span>
      </div>
    </div>`,
    { maxWidth: 200 }
  )
  .openPopup();