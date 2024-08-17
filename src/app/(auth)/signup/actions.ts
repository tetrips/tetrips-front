'use server'

import { redirect } from 'next/navigation'

export async function signupFetch(formData: FormData) {
  let redi = true
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    nickname: formData.get('nickname') as string,
    gender: formData.get('gender') ? 'true' : 'false',
    birthDate: formData.get('birth-date') as string,
  }
  console.log(data)
  try {
    const res = await fetch(`http://api.tetrips.co.kr/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log(res)
  } catch (error) {
    console.log(error)
    redi = false
  }
  if (redi) {
    redirect('/login')
  } else {
    redirect('/error/back')
  }
}
