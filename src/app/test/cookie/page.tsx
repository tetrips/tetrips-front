import { cookies } from 'next/headers'

export default function Page(){
  const cookieStore = cookies()
  console.log(cookieStore.get('username'))
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  )
}