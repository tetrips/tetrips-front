'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { ClientProject } from '@/types/Project';
import { ClientFolder } from '@/types/Folder';
import ProjectList from './ProjectList';

interface ProjectsClientProps {
  projects: ClientProject[];
  folders: ClientFolder[] | null;
}

export default function ProjectsClient({ projects, folders }: ProjectsClientProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const filteredProjects = selectedFolderId
    ? projects.filter(project =>
        folders?.some(folder => folder.id === selectedFolderId && folder.projectIds?.includes(project.id))
      )
    : projects;

  return (
    <div className="flex items-start justify-between gap-2 h-full">
      <Sidebar
        folders={folders}
        onFolderSelect={handleFolderSelect}
      />
      <ProjectList
        projects={filteredProjects}
        folders={folders}
      />
    </div>
  );
}