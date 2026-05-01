import { useState } from "react";
import { motion } from "motion/react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContactInfo } from "../lib/useContactInfo";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { contactInfo } = useContactInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: Date.now(),
        status: "new",
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-ruya-bg overflow-hidden">
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
              لديك مشروع جديد؟ نحن هنا للمساعدة. تواصل معنا اليوم لمناقشة أفكارك
              وكيف يمكننا تحويلها إلى واقع ملموس.
            </p>

            <div className="space-y-8">
              {[
                { icon: Phone, label: "رقم الهاتف", value: contactInfo.phone },
                {
                  icon: Mail,
                  label: "البريد الإلكتروني",
                  value: contactInfo.email,
                },
                {
                  icon: MapPin,
                  label: "الموقع",
                  value: contactInfo.address,
                },
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
                    <h4 className="text-sm text-gray-500 font-bold mb-1">
                      {item.label}
                    </h4>
                    <p
                      className="text-xl font-bold text-ruya-purple"
                      dir="auto"
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-bold text-ruya-purple mb-6">
                تابعنا على
              </h4>
              <div className="flex gap-4">
                {contactInfo.instagram && contactInfo.instagram !== "#" && (
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-ruya-purple text-white rounded-full flex items-center justify-center hover:bg-ruya-yellow transition-colors"
                  >
                    <Instagram size={24} />
                  </motion.a>
                )}
                {contactInfo.facebook && contactInfo.facebook !== "#" && (
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-ruya-purple text-white rounded-full flex items-center justify-center hover:bg-ruya-yellow transition-colors"
                  >
                    <Facebook size={24} />
                  </motion.a>
                )}
                {contactInfo.twitter && contactInfo.twitter !== "#" && (
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    href={contactInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-ruya-purple text-white rounded-full flex items-center justify-center hover:bg-ruya-yellow transition-colors"
                  >
                    <Twitter size={24} />
                  </motion.a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm"
          >
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={40} />
                </div>
                <h3 className="text-2xl font-bold text-ruya-purple">
                  تم استلام طلبك بنجاح!
                </h3>
                <p className="text-gray-600">سنتواصل معك في أقرب وقت ممكن.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 mt-4 bg-ruya-purple text-white rounded-xl hover:bg-ruya-yellow transition-colors"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ruya-purple mr-2">
                    الرسالة أو التفاصيل
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="كيف يمكننا مساعدتك؟"
                    rows={4}
                    className="w-full bg-white border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ruya-purple text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-ruya-yellow hover:text-ruya-purple transition-all shadow-xl shadow-ruya-purple/20 disabled:opacity-50"
                >
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                  {!loading && <Send size={24} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
