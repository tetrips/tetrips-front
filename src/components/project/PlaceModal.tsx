'use client'
import { useState } from 'react';
import PlaceList from './PlaceList';
import NaverSearchPlaceList from './NaverSearchPlaceList';
import { ClientPlace } from '@/types/Place';



interface PlaceModalProps {
  onClose: () => void;
  purpose: 'start' | 'end' | 'add';
  onPlaceSelect: (place: ClientPlace) => void;
  initialPlaces: ClientPlace[];
}

export default function PlaceModal({ onClose, purpose, onPlaceSelect, initialPlaces }: PlaceModalProps) {
  const [activeTab, setActiveTab] = useState<'recommended' | 'search'>('recommended');

  const handlePlaceSelect = (place: ClientPlace) => {
    onPlaceSelect(place);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl h-4/5 flex flex-col">
        <h2 className="text-sm font-bold mb-2">
          {purpose === 'start' ? '출발지 선택' : purpose === 'end' ? '도착지 선택' : '여행지 추가'}
        </h2>
        <div className="mb-2">
          <button
            className={`mr-2 px-4 py-2 rounded text-sm ${activeTab === 'recommended' ? 'bg-color2 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('recommended')}
          >
            추천 장소
          </button>
          <button
            className={`px-4 py-2 rounded text-sm ${activeTab === 'search' ? 'bg-color2 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('search')}
          >
            네이버 지도 검색
          </button>
        </div>
        <div className="flex-grow h-0 overflow-y-auto no-scrollbar">
          {activeTab === 'recommended' ? (
            <PlaceList places={initialPlaces} onPlaceSelect={handlePlaceSelect} />
          ) : (
            <NaverSearchPlaceList onPlaceSelect={handlePlaceSelect} />
          )}
        </div>
        <div className="mt-4 w-full flex justify-end">
          <button
            className="px-4 py-2 bg-color7 text-white rounded hover:bg-color6 text-sm"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}