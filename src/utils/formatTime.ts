import { toZonedTime } from "date-fns-tz";

export function convertToKoreanDate(date: Date): Date {
  const timeZone = 'Asia/Seoul'; 
  return toZonedTime(date, timeZone);
}