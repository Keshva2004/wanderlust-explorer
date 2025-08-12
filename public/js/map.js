	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geoMetry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
    console.log(listing);
    const marker1 = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geoMetry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
         .setHTML(
            `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
         )
         .setMaxWidth("300px")
    )
    .addTo(map);
    