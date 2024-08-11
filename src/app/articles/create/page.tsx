
import CreateArticleForm from '@/components/articles/CreateArticleForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Article',
};

export default async function Page() {

  return (
    <main>
      <CreateArticleForm />
    </main>
  );
}

