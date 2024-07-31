import { type Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/auth/Button'
import { SelectField, TextField } from '@/components/auth/Fields'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function Register() {
  return (
    <AuthLayout
      title="Sign up for an account"
      subtitle={
        <>
          이미 회원이신가요?{' '}
          <Link href="/login" className="text-cyan-600">
            여기
          </Link>{' '}
          를 눌러 로그인하세요.
        </>
      }
    >
      <form>
        <div className="grid grid-cols-2 gap-6">
          <TextField
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <SelectField className="col-span-full" label="성별" name="gender">
            <option>남성</option>
            <option>여성</option>
          </SelectField>
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          회원가입
        </Button>
      </form>
    </AuthLayout>
  )
}
