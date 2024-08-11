'use client'
import { Destination } from '@/types/Project';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon, ListBulletIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { noto } from '../common/fonts';

interface SortableItemProps {
  id: string;
  destination: Destination;
  updateDestinationDuration: (destinationId: string, duration: number) => void;
  updateDestinationDescription: (destinationId: string, description: string) => void;
  removeDestination: (destinationId: string) => void;
}

export function SortableItem({ id, destination, updateDestinationDuration,updateDestinationDescription, removeDestination }: SortableItemProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className="bg-white border-b border-gray-100 p-4 flex items-center space-x-4 group hover:bg-gray-50 transition-colors duration-200"
    >
      <div {...listeners} className="cursor-grab flex-shrink-0 text-gray-300 group-hover:text-gray-400 transition-colors duration-200">
        <Bars3Icon className="w-5 h-5" />
      </div>
      <div className={`${noto.className} flex-grow min-w-0 space-y-1`}>
        <p className="text-sm font-medium text-gray-700 truncate">{destination.title}</p>
        <input
          type="text"
          value={destination.description}
          maxLength={20}
          onChange={(e) => updateDestinationDescription(destination.id, e.target.value)}
          className="w-full text-xs text-gray-500 bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none focus:ring-0 transition-colors duration-200"
          placeholder="메모 입력..."
        />
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <input
            type="number"
            step={10}
            value={destination.stayDuration}
            max={1440}
            onChange={(e) => updateDestinationDuration(destination.id, parseInt(e.target.value))}
            className="w-14 p-1 text-xs text-gray-600 border border-gray-200 rounded-md focus:border-cyan-500 focus:outline-none transition-colors duration-200"
            min="0"
          />
          <span className="text-xs text-gray-400 whitespace-nowrap">분</span>
        </div>
        <button
          onClick={() => removeDestination(destination.id)}
          className="text-gray-300 hover:text-red-500 p-1 rounded-full flex items-center justify-center transition-colors duration-200"
          aria-label="삭제"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>

  );
}
