/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import WhatsApp from "./components/WhatsApp";
import { motion } from "motion/react";
import { useLogo } from "./lib/useLogo";
import { useSectionsVisibility } from "./lib/useSectionsVisibility";
import { useContactInfo } from "./lib/useContactInfo";
import { useEffect } from "react";
import { Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function App() {
  const logoUrl = useLogo();
  const { visibility } = useSectionsVisibility();
  const { contactInfo } = useContactInfo();

  useEffect(() => {
    // Basic protection against casual image theft and layout inspection
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.style.backgroundImage) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Cmd+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase())) ||
        (e.metaKey && ['U', 'S'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ruya-bg overflow-x-hidden">
      <Navbar />

      <main>
        {visibility.hero && <Hero />}
        {visibility.about && <About />}
        {visibility.services && <Services />}
        {visibility.portfolio && <Portfolio />}
        {visibility.testimonials && <Testimonials />}
        {visibility.contact && <Contact />}
      </main>

      <footer className="bg-ruya-purple text-white py-16 border-t border-white/10 text-right relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-ruya-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-end">
                {logoUrl ? (
                  logoUrl.startsWith("http") ||
                  logoUrl.startsWith("data:image") ||
                  logoUrl.startsWith("/") ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-20 w-auto object-contain drop-shadow-sm ml-auto bg-white/5 p-2 rounded-xl border border-white/10"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-4xl font-black text-white tracking-wider font-sans ml-auto">
                      {logoUrl}
                    </span>
                  )
                ) : (
                  <div className="h-16 w-40 ml-auto bg-white/5 rounded-xl animate-pulse"></div>
                )}
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm mr-0 ml-auto text-base">
                {contactInfo.footerText}
              </p>
              
              <div className="flex gap-4 justify-end pt-4">
                {contactInfo.instagram && contactInfo.instagram !== "#" && (
                  <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ruya-yellow hover:text-slate-900 transition-all duration-300 text-gray-400 hover:scale-110">
                    <Instagram size={20} />
                  </a>
                )}
                {contactInfo.facebook && contactInfo.facebook !== "#" && (
                  <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ruya-yellow hover:text-slate-900 transition-all duration-300 text-gray-400 hover:scale-110">
                    <Facebook size={20} />
                  </a>
                )}
                {contactInfo.twitter && contactInfo.twitter !== "#" && (
                  <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ruya-yellow hover:text-slate-900 transition-all duration-300 text-gray-400 hover:scale-110">
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-white flex items-center justify-end gap-2">
                روابط سريعة
                <span className="w-8 h-1 bg-ruya-yellow rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                {visibility.hero && (
                  <li>
                    <a
                      href="#home"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-end gap-2 group"
                    >
                      <span className="group-hover:-translate-x-2 transition-transform duration-300">الرئيسية</span>
                    </a>
                  </li>
                )}
                {visibility.services && (
                  <li>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-end gap-2 group"
                    >
                      <span className="group-hover:-translate-x-2 transition-transform duration-300">خدماتنا</span>
                    </a>
                  </li>
                )}
                {visibility.portfolio && (
                  <li>
                    <a
                      href="#portfolio"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-end gap-2 group"
                    >
                      <span className="group-hover:-translate-x-2 transition-transform duration-300">أعمالنا</span>
                    </a>
                  </li>
                )}
                {visibility.contact && (
                  <li>
                    <a
                      href="#contact"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-end gap-2 group"
                    >
                      <span className="group-hover:-translate-x-2 transition-transform duration-300">تواصل معنا</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-white flex items-center justify-end gap-2">
                تواصل معنا
                <span className="w-8 h-1 bg-ruya-yellow rounded-full"></span>
              </h4>
              <ul className="space-y-5 text-gray-400">
                {contactInfo.locations && contactInfo.locations.length > 0 && (
                  <li className="flex items-start gap-4 justify-end group">
                    <span className="text-sm leading-relaxed group-hover:text-white transition-colors">{contactInfo.locations[0].address}</span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-ruya-yellow group-hover:bg-ruya-yellow group-hover:text-slate-900 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </li>
                )}
                {contactInfo.phone && (
                  <li className="flex items-center gap-4 justify-end group">
                    <span className="font-mono text-sm group-hover:text-white transition-colors" dir="ltr">{contactInfo.phone}</span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-ruya-yellow group-hover:bg-ruya-yellow group-hover:text-slate-900 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} <span className="text-white font-bold">رؤية ديزاين (RUYA Design)</span>. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-2">
              <span>صُنع بشغف لتقديم أفضل تجربة</span>
              <span className="text-red-500 animate-pulse">❤</span>
            </div>
          </div>
        </div>
      </footer>

      <WhatsApp />
    </div>
  );
}
