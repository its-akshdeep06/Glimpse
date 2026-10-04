import React, { useState, useEffect } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import LogoMark from '@/components/brand/LogoMark';
import Magnetic from '@/components/fx/Magnetic';
import { getSettings, updateSettings } from '@/services/storageService';

export default function LandingNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState(getSettings().theme);

  useMotionValueEvent(scrollY, 'change', (v) => {
    setHidden(
      v > (scrollY.getPrevious() ?? 0) && v > 240
    );
  });

  useEffect(() => {
    const handle = () => setTheme(getSettings().theme);

    window.addEventListener('module:settings', handle);

    return () => {
      window.removeEventListener('module:settings', handle);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  const scrollToTop = (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.header
      animate={{ y: hidden ? -110 : 0 }}
      transition={{
        duration: 0.5,
        ease: [0.2, 0.9, 0.1, 1],
      }}
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-void/90 to-transparent"
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 md:px-10">

        {/* GLIMPSE - SMOOTH SCROLL TO TOP */}
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <LogoMark />

          <span className="hidden min-[360px]:inline font-wide text-lg font-extrabold tracking-tight">
            GLIMPSE
          </span>
        </a>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-transparent px-2 py-2 label-caps text-mute transition-colors hover:bg-carbon hover:text-ink sm:px-4"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4 text-volt" />
            )}

            <span className="hidden sm:inline">
              {theme === 'dark'
                ? 'Light Mode'
                : 'Try Dark Mode!'}
            </span>
          </button>

          {/* OPEN GLIMPSE */}
          <Magnetic>
            <Link
              to="/app"
              className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-carbon bg-void/60 px-3 py-2.5 label-caps backdrop-blur transition-colors hover:border-volt hover:bg-volt hover:text-on-volt sm:gap-2 sm:px-5"
            >
              <span className="sm:hidden">Open</span>
              <span className="hidden sm:inline">Open Glimpse</span>

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Magnetic>

        </div>
      </div>
    </motion.header>
  );
}
