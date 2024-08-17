'use client'

import { useYjs } from "@/hooks/useYjs";
import { ClientProject, Guest } from "@/types/Project";
import { noto } from "../common/fonts";
import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ProjectHeader({project}:{project:ClientProject}) {
  const {updateProject,isSaving } = useYjs({project});
  const [guests, setGuests] = useState<Guest[]>(project.guests);
  useEffect(() => {
    setGuests(project.guests);
  }, [project.guests]);
  
  const colors = ['bg-[#ff8d8d]', 'bg-[#ffb785]', 'bg-[#fdff96]', 'bg-[#8eff9f]', 'bg-[#5ff6ff]', 'bg-[#60a4ff]', 'bg-[#9d8bff]', 'bg-[#ff86ff]', 'bg-[#fa8351]', 'bg-[#f59d77]', 'bg-[#dccb88]', 'bg-[#c5d39a]', 'bg-[#2ddbad]', 'bg-[#5073f1]', 'bg-[#9a58eb]', 'bg-[#d14b58]'];

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

  
  return (
    <header className="bg-white border-b py-1 px-4">
      <div className="flex justify-start items-center">
        <Link href="/project">
          <ArrowUturnLeftIcon className="h-6 w-6 text-gray-500 cursor-pointer"/>
        </Link>
        <h1 className={`${noto.className} sm:text-sm text-xs truncate max-w-[50%] ml-4`}>{project.title}</h1>
        <div className="flex items-center space-x-6 ml-auto">
          {guests.map((user, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center w-9 h-9 rounded-full text-white ${colors[index % colors.length]}`}
            >
              {user.nickname?.[0]}
            </div>
          ))}
          <button
            onClick={handleInvite}
            className="mx-1 text-cyan-500 border border-cyan-500 text-xs sm:text-xs px-5 py-2 rounded-2xl"
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