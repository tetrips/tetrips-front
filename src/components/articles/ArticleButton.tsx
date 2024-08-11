'use client'
import { deleteArticle } from '@/services/articleAction';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function CreateArticle() {
  return (
    <Link
      href="/articles/create"
      className="flex h-10 items-center rounded-lg bg-color8 px-4 text-sm font-medium text-white transition-colors hover:bg-color6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Article</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateArticle({ articleId }: { articleId: string }) {
  return (
    <Link
      href={`/articles/${articleId}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteArticle({ articleId }: { articleId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteArticle(articleId);
      alert('게시글이 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
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
