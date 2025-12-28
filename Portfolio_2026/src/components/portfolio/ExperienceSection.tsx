import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";

const experiences = [
  {
    type: "work",
    title: "Freelance Developer",
    company: "Self-Employed",
    period: "2022 - Present",
    description:
      "Building custom web and mobile applications for clients worldwide. Specializing in React, Laravel, and React Native development.",
    platforms: ["Khamsat", "Upwork", "Fiverr"],
  },
  {
    type: "work",
    title: "Full Stack Developer",
    company: "Various Projects",
    period: "2020 - 2022",
    description:
      "Developed multiple web applications using modern technologies. Collaborated with teams to deliver high-quality software solutions.",
    platforms: [],
  },
  {
    type: "education",
    title: "Software Engineering",
    company: "OFPPT",
    period: "2019 - 2022",
    description:
      "Specialized in software development with focus on web technologies, databases, and software engineering principles.",
    platforms: [],
  },
  {
    type: "education",
    title: "Baccalaureate in Science",
    company: "High School",
    period: "2018 - 2019",
    description:
      "Focused on mathematics and physics, building a strong foundation for technical education.",
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
                      <span className="font-orbitron text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {exp.period}
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
