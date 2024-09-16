/* eslint-disable */
// const locations = JSON.parse(document.getElementById('map').dataset.locations);

export const displayMap = (locations) => {

    var myIcon = L.divIcon(
        {
            className: 'marker',
            iconSize: [32,40],
            iconAnchor: [13, 41],
            // iconAnchor: [25, 50],
            popupAnchor: [3, -30],
        }
    );
    
    
    const map = L.map('map', { zoomControl: false });  //to disable + - zoom
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        crossOrigin: ""
    }).addTo(map);
    
    // Create an array to store markers
    const markers = [];
    
    // Add markers and popups
    locations.forEach((loc) => {
        // const marker = L.marker([loc.coordinates[1], loc.coordinates[0]])
        const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], {icon: myIcon})
            .bindPopup(
                L.popup({
                    autoClose: false,
                    className: "mapboxgl-popup-content",
                })
            )
            .setPopupContent(`Day ${loc.day}: ${loc.description}`);
            // .setPopupContent(`<p>Day ${loc.day}: ${loc.description}</p>`);
            
        marker.addTo(map);
        markers.push(marker); // Store the marker
    });
    
    // Use a small delay to ensure the map is fully rendered
    setTimeout(() => {
        // Fit the bounds to include all markers
        const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
        map.fitBounds(bounds, {padding: [200, 150, 100, 100]} );
    
        // Open the first marker's popup as an example
        if (markers.length > 0) {
            markers.forEach((marker) => marker.openPopup());
        }
    }, 100); // Adjust the timeout if necessary
    
    map.scrollWheelZoom.disable();  //to disable zoom by mouse wheel
}