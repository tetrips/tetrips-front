import Cookies from 'js-cookie'

export default async function postLogout() {
  const refreshToken = Cookies.get('refreshToken')

  const response = await fetch(`http://api.tetrips.co.kr/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
}
