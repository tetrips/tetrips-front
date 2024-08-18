'use client'
import { ClockIcon, CalendarIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { ClientProject, Itinerary } from '@/types/Project';

export default function ItineraryModal({ project }: { project: ClientProject }) {
  const [activeTab, setActiveTab] = useState(-1);
  const contentRef = useRef<HTMLDivElement>(null);

  const saveAsImage = async (format: 'png' | 'jpg') => {
    if (contentRef.current) {
      try {
        let image;
        const scale = 2;
        const options = {
          quality: 0.95,
          pixelRatio: window.devicePixelRatio * scale,
          cacheBust: true,
          height: contentRef.current.scrollHeight
        };

        if (format === 'png') {
          image = await toPng(contentRef.current, options);
        } else {
          image = await toJpeg(contentRef.current, { ...options, backgroundColor: 'white' });
        }

        const link = document.createElement('a');
        link.download = `${project.title}.${format}`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error('Failed to save image:', error);
        alert('이미지 저장에 실패했습니다.');
      }
    }
  };


  return (
    <div className="bg-white h-[calc(90vh-80px)] flex flex-col">
      <div className="flex-grow overflow-y-auto p-5 no-scrollbar" ref={contentRef}>
        <div className="mb-2">
          <h1 className="text-lg font-semibold text-gray-800">{project.title}</h1>
          <p className="text-xs text-gray-500 py-2">
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <UserGroupIcon className="h-3 w-3 mr-1" />
            {project.guests.map(guest => guest.nickname).join(', ')}
          </div>
        </div>
        
        <div className="flex mb-2 space-x-1 text-xs">
          {['전체', ...project.itineraries.map((_, i) => `Day ${i + 1}`)].map((label, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                activeTab === index - 1 ? 'bg-cyan-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(index - 1)}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="pb-2">
          {activeTab === -1 ? (
            <AllItinerariesModal itineraries={project.itineraries} />
          ) : (
            <DayItineraryModal day={project.itineraries[activeTab]} />
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-2 pt-2">
        <button
          onClick={() => saveAsImage('png')}
          className="bg-cyan-500 text-white text-xs px-4 py-2 rounded hover:bg-cyan-800"
        >
          PNG로 저장
        </button>
        <button
          onClick={() => saveAsImage('jpg')}
          className="bg-cyan-500 text-white text-xs px-4 py-2 rounded hover:bg-cyan-800"
        >
          JPG로 저장
        </button>
      </div>
    </div>
  );
}


function AllItinerariesModal({ itineraries }: { itineraries: Itinerary[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {itineraries.map((day, index) => (
        <div key={day.itineraryId} className="border border-gray-200 p-3 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">{day.date}</h2>
          <div className="text-xs text-gray-600 mb-2 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{day.dayStartTime} 출발</span>
          </div>

          <div className="space-y-2">
            {day.startPlace && (
              <div className="text-xs text-green-600 flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" />
                <span>시작: {day.startPlace.title}</span>
              </div>
            )}

            <div className="pl-2 border-l border-gray-200 space-y-2">
              {day.destinations.map((dest, i) => (
                <div key={dest.id} className="mb-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-800">{dest.title}</span>
                    {dest.stayDuration > 0 && (
                      <span className="text-gray-500">{dest.stayDuration}분</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {day.endPlace && (
              <div className="text-xs text-red-600 flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" />
                <span>종료: {day.endPlace.title}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


function DayItineraryModal({ day }: { day: Itinerary }) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
        <h2 className="font-semibold text-gray-800">{day.date}</h2>
        <span className="ml-4 text-sm text-gray-600 flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          {day.dayStartTime} 출발
        </span>
      </div>
      <div className="space-y-4">
        {day.startPlace && (
          <div className="flex items-center text-sm text-green-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">시작: {day.startPlace.title}</span>
          </div>
        )}
        {day.destinations.map((dest, index) => (
          <div key={dest.id} className="pl-4 border-l-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">{dest.title}</span>
              {dest.stayDuration > 0 && (
                <span className="text-xs text-gray-500 flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {dest.stayDuration}분
                </span>
              )}
            </div>
            {dest.description && (
              <p className="text-xs text-gray-500 mt-1">{dest.description}</p>
            )}
          </div>
        ))}
        {day.endPlace && (
          <div className="flex items-center text-sm text-red-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">종료: {day.endPlace.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}