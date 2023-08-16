import Image from 'next/image'
import {Button} from '../../components/ui/button'
import Link from 'next/link'
import { LandingNavbar } from '@/components/landing-navbat'
import { LandingHero } from '@/components/landing-hero'
import { LandingContent } from '@/components/LandingContent'

const DashboardPage=()=>{
  return (
    <div>
      <p>landing page</p>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default DashboardPage;
