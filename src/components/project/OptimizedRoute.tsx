'use client'
import { Destination } from '@/types/Project';
import { formatDateTime } from '@/utils/formatTime';

interface OptimizedRouteProps {
  route: Destination[];
  isOpen: boolean;
  onClick: () => void;
}

export default function  OptimizedRoute  ({ route,isOpen,onClick }: OptimizedRouteProps) {
  if (!route || route.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[400px] lg:w-[800px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <button 
          className="absolute top-4 right-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm"
          onClick={onClick}
        >
          닫기
        </button>
        <h2 className="text-sm font-semibold mb-4 text-gray-800">동선 최적화 결과</h2>
        <ul className="space-y-4">
          {route.map((destination, index) => (
            <li key={destination.id} className="bg-gray-50 shadow rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-gray-700">{index + 1}. {destination.title}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <p>도착: {formatDateTime(destination.startTime ?? '')}</p>
                  <p>출발: {formatDateTime(destination.endTime ?? '')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{destination.roadAddress}</p>
              {destination.stayDuration > 0 && (
                <p className="text-xs text-cyan-600 mt-2">체류 시간: {destination.stayDuration}분</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
