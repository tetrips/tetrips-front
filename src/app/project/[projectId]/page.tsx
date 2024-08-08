import { fetchProjectById } from '@/services/projectService';
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
  const projectId = params.projectId;

  const [projectData, placesData] = await Promise.all([
    fetchProjectById(projectId),
    fetchPlaces(''),
  ]);
  console.log(projectData);

  if (!projectData) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader project={projectData} />
      <EditProjectForm projectData={projectData} placesData={placesData}/>
    </div>
  );
}