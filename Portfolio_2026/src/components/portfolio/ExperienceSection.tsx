import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

import AlbriIcon from "../../assets/albri.jpg";
import EnsetIcon from "../../assets/enset.jpg";
import JdidaIcon from "../../assets/jdida.jpg";
import WorldSkillsIcon from "../../assets/worldskills.jpg";
import OfpptIcon from "../../assets/ofppt.png";
import IntellicoIcon from "../../assets/intellico.jpg";
import SupemirIcon from "../../assets/supemir.jpg";
import FreelanceIcon from "../../assets/freelance.jpg";
import BacIcon from "../../assets/bac.png";

const initialExperiences = [
  // --- Education (Future/Current) ---
  {
    type: "education",
    originalTitle: "Master's Degree, Distributed Systems & AI (SDIA)",
    originalCompany: "ENSET Mohammedia",
    period: "Nov 2025 - Jun 2027",
    originalDescription:
      "Advanced studies in Distributed Systems and Artificial Intelligence.",
    platforms: [],
    icon: EnsetIcon,
  },
  {
    type: "work",
    originalTitle: "Competitor – WorldSkills Morocco (Web Technologies)",
    originalCompany: "WorldSkills International",
    period: "Jun 2025 - Nov 2025",
    originalDescription:
      "Intensive national preparation program for WorldSkills Shanghai 2026. Focus on advanced back-end development, database optimization, and international standards using React.js and Laravel.",
    platforms: [],
    icon: WorldSkillsIcon,
  },
  {
    type: "education",
    originalTitle: "Professional License, Computer Science & Applied Math",
    originalCompany: "Université Chouaïb Doukkali El Jadida",
    period: "Sep 2024 - Jul 2025",
    originalDescription:
      "Focused on applied mathematics and computer science. Skills: UML, SQL, JEE, PHP, JavaScript.",
    platforms: [],
    icon: JdidaIcon,
  },
  // --- Work Experience ---
  {
    type: "work",
    originalTitle: "Web Developer (PFE Internship)",
    originalCompany: "OFPPT",
    period: "Apr 2025 - May 2025",
    originalDescription:
      "Developed a card management system (creation, validation, site management). Contributed to functional analysis, UML modeling, and defense preparation using Spring Boot and React.js.",
    platforms: [],
    icon: OfpptIcon,
  },
  {
    type: "work",
    originalTitle: "Mobile Developer (Internship)",
    originalCompany: "Albri SARL",
    period: "Apr 2024 - Jun 2024",
    originalDescription:
      "Developed the mobile version of an e-commerce application using React Native and TypeScript. Improved performance and ergonomics for wholesale suppliers, integrated with a Laravel backend.",
    platforms: [],
    icon: AlbriIcon,
  },
  {
    type: "work",
    originalTitle: "Web Development & Agile Trainer",
    originalCompany: "SUPEMIR (Freelance)",
    period: "Feb 2024 - May 2024",
    originalDescription:
      "Taught Front-end (React JS & Redux) and Mobile development (React Native). Introduced Agile methodologies and trained students on Scrum Master roles and responsibilities.",
    platforms: [],
    icon: SupemirIcon,
  },
  {
    type: "work",
    originalTitle: "Full Stack Developer (Hackathon)",
    originalCompany: "Intellico Consulting",
    period: "May 2024",
    originalDescription:
      "Developed a continuing education platform using React and Laravel. Ranked 8th out of 38 groups. Focused on teamwork, project management, and high-quality code delivery.",
    platforms: [],
    icon: IntellicoIcon,
  },
  {
    type: "work",
    originalTitle: "Web Developer (Internship)",
    originalCompany: "Albri SARL",
    period: "Jan 2024 - Mar 2024",
    originalDescription:
      "Built a complete Unified Commerce platform (Web & Mobile). Used Laravel, React, and Redux for the web app to streamline wholesale and retail purchasing processes.",
    platforms: [],
    icon: AlbriIcon,
  },
  // --- Previous Education & Early Work ---
  {
    type: "education",
    originalTitle: "Specialized Technician, Computer Science",
    originalCompany: "Institut Spécialisé de Technologie Appliquée Sidi Moumen",
    period: "Sep 2022 - Jun 2024",
    originalDescription:
      "Comprehensive training in full-stack development. Skills: React.js, Laravel, Redux, Scrum, SQL, and UML.",
    platforms: [],
    icon: OfpptIcon,
  },
  {
    type: "work",
    originalTitle: "Freelance Web Developer",
    originalCompany: "Self-Employed",
    period: "Dec 2022 - May 2023",
    originalDescription:
      "Developed 'Syaqati', a driving education website featuring user authentication, level progression, and community forums using PHP and JavaScript.",
    platforms: [],
    icon: FreelanceIcon,
  },
  // {
  //   type: "education",
  //   originalTitle: "Biology Studies (1st Year)",
  //   originalCompany: "Faculté des Sciences Ben M’Sik",
  //   period: "Nov 2021 - Jun 2022",
  //   originalDescription: "Fundamental studies in Biology.",
  //   platforms: [],
  // },
  {
    type: "education",
    originalTitle: "Baccalaureate, Science",
    originalCompany: "Lycée El Mokhtar Essoussi",
    period: "Sep 2018 - Jun 2021",
    originalDescription: "High school diploma with a focus on scientific subjects.",
    platforms: [],
    icon: BacIcon,
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];

  const experiences = initialExperiences.map((exp, index) => ({
    ...exp,
    title: translations.experience.experiences[index].title,
    company: translations.experience.experiences[index].company,
    description: translations.experience.experiences[index].description,
  }));

  return (
    <section id="experience" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.experience.title}
          </span>
          <h2 className="section-title">{translations.experience.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.experience.description}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute start-4 md:start-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.originalTitle} // Use originalTitle for key as title is now dynamic
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute start-4 md:start-1/2 w-4 h-4 -ms-2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50 z-10"></div>

              {/* Content */}
              <div className={`flex-1 ms-12 md:ms-0 ${index % 2 === 0 ? "md:pe-12" : "md:ps-12"}`}>
                <div className="group relative">
                  {/* Glow */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${
                      exp.type === "work"
                        ? "from-primary to-secondary"
                        : "from-secondary to-accent"
                    } rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
                  ></div>

                  {/* Card */}
                  <div className="relative cyber-card p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          exp.type === "work"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        <img src={exp.icon} alt={exp.originalCompany} className="w-full h-full object-cover rounded-md" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-orbitron text-lg font-bold text-card-foreground">
                          {exp.title}
                        </h3>
                        <p className="font-rajdhani text-muted-foreground">
                          {exp.company}
                        </p>
                      </div>
                      <span className="font-orbitron text-xs text-primary bg-primary/10 px-3 py-2 rounded-xl text-center whitespace-pre-line leading-tight shrink-0">
                        {exp.period.replace(" - ", "\n")}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-rajdhani text-muted-foreground mb-4">
                      {exp.description}
                    </p>

                    {/* Platforms */}
                    {exp.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.platforms.map((platform, pIndex) => (
                          <span
                            key={pIndex}
                            className="px-3 py-1 rounded-full text-xs font-orbitron bg-muted/50 text-primary border border-primary/20"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty space for alignment */}
              <div className="hidden md:block flex-1"></div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-20"></div>
            <div className="relative cyber-card p-8 text-center">
              <p className="font-rajdhani text-lg text-card-foreground italic mb-6">
                "{translations.experience.testimonial.quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="font-orbitron font-bold text-background">C</span>
                </div>
                <div className="text-start">
                  <div className="font-orbitron text-sm text-card-foreground">
                    {translations.experience.testimonial.client}
                  </div>
                  <div className="font-rajdhani text-xs text-muted-foreground">
                    {translations.experience.testimonial.project}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
