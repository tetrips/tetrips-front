'use client'
import { useTabStore } from "@/stores/tabStore";
import { Itinerary } from "@/types/Project";
import { useEffect } from "react";

interface ItineraryTabsProps {
  itineraries: Itinerary[];
  activeDay: number;
  setActiveDay: (day: number) => void;
}

export default function ItineraryTabs({ itineraries, activeDay, setActiveDay }: ItineraryTabsProps) {
  const { selectedItineraryId, setSelectedItineraryId } = useTabStore();

  useEffect(() => {
    if (itineraries.length > 0 && !selectedItineraryId) {
      setSelectedItineraryId(itineraries[0].itineraryId);
      setActiveDay(0);
    }
  }, [itineraries, selectedItineraryId, setSelectedItineraryId, setActiveDay]);

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      {itineraries.map((itinerary, index) => (
        <button
          key={itinerary.itineraryId}
          className={`p-4 text-left ${
            activeDay === index
              ? 'bg-cyan-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            setActiveDay(index);
            setSelectedItineraryId(itinerary.itineraryId);
          }}
        >
          <div className="font-semibold text-xs sm:text-sm truncate">Day {index + 1}</div>
          <div className="text-xs sm:text-xs truncate">{itinerary.date}</div>
        </button>
      ))}
    </div>
  );
}