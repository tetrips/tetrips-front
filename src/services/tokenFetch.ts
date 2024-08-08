import Cookies from 'js-cookie';

export async function tokenRefresh() {
  if(!Cookies.get('accessToken')) {
  const refreshToken = Cookies.get('refreshToken');
  console.log("tokenFetch 함수 : " + refreshToken)

  try {
    const res = await fetch(`http://localhost:3000/api/cookie/return/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refreshToken}),
    });

    if (res.ok) {
      console.log("tokenFetch 함수 로그 :" + res);
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
}