import Cookies from 'js-cookie';

export default async function postLogout() {
  const refreshToken = Cookies.get('refreshToken');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  }