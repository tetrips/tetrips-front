'use client'

import { useYjs } from "@/hooks/useYjs";
import { ClientProject } from "@/types/Project";
import { noto } from "../common/fonts";

export default function ProjectHeader({project}:{project:ClientProject}) {
  const {updateProject,isSaving } = useYjs({project});
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
      <div className="flex justify-between items-center">
        <h1 className={`${noto.className} text-lg truncate max-w-[50%]`}>{project.title}</h1>
        <div className="flex items-center space-x-6">
          {project.guests.map((user, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-full text-white ${colors[index % colors.length]}`}
            >
              {user.nickname?.[0]}
            </div>
          ))}
          <button
            onClick={handleInvite}
            className="bg-color8 mx-1 text-white text-sm px-5 py-2 rounded"
          >
            초대
          </button>
          <button
            onClick={handleComplete}
            className="bg-cyan-500 text-white text-sm px-5 py-2 rounded"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </header>
  );
}