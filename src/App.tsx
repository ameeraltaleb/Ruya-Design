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

      <footer className="bg-ruya-purple text-white py-12 border-t border-white/10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="mb-6 flex justify-end">
                {logoUrl ? (
                  logoUrl.startsWith("http") ||
                  logoUrl.startsWith("data:image") ||
                  logoUrl.startsWith("/") ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-16 w-auto object-contain drop-shadow-sm ml-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-white tracking-wider font-sans ml-auto">
                      {logoUrl}
                    </span>
                  )
                ) : (
                  <div className="h-16 w-40 ml-auto"></div>
                )}
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm mr-0 ml-auto">
                {contactInfo.footerText}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-ruya-yellow">
                روابط سريعة
              </h4>
              <ul className="space-y-4">
                {visibility.hero && (
                  <li>
                    <a
                      href="#home"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      الرئيسية
                    </a>
                  </li>
                )}
                {visibility.services && (
                  <li>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      خدماتنا
                    </a>
                  </li>
                )}
                {visibility.portfolio && (
                  <li>
                    <a
                      href="#portfolio"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      أعمالنا
                    </a>
                  </li>
                )}
                {visibility.contact && (
                  <li>
                    <a
                      href="#contact"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      تواصل معنا
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} رؤية ديزاين (RUYA Design). جميع
              الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      <WhatsApp />
    </div>
  );
}
