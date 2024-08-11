'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, Field, Label, Switch } from '@headlessui/react'
import {
  BellIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
const secondaryNavigation = [
  {
    name: '개인 정보',
    href: '/mypage/user',
    icon: UserCircleIcon,
    current: true,
  },
  {
    name: '비밀번호 변경',
    href: '/mypage/password',
    icon: FingerPrintIcon,
    current: false,
  },
  {
    name: '회원 탈퇴',
    href: '/mypage/withdraw',
    icon: UsersIcon,
    current: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Page() {
  const [editMode, setEditMode] = useState({
    nickname: false,
    email: false,
    birthdate: false,
  })
  const [formData, setFormData] = useState({
    nickname: '김동은',
    email: 'test@test.com',
    birthdate: '1998-04-16',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleEditClick = (field: string) => {
    // @ts-ignore
    setEditMode((prevMode) => ({ ...prevMode, [field]: !prevMode[field] }))
  }

  const handleSaveClick = (field: string) => {
    // Save changes logic here
    setEditMode((prevMode) => ({ ...prevMode, [field]: false }))
  }

  const handleSaveAllClick = () => {
    // Save all changes logic here
    console.log('All changes saved:', formData)
  }

  return (
    <>
      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <h1 className="sr-only">General Settings</h1>

        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul
              role="list"
              className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0',
                      )}
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                개인 정보
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Update 버튼을 눌러 수정할 수 있습니다.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    닉네임
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {editMode.nickname ? (
                      <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className="text-gray-900"
                      />
                    ) : (
                      <div className="text-gray-900">{formData.nickname}</div>
                    )}
                    <button
                      type="button"
                      className="font-semibold text-cyan-500 hover:text-indigo-500"
                      onClick={() =>
                        editMode.nickname
                          ? handleSaveClick('nickname')
                          : handleEditClick('nickname')
                      }
                    >
                      {editMode.nickname ? 'Save' : 'Update'}
                    </button>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    이메일
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{formData.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    생년월일
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {editMode.birthdate ? (
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        className="text-gray-900"
                      />
                    ) : (
                      <div className="text-gray-900">{formData.birthdate}</div>
                    )}
                    <button
                      type="button"
                      className="font-semibold text-cyan-500 hover:text-indigo-500"
                      onClick={() =>
                        editMode.birthdate
                          ? handleSaveClick('birthdate')
                          : handleEditClick('birthdate')
                      }
                    >
                      {editMode.birthdate ? 'Save' : 'Update'}
                    </button>
                  </dd>
                </div>
              </dl>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="mt-10 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleSaveAllClick}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
