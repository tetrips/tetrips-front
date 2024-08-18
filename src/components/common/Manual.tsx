const features = [
  {
    name: '001',
    description: '1. 나만의 여행 계획 이름을 입력하세요.',
    imageSrc: '/manual/001.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '002',
    description:
      '2. 날짜 선택 버튼을 눌러 여행 시작 날짜와 종료 날짜를 선택하세요.',
    imageSrc: '/manual/002.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '003',
    description:
      '3. 여행 계획 제목과 날짜를 모두 입력했다면 여행 계획 생성 버튼을 눌러 본격적으로 여행 계획을 시작하세요.',
    imageSrc: '/manual/003.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '004',
    description:
      '4. 여행 계획 편집 중 초대 링크 복사 버튼을 눌러 링크를 공유하여, 언제든지 다른 사용자를 공동 편집자로 초대할 수 있습니다.\n' +
      '5. 초대한 사용자들과 채팅을 통해 실시간으로 의견을 나눌 수 있습니다.\n' +
      '6. 편집할 여행 일정 날짜를 선택하여 해당 날짜의 활동 시작 시간, 출발 지점, 종료 지점, 여행지 목록 등을 편집할 수 있습니다.',
    imageSrc: '/manual/004.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '005',
    description:
      '7. 시계 아이콘을 클릭하여 활동 시작 시간을 편집할 수 있습니다.\n' +
      '8. 출발 지점 선택 또는 도착 지점 선택을 클릭하거나, 장소 추가 버튼을 통해 추천장소 목록을 확인하여 여행지 장소를 추가하세요.',
    imageSrc: '/manual/005.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '006',
    description:
      '8. 출발 지점 선택 또는 도착 지점 선택을 클릭하거나, 장소 추가 버튼을 통해 추천장소 목록을 확인하여 여행지 장소를 추가하세요.',
    imageSrc: '/manual/006.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '007',
    description:
      '9. 추천 장소 목록에 원하는 장소가 없으면, 네이버 지도 검색을 통해 새로운 장소를 등록할 수 있습니다.',
    imageSrc: '/manual/007.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '008',
    description:
      '10. 등록된 장소들을 일정별로 지도에서 마커로 확인하고, 마커를 클릭하여 해당 장소에 대한 간략한 정보를 확인하세요.',
    imageSrc: '/manual/008.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '009',
    description:
      '11. 여행지 목록에 추가한 장소 중 특정 장소에 머무를 시간을 설정하거나 메모를 작성할 수 있습니다.\n' +
      '12. 경로 최적화 버튼을 누르면 해당 일정의 최적화된 동선에 따라 여행지 순서와 지도 마커 순서가 자동으로 변경됩니다.\n' +
      '13. 최적화 결과 확인 버튼을 통해 공동 편집자 모두가 경로 최적화 결과를 확인할 수 있습니다.',
    imageSrc: '/manual/009.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '010',
    description:
      '14. 여행지 목록에서 특정 장소를 드래그하여 여행지 순서를 쉽게 조정할 수 있습니다.',
    imageSrc: '/manual/010.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
  {
    name: '011',
    description:
      '15. 편집 과정 중 언제든 저장 버튼을 눌러 여행 계획을 중간 저장하세요.\n' +
      '16. 여행 계획 목록에서 View Project 버튼을 눌러 해당 여행 계획의 동선을 한눈에 파악하고, 이미지를 JPG 또는 PNG 파일로 저장할 수 있습니다.\n' +
      '17. 여행 계획 목록에서 폴더를 생성하여 여행 계획을 폴더별로 구분할 수 있습니다.',
    imageSrc: '/manual/011.jpg',
    imageAlt: '여행 계획 설명 사진',
  },
]

export default function Manual() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div className="max-w-3xl">
            <h2 className="font-semibold text-gray-500">How to use teTrips</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              테트립스 사용 방법
            </p>
            <p className="mt-4 text-gray-500">
              사용 설명서를 따라서 테트립스를 사용해보세요!
            </p>
          </div>

          <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8"
              >
                <div className="mt-6 lg:col-span-5 lg:mt-0 xl:col-span-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-auto lg:col-span-7 xl:col-span-8">
                  <div className="aspect-h-2 aspect-w-5 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      alt={feature.imageAlt}
                      src={feature.imageSrc}
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
