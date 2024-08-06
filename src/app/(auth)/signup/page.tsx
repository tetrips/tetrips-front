'use client'

import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/auth/Button'
import { SelectField, TextField } from '@/components/auth/Fields'
import { signupFetch } from '@/app/(auth)/signup/actions'
import { useState } from 'react'

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checked, setChecked] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    await signupFetch(formData);
    // 다시 버튼을 활성화 시키는 로직 필요

  };

  const handleEmailCheck = async() => {
    setChecked(checked + 1);
  }
  const handleNicknameCheck = async() => {
    setChecked(checked + 1);
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
            <button type="button" onClick={handleEmailCheck} className="p-2 bg-gray-200 rounded-md min-w-[8rem]">중복 체크</button>
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
          <button type="button" onClick={handleNicknameCheck} className="p-2 bg-gray-200 rounded-md min-w-[8rem]">중복 체크</button>
          </div>
          <SelectField label="성별" name="gender">
            <option value="ture">남성</option>
            <option value="false">여성</option>
          </SelectField>
          <TextField
            label="생년월일"
            name="birth-date"
            type="date"
            required
          />
        </div>
        <Button type="submit" color="cyan" className={`mt-8 w-full ${isSubmitting || checked !== 2 ? 'bg-gray-200' : ''}`} disabled={isSubmitting || checked !== 2}>
          회원가입
        </Button>
      </form>
    </AuthLayout>
  )
}
