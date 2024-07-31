'use server'

import { cookies } from 'next/headers'

export async function deleteUserCookie() {
  cookies().delete('username')
  cookies().delete('refreshToken')
  cookies().delete('accessToken')
  cookies().delete('nickname' )
}