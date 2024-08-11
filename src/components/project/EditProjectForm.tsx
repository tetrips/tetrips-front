import { ClientProject, Guest } from "@/types/Project"
import ItineraryBox from "./ItineraryBox"
import { ClientPlace } from "@/types/Place"
import NaverMap from "./NaverMap"
import ChatBox from "./ChatBox"


interface EditProjectFormProps {
  projectData: ClientProject
  placesData: ClientPlace[]
  userData: Guest
}

export default function EditProjectForm({ projectData, placesData,userData }: EditProjectFormProps) {

  return (
    <div className="flex flex-col lg:flex-col 2xl:flex-row h-screen overflow-hidden">
      <div className="flex flex-col lg:flex-row h-[70%] lg:h-[70%] 2xl:h-full 2xl:w-5/6">
        <div className="w-full lg:w-1/2 2xl:w-2/5 h-1/2 lg:h-full 2xl:h-full overflow-y-auto no-scrollbar border-b lg:border-b-0 lg:border-r 2xl:border-b-0 2xl:border-r">
          <ItineraryBox
            project={projectData}
            initialPlaces={placesData}
          />
        </div>
        <div className="w-full lg:w-1/2 2xl:w-3/5 h-1/2 lg:h-full 2xl:h-full">
          <NaverMap project={projectData} />
        </div>
      </div>
      <div className="w-full h-[30%] lg:h-[30%] 2xl:h-full 2xl:w-1/6 overflow-y-auto no-scrollbar border-t lg:border-t-0 2xl:border-t-0 2xl:border-l">
        <ChatBox project={projectData} userData={userData}/>
      </div>
    </div>
  )
}