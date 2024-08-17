import NoProject from '@/components/project/NoProject'
import ProjectList from '@/components/project/ProjectList'
import Sidebar from '@/components/project/Sidebar'
import { fetchProjectsByUserId } from '@/services/projectService'
import { cookies } from 'next/headers'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { redirect } from 'next/navigation'
import { fetchFoldersByUserId } from '@/services/folderService'



export default async function Page() {
  // const usernameData = cookies().get('username');
  // if (!usernameData) {
  //   redirect('/login');
  // }
  // const username = usernameData.value;
  const test = 'test1@naver.com';
  

  const projects = await fetchProjectsByUserId(test);
  const folders = await fetchFoldersByUserId(test);

  if (!projects || projects.length === 0) {
    return (
      <>
        <Header />
        <div className="flex pt-10">
          <Sidebar projects={projects} folders={folders} />
          <NoProject />
        </div>
        <Footer />
      </>
    )
  }
  return (
    <>
      <Header />
      <div className="h-screen">
        <Sidebar projects={projects} folders={folders}/>
      </div>
      <Footer />
    </>
  )
}
