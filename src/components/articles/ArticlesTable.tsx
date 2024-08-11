import { fetchArticle } from '@/services/articleService';
import { DeleteArticle, UpdateArticle } from './ArticleButton';
import Link from 'next/link';

export default async function ArticlesTable() {
  const articles = await fetchArticle();
  // const usernameData = cookies().get('username');
  // if (!usernameData) {
  //   redirect('/login');
  // }
  // const username = usernameData.value;
  const test = 'test1@naver.com';
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {articles?.map((article) => (
              <div
                key={article.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Link href={`/articles/${article.id}/edit`}>
                        <p className="hover:underline">{article.title}</p>
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      {article.content.length > 10 
                        ? `${article.content.substring(0, 10)}...` 
                        : article.content}
                    </p>
                  </div>
  
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{article.createdAt}</p>
                  </div>
                  {test === article.author && (
                    <div className="flex justify-end gap-2">
                      <UpdateArticle articleId={article.id} />
                      <DeleteArticle articleId={article.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Content
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  CreatedDate
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {articles?.map((article) => (
                <tr
                  key={article.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/articles/${article.id}/edit`}>
                        <p className="hover:underline">{article.title}</p>
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {article.content.length > 10 
                      ? `${article.content.substring(0, 10)}...` 
                      : article.content}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {article.createdAt}
                  </td>
                  {test === article.author && (
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateArticle articleId={article.id} />
                        <DeleteArticle articleId={article.id} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}