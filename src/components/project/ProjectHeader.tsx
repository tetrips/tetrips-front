'use client'

import { useYjs } from "@/hooks/useYjs";
import { ClientProject, Guest } from "@/types/Project";
import { noto } from "../common/fonts";
import { useCallback } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useYjsGuests } from "@/hooks/useYjsGuests";
import { generateColorFromEmail, getContrastColor } from "@/utils/userColor";

export default function ProjectHeader({project,userData}:{project:ClientProject,userData:Guest}) {
  const {updateProject,isSaving } = useYjs({project});
  const {guests} = useYjsGuests(project.id,userData)

  const handleInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/project/${project.id}`);
    alert('프로젝트 초대 링크가 복사되었습니다.');
  }
  
  const handleComplete = async () => {
    try{
      await updateProject();
      alert('프로젝트가 저장되었습니다.');
    }catch(e){
      alert('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  const getUserColors = useCallback((email: string) => {
    const backgroundColor = generateColorFromEmail(email);
    const textColor = getContrastColor(backgroundColor);
    return { backgroundColor, textColor };
  }, []);

  
  return (
    <header className="bg-white border-b py-1 px-4">
      <div className="flex justify-start items-center">
        <Link href="/project">
          <ArrowUturnLeftIcon className="h-6 w-6 text-gray-500 cursor-pointer"/>
        </Link>
        <h1 className={`${noto.className} sm:text-sm text-xs truncate max-w-[50%] ml-4`}>{project.title}</h1>
        <div className="flex items-center space-x-6 ml-auto">
          {guests.map((user) => {
            const { backgroundColor, textColor } = getUserColors(user.email);
            return (
              <div
                key={user.email}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor, color: textColor }}
              >
                {user.nickname?.[0]}
              </div>
            );
          })}
          <button
            onClick={handleInvite}
            className="bg-cyan-500 text-white mx-1 text-xs sm:text-xs px-5 py-2 rounded-2xl"
          >
            초대 링크 복사
          </button>
          <button
            onClick={handleComplete}
            className="bg-cyan-500 text-white text-xs sm:text-xs px-5 py-2 rounded-2xl"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </header>
  );
}