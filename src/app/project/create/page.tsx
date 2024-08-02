import CreateProjectForm from '@/components/project/CreateProjectForm';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Create Project',
};

export default async function Page() {
  return (
    <div className="min-h-screen flex">
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
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/portfolio-3.jpg"
            alt="Travel Template Image"
            width={1920}
            height={1080}
          />
          <div className="h-full flex items-center justify-center text-white text-4xl font-bold">
            여행 템플릿 이미지
          </div>
        </div>
      </div>
    </div>
  )
}