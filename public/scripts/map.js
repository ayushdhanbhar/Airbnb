   const mapToken = "<%= process.env.MAP_TOKEN %>";
    console.log("Mapbox Token:", mapToken);
    if (typeof mapboxgl !== 'undefined') {
      mapboxgl.accessToken = mapToken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.209, 28.6139],
        zoom: 9
      });
    } else {
      console.error("Mapbox GL JS not loaded.");
    }