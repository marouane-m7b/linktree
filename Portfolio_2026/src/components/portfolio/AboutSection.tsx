import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaCode, FaMobile, FaServer, FaDesktop } from "react-icons/fa";

const services = [
  {
    icon: FaDesktop,
    title: "Full Stack Developer",
    description:
      "I craft comprehensive end-to-end solutions with my expertise in both front-end and back-end technologies for efficient and versatile applications.",
    color: "primary",
  },
  {
    icon: FaCode,
    title: "Frontend Developer",
    description:
      "I create inspiring user interfaces using modern technologies and frameworks to provide interactive and engaging experiences.",
    color: "secondary",
  },
  {
    icon: FaMobile,
    title: "Mobile Developer",
    description:
      "I build innovative mobile applications for iOS and Android systems, focusing on performance and user-friendliness.",
    color: "accent",
  },
  {
    icon: FaServer,
    title: "Backend Developer",
    description:
      "I design robust database and server systems for seamless integration and enhanced performance of applications.",
    color: "primary",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            About Me
          </span>
          <h2 className="section-title">What I Do</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Turning ideas into reality through the art of programming
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
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl transition-all group-hover:border-primary/50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl transition-all group-hover:border-primary/50"></div>
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
          {[
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "10+", label: "Technologies" },
          ].map((stat, index) => (
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
