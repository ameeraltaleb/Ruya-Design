import { motion } from "motion/react";
import { Send, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-ruya-purple text-4xl md:text-5xl font-black mb-8"
            >
              تواصل معنا
            </motion.h2>
            <p className="text-gray-600 text-lg mb-12">
              لديك مشروع جديد؟ نحن هنا للمساعدة. تواصل معنا اليوم لمناقشة أفكارك وكيف يمكننا تحويلها إلى واقع ملموس.
            </p>

            <div className="space-y-8">
              {[
                { icon: Phone, label: "رقم الهاتف", value: "+966 50 000 0000" },
                { icon: Mail, label: "البريد الإلكتروني", value: "info@ruyadesign.com" },
                { icon: MapPin, label: "الموقع", value: "الرياض، المملكة العربية السعودية" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6"
                >
                  <div className="w-12 h-12 bg-ruya-bg text-ruya-purple rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-bold mb-1">{item.label}</h4>
                    <p className="text-xl font-bold text-ruya-purple">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-bold text-ruya-purple mb-6">تابعنا على</h4>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((SocialIcon, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -5, scale: 1.1 }}
                    href="#"
                    className="w-12 h-12 bg-ruya-purple text-white rounded-full flex items-center justify-center hover:bg-ruya-yellow transition-colors"
                  >
                    <SocialIcon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-ruya-bg p-8 md:p-12 rounded-[40px] border border-gray-100"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ruya-purple mr-2">الاسم الكامل</label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك"
                    className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ruya-purple mr-2">رقم الجوال</label>
                  <input
                    type="tel"
                    placeholder="05xxxxxxx"
                    className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-ruya-purple mr-2">نوع الخدمة</label>
                <select className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all bg-no-repeat appearance-none">
                  <option>تصميم جرافيكي</option>
                  <option>طباعة وإنتاج</option>
                  <option>هوية تجارية</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-ruya-purple mr-2">الرسالة</label>
                <textarea
                  placeholder="كيف يمكننا مساعدتك؟"
                  rows={4}
                  className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ruya-purple text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-ruya-yellow hover:text-ruya-purple transition-all shadow-xl shadow-ruya-purple/20"
              >
                إرسال الطلب
                <Send size={24} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
