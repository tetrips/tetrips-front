'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Destination } from '@/types/Project';
import { ListBulletIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useProjectStore } from '@/stores/projectStore';


interface SortableItemProps {
  id: string;
  destination: Destination;
  date: string;
  updateDestinationDuration: (destinationId: string, duration: number) => void;
  removeDestination: (date: string, destinationId: string) => void;
}

export function SortableItem({ id, destination, date, updateDestinationDuration, removeDestination }: SortableItemProps) {
  const {updateMarkers} = useProjectStore();
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
  const handleDelete = () => {

    useProjectStore.getState().removeDestination(date, destination.id);
    updateMarkers();
    
  }
  

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
      <div className="flex-grow px-2">
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
          onClick={handleDelete}
          className="text-red-500 p-1 hover:bg-red-100 rounded flex items-center justify-center w-7 h-7"
          aria-label="삭제"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

