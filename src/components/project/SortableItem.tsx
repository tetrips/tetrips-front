'use client'
import { Destination } from '@/types/Project';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListBulletIcon, MinusIcon } from '@heroicons/react/24/outline';
import { noto } from '../common/fonts';

interface SortableItemProps {
  id: string;
  destination: Destination;
  updateDestinationDuration: (destinationId: string, duration: number) => void;
  removeDestination: (destinationId: string) => void;
}

export function SortableItem({ id, destination, updateDestinationDuration, removeDestination }: SortableItemProps) {

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
      className="bg-white border p-2 rounded flex justify-between items-center mb-2"
    >
      <div {...listeners} className="cursor-grab p-2">
        <ListBulletIcon
          className="w-6 h-6 text-gray-400"
        />
      </div>
      <div className={`${noto.className} text-left flex-grow px-2`}>
        <p>{destination.title}</p>

      </div>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          step={10}
          value={destination.stayDuration}
          onChange={(e) => updateDestinationDuration(destination.id, parseInt(e.target.value))}
          className="border rounded w-16 p-1"
          min="0"
        />
        <span className="text-sm">분</span>
        <button
          onClick={() => removeDestination(destination.id)}
          className="text-red-500 p-1 hover:bg-red-100 rounded flex items-center justify-center w-7 h-7"
          aria-label="삭제"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
