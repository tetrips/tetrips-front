'use client'

import { useState, useEffect } from 'react';
import { ClientPlace } from '@/types/Place';
import { useProjectStore } from '@/stores/projectStore';
import { ClientProject, Destination, Itinerary as ItineraryType } from '@/types/Project';
import ItineraryTabs from './ItineraryTabs';
import ItineraryDayView from './ItineraryDayView';
import { v4 as uuidV4 } from 'uuid';
import PlaceModal from './PlaceModal';

interface ItineraryProps {
  project: ClientProject;
  initialPlaces: ClientPlace[];
}

export default function ItineraryBox({ project, initialPlaces }: ItineraryProps) {
  const {
    setCurrentProject,
    itineraries, 
    updateItinerary, 
    addDestination, 
    removeDestination, 
    reorderDestinations,
    updateDestinationDuration,
    setStartPlace,
    setEndPlace,
    updateMarkers
  } = useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const [modalPurpose, setModalPurpose] = useState<'start' | 'end' | 'add'>();

  useEffect(() => {
    updateMarkers();
    setCurrentProject(project)
  }, [project, setCurrentProject, updateMarkers]);



  const handleOpenModal = (purpose: 'start' | 'end' | 'add', date: string) => {
    setModalPurpose(purpose);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleItineraryChange = (updatedItinerary: ItineraryType) => {
    updateItinerary(updatedItinerary.date, updatedItinerary);
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
      updateMarkers();
    } else if (modalPurpose === 'end') {
      setEndPlace(selectedDate, destination);
      updateMarkers();
    } else {
      addDestination(selectedDate, destination);
      updateMarkers();
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
            onOpenModal={(purpose) => handleOpenModal(purpose, currentItinerary.date)}
            onItineraryChange={handleItineraryChange}
            removeDestination={(destinationId) => removeDestination(currentItinerary.date, destinationId)}
            reorderDestinations={(newOrder) => reorderDestinations(currentItinerary.date, newOrder)}
            updateDestinationDuration={(destinationId, duration) => updateDestinationDuration(currentItinerary.date, destinationId, duration)}
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