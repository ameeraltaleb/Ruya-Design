import { motion } from "motion/react";
import {
  ArrowLeft,
  Palette,
  Printer,
  PenTool,
  Layout,
  Monitor,
  Brush,
  Layers,
  Type,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
  subtitle: "مرحباً بكم في",
  title_prefix: "رؤيــا",
  title_highlight: "للتصميم",
  slogan: "New World, New Thinking ...",
  description:
    "نحن نصمم المستقبل بهوية بصرية قوية وحلول طباعية مبتكرة. فريقنا يجمع بين الفن والتكنولوجيا لتقديم تجربة لا تُنسى لعلامتك التجارية.",
  button1_text: "استعرض أعمالنا",
  button2_text: "احصل على استشارة",
  image_url:
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000",
};

export default function Hero() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);

  useEffect(() => {
    const fetchHero = async () => {
      const { data } = await supabase.from('settings').select('value').eq('id', 'hero').single();
      if (data && data.value) {
        try {
          setData(typeof data.value === 'string' ? JSON.parse(data.value) : data.value);
        } catch (e) {}
      }
    };
    fetchHero();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 lg:pb-24 overflow-hidden bg-ruya-bg"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-ruya-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-ruya-yellow/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
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
            className="text-5xl sm:text-[60px] md:text-[80px] leading-tight font-black text-ruya-purple tracking-tight mb-6 text-right"
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-10"
          >
            {[
              { label: "عميل", value: "+1300" },
              { label: "مشروع", value: "+620" },
              { label: "سنوات خبرة", value: "+13" },
              { label: "مطبوعة تم تسليمها", value: "+15,000" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/60 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200/50 text-center flex flex-col justify-center min-h-[90px]"
              >
                <h4 className="text-ruya-purple font-black text-xl md:text-2xl lg:text-3xl">
                  {stat.value}
                </h4>
                <p className="text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4"
          >
            <a
              href="#portfolio"
              className="w-full sm:w-auto text-center justify-center bg-ruya-purple text-white px-8 py-4 rounded-full font-black text-sm uppercase shadow-[0_5px_0_rgb(50,30,80)] active:translate-y-1 transition-all flex items-center gap-2"
            >
              {data.button1_text}
              <ArrowLeft size={18} />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto text-center bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-full font-black text-sm uppercase hover:bg-slate-50 transition-all shadow-sm"
            >
              {data.button2_text}
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:mt-0">
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
              <h3 className="text-3xl font-black mb-2 uppercase">
                Innovative Hub
              </h3>
              <p className="text-ruya-yellow font-bold uppercase tracking-widest text-sm">
                EST. 2024
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating element for visual interest */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="absolute right-[5%] top-[15%] opacity-20 lg:opacity-40 z-0 text-ruya-purple"
      >
        <Palette size={48} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[8%] md:left-[45%] top-[20%] opacity-20 lg:opacity-40 z-0 text-ruya-yellow"
      >
        <PenTool size={64} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute left-[15%] md:left-[35%] bottom-[15%] md:bottom-[30%] opacity-15 lg:opacity-30 z-0 text-ruya-purple"
      >
        <Printer size={42} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 25, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[20%] md:right-[40%] top-[5%] md:top-[10%] opacity-15 lg:opacity-30 z-0 text-ruya-purple"
      >
        <Layout size={36} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute right-[10%] md:right-[25%] bottom-[5%] md:bottom-[15%] opacity-10 lg:opacity-20 z-0 text-ruya-yellow"
      >
        <Monitor size={56} strokeWidth={1} />
      </motion.div>

      {/* New left-side focused design icons */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5.5,
          ease: "easeInOut",
          delay: 2.5,
        }}
        className="absolute left-[5%] top-[50%] md:top-[60%] opacity-15 lg:opacity-30 z-0 text-ruya-yellow"
      >
        <Brush size={42} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute left-[12%] bottom-[40%] opacity-15 lg:opacity-30 z-0 text-ruya-purple"
      >
        <Layers size={48} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6.5,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute left-[20%] top-[10%] md:top-[35%] opacity-10 lg:opacity-20 z-0 text-ruya-purple"
      >
        <Type size={36} strokeWidth={1} />
      </motion.div>
    </section>
  );
}
