import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface StatItem {
  id: number;
  name: string;
  value: string;
  iconName: string;
}

export default function Stats() {
  const [stats, setStats] = useState<StatItem[]>([
    { id: 1, name: "عميل", value: "+1300", iconName: "Users" },
    { id: 2, name: "مشروع", value: "+620", iconName: "Briefcase" },
    { id: 3, name: "سنوات خبرة", value: "+13", iconName: "Clock" },
    { id: 4, name: "جائزة إبداعية", value: "+25", iconName: "Award" },
  ]);

  useEffect(() => {
    const docRef = doc(db, "settings", "stats");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().value) {
          try {
            setStats(JSON.parse(docSnap.data().value));
          } catch (e) {}
        }
      },
      (error) => {
        console.error("Error fetching stats realtime:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" dir="rtl">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop"
          alt="بدء العمل"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-ruya-purple/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => {
            const Icon =
              (LucideIcons as any)[stat.iconName] || LucideIcons.Star;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                  <Icon className="w-8 h-8 text-ruya-yellow" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium text-lg">
                  {stat.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
