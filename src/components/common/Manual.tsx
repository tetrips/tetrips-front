const features = [
  {
    name: 'Adventure-ready',
    description:
      'The Drawstring Canister is water and tear resistant with durable canvas construction. This bag holds up to the demands of daily use while keeping your snacks secure.',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-feature-04-detail-03.jpg',
    imageAlt: 'Printed photo of bag being tossed into the sky on top of grass.',
  },
  {
    name: 'Minimal and clean',
    description:
      "Everything you need, nothing you don't. This bag has the simple, contemporary design that enables you to tell everyone you know about how essentialism is the only rational way to live life.",
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-feature-04-detail-01.jpg',
    imageAlt: 'Double stitched black canvas hook loop.',
  },
  {
    name: 'Organized',
    description:
      'Never lose your snacks again with our patent-pending snack stash pocket system. With dedicated pouches for each of your snacking needs, the Drawstring Canister unlocks new levels of efficiency and convenience.',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-feature-04-detail-02.jpg',
    imageAlt: 'Black canvas body with chrome zipper and key ring.',
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
