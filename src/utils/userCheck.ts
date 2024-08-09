import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function userCheck() {
  const username = cookies().get('username')
  if (username === undefined) {
    redirect('/login')
  }
}
