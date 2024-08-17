'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/auth/Button'
import { TextField } from '@/components/auth/Fields'
import Cookies from 'js-cookie'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  // const router = useRouter()
  //
  // useEffect(() => {
  //   const username = Cookies.get('username')
  //   if (username) {
  //     router.push('/')
  //   }
  // }, [router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      // const res = await fetch(`http://localhost:3000/test/login`, {
      // const res = await fetch(`/api/cookie/return/first`, {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/local`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      )

      if (res.ok) {
        console.log(res)
        // router.push('/');
        window.location.href = '/'
      } else {
        console.error('Login failed')
        setIsError(true)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <AuthLayout
      title="Sign in to account"
      subtitle={
        <>
          회원이 아니신가요?{' '}
          <Link href="/signup" className="text-cyan-600">
            여기
          </Link>{' '}
          를 눌러 가입하세요.
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isError ? (
          <p className="text-red-600">아이디나 비밀번호가 틀렸습니다.</p>
        ) : null}
        <Button type="submit" color="cyan" className="mt-8 w-full">
          로그인
        </Button>
      </form>
    </AuthLayout>
  )
}
