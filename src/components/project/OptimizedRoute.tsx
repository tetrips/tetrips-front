'use client'
import { Destination } from '@/types/Project';
import { formatDateTime } from '@/utils/formatTime';

interface OptimizedRouteProps {
  route: Destination[];
  onClick: () => void;
}

export default function  OptimizedRoute ({ route,onClick }: OptimizedRouteProps) {
  if (!route || route.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-xl w-[90vw] h-[90vh] max-w-[1000px] p-4 sm:p-6 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 text-sm">동선 최적화 결과</h2>
          <button 
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-900 text-sm"
            onClick={onClick}
          >
            닫기
          </button>
        </div>
        <ul className="space-y-4 justify-center">
          {route.map((destination, index) => (
            <li key={destination.id} className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
              <div className="flex items-center py-1">
                <span className="bg-cyan-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-sm text-gray-800">{destination.title}</h3>
              </div>
              <div className="flex space-x-12 text-xs text-gray-600">
                <div>
                  <p>도착 : {formatDateTime(destination.startTime ?? '')}</p>
                </div>
                <div>
                  <p>출발: {formatDateTime(destination.endTime ?? '')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{destination.roadAddress}</p>
              {destination.stayDuration > 0 && (
                <p className="text-xs text-blue-800 font-medium">
                  체류 시간: {destination.stayDuration}분
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
