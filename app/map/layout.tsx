import MobileTabBar from '@/components/MobileTabBar'

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <MobileTabBar />
    </>
  )
}
