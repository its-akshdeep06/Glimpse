import React, { useEffect } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import TypesMarquee from '@/components/landing/TypesMarquee';
import FormatsSection from '@/components/landing/FormatsSection';
import DesignSection from '@/components/landing/DesignSection';
import TemplateBelt from '@/components/landing/TemplateBelt';
import ProcessSection from '@/components/landing/ProcessSection';
import PrivacySection from '@/components/landing/PrivacySection';
import CurtainFooter from '@/components/landing/CurtainFooter';
import useDynamicFavicon from '@/hooks/useDynamicFavicon';

export default function LandingPage() {
  useDynamicFavicon('home');
  useEffect(() => { document.title = 'GLIMPSE — QR Atelier'; }, []);

  return (
    <div className="bg-void text-ink">
      <LandingNav />
      <main className="relative z-10 mb-[92svh] overflow-clip rounded-b-[2rem] bg-void shadow-[0_40px_90px_-20px_rgba(60,64,67,0.18)] md:rounded-b-[3rem]">
        <Hero />
        <TypesMarquee />
        <FormatsSection />
        <DesignSection />
        <TemplateBelt />
        <ProcessSection />
        <PrivacySection />
      </main>
      <CurtainFooter />
    </div>
  );
}