import http from './httpService';

const apiEndpoint = '/customers';

function customerUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.email.toLowerCase(),
    name: user.name,
    phone: user.phone,
  });
}

export function getCustomers() {
  return http.get(apiEndpoint);
}

export function getCustomer(id) {
  return http.get(customerUrl(id));
}

export function getMyDetails(_id) {
  return http.get(apiEndpoint + '/mydetails/' + _id);
}

export function updateCustomer(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    if (body.isAdmin) delete body.isAdmin;
    if (body.__v === 0) delete body.__v;
    if (body.publishDate) delete body.publishDate;
    if (body.resetPasswordExpires) delete body.resetPasswordExpires;
    if (body.resetPasswordToken) delete body.resetPasswordToken;

    body.email = body.email.toLowerCase();
    return http.put(customerUrl(user._id), body);
  }
}

export function getDataofForgotUser(user) {
  user.username = user.username.toLowerCase();
  return http.get(
    apiEndpoint + '/forgotpassword/' + user.username + '/' + user.name
  );
}

export function getCurrentPassword(user) {
  return http.get(
    apiEndpoint + '/currentpassword/' + user._id + '/' + user.password
  );
}

export function sendForgotPasswordLink(user) {
  const email = user.username.toLowerCase();
  const body = { email: email };
  return http.post(apiEndpoint + '/forgotpasswordlink', body);
}

export function verfiyResetLink(token) {
  return http.get(apiEndpoint + '/reset/' + token);
}
