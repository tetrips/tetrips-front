import { create } from 'zustand';
import { ClientProject } from '@/types/Project';

interface MarkerData {
  id: string;
  mapx: number;
  mapy: number;
  roadAddress: string;
  buildingName: string;
  link?: string;
}
interface Itinerary {
  id: string;
  date: string;
  dayStartTime: string;
  startPlace?: Destination;
  endPlace?: Destination;
  destinations?: Destination[];
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
  startTime?: string;
  endTime?: string; 
}

interface ProjectState {
  currentProject: ClientProject;
  itineraries: Itinerary[];
  markers: MarkerData[];
}
interface ProjectActions {
  setCurrentProject: (project: ClientProject) => void;
  updateItinerary: (date: string, updates: Partial<Itinerary>) => void;
  setStartPlace: (date: string, place: Destination) => void;
  setEndPlace: (date: string, place: Destination) => void; 
  addDestination: (date: string, destination: Destination) => void; 
  removeDestination: (date: string, destinationId: string) => void;
  reorderDestinations: (date: string, newOrder: string[]) => void; 
  updateDestinationDuration: (date: string, destinationId: string, duration: number) => void; 
  updateMarkers: () => void;
  updateProject: (updatedProject: ClientProject) => Promise<void>;
}

type ProjectStore = ProjectState & ProjectActions;

const initialProject:ClientProject = {
  id: '',
  creator: '',
  title: '',
  startDate: '',
  endDate: '',
  createdAt: '',
  guests: [],
  itineraries: [],
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: initialProject,
  itineraries: [],
  markers: [],
  setCurrentProject: (project) => set({ 
    currentProject: project,
    itineraries: project.itineraries || []
  }),
  updateItinerary: (date, updates) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date ? { ...itinerary, ...updates } : itinerary
    )
  })),
  setStartPlace: (date, place) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date ? { ...itinerary, startPlace: place } : itinerary
    )
  })),
  setEndPlace: (date, place) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date ? { ...itinerary, endPlace: place } : itinerary
    )
  })),

  addDestination: (date, destination) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date
        ? { ...itinerary, destinations: [...(itinerary.destinations || []), destination] }
        : itinerary
    )
  })),

  removeDestination: (date, destinationId) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date
        ? { ...itinerary, destinations: itinerary.destinations?.filter(d => d.id !== destinationId) }
        : itinerary
    )
  })),
  reorderDestinations: (date, newOrder) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date
        ? { ...itinerary, destinations: newOrder.map(id => itinerary.destinations?.find(d => d.id === id) as Destination) }
        : itinerary)
  })),

  updateDestinationDuration: (date, destinationId, duration) => set((state) => ({
    itineraries: state.itineraries.map(itinerary => 
      itinerary.date === date
        ? {
            ...itinerary,
            destinations: itinerary.destinations?.map(d =>
              d.id === destinationId ? { ...d, stayDuration: duration } : d
            )
          }
        : itinerary
    )
  })),
  updateMarkers: () => set((state) => {
    const newMarkers: MarkerData[] = [];
    state.itineraries.forEach(itinerary => {
      if (itinerary.startPlace) {
        newMarkers.push({
          id: `start-${itinerary.date}`,
          mapx: itinerary.startPlace.mapx,
          mapy: itinerary.startPlace.mapy,
          roadAddress: itinerary.startPlace.roadAddress,
          buildingName: itinerary.startPlace.title,
        });
      }
      itinerary.destinations?.forEach(dest => {
        newMarkers.push({
          id: dest.id,
          mapx: dest.mapx,
          mapy: dest.mapy,
          roadAddress: dest.roadAddress,
          buildingName: dest.title,
          link: dest.link,
        });
      });
      if (itinerary.endPlace) {
        newMarkers.push({
          id: `end-${itinerary.date}`,
          mapx: itinerary.endPlace.mapx,
          mapy: itinerary.endPlace.mapy,
          roadAddress: itinerary.endPlace.roadAddress,
          buildingName: itinerary.endPlace.title,
        });
      }
    });
    return { markers: newMarkers };
  }),
  updateProject: async (updatedProject: ClientProject) => {
    const { itineraries } = get(); 
    try {
      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedProject, itineraries }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data = await response.json();
      const updateData = data.project;
      set({ currentProject: updateData });
      return updateData;

    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
}));


