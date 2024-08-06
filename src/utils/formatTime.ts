
export function convertToKoreanDate(date: Date): Date {
  const koreanTimeOffset = 9 * 60;
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcTime + koreanTimeOffset * 60000);
}