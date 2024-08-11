'use client'
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ClientProject } from '@/types/Project';
import TravelItineraryView from './TravelItineraryView';

export default function ItineraryModalButton({ project }: { project: ClientProject }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
      >
        View Project
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-[1200px] h-[850px] p-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
              <TravelItineraryView project={project} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}