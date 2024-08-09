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
    { email: 'guest1@naver.com', nickname: 'Guest1', img: 'guest1.jpg' },
    { email: 'guest2@naver.com', nickname: 'Guest2', img: 'guest2.jpg' },
  ];

  const projectId = params.projectId;

  const [projectData, placesData] = await Promise.all([
    fetchProjectById(projectId),
    fetchPlaces(''),
  ]);
  console.log(projectData);

  if (!projectData) {
    notFound();
  }

  // 사용 가능한 사용자 데이터 배열 생성 (프로젝트 생성자 및 이미 초대된 게스트 제외)
  const availableUsers = users.filter(user =>
    projectData.creator !== user.email &&
    !projectData.guests.some(guest => guest.email === user.email)
  );

  // 현재 클라이언트에 할당할 사용자 데이터 결정
  let userData;

  if (availableUsers.length > 0) {
    userData = availableUsers[0]; // 할당 가능한 사용자가 있다면 첫 번째 사용자 할당
  } else {
    // 모든 사용자가 이미 할당된 경우 프로젝트의 생성자나 이미 존재하는 게스트 중 한 명을 사용할 수 있음
    userData = {
      email: projectData.creator,
      nickname: 'User1',
      img: '',
    };
  }

  // 프로젝트에 사용자가 이미 존재하지 않는 경우 초대
  if (availableUsers.length > 0) {
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