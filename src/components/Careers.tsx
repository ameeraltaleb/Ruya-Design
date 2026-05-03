import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Briefcase, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Job {
  id: string;
  title: string;
  type: string;
  description: string;
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [position, setPosition] = useState("طلب عام");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('job_applications').insert({
        name,
        email,
        phone,
        portfolio_url: portfolio,
        position,
        notes,
        status: "new"
      });
      if (error) throw error;
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setPortfolio("");
      setPosition("طلب عام");
      setNotes("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى والتأكد من إعداد قاعدة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="careers" className="py-16 lg:py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ruya-purple text-4xl md:text-5xl font-black mb-6"
          >
            انضم إلى فريق <span className="text-ruya-yellow">رؤيا</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            نحن دائماً نبحث عن المواهب المبدعة والعقول المبتكرة. إذا كنت تمتلك الشغف وترغب في العمل في بيئة محفزة، فنحن نرحب بك.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Jobs List */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold text-ruya-purple mb-8 flex items-center gap-3">
              <Briefcase className="text-ruya-yellow" size={28} />
              الفرص المتاحة
            </h3>
            
            {jobsLoading ? (
              <div className="text-gray-500 text-center py-8">جاري تحميل الوظائف...</div>
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-ruya-bg p-6 rounded-3xl border border-gray-100 hover:border-ruya-yellow/50 transition-colors cursor-pointer"
                  onClick={() => setPosition(job.title)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-ruya-purple">{job.title}</h4>
                    <span className="text-xs font-bold bg-ruya-purple text-white px-3 py-1 rounded-full whitespace-nowrap">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {job.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-ruya-yellow font-bold text-sm flex items-center gap-2">
                      التقديم على هذه الوظيفة
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100">
                 <p className="text-gray-500">لا توجد وظائف متاحة حالياً، ولكن يمكنك تقديم طلب عام وسنتواصل معك.</p>
               </div>
            )}
            
            <div className="bg-ruya-purple text-white p-8 rounded-3xl mt-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-ruya-yellow/20 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
               <h4 className="text-xl font-bold mb-3 relative z-10">لم تجد تخصصك؟</h4>
               <p className="text-white/80 text-sm leading-relaxed relative z-10">
                 لا تقلق، يمكنك تقديم طلب عام وسنقوم بالاحتفاظ ببياناتك للتواصل معك عند توفر فرصة مناسبة لمهاراتك.
               </p>
            </div>
            
          </div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
          >
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={48} />
                </div>
                <h3 className="text-2xl font-bold text-ruya-purple">
                  تم استلام طلبك بنجاح!
                </h3>
                <p className="text-gray-600 max-w-sm">سعداء باهتمامك بالانضمام إلينا. سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 mt-6 bg-ruya-purple text-white font-bold rounded-xl hover:bg-ruya-yellow transition-colors"
                >
                  تقديم طلب آخر
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold text-ruya-purple mb-8 border-b border-gray-100 pb-4">
                  قدم الآن
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-ruya-purple mr-2">
                    المسمى الوظيفي
                  </label>
                  <div className="relative">
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-ruya-bg appearance-none border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all text-ruya-purple font-medium cursor-pointer"
                    >
                      <option value="طلب عام">طلب عام</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-ruya-bg border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full bg-ruya-bg border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full bg-ruya-bg border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ruya-purple mr-2">
                      رابط الأعمال / البورتفوليو *
                    </label>
                    <input
                      type="url"
                      required
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://behance.net/..."
                      className="w-full bg-ruya-bg border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-ruya-purple mr-2">
                    نبذة عنك / ملاحظات إضافية
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="حدثنا عن خبرتك ولماذا ترغب بالانضمام إلينا..."
                    rows={4}
                    className="w-full bg-ruya-bg border-2 border-transparent focus:border-ruya-yellow p-4 rounded-2xl outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ruya-purple text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-ruya-yellow hover:text-ruya-purple transition-all shadow-xl shadow-ruya-purple/20 disabled:opacity-50 mt-4"
                >
                  {loading ? "جاري الإرسال..." : "تقديم الطلب"}
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
