import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  image?: string;
  images?: string[];
  createdAt?: number;
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projs) {
        setProjects(projs);
      }
      
      const { data: srvs } = await supabase.from('services').select('title');
      if (srvs) {
        setServices(srvs.map(s => s.title));
      }
      
      setLoading(false);
    };
    fetchPortfolio();
  }, []);

  const CATEGORIES = [
    "الكل",
    ...Array.from(new Set([
      ...services,
      ...projects.map((p) => p.category)
    ])).filter(Boolean),
  ];

  const filteredProjects =
    activeCategory === "الكل"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-ruya-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ruya-purple text-4xl md:text-5xl font-black mb-4"
          >
            معرض أعمالنا
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-ruya-yellow mx-auto rounded-full"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-ruya-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex justify-center flex-wrap gap-2 mb-16">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-ruya-purple text-white shadow-xl"
                      : "bg-white border border-slate-200 text-slate-400 hover:border-ruya-yellow hover:text-ruya-yellow"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Masonry Project Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-slate-200 rounded-[30px] overflow-hidden shadow-xl border-4 border-white cursor-pointer break-inside-avoid inline-block w-full"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative z-0 bg-slate-100 flex items-center justify-center min-h-[200px]">
                      <img
                        src={project.images && project.images.length > 0 ? project.images[0] : project.image}
                        alt={project.title}
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {project.images && project.images.length > 1 && (
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-ruya-yellow animate-pulse"></span>
                        {project.images.length} صور
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ruya-purple/90 via-ruya-purple/20 to-transparent opacity-0 z-10 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-6 right-6 left-6 text-white z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-right">
                      <h3 className="text-xl sm:text-2xl font-black mb-1 drop-shadow-md">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ruya-yellow font-bold uppercase tracking-widest drop-shadow-md">
                        {project.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Vertical Scroll Modal for Project Images */}
            <AnimatePresence>
              {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pt-24 pb-4 px-4 sm:p-6 sm:pt-24 backdrop-blur-xl bg-black/60">
                  <div className="absolute inset-0 z-0 bg-black/40" onClick={() => setSelectedProject(null)} />
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] bg-[#f8f9fa] rounded-[30px] overflow-hidden shadow-2xl flex flex-col relative z-10 border border-white/30"
                  >
                    {/* Modal Header */}
                    <div className="p-5 sm:p-6 border-b border-white flex justify-between items-start bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                       <div className="text-right">
                          <h3 className="text-2xl sm:text-3xl font-black text-ruya-purple">{selectedProject.title}</h3>
                          <div className="mt-2 inline-flex items-center gap-2">
                             <span className="text-ruya-yellow font-bold text-xs sm:text-sm px-4 py-1.5 bg-ruya-yellow/10 rounded-full">
                               {selectedProject.category}
                             </span>
                          </div>
                       </div>
                       <button 
                         onClick={() => setSelectedProject(null)} 
                         className="p-2 sm:p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex-shrink-0"
                       >
                         <X className="w-5 h-5 sm:w-6 sm:h-6" />
                       </button>
                    </div>

                    {/* Modal Body (Scrollable Images) */}
                    <div className="overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-slate-50 flex-1">
                       <div className="flex flex-col gap-6 sm:gap-10 max-w-4xl mx-auto">
                         {selectedProject.images && selectedProject.images.length > 0 ? (
                           selectedProject.images.map((img, i) => (
                             <motion.div 
                               initial={{ opacity: 0, y: 20 }}
                               whileInView={{ opacity: 1, y: 0 }}
                               viewport={{ once: true, margin: "-50px" }}
                               transition={{ duration: 0.5, delay: i * 0.1 }}
                               key={i} 
                               className="w-full bg-white p-2 sm:p-4 rounded-2xl shadow-md border border-slate-100"
                             >
                               <img src={img} alt={`${selectedProject.title} - صورة ${i + 1}`} className="w-full h-auto rounded-xl" loading="lazy" />
                             </motion.div>
                           ))
                         ) : (
                           <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="w-full bg-white p-2 sm:p-4 rounded-2xl shadow-md border border-slate-100"
                           >
                             <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-auto rounded-xl" loading="lazy" />
                           </motion.div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
