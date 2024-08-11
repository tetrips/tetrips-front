import { isLogin } from '@/utils/userCheck'

export default function Layout({ children }: { children: React.ReactNode }) {
  isLogin()
  return <>{children}</>
}
