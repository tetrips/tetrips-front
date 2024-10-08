import { getAccessToken } from '@/services/getAccessToken'
import Cookies from 'js-cookie'
import { deleteUserCookie } from '@/app/(auth)/logout/actions'
import postLogout from '@/services/postLogout'

export const deleteUser = async () => {
  const token = await getAccessToken()
  const email = Cookies.get('username')
  if (!token) {
    //console.log(token)
    //console.log('토큰이 없어서 작업을 수행하지 못했습니다.')
    return null
  }
  try {
    const res = await fetch(
      `https://api.tetrips.co.kr/user/deleteUser?email=${email}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
    if (res.status === 200) {
      const data = await res.json()
      //console.log(data)
      await deleteUserCookie()
      await postLogout()
      window.location.reload()
      return data
    } else {
      alert('백엔드 에러')
      //console.log('status가 200이 아닙니다.')
    }
  } catch (error) {
    console.error(error)
  }
}
