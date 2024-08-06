'use client'

import { getCookie } from '../../../libs/cookieUtils'

export default function Page() {
  const test1 = async () => {
    if (!getCookie('accessToken')){
      const refreshToken = getCookie('refreshToken');
      try {
        const res = await fetch(`/api/cookie/return/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
          console.log("test component :" + res);
        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }
  return (
    <div>
      <h1>Token</h1>
      <button onClick={test1}>토큰 갱신</button>
    </div>
  );
}