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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/exists-nickname?nickname=${encodeURIComponent(nickname)}`, {
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/exists-nickname?nickname=${nickname}`, {
  });
  console.log(response);
  if(response.status === 209){
    return 'fail';
  }
  else if(response.status === 200){
    return 'success';
  }
  else {
    return 'error';
  }
}