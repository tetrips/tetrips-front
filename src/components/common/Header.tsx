'use client'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import LoginOut from '@/components/auth/LoginOut'

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <img
                      className="h-8 w-auto"
                      src="/icons/tetrips-logo.png"
                      alt="tetrips logo"
                    />
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    href="/manual"
                    // className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900" // 하이라이트된 탭
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    사용 방법
                  </Link>
                </div>
              </div>
              <LoginOut />
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <DisclosureButton
                as="a"
                href="/manual"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700 sm:pl-5 sm:pr-6"
              >
                사용 방법
              </DisclosureButton>
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4 sm:px-6">
                <div className="flex-shrink-0">
                  {/*<img*/}
                  {/*  className="h-10 w-10 rounded-full"*/}
                  {/*  src="/icons/tetrips.jpg"*/}
                  {/*  alt="Mobile Profile"*/}
                  {/*/>*/}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-500">
                    여행 계획은 PC 버전에서 진행해 주세요.
                  </div>
                </div>
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                {/*>*/}
                {/*  <span className="absolute -inset-1.5" />*/}
                {/*  <span className="sr-only">View notifications</span>*/}
                {/*  <BellIcon className="h-6 w-6" aria-hidden="true" />*/}
                {/*</button>*/}
              </div>
              {/*<div className="mt-3 space-y-1">*/}
              {/*  <DisclosureButton*/}
              {/*    as="a"*/}
              {/*    href="/mypage/user"*/}
              {/*    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"*/}
              {/*  >*/}
              {/*    Profile*/}
              {/*  </DisclosureButton>*/}
              {/*  <DisclosureButton*/}
              {/*    as="a"*/}
              {/*    href="#"*/}
              {/*    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"*/}
              {/*  >*/}
              {/*    Sign out*/}
              {/*  </DisclosureButton>*/}
              {/*</div>*/}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
