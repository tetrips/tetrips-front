export async function existsEmailCheck(email:string){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/exists-email?email=${email}`, {
  });
  console.log(response);
  if(response.status === 409){
    return 'fail';
  }
  else if(response.status === 200){
    return 'success';
  }
  else {
    return 'error';
  }
}
export async function existsNicknameCheck(nickname : string){
  const encoder = new TextEncoder();
  const encodedNickname = Array.from(encoder.encode(nickname))
    .map(byte => '%' + byte.toString(16).padStart(2, '0'))
    .join('');
// utf-8로 인코딩 후 url-safe 인코딩
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/exists-nickname?nickname=${encodedNickname}`, {
  });
  console.log(response);
  if(response.status === 409){
    return 'fail';
  }
  else if(response.status === 200){
    return 'success';
  }
  else if(response.status === 400){
    return 'not-supported';
  }
  else {
    return 'error';
  }
}