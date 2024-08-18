'use client'
import { ClientFolder } from '@/types/Folder'
import { ClientProject } from '@/types/Project'
import { useState } from 'react';
import DeleteFolder from './DeleteFolder';
import ProjectList from './ProjectList';
import { createFolder } from '@/services/folderAction';
import { useFormState } from 'react-dom';
import { FolderIcon, PlusIcon } from '@heroicons/react/24/outline';


export default function Sidebar({ projects,folders }: { projects: ClientProject[] | null, folders:ClientFolder[]| null}) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const initialState = { message: '', errors: {} };
  const [state, formAction] = useFormState(createFolder, initialState);
  
  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto no-scrollbar">
        <div className="p-4">
          <form action={formAction} className="mb-4">
            <div className="flex items-center">
              <input
                id='name'
                name='name'
                type='text'
                placeholder='New folder name'
                className='flex-grow p-2 text-sm border-b border-gray-300 focus:outline-none focus:border-cyan-500'
              />
              <button type="submit" className="flex p-2 text-cyan-600">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    !selectedFolderId ? 'bg-cyan-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Projects
                </button>
              </li>
              {folders && folders.map((folder) => (
                <li key={folder.id}>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100">
                    <button 
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`flex items-center flex-grow text-sm font-medium ${
                        selectedFolderId === folder.id ? 'text-cyan-500' : 'text-gray-700'
                      }`}
                    >
                      <FolderIcon className={`h-4 w-4 mr-2 ${
                        selectedFolderId === folder.id ? 'text-cyan-500' : 'text-gray-400'
                      }`} />
                      {folder.name}
                    </button>
                    <DeleteFolder folderId={folder.id} />
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex-grow">
        <ProjectList projects={projects} folderId={selectedFolderId} folders={folders}/>
      </div>
    </div>
  )
}
