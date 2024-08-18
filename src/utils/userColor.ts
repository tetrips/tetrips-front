export const generateColorFromEmail = (email: string) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = ((hash % 360 + 360) % 360);
  const s = 50 + (hash % 48);
  const l = 75 + (hash % 20);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const getContrastColor = (backgroundColor: string) => {
  // HSL에서 밝기(L) 값 추출
  const l = parseInt(backgroundColor.split(',')[2].slice(0, -2));
  
  // 밝기가 95% 이상이면 검은색, 그렇지 않으면 흰색 반환
  return l >= 95 ? '#000000' : '#ffffff';
};