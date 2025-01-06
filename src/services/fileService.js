import http from './httpService';


const apiEndpoint = '/fileupload/';

export function uploadImage(file, fn) {
  return http.post(apiEndpoint, file,fn);


}


    //http
    //   .post(apiUrl + '/fileupload/', data, {
    //     onUploadProgress: (ProgressEvent) => {
    //       this.setState({
    //         loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
    //       });
    //     },
    //   })
    //   .then((res) => {
    //     // then print response status
    //     console.log(res);
    //   })
    //   .catch((er) => {
    //     console.log(er);
    //   });