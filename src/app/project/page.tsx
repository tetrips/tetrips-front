import NoProject from '@/components/project/NoProject'
import ProjectList from '@/components/project/ProjectList'
import Sidebar from '@/components/project/Sidebar'
import { fetchProjectsByUserId } from '@/services/projectService'
import { cookies } from 'next/headers'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { redirect } from 'next/navigation'


export default async function Page() {
  const usernameData = cookies().get('username');
  if (!usernameData) {
    redirect('/login');
  }

  const projects = await fetchProjectsByUserId(usernameData.value);

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
