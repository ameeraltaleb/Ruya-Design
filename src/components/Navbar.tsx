import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { NAVBAR_LINKS } from "../constants";
import { Menu, X } from "lucide-react";
import { useLogo } from "../lib/useLogo";
import { useSectionsVisibility } from "../lib/useSectionsVisibility";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const logoUrl = useLogo();
  const { visibility } = useSectionsVisibility();

  // Filter links based on visibility
  const visibleLinks = NAVBAR_LINKS.filter((link) => {
    if (link.href === "#home") return visibility.hero;
    if (link.href === "#about") return visibility.about;
    if (link.href === "#services") return visibility.services;
    if (link.href === "#portfolio") return visibility.portfolio;
    if (link.href === "#contact") return visibility.contact;
    return true;
  });

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(75, 42, 107, 0)", "rgba(75, 42, 107, 1)"],
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{
        backgroundColor: scrolled
          ? "rgba(75, 42, 107, 1)"
          : "rgba(75, 42, 107, 0.9)",
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-2xl border-b-4 border-ruya-yellow h-20" : "h-24"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" className="flex items-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-16 w-auto object-contain drop-shadow-sm"
                />
              ) : (
                <div className="h-16 w-40 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                  <span className="text-white/20 text-[10px] font-bold">
                    LOGO SPACE
                  </span>
                </div>
              )}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline space-x-8 space-x-reverse">
              {visibleLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/90 hover:text-ruya-yellow px-3 py-2 text-sm font-bold tracking-wide transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <button className="bg-ruya-yellow text-ruya-purple px-6 py-2.5 rounded-full font-black text-xs uppercase shadow-[0_4px_0_rgb(200,140,30)] active:translate-y-1 transition-all">
              ابدأ الآن
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-ruya-yellow transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-ruya-purple px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/10"
        >
          {visibleLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white block px-3 py-4 rounded-md text-base font-medium hover:bg-white/10"
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
