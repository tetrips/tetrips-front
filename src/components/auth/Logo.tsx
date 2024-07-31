import Image from 'next/image'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/icons/tetrips-logo.png"
      alt="tetrips logo"
      width="100"
      height="100"
      className="m-auto"
    />
  )
}
