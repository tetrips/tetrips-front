import Link from 'next/link'

const teams = [
  { id: 1, name: '친구들', href: '#', initial: 'H', current: false },
  { id: 2, name: '가족', href: '#', initial: 'T', current: false },
  { id: 3, name: '학교', href: '#', initial: 'W', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  return (
    <div className="flex min-w-60 grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-20">
      <div className="flex shrink-0 items-center">
        <Link href="/">
          <img
            className="h-8 w-auto"
            src="/icons/tetrips-logo.png"
            alt="Your Company"
          />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <a
                    href={team.href}
                    className={classNames(
                      team.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    )}
                  >
                    <span
                      className={classNames(
                        team.current
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                      )}
                    >
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto"></li>
        </ul>
      </nav>
    </div>
  )
}
