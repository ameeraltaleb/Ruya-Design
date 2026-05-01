import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Palette, Printer, Briefcase, Layout, Video, Monitor, Store, PenTool, Search } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const iconMap = {
  Palette: Palette,
  Printer: Printer,
  Briefcase: Briefcase,
  Layout: Layout,
  Video: Video,
  Monitor: Monitor,
  Store: Store,
  PenTool: PenTool,
  Search: Search
};

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Service[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Service);
      });
      // Fallback fallback to constant if empty, but for now we expect empty 
      setServices(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching services:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ruya-purple text-4xl md:text-5xl font-black mb-4"
          >
            خدماتنا الاحترافية
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-ruya-yellow mx-auto rounded-full"
          />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg font-medium">
            نقدم مجموعة متكاملة من الخدمات التي تلبي احتياجات أعمالك في التصميم والإنتاج الفني
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-ruya-purple border-t-white rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 py-12">لا يوجد خدمات مضافة حالياً. يرجى إضافتها من لوحة الإدارة.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Palette;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-ruya-purple/5 text-ruya-purple rounded-2xl flex items-center justify-center mb-6 group-hover:bg-ruya-purple group-hover:text-ruya-yellow transition-colors duration-300">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-ruya-purple mb-4">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-bold text-sm tracking-wide">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
