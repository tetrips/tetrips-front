import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export function userCheck() {
  const username = cookies().get('username')
  if (username === undefined) {
    redirect('/login')
  }
}
export function isLogin() {
  const username = cookies().get('username')
  if (username) {
    redirect('/')
  }
}
