import NoProject from '@/components/project/NoProject'
import ProjectList from '@/components/project/ProjectList';
import Sidebar from '@/components/project/Sidebar'
import { fetchProjectsByUserId } from '@/services/projectService';


export default async function Page() {
  const username = "testUser";
  const projects = await fetchProjectsByUserId(username);

  if (!projects|| projects.length === 0) {
    return (
      <div className="flex">
        <Sidebar />
        <NoProject />
      </div>
    );
  }
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <ProjectList projects={projects} />
      </div>
    </main>
  )
}
