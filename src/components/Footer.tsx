import { Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { useLogo } from "../lib/useLogo";
import { useSectionsVisibility } from "../lib/useSectionsVisibility";
import { useContactInfo } from "../lib/useContactInfo";

export default function Footer() {
  const logoUrl = useLogo();
  const { visibility } = useSectionsVisibility();
  const { contactInfo } = useContactInfo();

  return (
      <footer className="bg-ruya-purple text-white py-12 lg:py-16 border-t border-white/10 relative overflow-hidden" dir="rtl">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-ruya-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12 mb-12 lg:mb-16">
            <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start">
              <div className="flex justify-center md:justify-start">
                {logoUrl ? (
                  logoUrl.startsWith("http") ||
                  logoUrl.startsWith("data:image") ||
                  logoUrl.startsWith("/") ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-16 lg:h-20 w-auto object-contain drop-shadow-sm bg-white/5 p-2 rounded-xl border border-white/10"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-3xl lg:text-4xl font-black text-white tracking-wider font-sans">
                      {logoUrl}
                    </span>
                  )
                ) : (
                  <div className="h-16 w-40 bg-white/5 rounded-xl animate-pulse"></div>
                )}
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm text-sm lg:text-base">
                {contactInfo.footerText}
              </p>
              
              <div className="flex gap-4 justify-center md:justify-start pt-4">
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

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                روابط سريعة
                <span className="w-8 h-1 bg-ruya-yellow rounded-full hidden md:block"></span>
              </h4>
              <ul className="space-y-4 text-center md:text-right w-full">
                {visibility.hero && (
                  <li>
                    <a
                      href="/#home"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-center md:justify-start gap-2 group"
                    >
                      <span className="md:group-hover:-translate-x-2 transition-transform duration-300">الرئيسية</span>
                    </a>
                  </li>
                )}
                {visibility.services && (
                  <li>
                    <a
                      href="/#services"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-center md:justify-start gap-2 group"
                    >
                      <span className="md:group-hover:-translate-x-2 transition-transform duration-300">خدماتنا</span>
                    </a>
                  </li>
                )}
                {visibility.portfolio && (
                  <li>
                    <a
                      href="/#portfolio"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-center md:justify-start gap-2 group"
                    >
                      <span className="md:group-hover:-translate-x-2 transition-transform duration-300">أعمالنا</span>
                    </a>
                  </li>
                )}
                {visibility.contact && (
                  <li>
                    <a
                      href="/#contact"
                      className="text-gray-400 hover:text-ruya-yellow transition-colors flex items-center justify-center md:justify-start gap-2 group"
                    >
                      <span className="md:group-hover:-translate-x-2 transition-transform duration-300">تواصل معنا</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                تواصل معنا
                <span className="w-8 h-1 bg-ruya-yellow rounded-full hidden md:block"></span>
              </h4>
              <ul className="space-y-5 text-gray-400 w-full">
                {contactInfo.locations && contactInfo.locations.length > 0 && (
                  <li className="flex items-start lg:items-center flex-col md:flex-row gap-3 justify-center md:justify-start group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-ruya-yellow group-hover:bg-ruya-yellow group-hover:text-slate-900 transition-colors mx-auto md:mx-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm leading-relaxed group-hover:text-white transition-colors text-center md:text-right">{contactInfo.locations[0].address}</span>
                  </li>
                )}
                {contactInfo.phone && (
                  <li className="flex items-center gap-3 justify-center md:justify-start group flex-col md:flex-row">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-ruya-yellow group-hover:bg-ruya-yellow group-hover:text-slate-900 transition-colors mx-auto md:mx-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-sm group-hover:text-white transition-colors text-center md:text-right" dir="ltr">{contactInfo.phone}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-center gap-4 text-gray-500 text-xs sm:text-sm text-center">
            <p>
              © {new Date().getFullYear()} <span className="text-white font-bold">رؤيا ديزاين (RUYA Design)</span>. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
  );
}
