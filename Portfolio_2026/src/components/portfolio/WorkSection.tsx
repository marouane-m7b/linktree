import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

const PLACEHOLDER_IMAGE = "https://www.sliderrevolution.com/wp-content/uploads/2024/09/what-is-a-hero-section.jpg";

const initialProjects = [
  {
    originalTitle: "OFPPT Absence Manager",
    image: PLACEHOLDER_IMAGE,
    tags: ["React Js", "Laravel", "Material UI", "MySQL"],
    category: ["react", "laravel", "fullstack"],
    github: "#",
    demo: "#",
    color: "primary",
  },
  {
    originalTitle: "ZM Store",
    image: PLACEHOLDER_IMAGE,
    tags: ["React Js", "Laravel", "MySQL", "Git"],
    category: ["react", "laravel", "fullstack"],
    github: "#",
    demo: "#",
    color: "secondary",
  },
  {
    originalTitle: "OFPPT Establishments Cards Manager",
    image: PLACEHOLDER_IMAGE,
    tags: ["Spring Boot", "React Js", "MySQL", "Spring Security"],
    category: ["react", "fullstack"],
    github: "#",
    demo: "#",
    color: "accent",
  },
  {
    originalTitle: "Movies Reviews System",
    image: PLACEHOLDER_IMAGE,
    tags: ["Jakarta EE", "JavaScript", "MySQL", "JDBC"],
    category: ["fullstack"],
    github: "#",
    demo: "#",
    color: "primary",
  },
  {
    originalTitle: "Baccalaureate GPA Calculator",
    image: PLACEHOLDER_IMAGE,
    tags: ["HTML", "CSS", "JavaScript", "Mobile"],
    category: ["mobile"],
    github: "#",
    demo: "#",
    color: "secondary",
  },
  {
    originalTitle: "سياقتي - Driving Learning Platform",
    image: PLACEHOLDER_IMAGE,
    tags: ["JavaScript", "PHP", "HTML", "CSS"],
    category: ["fullstack"],
    github: "#",
    demo: "#",
    color: "accent",
  },
];

const WorkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: translations.work.categories.all },
    { id: "react", label: translations.work.categories.react },
    { id: "laravel", label: translations.work.categories.laravel },
    { id: "mobile", label: translations.work.categories.mobile },
    { id: "fullstack", label: translations.work.categories.fullstack },
  ];

  const projects = initialProjects.map((project, index) => ({
    ...project,
    title: translations.work.projects[index].title,
    description: translations.work.projects[index].description,
  }));

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category.includes(activeCategory));

  return (
    <section id="work" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.work.title}
          </span>
          <h2 className="section-title">{translations.work.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.work.description}
          </p>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-card/50 border border-primary/20 text-center"
        >
          <p className="font-rajdhani text-muted-foreground text-sm">
            <span className="text-primary">{translations.work.importantNotice}</span> {translations.work.notice}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-orbitron text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-primary text-background shadow-lg shadow-primary/30"
                  : "bg-card border border-primary/30 text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.originalTitle} // Use originalTitle for key as title is now dynamic
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              layout
              className="group"
            >
              <div className="relative cyber-card overflow-hidden h-full">
                {/* Glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${
                    project.color === "primary"
                      ? "from-primary to-primary/50"
                      : project.color === "secondary"
                      ? "from-secondary to-secondary/50"
                      : "from-accent to-accent/50"
                  } rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
                ></div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      project.color === "primary"
                        ? "from-background via-background/50 to-transparent"
                        : project.color === "secondary"
                        ? "from-background via-background/50 to-transparent"
                        : "from-background via-background/50 to-transparent"
                    }`}
                  ></div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-card border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all"
                    >
                      <FaGithub className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-card border border-secondary/50 flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-all"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="font-orbitron text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-rajdhani text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 rounded-full text-xs font-orbitron bg-muted/50 text-muted-foreground border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 rounded-full text-xs font-orbitron bg-muted/50 text-muted-foreground border border-primary/20">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WorkSection;
