'use client'

interface OptimizedRouteButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function OptimizedRouteButton({ onClick, isOpen }: OptimizedRouteButtonProps) {

  return (
    <button
      onClick={onClick}
      className="bg-color2 text-white px-4 py-1 rounded mx-2"
    >
      <span className="mr-2">최적화된 경로 {isOpen ? '접기' : '펼치기'}</span>
    </button>
  );
}