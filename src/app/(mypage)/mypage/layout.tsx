import '@/styles/globals.css'
import Header from '@/components/common/Header'

import userCheck from '@/utils/userCheck'

export default function Layout({ children }: { children: React.ReactNode }) {
  userCheck()
  return (
    <>
      <Header />
      {children}
    </>
  )
}
