'use client'

interface OptimizedRouteButtonProps {
  onClick: () => void;
}

export function OptimizedRouteButton({ onClick }: OptimizedRouteButtonProps) {

  return (
    <button
      onClick={onClick}
      className="bg-white text-cyan-500 border border-cyan-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-cyan-500 hover:text-white transition-colors duration-200 flex items-center"
    >
      <span className="mr-2">최적화 결과 확인</span>
    </button>
  );
}