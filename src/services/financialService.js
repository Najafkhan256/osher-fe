import http from './httpService';

const apiEndpoint = '/financials';

function financeUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getFinancials() {
  return http.get(apiEndpoint);
}

export function getLocation(id) {
  return http.get(financeUrl(id));
}

export function saveFinancial(financial) {
//   if (financial._id) {
//     const body = { ...financial };
//     delete body._id;
//     if (body.publishDate) delete body.publishDate;
//     return http.put(financeUrl(location._id), body);
//   }

  return http.post(apiEndpoint, financial);
}

export function deleteLocation(id) {
  return http.delete(financeUrl(id));
}
