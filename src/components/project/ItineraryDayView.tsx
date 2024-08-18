'use client'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

import { useState } from 'react';
import { Destination, Itinerary } from '@/types/Project';
import { OptimizedRouteButton } from './OptimizedRouteButton';
import OptimizedRoute from './OptimizedRoute';
import { PlusIcon, ArrowPathIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ItineraryDayViewProps {
  itinerary: Itinerary;
  onOpenModal: (purpose: 'start' | 'end' | 'add') => void;
  onItineraryChange: (newDayStartTime: string) => void;
  removeDestination: (destinationId: string) => void;
  reorderDestinations: (newOrder: string[]) => void;
  updateDestinationDuration: (destinationId: string, duration: number) => void;
  updateDestinationDescription: (destinationId: string, description: string) => void;
  optimizedRoute: Destination[] | undefined;
  setOptimizedRoute: (route: Destination[]) => void;
}

export default function ItineraryDayView({
  itinerary,
  onOpenModal,
  onItineraryChange,
  removeDestination,
  reorderDestinations,
  updateDestinationDuration,
  updateDestinationDescription,
  optimizedRoute,
  setOptimizedRoute,
}: ItineraryDayViewProps) {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isOptimizedRouteOpen, setIsOptimizedRouteOpen] = useState(false);

  const handleDayStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    onItineraryChange(newTime);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = itinerary.destinations?.findIndex((item) => item.id === active.id);
      const newIndex = itinerary.destinations?.findIndex((item) => item.id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && itinerary.destinations) {
        const newDestinations = arrayMove(itinerary.destinations, oldIndex, newIndex);
        const newOrder = newDestinations.map((item) => item.id);
        reorderDestinations(newOrder);

      }
    }
  };

  const handleOptimizeRoute = async () => {
    if (!itinerary.destinations || itinerary.destinations.length < 2) {
      alert('최적화할 목적지가 충분하지 않습니다.');
      return;
    }
  
    try {
      const response = await fetch('/api/optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startPlace: itinerary.startPlace,
          endPlace: itinerary.endPlace,
          destinations: itinerary.destinations,
          date: itinerary.date,
          dayStartTime: itinerary.dayStartTime,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Route optimization failed');
      }
  
      const optimizedData: { optimizedRoute: Destination[] } = await response.json();
  
      const optimizedDestinations = optimizedData.optimizedRoute;
      setOptimizedRoute(optimizedDestinations);

      const newOrder = optimizedDestinations.map((item) => item.id);
      reorderDestinations(newOrder);
      alert('동선이 최적화되었습니다.');
    } catch (error) {
      console.error('Route optimization error:', error);
      alert('시작지점과 종료지점을 모두 입력해주세요.');
    }
  };

  const LocationBox = ({ type, place }: { type: 'start' | 'end', place: Destination | undefined }) => (
    <div 
      onClick={() => onOpenModal(type)}
      className={`w-full p-3 bg-white border-l-4 ${type === 'start' ? 'border-l-emerald-500' : 'border-l-rose-400'} rounded-md flex items-center justify-between text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-200 group shadow-sm`}
    >
      <div className="flex items-center space-x-3">
        <MapPinIcon className={`h-5 w-5 ${type === 'start' ? 'text-emerald-600' : 'text-rose-500'}`} />
        <p className='font-medium text-sm'>{place ? place.title : `${type === 'start' ? '출발' : '도착'}지점 선택`}</p>
      </div>
      {!place && <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-colors duration-200" />}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden border border-gray-200">
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <p className='text-sm font-medium text-gray-700'>{itinerary.date}</p>
        </div>
        <input
          type="time"
          value={itinerary.dayStartTime} 
          onChange={handleDayStartTimeChange}
          className="text-xs text-gray-700 focus:outline-none w-32 focus:ring-0"
        />
      </div>

      <div className="flex-grow flex flex-col space-y-2 p-4 overflow-y-auto no-scrollbar">
        <LocationBox type="start" place={itinerary.startPlace} />
        
        <div className="flex-grow overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700">여행 일정</h3>
            <div className="flex space-x-2">
              {optimizedRoute && optimizedRoute.length > 0 &&
                <OptimizedRouteButton
                  onClick={() => setIsOptimizedRouteOpen(!isOptimizedRouteOpen)}
                />
              }
              <button
                onClick={() => onOpenModal('add')}
                className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-cyan-600 transition-colors duration-200 flex items-center"
              >
                <PlusIcon className="h-3 w-3 mr-1" /> 장소 추가
              </button>
              <button
                onClick={handleOptimizeRoute}
                className="bg-white text-cyan-500 border border-cyan-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-cyan-50 transition-colors duration-200 flex items-center"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" /> 최적 경로
              </button>
            </div>
          </div>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itinerary.destinations?.map(d => d.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {itinerary.destinations?.map((destination) => (
                  <SortableItem
                    key={destination.id} 
                    id={destination.id}
                    destination={destination}
                    updateDestinationDuration={updateDestinationDuration}
                    updateDestinationDescription={updateDestinationDescription}
                    removeDestination={() => removeDestination(destination.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <LocationBox type="end" place={itinerary.endPlace} />
      </div>
      {isOptimizedRouteOpen && optimizedRoute && (
        <OptimizedRoute
        route={optimizedRoute}
        onClick={() => setIsOptimizedRouteOpen(!isOptimizedRouteOpen)}
        />
      )}
    </div>
  );
}