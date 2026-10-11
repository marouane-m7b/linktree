import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaCode, FaMobile, FaServer, FaDesktop } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];

  const services = [
    {
      icon: FaDesktop,
      title: translations.about.services.fullStackTitle,
      description: translations.about.services.fullStackDescription,
      color: "primary",
    },
    {
      icon: FaCode,
      title: translations.about.services.frontendTitle,
      description: translations.about.services.frontendDescription,
      color: "secondary",
    },
    {
      icon: FaMobile,
      title: translations.about.services.mobileTitle,
      description: translations.about.services.mobileDescription,
      color: "accent",
    },
    {
      icon: FaServer,
      title: translations.about.services.backendTitle,
      description: translations.about.services.backendDescription,
      color: "primary",
    },
  ];

  const stats = [
    { value: "3+", label: translations.about.stats.experience },
    { value: "11+", label: translations.about.stats.projects },
    { value: "2+", label: translations.about.stats.clients },
    { value: "5+", label: translations.about.stats.technologies },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.about.title}
          </span>
          <h2 className="section-title">{translations.about.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.about.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  service.color === "primary"
                    ? "from-primary to-primary/50"
                    : service.color === "secondary"
                    ? "from-secondary to-secondary/50"
                    : "from-accent to-accent/50"
                } rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              ></div>

              {/* Card */}
              <div className="relative cyber-card p-8 h-full transition-all duration-300 group-hover:border-primary/50">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      service.color === "primary"
                        ? "bg-primary/20 text-primary shadow-lg shadow-primary/30"
                        : service.color === "secondary"
                        ? "bg-secondary/20 text-secondary shadow-lg shadow-secondary/30"
                        : "bg-accent/20 text-accent shadow-lg shadow-accent/30"
                    }`}
                  >
                    <service.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-rajdhani text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 end-0 w-16 h-16 border-t-2 border-e-2 border-primary/20 rounded-ts-2xl transition-all group-hover:border-primary/50"></div>
                <div className="absolute bottom-0 start-0 w-16 h-16 border-b-2 border-s-2 border-primary/20 rounded-be-2xl transition-all group-hover:border-primary/50"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card/50 border border-primary/20 hover:border-primary/50 transition-all"
            >
              <div className="font-orbitron text-4xl font-bold cyber-text mb-2">
                {stat.value}
              </div>
              <div className="font-rajdhani text-muted-foreground text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
