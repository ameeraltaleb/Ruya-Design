import { motion } from "motion/react";
import { SERVICES } from "../constants";
import { Palette, Printer, Briefcase, Layout } from "lucide-react";

const iconMap = {
  Palette: Palette,
  Printer: Printer,
  Briefcase: Briefcase,
  Layout: Layout,
};

export default function Services() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
      </div>
    </section>
  );
}
