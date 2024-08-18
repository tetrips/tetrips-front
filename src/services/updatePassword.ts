import { getAccessToken } from '@/services/getAccessToken'
import Cookies from 'js-cookie'

export const updatePassword = async (
  lastPassword: string,
  newPassword: string,
) => {
  const email = Cookies.get('email')
  const token = await getAccessToken()
  if (!token) {
    console.log(token)
    console.log('토큰이 없어서 작업을 수행하지 못했습니다.')
    window.location.reload()
    return null
  }
  try {
    const res = await fetch(`https://api.tetrips.co.kr/auth/updatePassword`, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ lastPassword, newPassword, email }),
    })
    if (res.status === 200) {
      const data = await res.json()
      console.log(data)
      alert('비밀번호가 변경되었습니다.')
      return data
    } else if (res.status === 401) {
      console.log('status가 401입니다.')
      alert('비밀번호가 틀렸습니다.')
    } else {
      alert('백엔드 에러')
      console.log('status가 200이 아닙니다.')
      console.log(res)
    }
  } catch (error) {
    console.error(error)
  }
}
