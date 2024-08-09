import { fetchProjectById, inviteGuest } from '@/services/projectService';
import { fetchPlaces } from '@/services/placeService';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ProjectHeader from '@/components/project/ProjectHeader';
import EditProjectForm from '@/components/project/EditProjectForm';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Edit Project',
};

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  //로그인한 사용자인지 확인해야함, 로그인하지않았으면 로그인 페이지로 이동시키기
  //로그인한 사용자면 로그인 사용자 정보가져오기
  const usernameData = cookies().get('username');
  if(!usernameData){
    redirect('/login');
  }
  const username = JSON.stringify(usernameData);
  const userData= {
    email: username,
    nickname: username.split('@')[0],
    img: 'user1.jpg'
  }

  const projectId = params.projectId;

  const [projectData, placesData] = await Promise.all([
    fetchProjectById(projectId),
    fetchPlaces(''),
  ]);
  console.log(projectData);

  if (!projectData) {
    notFound();
  }
  if (projectData.creator !== userData.email && !projectData.guests.some(guest => guest.email === userData.email)) {
    projectData.guests.push({
      email: userData.email,
      nickname: userData.nickname || 'Guest',
      img: userData.img || '',
    });
    await inviteGuest(projectId, userData.email, userData.nickname, userData.img);  
    }


  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader project={projectData} />
      <EditProjectForm projectData={projectData} placesData={placesData} userData={userData}/>
    </div>
  );
}