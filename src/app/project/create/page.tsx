import CreateProjectForm from '@/components/project/CreateProjectForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Project',
};

export default async function Page() {
  const usernameData = cookies().get('username');
  if (!usernameData) {
    redirect('/login');
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">여행 계획 만들기</h2>
            <p className="mt-2 text-sm text-gray-600">
              여행의 첫 걸음, 지금 시작해보세요!
            </p>
          </div>
          <div className="mt-8">
            <CreateProjectForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/sea1.jpg"
            alt="Travel Template Image"
            fill={true}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>
    </div>
  )
}