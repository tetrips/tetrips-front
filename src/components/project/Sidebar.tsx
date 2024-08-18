'use client'
import { createFolder, deleteFolder, updateFolder } from '@/services/folderAction';
import { ClientFolder } from '@/types/Folder';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderIcon, MinusIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  folders: ClientFolder[] | null;
  onFolderSelect: (folderId: string | null) => void;
}

export default function Sidebar({ folders, onFolderSelect }: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder(newFolderName.trim());
        setNewFolderName('');
        router.refresh();
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    }
  };

  const handleUpdateFolder = async (folderId: string, newName: string) => {
    try {
      await updateFolder(folderId, newName);
      setEditingFolderId(null);
      router.refresh();
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  return (
    <div className="w-40 md:w-64 h-full p-2 flex flex-col">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-2 py-4 border-b border-dashed border-gray-400">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-xs mb-2 sm:mb-0 truncate"
          placeholder="New folder name"
        />
        <button
          onClick={handleCreateFolder}
          className="w-full sm:w-auto bg-cyan-500 text-white p-2 rounded text-xs md:text-sm"
        >
          <PlusIcon className="w-5 h-5 m-auto" />
        </button>
      </div>
      <ul className="flex-grow overflow-y-auto no-scrollbar pt-4 w-full">
        <li
          className="cursor-pointer hover:bg-gray-200 p-4 rounded text-xs md:text-sm"
          onClick={() => onFolderSelect(null)}
        >
          All Projects
        </li>
        {folders && folders.map((folder) => (
          <li key={folder.id} className="flex items-center justify-between my-2 text-xs md:text-sm w-full">
            {editingFolderId === folder.id ? (
              <input
                type="text"
                defaultValue={folder.name}
                onBlur={(e) => handleUpdateFolder(folder.id, e.target.value)}
                className="w-14 md:w-36 p-1 border rounded truncate text-xs md:text-sm"
              />
            ) : (
              <span
                className="flex cursor-pointer hover:bg-gray-200 p-2 rounded flex-grow truncate"
                onClick={() => onFolderSelect(folder.id)}
              >
                <FolderIcon className="h-4 w-4 mr-2 text-gray-400" />
                {folder.name}
              </span>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingFolderId(folder.id)}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="text-red-500"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
