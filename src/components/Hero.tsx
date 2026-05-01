import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden bg-ruya-purple">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-ruya-yellow/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-ruya-yellow font-bold text-xl md:text-2xl mb-4"
          >
            New World, New Thinking ...
          </motion.h2>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight"
          >
            RUYA Design
            <br />
            <span className="text-ruya-yellow">رؤية ديزاين</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed"
          >
            نحن هنا لنحول رؤيتك إلى واقع ملموس. نقدم حلولاً إبداعية في التصميم والطباعة، نجمع بين الابتكار والجودة العالية لنصنع لعلامتك التجارية حضوراً لا يُنسى.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#portfolio"
              className="bg-ruya-yellow text-ruya-purple px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-white transition-colors"
            >
              استعرض أعمالنا
              <ArrowLeft size={20} />
            </a>
            <a
              href="#contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-ruya-purple transition-colors"
            >
              احصل على استشارة
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Floating element for visual interest */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
        className="absolute right-[10%] top-[20%] hidden lg:block"
      >
        <div className="w-64 h-64 border-4 border-ruya-yellow opacity-20 rounded-3xl rotate-12" />
      </motion.div>
    </section>
  );
}
