'use client'
export default function Page() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-cyan-500">백엔드 에러</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">백엔드에 문제가 있습니다.</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">백엔드 개발자에게 문의해 보세요</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            <button
              className="text-sm font-semibold text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              다시 시도하기 <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
