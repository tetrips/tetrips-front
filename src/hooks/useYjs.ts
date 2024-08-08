'use client'
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ClientProject } from '@/types/Project';


interface MarkerData {
  id: string;
  mapx: number;
  mapy: number;
  roadAddress: string;
  buildingName: string;
  category: string;
  link?: string;
}

interface Destination {
  id: string;
  placeId: string;
  title: string;
  roadAddress: string;
  category: string;
  mapx: number;
  mapy: number;
  link?: string;
  stayDuration: number;
  startTime?: string;
  endTime?: string;
}

interface Itinerary {
  itineraryId: string;
  date: string;
  dayStartTime: string;
  startPlace?: Destination;
  endPlace?: Destination;
  destinations: Destination[];
}
const initializeItineraries = (doc: Y.Doc, project: ClientProject) => {
  const yItineraries = doc.getArray<Itinerary>('itineraries');
  
  yItineraries.delete(0, yItineraries.length);
  
  const initialItineraries = project.itineraries.map(itinerary => ({
    itineraryId: itinerary.itineraryId,
    date: itinerary.date,
    dayStartTime: itinerary.dayStartTime,
    startPlace: itinerary.startPlace,
    endPlace: itinerary.endPlace,
    destinations: itinerary.destinations || [],
  }));

  yItineraries.insert(0, initialItineraries);
};

export function useYjs({ project }: { project: ClientProject }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const projectId = project.id;

  const markers = useMemo(() => {
    const newMarkers: MarkerData[] = [];
    itineraries.forEach(itinerary => {
      if (itinerary.startPlace) {
        newMarkers.push(createMarkerData('start', itinerary.startPlace));
      }
      itinerary.destinations?.forEach(dest => {
        newMarkers.push(createMarkerData('destination', dest));
      });
      if (itinerary.endPlace) {
        newMarkers.push(createMarkerData('end', itinerary.endPlace));
      }
    });
    return newMarkers;
  }, [itineraries]);


  useEffect(() => {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider('wss://demos.yjs.dev/ws', `project-tetrips-test-${projectId}`, doc, { connect: false });

    wsProvider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        const yItineraries = doc.getArray<Itinerary>('itineraries');
        if (yItineraries.length === 0) {
          initializeItineraries(doc, project);
        }
        updateItineraries();
      }
    });

    wsProvider.connect();

    const yItineraries = doc.getArray<Itinerary>('itineraries');

    const updateItineraries = () => {
      const updatedItineraries = yItineraries.toArray();
      setItineraries(updatedItineraries);
    };


    yItineraries.observe(updateItineraries);
    
    setYdoc(doc);

    return () => {
      wsProvider.destroy();
      doc.destroy();
    };
  }, [project, projectId]);

  const updateItinerary = useCallback((itineraryId: string, updater: (itinerary: Itinerary) => Itinerary) => {
    if (!ydoc) return;
    const yItineraries = ydoc.getArray<Itinerary>('itineraries');
    ydoc.transact(() => {
      const index = yItineraries.toArray().findIndex(i => i.itineraryId === itineraryId);
      if (index !== -1) {
        const currentItinerary = yItineraries.get(index);
        const updatedItinerary = updater(currentItinerary);
        yItineraries.delete(index, 1);
        yItineraries.insert(index, [updatedItinerary]);
      }
    });
  }, [ydoc]);

  const updateDayStartTime = useCallback((itineraryId: string, newDayStartTime: string) => {
    updateItinerary(itineraryId, itinerary => ({ ...itinerary, dayStartTime: newDayStartTime }));
  }, [updateItinerary]);

  const setStartPlace = useCallback((itineraryId: string, place: Destination) => {
    updateItinerary(itineraryId, itinerary => ({ ...itinerary, startPlace: place }));
  }, [updateItinerary]);

  const setEndPlace = useCallback((itineraryId: string, place: Destination) => {
    updateItinerary(itineraryId, itinerary => ({ ...itinerary, endPlace: place }));
  }, [updateItinerary]);

  const addDestination = useCallback((itineraryId: string, destination: Destination) => {
    updateItinerary(itineraryId, itinerary => ({
      ...itinerary,
      destinations: [...itinerary.destinations, destination]
    }));
  }, [updateItinerary]);

  const removeDestination = useCallback((itineraryId: string, destinationId: string) => {
    updateItinerary(itineraryId, itinerary => ({
      ...itinerary,
      destinations: itinerary.destinations.filter(d => d.id !== destinationId)
    }));
  }, [updateItinerary]);

  const reorderDestinations = useCallback((itineraryId: string, newOrder: string[]) => {
    updateItinerary(itineraryId, itinerary => ({
      ...itinerary,
      destinations: newOrder.map(id => itinerary.destinations.find(d => d.id === id) as Destination)
    }));
  }, [updateItinerary]);

  const updateDestinationDuration = useCallback((itineraryId: string, destinationId: string, duration: number) => {
    updateItinerary(itineraryId, itinerary => ({
      ...itinerary,
      destinations: itinerary.destinations.map(d => d.id === destinationId ? { ...d, stayDuration: duration } : d)
    }));
  }, [updateItinerary]);

  const updateProject = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedProject = {
        ...project,
        itineraries: itineraries,
      };
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data = await response.json();
      return data.project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [project, itineraries, projectId]);

  return {
    itineraries,
    markers,
    isSaving,
    updateDayStartTime,
    setStartPlace,
    setEndPlace,
    addDestination,
    removeDestination,
    reorderDestinations,
    updateDestinationDuration,
    updateProject,
  };
}

function createMarkerData(type: 'start' | 'destination' | 'end', place: Destination): MarkerData {
  return {
    id: type === 'destination' ? place.id : `${type}-${place.id}`,
    mapx: place.mapx,
    mapy: place.mapy,
    roadAddress: place.roadAddress,
    buildingName: place.title,
    category: place.category,
    link: place.link,
  };
}