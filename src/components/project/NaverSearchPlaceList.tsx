'use client'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ClientPlace } from '@/types/Place'

interface SearchResult {
  status: string
  meta: {
    totalCount: number
    page: number
    count: number
  }
  places: {
    title: string
    roadAddress: string
    mapx: string
    mapy: string
    category: string
    link: string
  }[]
  errorMessage?: string
}

interface NaverSearchListProps {
  onPlaceSelect: (place: ClientPlace) => void
}

export default function NaverSearchList({
  onPlaceSelect,
}: NaverSearchListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<ClientPlace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`,
      )
      if (!response.ok) {
        throw new Error('Search request failed')
      }

      const data: SearchResult = await response.json()

      if (data.status === 'OK' && data.places && data.places.length > 0) {
        const destinations: ClientPlace[] = data.places.map((place) => ({
          id: place.mapx + place.mapy,
          title: place.title,
          roadAddress: place.roadAddress,
          category: place.category,
          mapx: parseFloat(place.mapx),
          mapy: parseFloat(place.mapy),
          link: place.link,
        }))
        setResults(destinations)
        //console.log('Search results:', destinations);
      } else {
        setError(data.errorMessage || '검색 결과가 없습니다.')
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlace = async (destination: ClientPlace) => {
    //console.log('Adding place:', destination);
    try {
      const response = await fetch('/api/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destination),
      })
      if (!response.ok) {
        throw new Error('Failed to add place')
      }
      const data = await response.json()
      //console.log('Place added successfully:', data);
    } catch (err) {
      console.error('Add place error:', err)
    }
    onPlaceSelect(destination)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="py-2">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="장소 검색"
            className="flex-grow rounded-l border border-gray-300 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-cyan-500 text-white text-sm px-4 py-2 rounded-r hover:bg-cyan-900"
            disabled={isLoading}
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ul className="max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto">
        {results.map((result, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded border p-2"
          >
            <div>
              <h3 className="font-semibold">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.roadAddress}</p>
              <p className="text-xs text-gray-500">{result.category}</p>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                {result.link}
              </a>
            </div>
            <button
              className="bg-cyan-500 text-white p-2 rounded hover:bg-cyan-900"
              onClick={() => handleAddPlace(result)}
            >
              <PlusIcon className="w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
