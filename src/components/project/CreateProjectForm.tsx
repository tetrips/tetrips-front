'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DateRange, DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

export default function CreateProjectForm() {
  const [title, setTitle] = useState('')
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [range, setRange] = useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  const modifiersStyles = {
    selected: {
      color: 'white',
      backgroundColor: '#94D9DA',
    }
  };

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from && selectedRange?.to) {
      const daysDifference = (selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDifference > 15) {
        alert('최대 15일의 기간만 선택할 수 있습니다.');
        return;
      }
      setStartDate(selectedRange.from);
      setEndDate(selectedRange.to);
      setIsDatePickerOpen(false);
    }
    setRange(selectedRange || { from: undefined, to: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startDate || !endDate) {
      alert('제목과 날짜를 모두 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
        }),
      })

      if (!response.ok) {
        throw new Error('프로젝트 생성에 실패했습니다.')
      }

      const data = await response.json()
      router.push(data.redirectUrl)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('프로젝트 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          여행 계획 제목
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-color6 focus:border-color6 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="p-2">
        <div className="flex justify-between items-center p-2">
          <div>
            {startDate && endDate? (
              <span className="font-semibold px-2">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </span>
            ) : (
              <span className="text-gray-500 text-sm">날짜를 선택해주세요</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(true)}
            className="bg-color2 text-white text-sm py-2 px-4 rounded hover:bg-color7"
          >
            날짜 선택
          </button>
        </div>
        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <DayPicker
                locale={ko}
                mode="range"
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                modifiersStyles={modifiersStyles}
                fromDate={new Date()}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="bg-color2 text-black px-4 py-2 rounded hover:bg-color7 hover:text-white"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-color8 hover:bg-color6 focus:outline-none"
        >
          여행 계획 생성
        </button>
      </div>
    </form>
  )
}