import http from './httpService';

const apiEndpoint = '/locations';

function locationUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getLocations() {
  return http.get(apiEndpoint);
}

export function getLocation(id) {
  return http.get(locationUrl(id));
}

export function saveLocation(location) {
  if (location._id) {
    const body = { ...location };
    delete body._id;
    if (body.publishDate) delete body.publishDate;
    return http.put(locationUrl(location._id), body);
  }

  return http.post(apiEndpoint, location);
}

export function deleteLocation(id) {
  return http.delete(locationUrl(id));
}
