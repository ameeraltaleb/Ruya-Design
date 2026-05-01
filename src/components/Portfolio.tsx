import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  createdAt?: number;
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Project[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const CATEGORIES = ["الكل", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeCategory === "الكل" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-ruya-bg">
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

            {/* Project Grid */}
            <div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-slate-200 h-[400px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white"
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ruya-purple via-transparent to-transparent opacity-80 z-10 transition-opacity group-hover:opacity-90" />
                    
                    <div className="absolute bottom-8 right-8 left-8 text-white z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-right">
                      <h3 className="text-2xl font-black mb-1">{project.title}</h3>
                      <p className="text-sm text-ruya-yellow font-bold uppercase tracking-widest">{project.category}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
