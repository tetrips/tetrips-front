'use client'
import { useProjectStore } from "@/stores/projectStore";
import { ClientProject } from "@/types/Project";
import { useEffect } from "react";

export default function ProjectHeader({project}:{project:ClientProject}) {
  const {currentProject, updateProject,setCurrentProject} = useProjectStore();

  useEffect(() => {
    setCurrentProject(project);
  }, [project, setCurrentProject]);
  
  const handleInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/project/${project.id}`);

  }
  const handleComplete = async () => {
    try {
      await updateProject(currentProject);

      alert('프로젝트가 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Update error:', err);
      alert('프로젝트 업데이트 중 오류가 발생했습니다.');
    }
  };

  
  return (
    <header className="bg-white border-b py-1 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold truncate max-w-[50%]">{project.title}</h1>
        <div className="flex items-center space-x-5">
          {project.guests.map((user, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-10 h-10 bg-color6 text-white rounded-full m-1`}
            >
              {user.nickname.charAt(0)}
            </div>
          ))}
          <button
            onClick={handleInvite}
            className="bg-color7 text-white text-sm px-5 py-2 rounded"
          >
            초대
          </button>
          <button
            onClick={handleComplete}
            className="bg-color2 text-white text-sm px-5 py-2 rounded"
          >
            저장
          </button>
          <div>

          </div>
        </div>
      </div>
    </header>
  );
}