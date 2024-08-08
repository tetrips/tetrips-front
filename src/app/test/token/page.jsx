'use client'


import { tokenRefresh } from '../../../services/tokenFetch'

export default function Page() {
  const onHi = async() => {
    await tokenRefresh()
  }

  return (
    <div>
      <h1>Token</h1>
      <button onClick={onHi}>토큰 갱신</button>
    </div>
  );
}