'use client'
import { useState } from 'react';
import { ClientPlace } from '@/types/Place';

interface PlaceListProps {
  places: ClientPlace[];
  onPlaceSelect: (place: ClientPlace) => void;
}

export default function PlaceList({ places, onPlaceSelect }: PlaceListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaces = places.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.roadAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white z-10">
        <input
          type="text"
          placeholder="장소 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm p-2 border border-gray-300 rounded"
        />
      </div>
      {filteredPlaces.length === 0 ? (
        <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {filteredPlaces.map((place) => (
            <li
              key={place.id}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onPlaceSelect(place)}
            >
              <h3 className="font-semibold">{place.title}</h3>
              <p className="text-xs pt-1 text-gray-600">{place.roadAddress}</p>
              <div className="text-xs text-gray-500">
                {place.category && <span className="mr-2">{place.category}</span>}
                {place.link && (
                  <a href={place.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    상세 정보
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
}

