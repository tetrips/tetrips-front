'use client'

import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/auth/Button'
import { SelectField, TextField } from '@/components/auth/Fields'
import { signupFetch } from '@/app/(auth)/signup/actions'
import { useEffect, useState } from 'react'
import { existsEmailCheck, existsNicknameCheck } from '@/services/existsCheck'
import { redirect, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { router } from 'next/client'

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checked, setChecked] = useState(0) //
  // 체크 확인에 대한 로직 수정해야 함 이메일만 두번 체크해도 가입 요청이 가능
  // const router = useRouter()
  //
  // useEffect(() => {
  //   const username = Cookies.get('username')
  //   if (username) {
  //     router.push('/')
  //   }
  // }, [router])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    await signupFetch(formData)
    // 다시 버튼을 활성화 시키는 로직 필요
  }

  const handleEmailCheck = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const form = event.currentTarget.closest('form')
    if (form) {
      const formData = new FormData(form)
      const email = formData.get('email') as string
      let result = await existsEmailCheck(email)
      if (result === 'success') {
        alert('사용 가능한 이메일 입니다.')
        setChecked(checked + 1)
      } else if (result === 'fail') {
        alert('이미 사용중인 이메일입니다.')
      } else {
        redirect('/error/back')
      }
    }
  }
  const handleNicknameCheck = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const form = event.currentTarget.closest('form')
    if (form) {
      const formData = new FormData(form)
      const nickname = formData.get('nickname') as string
      let result = await existsNicknameCheck(nickname)
      if (result === 'success') {
        alert('사용 가능한 닉네임 입니다.')
        setChecked(checked + 1)
      } else if (result === 'fail') {
        alert('이미 사용중인 닉네임입니다.')
      } else if (result === 'not-supported') {
        alert('지원하지 않는 언어입니다.')
      } else {
        redirect('/error/back')
      }
    }
  }
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-full flex items-end space-x-4">
            <TextField
              className="w-full"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className="min-w-[8rem] rounded-md bg-gray-200 p-2"
            >
              중복 체크
            </button>
          </div>
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <div className="col-span-full flex items-end space-x-4">
            <TextField
              className="w-full"
              label="Nickname"
              name="nickname"
              type="text"
              required
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              className="min-w-[8rem] rounded-md bg-gray-200 p-2"
            >
              중복 체크
            </button>
          </div>
          <SelectField label="성별" name="gender">
            <option value="ture">남성</option>
            <option value="false">여성</option>
          </SelectField>
          <TextField label="생년월일" name="birth-date" type="date" required />
        </div>
        <Button
          type="submit"
          color="cyan"
          className={`mt-8 w-full ${isSubmitting || checked < 2 ? 'bg-gray-200' : ''}`}
          disabled={isSubmitting || checked < 2}
        >
          회원가입
        </Button>
      </form>
    </AuthLayout>
  )
}
