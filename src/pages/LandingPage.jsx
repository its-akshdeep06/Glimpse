import React, { useEffect, lazy, Suspense } from 'react';
const LandingNav = lazy(() => import('@/components/landing/LandingNav'));
const Hero = lazy(() => import('@/components/landing/Hero'));
const TypesMarquee = lazy(() => import('@/components/landing/TypesMarquee'));
const FormatsSection = lazy(() => import('@/components/landing/FormatsSection'));
const DesignSection = lazy(() => import('@/components/landing/DesignSection'));
const TemplateBelt = lazy(() => import('@/components/landing/TemplateBelt'));
const ProcessSection = lazy(() => import('@/components/landing/ProcessSection'));
const PrivacySection = lazy(() => import('@/components/landing/PrivacySection'));
const CurtainFooter = lazy(() => import('@/components/landing/CurtainFooter'));
const BlueGlow = lazy(() => import('@/components/fx/BlueGlow'));
import useDynamicFavicon from '@/hooks/useDynamicFavicon';


export default function LandingPage() {
  useDynamicFavicon('home');
  useEffect(() => { document.title = 'GLIMPSE — QR Atelier'; }, []);

  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <div className="bg-void text-ink">
        <LandingNav />
        <main className="relative z-10 mb-[92svh] overflow-clip rounded-b-[2rem] bg-void shadow-[0_40px_90px_-20px_rgba(60,64,67,0.18)] md:rounded-b-[3rem]">
          <Hero />
          <TypesMarquee />
          <div className="relative overflow-hidden">
            <BlueGlow />
            <div className="relative z-10">
              <FormatsSection />
              <DesignSection />
              <TemplateBelt />
              <ProcessSection />
              <PrivacySection />
            </div>
          </div>
        </main>
        <CurtainFooter />
      </div>
    </Suspense>
  );
}