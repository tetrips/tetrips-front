'use client'
import { ClientProject } from '@/types/Project';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { CreateProject, DeleteProject, UpdateProject } from './ProjectButton';
import ItineraryModalButton from './ItineraryModalButton';
import { ClientFolder } from '@/types/Folder';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function ProjectList({ projects, folderId, folders }: { projects: ClientProject[] | null, folderId: string | null, folders: ClientFolder[] | null }) {
  const router = useRouter();
  if (!projects) return null;
  const filteredProjects = folderId
    ? projects.filter(project => project.folderId === folderId)
    : projects;

  const moveProject = async (projectId: string, newFolderId: string | null) => {
    
    try {
      const response = await fetch(`/api/projects/${projectId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId: newFolderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move project');
      }
      router.refresh();
    } catch (error) {
      console.error('Error moving project:', error);
    }
  };

  return (
    <div className='relative block w-full rounded-lg border-1 border-dashed border-gray-300 p-7 text-center'>
      <CreateProject/>
    <ul role="list" className="divide-y divide-gray-100">
      {filteredProjects.map((project) => (
        <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <Link
                href={`/project/${project.id}`}
              >
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
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                {project.startDate} - {project.endDate}
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate">Created by {project.creator}</p>
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
                <MenuItem as="div">
                    <Listbox
                      value={project.folderId || ''}
                      onChange={(newFolderId) => moveProject(project.id, newFolderId)}
                    >
                      <div className="relative">
                        <ListboxButton className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 bg-white rounded-md">
                          {folders?.find(folder => folder.id === project.folderId)?.name || 'base'}
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption
                            key=""
                            value=""
                            className={({ focus }) =>
                              `cursor-default select-none relative py-2 px-5 ${
                                focus ? 'text-white bg-cyan-500' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  base
                                </span>
                              </>
                            )}
                          </ListboxOption>
                          {folders && folders.map((folder) => (
                            <ListboxOption
                              key={folder.id}
                              value={folder.id}
                              className={({ focus }) =>
                                `cursor-default select-none relative py-2 px-5 ${
                                  focus ? 'text-white bg-cyan-500' : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {folder.name}
                                  </span>
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </MenuItem>
                <MenuItem>
                  <DeleteProject projectId={project.id} />
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
    </div>
  )
}

