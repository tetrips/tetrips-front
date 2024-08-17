'use client'
import { getUserInfo } from '@/services/getUserInfo'
export default function Page() {
  const res = async () => {
    return await getUserInfo()
  }
  return (
    <>
      <button onClick={res}>패치버튼</button>
    </>
  )
}
