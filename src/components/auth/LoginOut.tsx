'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { BellIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
// @ts-ignore
import { getCookie } from '@/libs/cookieUtils'
import { deleteUserCookie } from '@/app/(auth)/logout/actions'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function LoginOut() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await deleteUserCookie()
    window.location.reload();
  }

  useEffect(() => {
    function fetchUsername() {
      const usernameCookie = getCookie('username'); // getCookie 함수가 비동기 방식이라고 가정
      setUsername(usernameCookie || null); // 쿠키가 없으면 null 설정
      setIsLoading(false);
    }

    fetchUsername();
  }, []);

  if (isLoading) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }
  if(username === null || username ===undefined){
    return (<>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <Link
            href="/login"
            className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </Link>
        </div>
      </>
    )
  }
  else {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Link href={'/project'}>
          <button
            type="button"
            className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Project
          </button>
          </Link>
        </div>
        <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
          <button
            type="button"
            className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton
                className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="/icons/tetrips.jpg"
                  alt="Desktop Profile"
                />
              </MenuButton>
            </div>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={classNames(
                        focus ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      )}
                    >
                      Your Profile
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={classNames(
                        focus ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      )}
                    >
                      Settings
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        focus ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      )}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    )
  }
}