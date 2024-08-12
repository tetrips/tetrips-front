import { getAccessToken } from '@/services/getAccessToken'

export const getUserInfo = async () => {
  const token = await getAccessToken()
  if (!token) {
    console.log(token)
    console.log('토큰이 없어서 작업을 수행하지 못했습니다.')
    return null
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/getUserInfo`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        cache: 'no-cache',
      },
    )
    if (res.status === 200) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      console.log('status가 200이 아닙니다.')
    }
  } catch (error) {
    console.error(error)
  }
}
