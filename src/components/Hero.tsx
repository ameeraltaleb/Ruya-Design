import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface HeroData {
  subtitle: string;
  title_prefix: string;
  title_highlight: string;
  slogan: string;
  description: string;
  button1_text: string;
  button2_text: string;
  image_url: string;
}

const DEFAULT_HERO: HeroData = {
  subtitle: 'وكالة إبداعية متكاملة',
  title_prefix: 'رؤية',
  title_highlight: 'للتصميم',
  slogan: 'New World, New Thinking ...',
  description: 'نحن نصمم المستقبل بهوية بصرية قوية وحلول طباعية مبتكرة. فريقنا يجمع بين الفن والتكنولوجيا لتقديم تجربة لا تُنسى لعلامتك التجارية.',
  button1_text: 'استعرض أعمالنا',
  button2_text: 'احصل على استشارة',
  image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000'
};

export default function Hero() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, 'settings', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          setData(JSON.parse(docSnap.data().value));
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-ruya-bg">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-ruya-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-ruya-yellow/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-ruya-yellow/10 text-ruya-purple text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md border-r-4 border-ruya-purple w-fit mb-6 text-right"
          >
            {data.subtitle}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[60px] md:text-[80px] leading-tight font-black text-ruya-purple tracking-tight mb-6 text-right"
          >
            {data.title_prefix}
            <br />
            <span className="text-ruya-yellow">{data.title_highlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl font-bold text-ruya-yellow italic opacity-90 mb-4 text-right underline decoration-ruya-purple/20 underline-offset-8"
          >
            {data.slogan}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-500 leading-relaxed max-w-lg mb-10 text-right"
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-10"
          >
            {[
              { label: "مشروع تصميم", value: "150+" },
              { label: "دعم فني", value: "24/7" },
              { label: "جودة طباعة", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-right">
                <h4 className="text-ruya-purple font-black text-2xl">{stat.value}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#portfolio"
              className="bg-ruya-purple text-white px-8 py-4 rounded-full font-black text-sm uppercase shadow-[0_5px_0_rgb(50,30,80)] active:translate-y-1 transition-all flex items-center gap-2"
            >
              {data.button1_text}
              <ArrowLeft size={18} />
            </a>
            <a
              href="#contact"
              className="bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-full font-black text-sm uppercase hover:bg-slate-50 transition-all shadow-sm"
            >
              {data.button2_text}
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-slate-200 h-[350px] md:h-[450px] lg:h-[500px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ruya-purple/80 via-transparent to-transparent z-10" />
            <img 
              src={data.image_url} 
              className="w-full h-full object-cover transform scale-110"
              alt="Creative Space"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-10 right-10 left-10 text-white z-20 text-left">
              <h3 className="text-3xl font-black mb-2 uppercase">Innovative Hub</h3>
              <p className="text-ruya-yellow font-bold uppercase tracking-widest text-sm">EST. 2024</p>
            </div>
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
