import { type Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/auth/Button'
import { TextField } from '@/components/auth/Fields'
import { login } from '@/app/(auth)/login/actions'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function Login() {
  return (
    <AuthLayout
      title="Sign in to account"
      subtitle={
        <>
          회원이 아니신가요?{' '}
          <Link href="/register" className="text-cyan-600">
            여기
          </Link>{' '}
          를 눌러 가입하세요.
        </>
      }
    >
      <form>
        <div className="space-y-6">
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Button
          type="submit"
          color="cyan"
          className="mt-8 w-full"
          formAction={login}
        >
          로그인
        </Button>
      </form>
    </AuthLayout>
  )
}