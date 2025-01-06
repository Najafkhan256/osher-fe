import http from './httpService';

const apiEndpoint =  '/orders';

function orderUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getOrders() {
  return http.get(apiEndpoint);
}

export function getOrder(id) {
  return http.get(orderUrl(id));
}

export function sendCoupon(order) {
  return http.post(apiEndpoint+'/sendcoupon', order);
}



export function saveOrder(order) {
  if (order._id) {
    const body = { ...order };
    delete body._id;
    // delete body.email;
    delete body.publishDate;
    return http.put(orderUrl(order._id), body);
  }

  return http.post(apiEndpoint, order);
}

export function deleteOrder(id) {
  return http.delete(orderUrl(id));
}
