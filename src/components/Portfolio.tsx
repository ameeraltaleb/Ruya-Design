import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PROJECTS } from "../constants";

const CATEGORIES = ["الكل", "تصميم", "طباعة"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filteredProjects = activeCategory === "الكل" 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeCategory);

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

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-ruya-purple text-white shadow-lg shadow-ruya-purple/30"
                  : "bg-white text-ruya-purple hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ruya-purple/90 via-ruya-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="text-ruya-yellow font-bold text-sm mb-2 uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-white text-2xl font-black">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
