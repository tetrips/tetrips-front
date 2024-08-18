'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CreateProject() {
  return (
    <Link
      href="/project/create"
      className="flex h-10 w-36 items-center rounded-lg bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span>Create Project</span>{' '}
    </Link>
  );
}

export function UpdateProject({ projectId }: { projectId: string }) {
  return (
    <Link
      href={`/project/${projectId}`}
      className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
    >
      Edit
    </Link>
  );
}

export function DeleteProject({ projectId }: { projectId: string }) {
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?');

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('프로젝트 삭제에 실패했습니다.');
      }
      alert('프로젝트가 성공적으로 삭제되었습니다.');
      router.refresh();

    } catch (error) {
      console.error('Error deleting project:', error);
      alert('프로젝트 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className='block w-32 px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50'
    >
      Delete
    </button>
  );
}

