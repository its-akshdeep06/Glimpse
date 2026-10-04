import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

const MAP = [
  { title: 'Explore', links: [['Formats', '#formats'], ['Design', '#design'], ['Gallery', '#gallery'], ['Privacy', '#privacy']] },
  { title: 'Atelier', links: [['Create QR', '/app'], ['Templates', '/app?section=templates'], ['Downloads', '/app?section=downloads'], ['Settings', '/app?section=settings']] },
];

const linkClass = 'inline-block font-wide text-lg font-bold uppercase transition-transform duration-300 hover:translate-x-2 min-[360px]:text-xl';

// Fixed behind the page; revealed as the main content slides up like a curtain.
export default function CurtainFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[37rem] flex-col justify-between overflow-hidden bg-volt px-6 pb-4 pt-8 text-on-volt min-[360px]:h-[47rem] min-[360px]:gap-0 min-[360px]:pb-6 min-[360px]:pt-24 md:h-[92svh] md:gap-6 md:pb-6 md:pt-24 md:px-10 md:pb-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 min-[360px]:gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="label-caps">Ready, when you are</p>
          <Link to="/app" className="group mt-3 inline-flex items-center gap-4 font-wide text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tight min-[360px]:mt-4">
            Start encoding
            <ArrowUpRight className="h-[0.8em] w-[0.8em] transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
        {MAP.map((col) => (
          <div key={col.title}>
            <p className="label-caps opacity-60">{col.title}</p>
            <ul className="mt-3 space-y-0.5 min-[360px]:mt-4 min-[360px]:space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('#') ? <a href={href} className={linkClass}>{label}</a> : <Link to={href} className={linkClass}>{label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-col items-start gap-2 label-caps min-[360px]:flex-row min-[360px]:items-end min-[360px]:justify-between min-[360px]:gap-4">
          <span className="min-w-0">© 2026 Glimpse • encoded in your browser</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex shrink-0 items-center gap-2 self-end whitespace-nowrap hover:underline min-[360px]:self-auto">
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p
          className="mt-3 w-full translate-y-0 select-none whitespace-nowrap text-center font-wide text-[clamp(2.25rem,11vw,4.5rem)] font-black uppercase leading-[0.78] tracking-[-0.05em] sm:mt-4 sm:-translate-y-2 sm:text-[min(17vw,17.5rem,calc((100vw-3rem)/5.85))] md:-translate-y-5 md:text-[min(17vw,17.5rem,calc((100vw-5rem)/5.85))]"
          aria-hidden="true"
        >
          GLIMPSE
        </p>


      </div>
    </footer>
  );
}