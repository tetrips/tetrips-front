import NoProject from '@/components/project/NoProject'
import ProjectList from '@/components/project/ProjectList'
import Sidebar from '@/components/project/Sidebar'
import { fetchProjectsByUserId } from '@/services/projectService'
import { cookies } from 'next/headers'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default async function Page() {
  const userEmail = 'testUser@naver.com'
  const username = cookies().get('username')

  const projects = await fetchProjectsByUserId(userEmail)

  if (!projects || projects.length === 0) {
    return (
      <>
        <Header />
        <div className="flex pt-10">
          <Sidebar />
          <NoProject />
        </div>
        <Footer />
      </>
    )
  }
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <ProjectList projects={projects} />
      </div>
      <Footer />
    </>
  )
}
