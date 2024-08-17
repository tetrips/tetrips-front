import { toZonedTime } from "date-fns-tz";

export function convertToKoreanDate(date: Date): Date {
  const timeZone = 'Asia/Seoul'; 
  return toZonedTime(date, timeZone);
}

export const formatDateTime = (datetime:string) => {
  const year = datetime.substring(0, 4);
  const month = datetime.substring(4, 6);
  const day = datetime.substring(6, 8);
  const hour = datetime.substring(8, 10);
  const minute = datetime.substring(10, 12);

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
}