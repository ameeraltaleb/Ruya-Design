/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import WhatsApp from "./components/WhatsApp";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-ruya-bg">
      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Contact />
      </main>

      <footer className="bg-ruya-purple text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <span className="text-ruya-yellow">RUYA</span>
                <span>Design</span>
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                نقدم حلولاً إبداعية في عالم التصميم والطباعة، حيث نجمع بين الخبرة والابتكار لنضع علامتك التجارية في الصدارة.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-ruya-yellow">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">خدماتنا</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">أعمالنا</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">تواصل معنا</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-ruya-yellow">ساعات العمل</h4>
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
                  <span className="text-ruya-yellow font-bold text-sm bg-ruya-yellow/10 px-2 py-0.5 rounded">مغلق</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} رؤية ديزاين (RUYA Design). جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      <WhatsApp />
    </div>
  );
}
