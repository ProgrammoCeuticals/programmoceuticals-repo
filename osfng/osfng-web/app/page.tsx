import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import MissionSection from '@/components/sections/MissionSection'
import FocusAreasSection from '@/components/sections/FocusAreasSection'
import ProductsSection from '@/components/sections/ProductsSection'
import BorrowingSection from '@/components/sections/BorrowingSection'
import CommunitySection from '@/components/sections/CommunitySection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Operation Smile Foundation Nigeria | Empowering Communities',
  description:
    'OSF provides savings, loans and development programmes to empower women, youth and underserved communities in Owerri, Imo State and across Nigeria.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <FocusAreasSection />
      <ProductsSection />
      <BorrowingSection />
      <CommunitySection />
      <CTASection />
    </>
  )
}
