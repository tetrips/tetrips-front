'use client'
import { deleteFolder } from '@/services/folderAction';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DeleteFolder({ folderId }: { folderId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    const confirmed = window.confirm('폴더를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteFolder(folderId);
      alert('폴더가 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('폴더 삭제 중 오류가 발생했습니다.');
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
