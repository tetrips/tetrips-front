import Cookies from 'js-cookie';

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const setCookie = (name) => {
  Cookies.set(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};