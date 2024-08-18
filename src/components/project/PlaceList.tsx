'use client'
import { useMemo, useState } from 'react';
import { ClientPlace } from '@/types/Place';
interface PlaceListProps {
  places: ClientPlace[];
  onPlaceSelect: (place: ClientPlace) => void;
}

type PlaceCategory = '명소' | '맛집' | '카페' | '숙소' | '교통' | '기타' | '전체';

function categorizePlace(category: string): PlaceCategory {
  if (category.startsWith('여행') || category.startsWith('문화')) {
    return '명소';
  }
  if (category.startsWith('카페') || category.startsWith('음식점>카페')) {
    return '카페';
  }
  if (category.startsWith('한식') || category.startsWith('중식') || category.startsWith('음식점') || category.startsWith('분식')) {
    return '맛집';
  }
  if (category.startsWith('숙박') || category.startsWith('주택')) {
    return '숙소';
  }
  if (category.startsWith('교통') || category.startsWith('기차') || category.startsWith('항공') || category.startsWith('버스')) {
    return '교통';
  }
  return '기타';
}

export default function PlaceList({ places, onPlaceSelect }: PlaceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<PlaceCategory>('전체');

  const categorizedPlaces = useMemo(() => {
    const filtered = places.filter(place =>
      place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.roadAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, place) => {
      const category = categorizePlace(place.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(place);
      return acc;
    }, {} as Record<PlaceCategory, ClientPlace[]>);
  }, [places, searchTerm]);

  const tabContent = activeTab === '전체' 
    ? Object.values(categorizedPlaces).flat() 
    : categorizedPlaces[activeTab] || [];

  const tabs: PlaceCategory[] = ['전체', '명소', '맛집', '카페', '숙소', '교통', '기타'];

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white z-10 space-y-2">
        <input
          type="text"
          placeholder="장소 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm px-4 py-2 border border-gray-300 rounded"
        />
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-full ${
                activeTab === tab
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white border border-cyan-500 text-cyan-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {tabContent.length === 0 ? (
        <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {tabContent.map((place) => (
            <li
              key={place.id}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onPlaceSelect(place)}
            >
              <h3 className="font-semibold text-sm">{place.title}</h3>
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

