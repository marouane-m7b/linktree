import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";

const roles = ["Full Stack Developer", "Mobile Developer", "Web Developer", "AI & LLM Engineer"];

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/marouane-m7b", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/m7b/", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com/marwane_m7b", label: "Instagram" },
  { icon: FaEnvelope, href: "mailto:marouane@m7b.dev", label: "Email" },
];

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 justify-center lg:justify-start mb-6"
            >
              <span className="text-4xl">👋</span>
              <span className="font-rajdhani text-xl text-muted-foreground">Hello, I am</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-orbitron text-5xl md:text-7xl font-bold mb-4"
            >
              <span className="text-primary text-glow-cyan">Marouane</span>
              <br />
              <span className="cyber-text">Mahboub</span>
            </motion.h1>

            {/* Animated Roles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="h-12 mb-8 overflow-hidden"
            >
              <motion.div
                animate={{ y: [0, -48, -96, -144, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                className="space-y-0"
              >
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="h-12 flex items-center justify-center lg:justify-start"
                  >
                    <span className="font-rajdhani text-2xl md:text-3xl text-secondary font-semibold">
                      {role}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-rajdhani text-lg text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0"
            >
              Turning ideas into reality through the art of programming. I craft
              comprehensive end-to-end solutions with expertise in both front-end
              and back-end technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.a
                href="#contact"
                className="cyber-button-fill flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Talk
              </motion.a>
              <motion.a
                href="/linktree"
                className="cyber-button-fill flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Linktree
              </motion.a>
              <motion.a
                href="#work"
                className="cyber-button flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiDownload />
                View Work
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
                  <social.icon className="relative w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              {/* Rotating rings */}
              <div className="absolute -inset-8 animate-spin-slow">
                <div className="h-full w-full rounded-full border-2 border-primary/30 border-t-primary"></div>
              </div>
              <div className="absolute -inset-12 animate-spin-slow-reverse">
                <div className="h-full w-full rounded-full border-2 border-secondary/30 border-r-secondary"></div>
              </div>
              <div className="absolute -inset-16 animate-spin-slow">
                <div className="h-full w-full rounded-full border border-accent/20 border-b-accent"></div>
              </div>

              {/* Profile Image Container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/30 animate-pulse-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
                <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <span className="font-orbitron text-6xl md:text-8xl font-bold text-background">M</span>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-4 top-10 bg-card/90 backdrop-blur-sm border border-primary/30 rounded-xl px-4 py-2 shadow-lg"
              >
                <span className="font-orbitron text-sm text-primary">5+ Years</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -left-4 bottom-10 bg-card/90 backdrop-blur-sm border border-secondary/30 rounded-xl px-4 py-2 shadow-lg"
              >
                <span className="font-orbitron text-sm text-secondary">50+ Projects</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-primary rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
