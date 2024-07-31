'use client';

import { redirect } from 'next/navigation'

export default function Page() {
  const fetchLogin = async () => {
    try {
      const email = 'qwerty@qwerty.com'
      const password = '1234'
      console.log("보내는 데이터", email, password);

      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/local`, {
      const res = await fetch(`http://localhost:3000/test/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(res)
    } catch (error) {
      console.log(error)
      redirect('error');
    }
  }

  return (
    <div className="bg-cyan-400" onClick={fetchLogin}>
      로그인 테스트 버튼
    </div>
  );
}
