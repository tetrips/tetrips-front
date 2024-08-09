import '@/styles/globals.css'
import Header from '@/components/common/Header'

import { isLogin } from '@/utils/userCheck'

export default function Layout({ children }: { children: React.ReactNode }) {
  isLogin()
  return <>{children}</>
}
