import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function About() {
  const [data, setData] = useState({
    title: "من نحن؟",
    description: "جاري التحميل...",
    features: [] as string[],
    image_url: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          setData(JSON.parse(docSnap.data().value));
        } else {
          // Default
          setData({
            title: "من نحن؟",
            description: "نحن في \"رؤية\" للتصميم والطباعة لسنا مجرد وكالة دعاية وإعلان، بل نحن شركاء نجاحك. نؤمن بأن كل علامة تجارية لها قصة فريدة تستحق أن تُروى بأفضل صورة ممكنة. نجمع بين الإبداع الفني والخبرة التقنية لنقدم لك حلولاً متكاملة تبرز هوية مشروعك.",
            features: [
              "فريق عمل مبدع ومحترف",
              "أحدث تقنيات الطباعة",
              "الالتزام بالمواعيد",
              "أسعار تنافسية",
              "جودة عالية في التنفيذ",
              "خدمة عملاء متميزة",
            ],
            image_url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2194&auto=format&fit=crop"
          });
        }
      } catch (error) {
        console.error("Error fetching about section:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      id="about"
      className="py-24 bg-slate-900 border-b border-white/10"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {data.title || "من نحن؟"}
            </h2>
            <div className="w-20 h-1.5 bg-ruya-yellow mb-8 rounded-full" />

            <p className="text-gray-400 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {data.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {data.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-ruya-yellow shrink-0" />
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {data.image_url && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-ruya-purple/20 mix-blend-multiply z-10" />
                <img
                  src={data.image_url}
                  alt="من نحن"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-ruya-yellow rounded-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-ruya-purple rounded-3xl -z-10" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
