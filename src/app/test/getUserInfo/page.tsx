import Cookies from 'js-cookie'
import { getUserInfo } from '@/services/getUserInfo'
import { getAccessToken } from '@/services/getAccessToken'
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
