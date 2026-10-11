import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/marouane-m7b", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/m7b/", label: "LinkedIn" },
    { icon: FaInstagram, href: "https://instagram.com/marwane_m7b", label: "Instagram" },
  ];

  return (
    <footer className="relative py-12 border-t border-primary/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2 group w-full md:w-1/3 justify-center md:justify-start"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-orbitron font-bold text-xl text-primary group-hover:text-glow-cyan transition-all">
              M7B
            </span>
          </motion.a>

          {/* Social Links */}
          <div className="flex gap-6 w-full md:w-1/3 justify-center">
            {socialLinks.map((social, index) => (
              <motion.a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          aria-label={social.label}
              >
          <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-rajdhani text-muted-foreground text-sm flex items-center justify-center md:justify-end gap-2 w-full md:w-1/3">
            © {currentYear} Marouane Mahboub. All rights
            reserved.
          </p>
        </div>

        {/* HUD Loading Bar */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-1">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 bg-primary transform -skew-x-12"
                style={{
                  animation: `pulse 1.5s infinite ${i * 0.05}s`,
                  opacity: 0.3,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
