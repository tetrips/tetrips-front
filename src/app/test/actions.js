'use server'

import { cookies } from 'next/headers'

export async function create(data) {
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
export async function get() {
  cookies().get('name')
}