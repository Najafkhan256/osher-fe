import http from './httpService';

const apiEndpoint = '/products';

function productUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProducts() {
  return http.get(apiEndpoint);
}

export function getProduct(id) {
  return http.get(productUrl(id));
}

export function saveProduct(product) {
  if (product._id) {
    const body = { ...product };
    delete body._id;
    if (body.publishDate) delete body.publishDate;
    return http.put(productUrl(product._id), body);
  }

  return http.post(apiEndpoint, product);
}

export function deleteProduct(id) {
  return http.delete(productUrl(id));
}
