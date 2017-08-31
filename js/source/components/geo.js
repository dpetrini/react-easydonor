// 
// Gets the coordinates from browser function. 
// On Chrome needs to be https only
//
function navGeoPosition(cb) {

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is Latitude: ' +
                crd.latitude + ' Longitude: ' +
                crd.longitude + ' More or less: ' +
                crd.accuracy + ' m.');

    cb(null, crd.latitude, crd.longitude);

  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    cb(err);
  }

  // request to navigator passing the callbacks
  navigator.geolocation.getCurrentPosition(success.bind(this), error.bind(this), options);

}

export { navGeoPosition }
