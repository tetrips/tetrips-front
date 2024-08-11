'use client'
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

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
  description?: string;
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

interface Guest {
  email: string;
  nickname: string;
  img?: string;
}

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

const initializeItineraries = (doc: Y.Doc, project: ClientProject) => {
  const yItineraries = doc.getMap<Y.Map<any>>('itineraries');
  const yDestMap = doc.getMap<Y.Map<any>>('destinations');

  project.itineraries.forEach(itinerary => {
    const yItinerary = new Y.Map();
    yItinerary.set('date', itinerary.date);
    yItinerary.set('dayStartTime', itinerary.dayStartTime);
    yItinerary.set('startPlace', itinerary.startPlace || null);
    yItinerary.set('endPlace', itinerary.endPlace || null);
    const yDestinations = new Y.Array();

    itinerary.destinations.forEach(dest => {
      const yDest = new Y.Map();
      yDest.set('placeId', dest.placeId);
      yDest.set('title', dest.title);
      yDest.set('roadAddress', dest.roadAddress);
      yDest.set('category', dest.category);
      yDest.set('mapx', dest.mapx);
      yDest.set('mapy', dest.mapy);
      yDest.set('link', dest.link || null);
      yDest.set('stayDuration', dest.stayDuration);
      yDest.set('description', dest.description || null);
      yDest.set('startTime', dest.startTime || null);
      yDest.set('endTime', dest.endTime || null);
      yDestMap.set(dest.id, yDest);
      yDestinations.push([yDest]);
    });

    yItinerary.set('destinations', yDestinations);

    yItineraries.set(itinerary.itineraryId, yItinerary);
  });
  console.log('초기설정한 yItineraries json',yItineraries.toJSON());
};

export function useYjs({ project }: { project: ClientProject }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [isSaving, setIsSaving] = useState(false);


  const updateLocalState = useCallback((doc: Y.Doc) => {
    const yItineraries = doc.getMap<Y.Map<any>>('itineraries');
    const yDestMap = doc.getMap<Y.Map<any>>('destinations');
    const updatedItineraries: Itinerary[] = [];

    yItineraries.forEach((yItinerary, itineraryId) => {
      const itinerary: Itinerary = {
        itineraryId,
        date: yItinerary.get('date'),
        dayStartTime: yItinerary.get('dayStartTime'),
        startPlace: yItinerary.get('startPlace'),
        endPlace: yItinerary.get('endPlace'),
        destinations: yItinerary.get('destinations').toArray().map((id: string) => yDestMap.get(id)?.toJSON())
      };
      updatedItineraries.push(itinerary);
    });

    setItineraries(updatedItineraries);
  }, []);

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
    const wsProvider = new WebsocketProvider('wss://demos.yjs.dev/ws', `projects-tetrips-${project.id}`, doc, { connect: false });

    wsProvider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        const yItineraries = doc.getMap<Y.Map<any>>('itineraries');
        if (yItineraries.size === 0) {
          initializeItineraries(doc,project);
        }
        updateLocalState(doc);
      }
    });

    wsProvider.connect();

    doc.on('update', () => updateLocalState(doc));

    setYdoc(doc);

    return () => {
      wsProvider.destroy();
      doc.destroy();
    };

  }, [project, updateLocalState]);

  const updateDayStartTime = useCallback((itineraryId: string, newTime: string) => {
    if (!ydoc) return
    const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries')
    const yItinerary = yItineraries.get(itineraryId)
    if (yItinerary) {
      yItinerary.set('dayStartTime', newTime)
    }
  }, [ydoc])

  const setStartPlace = useCallback((itineraryId: string, place: Destination) => {
    if (!ydoc) return
    const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries')
    const yItinerary = yItineraries.get(itineraryId)
    if (yItinerary) {
      yItinerary.set('startPlace', place)
    }
  }, [ydoc])

  const setEndPlace = useCallback((itineraryId: string, place: Destination) => {
    if (!ydoc) return;
    const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries');
    const yItinerary = yItineraries.get(itineraryId);
    if (yItinerary) {
      yItinerary.set('endPlace', place);
    }
  }, [ydoc]);

  const addDestination = useCallback((itineraryId: string, destination: Destination) => {
    if (!ydoc) return;
    const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries');
    const yDestMap = ydoc.getMap<Y.Map<any>>('destinations');
    const yItinerary = yItineraries.get(itineraryId);
    if (yItinerary) {
      const yDest = new Y.Map();
      Object.entries(destination).forEach(([key, value]) => yDest.set(key, value));
      yDestMap.set(destination.id, yDest);
      const yDestinations = yItinerary.get('destinations') as Y.Array<string>;
      yDestinations.push([destination.id]);
    }
  }, [ydoc]);

  const removeDestination = useCallback((itineraryId: string, destinationId: string) => {
    if (!ydoc) return;
    const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries');
    const yDestMap = ydoc.getMap<Y.Map<any>>('destinations');
    const yItinerary = yItineraries.get(itineraryId);
    if (yItinerary) {
      const yDestinations = yItinerary.get('destinations') as Y.Array<string>;
      const index = yDestinations.toArray().findIndex(id => id === destinationId);
      if (index !== -1) {
        yDestinations.delete(index, 1);
      }
      yDestMap.delete(destinationId);
    }
  }, [ydoc]);

  const reorderDestinations = useCallback((itineraryId: string, newOrder: string[]) => {
    if (!ydoc) return;
    try {
      ydoc.transact(() => {
        const yItineraries = ydoc.getMap<Y.Map<any>>('itineraries');
        const yItinerary = yItineraries.get(itineraryId);
        if (yItinerary) {
          const yDestinations = yItinerary.get('destinations') as Y.Array<string>;
          yDestinations.delete(0, yDestinations.length);
          yDestinations.insert(0, newOrder);
        }
      });
    } catch (err) {
      console.error(`Failed to reorder destinations: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ydoc]);

  const updateDestinationDuration = useCallback((destinationId: string, duration: number) => {
    if (!ydoc) return;
    const yDestMap = ydoc.getMap<Y.Map<any>>('destinations');
    const yDest = yDestMap.get(destinationId);
    if (yDest) {
      yDest.set('stayDuration', duration);
    }
  }, [ydoc]);

  const updateDestinationDescription = useCallback((destinationId: string, description: string) => {
    if (!ydoc) return;
    const yDestMap = ydoc.getMap<Y.Map<any>>('destinations');
    const yDest = yDestMap.get(destinationId);
    if (yDest) {
      yDest.set('description', description);
    }
  }, [ydoc]);

  const updateProject = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedProject = {
        ...project,
        itineraries: itineraries,
      };
      const response = await fetch(`/api/projects/${project.id}`, {
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
      console.error('Failed to update project:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [project, itineraries]);

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
    updateDestinationDescription,
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

