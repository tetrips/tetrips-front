import { fetchProjectById, inviteGuest } from '@/services/projectService'
import { fetchPlaces } from '@/services/placeService'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import ProjectHeader from '@/components/project/ProjectHeader'
import EditProjectForm from '@/components/project/EditProjectForm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export const metadata: Metadata = {
  title: 'Edit Project',
}

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {

  const usernameData = cookies().get('username')
  if (!usernameData) {
    redirect('/login')

  }
  const username = usernameData.value

  const userData = {
    email: username,
    nickname: username.split('@')[0],
  }

  const projectId = params.projectId

  const [projectData, placesData] = await Promise.all([
    fetchProjectById(projectId),
    fetchPlaces(''),
  ])
  //console.log(projectData);

  if (!projectData) {
    notFound()
  }

  if (projectData.creator !== userData.email && !projectData.guests.some(guest => guest.email === userData.email)) {
    await inviteGuest(projectId, userData.email, userData.nickname);
    revalidatePath(`/projects/${projectId}`);
    }


  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader project={projectData} userData={userData}/>
      <EditProjectForm projectData={projectData} placesData={placesData} userData={userData}/>
    </div>
  )
}
