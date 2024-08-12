import { ClientProject } from '@/types/Project';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { CreateProject, DeleteProject, UpdateProject } from './ProjectButton';
import Link from 'next/link';
import ItineraryModalButton from './ItineraryModalButton';

// const statuses: { Complete: string; 'In progress': string; Archived: string } = {
//   Complete: 'text-green-700 bg-green-50 ring-green-600/20',
//   'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
//   Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
// }

export default function ProjectList({projects}:{projects:ClientProject[]}) {
  return (
    <div className='relative block w-full rounded-lg border-1 border-dashed border-gray-300 p-7 text-center'>
      <CreateProject/>
    <ul role="list" className="divide-y divide-gray-100">
      {projects.map((project) => (
        <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">{project.title}</p>
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
            <a
              href={`/project/${project.id}/image`}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
              View project<span className="sr-only">, {project.title}</span>
            </a>
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
                  <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
                    Move<span className="sr-only">, {project.title}</span>
                  </a>
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

