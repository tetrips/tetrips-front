export const getUserInfo = async (email: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/getUserInfo?email=${email}`);
  if (res.status === 200) {
    return res.json();
  }
  else{
    console.log("status가 200이 아닙니다.")
  }
}