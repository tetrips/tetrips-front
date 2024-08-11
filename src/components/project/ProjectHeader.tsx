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
  
  const colors = ['bg-sky-300', 'bg-rose-300', 'bg-green-300', 'bg-purple-300', 'bg-yellow-300','bg-pink-300','bg-orange-300','bg-violet-300','bg-indigo-300','bg-blueGray-300'];

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
            className="bg-color8 mx-1 text-white text-xs sm:text-xs px-5 py-2 rounded"
          >
            초대
          </button>
          <button
            onClick={handleComplete}
            className="bg-cyan-500 text-white text-xs sm:text-xs px-5 py-2 rounded"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </header>
  );
}