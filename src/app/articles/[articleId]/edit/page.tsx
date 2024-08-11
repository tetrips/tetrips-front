
import EditArticleForm from '@/components/articles/EditArticleForm';
import { fetchArticleById } from '@/services/articleService';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Article Detail',
};

export default async function Page({ params }: { params: { articleId: string } }) {
  const articleId = params.articleId;
  const article = await fetchArticleById(articleId);
  const testEmail = 'test1@naver.com';
  // const usernameData = cookies().get('username');
  // if (!usernameData) {
  //   redirect('/login');
  // }
  // const username = usernameData.value;
  if (!article) {
    notFound();
  }

  return (
    <main>
      <EditArticleForm article={article} testEmail={testEmail}  />
    </main>
  );
}