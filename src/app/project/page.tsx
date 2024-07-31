import NoProject from '@/components/project/NoProject'
import Sidebar from '@/components/project/Sidebar'
import { redirect } from 'next/navigation'


export default function Page() {

  // const {data,error} = getUserCookie()
  // if (error || !data?.user) {
  //   redirect('/login')
  // }
  return (
    <>
      <div className="flex">
        <Sidebar />
        <NoProject />
      </div>
    </>
  )
}
