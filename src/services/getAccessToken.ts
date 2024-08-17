import Cookies from 'js-cookie'

export async function getAccessToken() {
  if (!Cookies.get('accessToken')) {
    const refreshToken = Cookies.get('refreshToken')
    console.log('tokenFetch 함수 : ' + refreshToken)

    try {
      const res = await fetch(`/api/cookie/return/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (res.ok) {
        console.log('res.ok :' + res.ok)
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  } else {
    return Cookies.get('accessToken')
  }
}
