import { CreateArticle } from '@/components/articles/ArticleButton';
import ArticlesTable from '@/components/articles/ArticlesTable';
import { noto } from '@/components/common/fonts';
import { ArticlesTableSkeleton } from '@/components/common/Skeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Articles',
};

export default async function Page({}) {

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${noto.className} text-2xl`}>Articles</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateArticle />
      </div>
      <Suspense fallback={<ArticlesTableSkeleton/>}>
        <ArticlesTable />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">

      </div>
    </div>
  );
}