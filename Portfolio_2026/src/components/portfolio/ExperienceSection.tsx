import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";

const experiences = [
  // --- Education (Future/Current) ---
  {
    type: "education",
    title: "Master's Degree, Distributed Systems & AI (SDIA)",
    company: "ENSET Mohammedia",
    period: "Nov 2025 - Jun 2027",
    description:
      "Advanced studies in Distributed Systems and Artificial Intelligence.",
    platforms: [],
  },
  {
    type: "work",
    title: "Competitor – WorldSkills Morocco (Web Technologies)",
    company: "WorldSkills International",
    period: "Jun 2025 - Nov 2025",
    description:
      "Intensive national preparation program for WorldSkills Shanghai 2026. Focus on advanced back-end development, database optimization, and international standards using React.js and Laravel.",
    platforms: [],
  },
  {
    type: "education",
    title: "Professional License, Computer Science & Applied Math",
    company: "Université Chouaïb Doukkali El Jadida",
    period: "Sep 2024 - Jul 2025",
    description:
      "Focused on applied mathematics and computer science. Skills: UML, SQL, JEE, PHP, JavaScript.",
    platforms: [],
  },
  // --- Work Experience ---
  {
    type: "work",
    title: "Web Developer (PFE Internship)",
    company: "OFPPT",
    period: "Apr 2025 - May 2025",
    description:
      "Developed a card management system (creation, validation, site management). Contributed to functional analysis, UML modeling, and defense preparation using Spring Boot and React.js.",
    platforms: [],
  },
  {
    type: "work",
    title: "Mobile Developer (Internship)",
    company: "Albri SARL",
    period: "Apr 2024 - Jun 2024",
    description:
      "Developed the mobile version of an e-commerce application using React Native and TypeScript. Improved performance and ergonomics for wholesale suppliers, integrated with a Laravel backend.",
    platforms: [],
  },
  {
    type: "work",
    title: "Web Development & Agile Trainer",
    company: "SUPEMIR (Freelance)",
    period: "Feb 2024 - May 2024",
    description:
      "Taught Front-end (React JS & Redux) and Mobile development (React Native). Introduced Agile methodologies and trained students on Scrum Master roles and responsibilities.",
    platforms: [],
  },
  {
    type: "work",
    title: "Full Stack Developer (Hackathon)",
    company: "Intellico Consulting",
    period: "May 2024",
    description:
      "Developed a continuing education platform using React and Laravel. Ranked 8th out of 38 groups. Focused on teamwork, project management, and high-quality code delivery.",
    platforms: [],
  },
  {
    type: "work",
    title: "Web Developer (Internship)",
    company: "Albri SARL",
    period: "Jan 2024 - Mar 2024",
    description:
      "Built a complete Unified Commerce platform (Web & Mobile). Used Laravel, React, and Redux for the web app to streamline wholesale and retail purchasing processes.",
    platforms: [],
  },
  // --- Previous Education & Early Work ---
  {
    type: "education",
    title: "Specialized Technician, Computer Science",
    company: "Institut Spécialisé de Technologie Appliquée Sidi Moumen",
    period: "Sep 2022 - Jun 2024",
    description:
      "Comprehensive training in full-stack development. Skills: React.js, Laravel, Redux, Scrum, SQL, and UML.",
    platforms: [],
  },
  {
    type: "work",
    title: "Freelance Web Developer",
    company: "Self-Employed",
    period: "Dec 2022 - May 2023",
    description:
      "Developed 'Syaqati', a driving education website featuring user authentication, level progression, and community forums using PHP and JavaScript.",
    platforms: [],
  },
  // {
  //   type: "education",
  //   title: "Biology Studies (1st Year)",
  //   company: "Faculté des Sciences Ben M’Sik",
  //   period: "Nov 2021 - Jun 2022",
  //   description: "Fundamental studies in Biology.",
  //   platforms: [],
  // },
  {
    type: "education",
    title: "Baccalaureate, Science",
    company: "Lycée El Mokhtar Essoussi",
    period: "Sep 2018 - Jun 2021",
    description: "High school diploma with a focus on scientific subjects.",
    platforms: [],
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            My Journey
          </span>
          <h2 className="section-title">Experience & Education</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            A timeline of my professional journey and academic achievements
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50 z-10"></div>

              {/* Content */}
              <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
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
                        {exp.type === "work" ? (
                          <FaBriefcase className="w-5 h-5" />
                        ) : (
                          <FaGraduationCap className="w-6 h-6" />
                        )}
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
                "Thank you for your outstanding contribution! Your coding skills have
                significantly impacted our project. We appreciate your dedication and
                attention to detail. Here's to more successful collaborations in the
                future!"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="font-orbitron font-bold text-background">C</span>
                </div>
                <div className="text-left">
                  <div className="font-orbitron text-sm text-card-foreground">
                    Happy Client
                  </div>
                  <div className="font-rajdhani text-xs text-muted-foreground">
                    Freelance Project
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
