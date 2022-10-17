export const postRequest = (url, data, callback) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => {
      callback(error);
      console.error('Error:', error);
    });

}

export const getRequest = (url, callback) => {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => {
      callback(error);
      console.error('Error:', error);
    });

}

export const isLatitudeValid = (lat) => {
  const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
 return  regexLat.test(lat)}

 export const isLongitudeValid = (lng) => {
  const regexLon =
  /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
return regexLon.test(lng)
}
