/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import WhatsApp from "./components/WhatsApp";
import { motion } from "motion/react";
import { useLogo } from "./lib/useLogo";
import { useSectionsVisibility } from "./lib/useSectionsVisibility";

export default function App() {
  const logoUrl = useLogo();
  const { visibility } = useSectionsVisibility();

  return (
    <div className="min-h-screen bg-ruya-bg overflow-x-hidden">
      <Navbar />

      <main>
        {visibility.hero && <Hero />}
        {visibility.clients && <Clients />}
        {visibility.about && <About />}
        {visibility.services && <Services />}
        {visibility.stats && <Stats />}
        {visibility.portfolio && <Portfolio />}
        {visibility.testimonials && <Testimonials />}
        {visibility.contact && <Contact />}
      </main>

      <footer className="bg-ruya-purple text-white py-12 border-t border-white/10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
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
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-white tracking-wider font-sans ml-auto">
                      {logoUrl}
                    </span>
                  )
                ) : (
                  <div className="h-16 w-40 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 ml-auto">
                    <span className="text-white/20 text-[10px] font-bold">
                      LOGO SPACE
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm mr-0 ml-auto">
                نقدم حلولاً إبداعية في عالم التصميم والطباعة، حيث نجمع بين
                الخبرة والابتكار لنضع علامتك التجارية في الصدارة.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-ruya-yellow">
                روابط سريعة
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    خدماتنا
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    أعمالنا
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-ruya-yellow">
                ساعات العمل
              </h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex justify-between">
                  <span>الأحد - الخميس</span>
                  <span>9:00 ص - 6:00 م</span>
                </li>
                <li className="flex justify-between">
                  <span>السبت</span>
                  <span>10:00 ص - 4:00 م</span>
                </li>
                <li className="flex justify-between">
                  <span>الجمعة</span>
                  <span className="text-ruya-yellow font-bold text-sm bg-ruya-yellow/10 px-2 py-0.5 rounded">
                    مغلق
                  </span>
                </li>
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
