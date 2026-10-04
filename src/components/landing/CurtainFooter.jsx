import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

const MAP = [
  { title: 'Explore', links: [['Formats', '#formats'], ['Design', '#design'], ['Gallery', '#gallery'], ['Privacy', '#privacy']] },
  { title: 'Atelier', links: [['Create QR', '/app'], ['Templates', '/app?section=templates'], ['Downloads', '/app?section=downloads'], ['Settings', '/app?section=settings']] },
];

const linkClass = 'inline-block font-wide text-xl font-bold uppercase transition-transform duration-300 hover:translate-x-2';

// Fixed behind the page; revealed as the main content slides up like a curtain.
export default function CurtainFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[92svh] flex-col justify-between overflow-hidden bg-volt px-6 pb-6 pt-24 text-on-volt md:px-10 md:pb-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="label-caps">Ready, when you are</p>
          <Link to="/app" className="group mt-4 inline-flex items-center gap-4 font-wide text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none tracking-tight">
            Start encoding
            <ArrowUpRight className="h-[0.8em] w-[0.8em] transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
        {MAP.map((col) => (
          <div key={col.title}>
            <p className="label-caps opacity-60">{col.title}</p>
            <ul className="mt-4 space-y-2">
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
        <div className="flex items-end justify-between gap-4 label-caps">
          <span>© 2026 Glimpse • encoded in your browser</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:underline">
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p
          className="mt-4 -translate-x-10 translate-y-4 select-none whitespace-nowrap font-wide text-[17vw] font-black uppercase leading-[0.78] tracking-[-0.05em]"
          aria-hidden="true"
        >
          GLIMPSE
        </p>


      </div>
    </footer>
  );
}