'use client'
import { ClockIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ClientProject {
  id: string;
  creator: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  guests: Guest[];
  itineraries: Itinerary[];
}
interface Guest {
  email: string;
  nickname: string;
  img: string;
}

interface Itinerary {
  itineraryId: string;
  date: string;
  dayStartTime: string;
  startPlace?: Destination;
  endPlace?: Destination;
  destinations: Destination[];
}

interface Destination {
  id: string;
  placeId:string;
  title: string;
  roadAddress: string;
  category: string;
  mapx: number;
  mapy: number;
  link?: string;
  stayDuration: number;
  description?: string;
  startTime?: string;
  endTime?: string;
}


interface DestinationCardProps {
  destination: Destination;
  description?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

export default function TravelItineraryView({ project }: { project: ClientProject }) {
  const [activeTab, setActiveTab] = useState(-1);

  return (
    <div className="bg-gray-50 p-4">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">{project.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </p>
          <div className="flex items-center mt-1 text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <p className="text-sm">{project.guests.length} 명의 여행자</p>
          </div>
        </div>
        
        <div className="flex flex-wrap p-2 border-b border-gray-200">
          <TabButton
            label="전체"
            isActive={activeTab === -1}
            onClick={() => setActiveTab(-1)}
          />
          {project.itineraries.map((_, index) => (
            <TabButton
              key={index}
              label={`Day ${index + 1}`}
              isActive={activeTab === index}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>
        
        <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {activeTab === -1 ? (
            <AllItinerariesView itineraries={project.itineraries} />
          ) : (
            <DayView day={project.itineraries[activeTab]} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      className={`py-1 px-3 m-1 text-sm font-medium rounded transition-colors duration-200 ${
        isActive
          ? 'bg-cyan-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function AllItinerariesView({ itineraries }: { itineraries: Itinerary[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {itineraries.map((day, dayIndex) => (
        <div key={day.itineraryId} className="border border-gray-200 p-3 rounded-lg">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Day {dayIndex + 1} - {day.date}</h2>
          <CompactItinerary day={day} />
        </div>
      ))}
    </div>
  );
}

function CompactItinerary({ day }: { day: Itinerary }) {
  const allDestinations = [
    ...(day.startPlace ? [day.startPlace] : []),
    ...day.destinations,
    ...(day.endPlace ? [day.endPlace] : [])
  ];

  return (
    <div className="space-y-2">
      {allDestinations.map((dest, index) => (
        <DestinationItem 
          key={dest.id} 
          destination={dest} 
          isStart={index === 0} 
          isEnd={index === allDestinations.length - 1}
        />
      ))}
    </div>
  );
}

function DestinationItem({ destination, isStart = false, isEnd = false }: DestinationCardProps) {
  const borderColor = isStart ? 'border-l-4 border-l-green-500' : isEnd ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-gray-300';

  return (
    <div className={`bg-white ${borderColor} pl-2 py-1 flex items-center text-sm`}>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-gray-800 truncate">{destination.title}</h3>
      </div>
      {destination.stayDuration > 0 && (
        <div className="flex items-center ml-2 text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          {Math.floor(destination.stayDuration / 60)}h
        </div>
      )}
    </div>
  );
}

function DayView({ day }: { day: Itinerary }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">{day.date}</h2>
        <span className="ml-4 text-sm text-gray-600 flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          {day.dayStartTime} 출발
        </span>
      </div>
      <CompactItinerary day={day} />
    </div>
  );
}