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

interface ItineraryDayViewProps {
  itinerary: Itinerary;
  onOpenModal: (purpose: 'start' | 'end' | 'add') => void;
  onItineraryChange: (newDayStartTime: string) => void;
  removeDestination: (destinationId: string) => void;
  reorderDestinations: (newOrder: string[]) => void;
  updateDestinationDuration: (destinationId: string, duration: number) => void;
}

export default function ItineraryDayView({
  itinerary,
  onOpenModal,
  onItineraryChange,
  removeDestination,
  reorderDestinations,
  updateDestinationDuration,
}: ItineraryDayViewProps) {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [optimizedRoute, setOptimizedRoute] = useState<Destination[]>([]);
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
      className={`w-full h-16 border-2 ${place ? 'border-solid' : 'border-dashed'} border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer`}
    >
      {place ? (
        <div className="text-center">
          <p className="font-semibold">{place.title}</p>
        </div>
      ) : (
        <p>{type === 'start' ? '시작지점 추가' : '종료지점 추가'}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full p-4 overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <p>{itinerary.date}</p>
        <input
          type="time"
          value={itinerary.dayStartTime} 
          onChange={handleDayStartTimeChange}
          className="border rounded p-1"
        />
      </div>

      <div className="flex-grow flex flex-col space-y-4 overflow-x-hidden">
        <div>
          <LocationBox type="start" place={itinerary.startPlace} />
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm">여행지 리스트</h3>
            <div>
              {/* {optimizedRoute.length > 0 &&
                  <OptimizedRouteButton
                  onClick={() => setIsOptimizedRouteOpen(!isOptimizedRouteOpen)}
                  isOpen={isOptimizedRouteOpen}
                />
                } */}
              <button
                onClick={() => onOpenModal('add')}
                className="bg-cyan-500 text-white px-4 py-1 rounded mr-2"
              >
                추가
              </button>
              <button
                onClick={handleOptimizeRoute}
                className="bg-cyan-500 text-white px-4 py-1 rounded"
              >
                최적화
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
              <div className="space-y-2 overflow-x-hidden">
                {itinerary.destinations?.map((destination) => (
                  <SortableItem
                    key={destination.id} 
                    id={destination.id}
                    destination={destination}
                    updateDestinationDuration={updateDestinationDuration}
                    removeDestination={() => removeDestination(destination.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div>
          <LocationBox type="end" place={itinerary.endPlace} />
        </div>
        {/* <OptimizedRoute isOpen={isOptimizedRouteOpen} route={optimizedRoute}/> */}
      </div>
    </div>

  );
}