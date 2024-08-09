import { fetchProjectById, inviteGuest } from '@/services/projectService';
import { fetchPlaces } from '@/services/placeService';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectHeader from '@/components/project/ProjectHeader';
import EditProjectForm from '@/components/project/EditProjectForm';

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

  const users = [
    { email:'user1@naver.com', nickname: 'User1', img: 'user1.jpg' },
    { email: 'guest1@naver.com', nickname: 'Guest1', img: 'guest1.jpg' },
    { email: 'guest2@naver.com', nickname: 'Guest2', img: 'guest2.jpg' },
    { email: 'guest3@naver.com', nickname: 'Guest3', img: 'guest3.jpg' },
    { email: 'guest4@naver.com', nickname: 'Guest4', img: 'guest4.jpg' },
  ];
  //클라이언트가 접속할 때마다 순서대로 사용자 데이터를 할당
  const clientIndex = (Math.random() * users.length) | 0;
  const userData = users[clientIndex];

  const projectId = params.projectId;

  const [projectData, placesData] = await Promise.all([
    fetchProjectById(projectId),
    fetchPlaces(''),
  ]);
  console.log(projectData);

  if (!projectData) {
    notFound();
  }

  // 프로젝트에 사용자가 이미 존재하지 않는 경우 하드코딩된 사용자 데이터를 추가
  if (projectData.creator !== userData.email && !projectData.guests.some(guest => guest.email === userData.email)) {
    try {
      await inviteGuest(projectId, userData.email, userData.nickname, userData.img);
    } catch (error) {
      console.error('Error inviting guest:', error);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader project={projectData} />
      <EditProjectForm projectData={projectData} placesData={placesData} userData={userData}/>
    </div>
  );
}