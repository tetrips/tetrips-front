'use client'

import { getAccessToken } from '../../../services/getAccessToken'

export default function Page() {
  const onHi = async () => {
    await getAccessToken()
  }

  return (
    <div>
      <h1>Token</h1>
      <button onClick={onHi}>토큰 갱신</button>
    </div>
  )
}
