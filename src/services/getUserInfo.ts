import { getAccessToken } from '@/services/getAccessToken'
import Cookies from 'js-cookie'

export const getUserInfo = async () => {
  const token = await getAccessToken()
  const email = Cookies.get('username')
  if (!token) {
    console.log(token)
    console.log('토큰이 없어서 작업을 수행하지 못했습니다.')
    window.location.reload()
    return null
  }
  try {
    const res = await fetch(
      `http://api.tetrips.co.kr/user/getUserInfo?email=${email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
    if (res.status === 200) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      console.log('status가 200이 아닙니다.')
      console.log(res)
    }
  } catch (error) {
    console.error(error)
  }
}
