import { getAccessToken } from '@/services/getAccessToken'
import Cookies from 'js-cookie'

export const updateUserInfo = async (userInfo: {
  nickname: string
  email: string
  birthDate: string
}) => {
  const token = await getAccessToken()
  if (!token) {
    console.log('토큰이 없어서 작업을 수행하지 못했습니다.')
    return null
  }
  try {
    const res = await fetch(`http://api.tetrips.co.kr/user/updateUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(userInfo),
    })
    if (res.status === 200) {
      const data = await res.json()
      alert('회원정보가 수정되었습니다.')
      console.log('User info updated:', data)
      return data
    } else {
      console.log('status가 200이 아닙니다.')
    }
  } catch (error) {
    console.error(error)
  }
}
