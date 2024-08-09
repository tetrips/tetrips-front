import Link from 'next/link'

export default function Example() {
  return (
    <Link
      href="/project/create"
      className="relative m-10 block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 pt-20 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <span className="mt-2 block text-sm font-semibold text-gray-900">
        새 프로젝트 생성
      </span>
    </Link>
  )
}
