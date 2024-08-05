'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/auth/Button';
import { TextField } from '@/components/auth/Fields';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // const res = await fetch(`http://localhost:3000/test/login`, {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        console.log(res);
        // router.push('/');
        window.location.href = '/';
      } else {
        console.error('Login failed');
        setIsError(true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    if(isError) {
      alert('로그인 실패');
    }
  };

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
        <Button
          type="submit"
          color="cyan"
          className="mt-8 w-full"
        >
          로그인
        </Button>
      </form>
    </AuthLayout>
  );
}