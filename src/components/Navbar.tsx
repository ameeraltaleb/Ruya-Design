import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { NAVBAR_LINKS } from "../constants";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(75, 42, 107, 0)", "rgba(75, 42, 107, 1)"]
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
      style={{ backgroundColor: scrolled ? "rgba(75, 42, 107, 1)" : "rgba(75, 42, 107, 0)" }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
             <div className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-ruya-yellow">RUYA</span>
                <span>Design</span>
             </div>
          </div>
          
          <div className="hidden md:block">
            <div className="mr-10 flex items-baseline space-x-8 space-x-reverse">
              {NAVBAR_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-ruya-yellow px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
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
          {NAVBAR_LINKS.map((link) => (
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
