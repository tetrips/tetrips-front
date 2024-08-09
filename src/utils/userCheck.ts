import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'

export default function userCheck() {
  const username = Cookies.get('username')
  if (username === undefined) {
    redirect('/login')
  }
}
