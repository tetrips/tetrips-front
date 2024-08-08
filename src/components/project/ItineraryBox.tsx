'use client'

import { useState } from 'react';
import ItineraryTabs from './ItineraryTabs';
import ItineraryDayView from './ItineraryDayView';
import { v4 as uuidV4 } from 'uuid';
import PlaceModal from './PlaceModal';
import { useYjs } from '@/hooks/useYjs';
import { ClientPlace } from '@/types/Place';
import { ClientProject, Destination } from '@/types/Project';

interface ItineraryProps {
  project: ClientProject;
  initialPlaces: ClientPlace[];
}

export default function ItineraryBox({ project, initialPlaces }: ItineraryProps) {
  const {
    itineraries, 
    updateDayStartTime, 
    addDestination, 
    removeDestination, 
    reorderDestinations,
    updateDestinationDuration,
    setStartPlace,
    setEndPlace,
  } = useYjs({project});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const [modalPurpose, setModalPurpose] = useState<'start' | 'end' | 'add'>();

  const handleOpenModal = (purpose: 'start' | 'end' | 'add', itineraryId: string) => {
    setModalPurpose(purpose);
    setSelectedDate(itineraryId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const handlePlaceSelect = (place: ClientPlace) => {
    const destination: Destination = {
      id: uuidV4(),
      placeId: place.id,
      title: place.title,
      roadAddress: place.roadAddress,
      category: place.category,
      mapx: place.mapx,
      mapy: place.mapy,
      link: place.link,      
      stayDuration: modalPurpose === 'start' || modalPurpose === 'end' ? 0 : 120,
    };

    if (modalPurpose === 'start') {
      setStartPlace(selectedDate, destination);
    } else if (modalPurpose === 'end') {
      setEndPlace(selectedDate, destination);
    } else {
      addDestination(selectedDate, destination);
    }

    handleCloseModal();
  };

  const currentItinerary = itineraries[activeDay];

  if (!currentItinerary) return null;

  return (
    <div className="h-full flex">
      <div className="w-1/4 border-r">
        <ItineraryTabs 
          itineraries={itineraries} 
          activeDay={activeDay} 
          setActiveDay={setActiveDay} 
        />
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow overflow-y-auto no-scrollbar">
          <ItineraryDayView 
            itinerary={currentItinerary} 
            onOpenModal={(purpose) => handleOpenModal(purpose, currentItinerary.itineraryId)}
            onItineraryChange={(newDayStartTime) => updateDayStartTime(currentItinerary.itineraryId, newDayStartTime)}
            removeDestination={(destinationId) => removeDestination(currentItinerary.itineraryId, destinationId)}
            reorderDestinations={(newOrder) => reorderDestinations(currentItinerary.itineraryId, newOrder)}
            updateDestinationDuration={(destinationId, duration) => updateDestinationDuration(currentItinerary.itineraryId, destinationId, duration)}
          />
        </div>
      </div>
      {isModalOpen && (
        <PlaceModal
          onClose={handleCloseModal}
          purpose={modalPurpose!}
          onPlaceSelect={handlePlaceSelect}
          initialPlaces={initialPlaces}
        />
      )}
    </div>
  );
}