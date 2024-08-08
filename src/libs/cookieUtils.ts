import Cookies from 'js-cookie';

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

// export const setCookie = (name) => {
//   Cookies.set(name);
// };

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};