import http from './httpService';

const apiEndpoint = '/videos';

function videoUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getVideos() {
  return http.get(apiEndpoint);
}

export function getVideo(id) {
  return http.get(videoUrl(id));
}

export function saveVideo(video) {
  if (video._id) {
    const body = { ...video };
    delete body._id;
    if (body.publishDate) delete body.publishDate;
    return http.put(videoUrl(video._id), body);
  }

  return http.post(apiEndpoint, video);
}

export function deleteVideo(id) {
  return http.delete(videoUrl(id));
}
