'use client'

import { useEffect, useState } from 'react'
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
import { getUserInfo } from '@/services/getUserInfo'
import { updateUserInfo } from '@/services/updateUserInfo'
import { existsNicknameCheck } from '@/services/existsCheck'
import { redirect } from 'next/navigation'
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
type EditModeKey = 'nickname' | 'email' | 'birthDate'

export default function Page() {
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editMode, setEditMode] = useState<Record<EditModeKey, boolean>>({
    nickname: false,
    email: false,
    birthDate: false,
  })
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    birthDate: '',
  })
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo()
      if (userInfo) {
        setFormData({
          nickname: userInfo.nickname,
          email: userInfo.email,
          birthDate: userInfo.birthDate,
        })
      }
    }
    fetchUserInfo()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleEditClick = (field: EditModeKey) => {
    setEditMode((prevMode) => {
      const newMode = { ...prevMode, [field]: !prevMode[field] }
      setIsUpdating(Object.values(newMode).some((mode) => mode))
      return newMode
    })
  }

  const handleSaveClick = (field: EditModeKey) => {
    setEditMode((prevMode) => {
      const newMode = { ...prevMode, [field]: false }
      setIsUpdating(Object.values(newMode).some((mode) => mode))
      return newMode
    })
  }
  const validateNickname = (nickname: string) => {
    const re = /^[a-zA-Z가-힣0-9]+$/
    return re.test(nickname)
  }
  const handleNicknameCheck = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const form = event.currentTarget.closest('form')
    if (form) {
      const formData = new FormData(form)
      const nickname = formData.get('nickname') as string

      if (!validateNickname(nickname)) {
        alert('닉네임은 영어와 한글만 포함할 수 있습니다.')
        return
      }

      let result = await existsNicknameCheck(nickname)
      if (result === 'success') {
        alert('사용 가능한 닉네임 입니다.')
        setIsNicknameChecked(true)
      } else if (result === 'fail') {
        alert('이미 사용중인 닉네임입니다.')
        setIsNicknameChecked(false)
      } else if (result === 'not-supported') {
        alert('지원하지 않는 언어입니다.')
        setIsNicknameChecked(false)
      } else {
        redirect('/error/back')
      }
    }
  }
  const handleSaveAllClick = async () => {
    await updateUserInfo(formData)
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

              <form>
                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      닉네임
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      {editMode.nickname ? (
                        <>
                          <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            className="text-gray-900"
                          />
                          <button
                            type="button"
                            onClick={handleNicknameCheck}
                            className={classNames(
                              'min-w-[8rem] rounded-md p-2',
                              isNicknameChecked ? 'bg-cyan-500' : 'bg-gray-200',
                            )}
                          >
                            중복 체크
                          </button>
                        </>
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
                        disabled={editMode.nickname && !isNicknameChecked}
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
                      {editMode.birthDate ? (
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="text-gray-900"
                        />
                      ) : (
                        <div className="text-gray-900">
                          {formData.birthDate}
                        </div>
                      )}
                      <button
                        type="button"
                        className="font-semibold text-cyan-500 hover:text-indigo-500"
                        onClick={() =>
                          editMode.birthDate
                            ? handleSaveClick('birthDate')
                            : handleEditClick('birthDate')
                        }
                      >
                        {editMode.birthDate ? 'Save' : 'Update'}
                      </button>
                    </dd>
                  </div>
                </dl>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className={classNames(
                      'mt-10 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                      isUpdating
                        ? 'bg-gray-200'
                        : 'bg-cyan-500 hover:bg-indigo-500',
                    )}
                    onClick={handleSaveAllClick}
                    disabled={isUpdating}
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
