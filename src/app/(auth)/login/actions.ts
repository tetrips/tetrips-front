// 'use server'
//
// import { redirect } from 'next/navigation'
// import cookie from 'cookie';
// import { cookies } from 'next/headers'
// export async function login(formData: FormData) {
//   try {
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     // console.log("보내는 데이터", email, password);
//
//     const res = await fetch(`https://api.tetrips.co.kr/auth/login/local`, {
//     // const res = await fetch(`https://localhost:3000/test/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });
//     console.log(res)
//     if (res.ok) {
//       const setCookie = res.headers.get('set-cookie');
//       if (setCookie) {
//         const parsed = cookie.parse(setCookie);
//         console.log(parsed)
//         cookies().set('username', parsed['username'], parsed);
//         cookies().set('accessToken', parsed['accessToken'], parsed);
//         cookies().set('refreshToken', parsed['refreshToken'], parsed);
//       } else {
//         console.log('set-cookie 헤더가 존재하지 않습니다.');
//       }}
//     else{
//       console.log('로그인 에러입니다.')
//     }
//   } catch (error) {
//     console.log(error)
//       redirect('error');// redirect 는 try-catch 밖으로 이동해야 함
//   }
// }
