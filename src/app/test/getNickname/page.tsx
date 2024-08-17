import { getNickname } from '@/services/getNickname'
export default function Page() {
  const res = async () => {
    return await getNickname()
  }
  return (
    <>
      <button onClick={res}>닉네임 받기</button>
    </>
  )
}
