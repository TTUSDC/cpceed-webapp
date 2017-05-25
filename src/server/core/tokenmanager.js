export function decode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export function saveToken(token){
  localStorage.setItem('sessiontoken', token);
}

export function getToken(){
  return localStorage.getItem('sessiontoken');
}
