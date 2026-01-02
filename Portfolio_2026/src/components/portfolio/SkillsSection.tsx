import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  SiReact,
  SiLaravel,
  SiTypescript,
  SiJavascript,
  SiPhp,
  SiPython,
  SiTailwindcss,
  SiNextdotjs,
  SiVuedotjs,
  SiNodedotjs,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiFirebase,
  SiSupabase,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiHtml5,
  SiCss3,
  SiSpring,
  SiFigma,
} from "react-icons/si";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

const skills = [
  { name: "React", icon: SiReact, category: "frontend", color: "#61DAFB" },
  { name: "Laravel", icon: SiLaravel, category: "backend", color: "#FF2D20" },
  { name: "TypeScript", icon: SiTypescript, category: "frontend", color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, category: "frontend", color: "#F7DF1E" },
  { name: "PHP", icon: SiPhp, category: "backend", color: "#777BB4" },
  { name: "Python", icon: SiPython, category: "backend", color: "#3776AB" },
  { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend", color: "#06B6D4" },
  { name: "Next.js", icon: SiNextdotjs, category: "frontend", color: "#FFFFFF" },
  { name: "Vue.js", icon: SiVuedotjs, category: "frontend", color: "#4FC08D" },
  { name: "Node.js", icon: SiNodedotjs, category: "backend", color: "#339933" },
  { name: "MySQL", icon: SiMysql, category: "backend", color: "#4479A1" },
  { name: "PostgreSQL", icon: SiPostgresql, category: "backend", color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, category: "backend", color: "#47A248" },
  { name: "Docker", icon: SiDocker, category: "tools", color: "#2496ED" },
  { name: "Git", icon: SiGit, category: "tools", color: "#F05032" },
  { name: "Firebase", icon: SiFirebase, category: "backend", color: "#FFCA28" },
  { name: "Supabase", icon: SiSupabase, category: "backend", color: "#3ECF8E" },
  { name: "Flutter", icon: SiFlutter, category: "mobile", color: "#02569B" },
  { name: "React Native", icon: SiReact, category: "mobile", color: "#61DAFB" },
  { name: "Kotlin", icon: SiKotlin, category: "mobile", color: "#7F52FF" },
  { name: "Swift", icon: SiSwift, category: "mobile", color: "#F05138" },
  { name: "HTML5", icon: SiHtml5, category: "frontend", color: "#E34F26" },
  { name: "CSS3", icon: SiCss3, category: "frontend", color: "#1572B6" },
  { name: "Spring Boot", icon: SiSpring, category: "backend", color: "#6DB33F" },
  { name: "Figma", icon: SiFigma, category: "tools", color: "#F24E1E" },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: translations.skills.categories.all },
    { id: "frontend", label: translations.skills.categories.frontend },
    { id: "backend", label: translations.skills.categories.backend },
    { id: "mobile", label: translations.skills.categories.mobile },
    { id: "tools", label: translations.skills.categories.tools },
  ];

  const languageSkills = [
    { lang: "Arabic", flag: "🇲🇦", level: translations.skills.languageLevels.native },
    { lang: "French", flag: "🇫🇷", level: translations.skills.languageLevels.fluent },
    { lang: "English", flag: "🇺🇸", level: translations.skills.languageLevels.fluent },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.skills.title}
          </span>
          <h2 className="section-title">{translations.skills.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.skills.description}
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

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              className="group"
            >
              <div className="relative aspect-square cyber-card p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-primary/50 group-hover:scale-105">
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ backgroundColor: skill.color }}
                ></div>

                <skill.icon
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: skill.color }}
                />
                <span className="font-rajdhani text-xs text-muted-foreground text-center group-hover:text-card-foreground transition-colors">
                  {skill.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="font-orbitron text-xl text-center text-card-foreground mb-8">
            {translations.skills.languagesTitle}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {languageSkills.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-primary/20 hover:border-primary/50 transition-all"
              >
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <div className="font-orbitron text-sm text-card-foreground">
                    {item.lang}
                  </div>
                  <div className="font-rajdhani text-xs text-muted-foreground">
                    {item.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
