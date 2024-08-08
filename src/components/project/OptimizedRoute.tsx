'use client'
import { Destination } from '@/types/Project';
import { AnimatePresence, motion } from 'framer-motion';

interface OptimizedRouteProps {
  route: Destination[];
  isOpen: boolean;
}

export default function  OptimizedRoute  ({ route,isOpen }: OptimizedRouteProps) {
  if (!route) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-96 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
          <div>
            <h2 className="text-xl font-bold mb-4">최적화된 경로</h2>
            <ul className="space-y-4">
              {route.map((destination, index) => (
                <li key={destination.id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{index + 1}. {destination.title}</span>
                    <div className="text-sm text-gray-600">
                      <span>도착: {destination.startTime}</span>
                      <span className="mx-2">|</span>
                      <span>출발: {destination.endTime}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{destination.roadAddress}</p>
                  {destination.stayDuration > 0 && (
                    <p className="text-sm text-blue-600 mt-1">체류 시간: {destination.stayDuration}분</p>
                  )}
                </li>
              ))}
            </ul>
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
