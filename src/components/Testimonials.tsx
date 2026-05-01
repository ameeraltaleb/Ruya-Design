import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    {
      id: 1,
      name: "أحمد محمد",
      role: "المدير التنفيذي لشركة التقنية",
      content:
        "تعاملنا مع رؤية للتصميم كان من أفضل القرارات التي اتخذناها. احترافية في العمل وسرعة في التسليم وتصاميم فاقت توقعاتنا.",
      rating: 5,
    },
    {
      id: 2,
      name: "سارة خالد",
      role: "صاحبة متجر إلكتروني",
      content:
        "فريق مبدع جداً، فهموا فكرتي بسرعة وقدموا لي هوية بصرية مذهلة ساعدت في زيادة مبيعاتي بشكل ملحوظ.",
      rating: 5,
    },
    {
      id: 3,
      name: "عمر عبدالله",
      role: "مدير تسويق",
      content:
        "جودة المطبوعات لديهم لا يُعلى عليها. دقة في الألوان واهتمام بأدق التفاصيل. أنصح بالتعامل معهم بشدة.",
      rating: 5,
    },
  ]);

  useEffect(() => {
    const docRef = doc(db, "settings", "testimonials");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().value) {
          try {
            setTestimonials(JSON.parse(docSnap.data().value));
          } catch (e) {}
        }
      },
      (error) => {
        console.error("Error fetching testimonials realtime:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              آراء <span className="text-ruya-yellow">عملائنا</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              نفخر بثقة عملائنا ونسعى دائماً لتقديم الأفضل لهم.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900 rounded-3xl p-8 relative border border-white/5 hover:border-ruya-yellow/30 transition-colors group"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-ruya-purple/30 group-hover:text-ruya-yellow/20 transition-colors -rotate-180" />

              <div className="flex mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-ruya-yellow fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-8 relative z-10 leading-relaxed text-lg">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ruya-purple flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
