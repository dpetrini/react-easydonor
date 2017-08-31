// 
// Gets IP from Internet service
//
function getIp(cb) {

  // Some (ramdom) IP viewer service
  let url = 'https://freegeoip.net/json/';
  let data = [];

  fetch(url)
    .then(response => response.json())
    .then(result => {

      if (result.ip !== undefined)
        data.push ({
          ip: result.ip,
          country_code: result.country_code,
          country_name: result.country_name,
          region_code: result.region_code,
          region_name: result.region_name,
          city: result.city,
          zip_code: result.zip_code,
          time_zone: result.time_zone,
          latitude: result.latitude,
          longitude: result.longitude,
          metro_code: result.metro_code,
        });

      cb(null, data[0].ip);
    })
    .catch((err) => {
      console.warn('ERROR(' + err.code + '): ' + err.message);
      cb(err);
    })

}

export { getIp }
