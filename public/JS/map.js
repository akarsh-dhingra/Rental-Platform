	mapboxgl.accessToken =maptoken; 
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10// starting zoom
    });
        const marker1 = new mapboxgl.Marker({color:"black"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML
        (`<h4>${listing.location}</h4><p>Exact Location Provided after booking</p>`))
        .addTo(map);

    // coordinates ka location mai convert hona hota hai forward geocoding:


// Geocoding is the process of converting addresses(like a street address) into geographic coordinates
// like (latitude and longitude), which you can use to place markers on a map, or position the map.


