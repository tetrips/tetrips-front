'use client'
import { ClientProject } from '@/types/Project';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { CreateProject, DeleteProject, UpdateProject } from './ProjectButton';
import ItineraryModalButton from './ItineraryModalButton';
import Link from 'next/link';
import { addProjectToFolder, removeProjectFromFolder } from '@/services/folderAction';
import { ClientFolder } from '@/types/Folder';

interface ProjectListProps {
  projects: ClientProject[];
  folders: ClientFolder[] | null;
}

export default function ProjectList({ projects, folders }: ProjectListProps) {

  const handleAddToFolder = async (newFolderId: string, projectId: string) => {
    try {
      const currentFolder = folders?.find(folder => folder.projectIds?.includes(projectId));
      if (currentFolder) {
        await removeProjectFromFolder(currentFolder.id, projectId);
      }
      await addProjectToFolder(newFolderId, projectId);
    } catch (error) {
      console.error('Failed to move project to folder:', error);
    } 
  };

  const getCurrentFolderForProject = (projectId: string): string | null => {
    const folder = folders?.find(f => f.projectIds?.includes(projectId));
    return folder ? folder.id : null;
  };

  return (
    <div className='relative block w-full h-full rounded-lg border-l border-dashed border-gray-300 p-7 text-center overflow-y-auto no-scrollbar'>
      <CreateProject/>
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => {
          const currentFolderId = getCurrentFolderForProject(project.id);
          return (
            <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <Link href={`/project/${project.id}`}>
                  <p className="text-sm font-semibold leading-6 text-gray-900">{project.title}</p>
                </Link>
                <p
                  className={clsx(
                    project.itineraries.length > 0,
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                  )}
                >
                  {project.itineraries.length} 일
                </p>
              </div>
              <div className="mt-1 flex flex-col items-center gap-x-2 text-xs leading-5 text-gray-500 md:flex-row">
                <p className="whitespace-nowrap">
                  {project.startDate} - {project.endDate}
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current hidden md:block">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">
                  Creator: {
                    project.guests.find((guest) => guest.email === project.creator)?.nickname || 'Unknown'
                  }
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current hidden md:block">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">
                  <span className='px-1'>Collaborators:</span>
                  <span className="space-x-2">
                    {project.guests.map((guest) => (
                      <span key={guest.email}>{guest.nickname}</span>
                    ))}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <ItineraryModalButton project={project}/>
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <UpdateProject projectId={project.id} />
                    </MenuItem>
                    <MenuItem>
                      <DeleteProject projectId={project.id} />
                    </MenuItem>
                    <MenuItem>
                      {folders && folders.length > 0 ? (
                        <Menu as="div" className="relative">
                          <MenuButton className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                            Move
                          </MenuButton>
                          <MenuItems className="absolute -left-40 top-0 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {folders
                              .filter(folder => folder.id !== currentFolderId)
                              .map((folder) => (
                                <MenuItem key={folder.id}>
                                  {({ focus }) => (
                                    <button
                                      className={`${
                                        focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } group flex w-full justify-center items-center px-2 py-2 text-sm`}
                                      onClick={() => handleAddToFolder(folder.id, project.id)}
                                    >
                                      {folder.name}
                                    </button>
                                  )}
                                </MenuItem>
                              ))}
                          </MenuItems>
                        </Menu>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-700">No folders available</div>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )
}