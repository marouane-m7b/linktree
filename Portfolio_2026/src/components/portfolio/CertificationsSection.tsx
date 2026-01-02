import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaCertificate, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";

import EnsetIcon from "../../assets/enset.jpg";
import OfpptIcon from "../../assets/ofppt.png";

const defaultCertImage = "https://marketplace.canva.com/EAF5ZVffmZw/1/0/1600w/canva-modern-vintage-certificate-of-achievement-yMEujoaa8Hs.jpg";

const certifications = [
  {
    title: "🥇 1ère Place Nationale – WorldSkills Maroc (Web Technologies)",
    issuer: "WorldSkills Morocco",
    date: "Jul 2025",
    credentialId: "",
    credentialUrl: "",
    skills: ["Web Technologies", "Full Stack Development"],
    image: defaultCertImage,
    iconImage: EnsetIcon,
  },
  {
    title: "Introduction to Modern AI",
    issuer: "ENSET Mohammedia",
    date: "Sep 2025",
    credentialId: "24ba0533-132f-429f-b30c-a5334d646241",
    credentialUrl: "",
    skills: ["Artificial Intelligence", "Machine Learning"],
    image: defaultCertImage,
    iconImage: OfpptIcon,
  },
  {
    title: "IBM IT Scrum Master Specialization",
    issuer: "IBM",
    date: "Aug 2024",
    credentialId: "ABZET6SO2939",
    credentialUrl: "#",
    skills: ["Scrum", "Agile"],
    image: defaultCertImage,
    iconImage: EnsetIcon,
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta",
    date: "Aug 2024",
    credentialId: "CSMWSHPQRZ6Q",
    credentialUrl: "#",
    skills: ["React.js", "JavaScript"],
    image: defaultCertImage,
    iconImage: OfpptIcon,
  },
  {
    title: "Introduction to Git and GitHub",
    issuer: "Google",
    date: "Jul 2024",
    credentialId: "TEWNDN998JGR",
    credentialUrl: "#",
    skills: ["Git", "Collaborative Problem Solving"],
    image: defaultCertImage,
    iconImage: EnsetIcon,
  },
  {
    title: "Prompt Engineering for Educators Specialization",
    issuer: "Vanderbilt University",
    date: "Jul 2024",
    credentialId: "JLHFNSIMFQ1G",
    credentialUrl: "#",
    skills: ["Prompt Engineering", "AI"],
    image: defaultCertImage,
    iconImage: OfpptIcon,
  },
];

const issuerColors: Record<string, string> = {
  "WorldSkills Morocco": "from-yellow-400 to-amber-500",
  "ENSET Mohammedia": "from-blue-500 to-cyan-500",
  "IBM": "from-blue-600 to-blue-400",
  "Meta": "from-blue-500 to-indigo-500",
  "Google": "from-green-500 to-blue-500",
  "Vanderbilt University": "from-amber-600 to-yellow-500",
};

const CertificationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];

  return (
    <section id="certifications" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            {translations.certifications.title}
          </span>
          <h2 className="section-title">{translations.certifications.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.certifications.description}
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  issuerColors[cert.issuer] || "from-primary to-secondary"
                } rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              ></div>

              {/* Card */}
              <div className="relative cyber-card p-6 h-full flex flex-col">
                {/* Certificate Image */}
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="relative w-full h-32 mb-4 rounded-xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <span className="font-orbitron text-xs text-primary">{translations.awards.view}</span>
                  </div>
                </button>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  {/* Issuer Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        issuerColors[cert.issuer] || "from-primary to-secondary"
                      }`}
                    >
                      <img src={cert.iconImage} alt={cert.issuer} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <span className="font-rajdhani text-sm font-semibold text-secondary">
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-orbitron text-sm font-bold text-card-foreground mb-2 line-clamp-2">
                    {cert.title}
                  </h3>

                  {/* Date & Credential */}
                  <div className="space-y-1 mb-4">
                    <p className="font-rajdhani text-xs text-muted-foreground">
                      Issued {cert.date}
                    </p>
                    {cert.credentialId && (
                      <p className="font-mono text-xs text-muted-foreground truncate">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cert.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 rounded-full text-xs font-orbitron bg-muted/50 text-primary border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Show Credential Link */}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 font-orbitron text-xs text-primary hover:text-secondary transition-colors"
                    >
                      {translations.certifications.showCredential}
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <button
            onClick={() => setSelectedCert(null)}
            className="absolute top-6 end-6 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-30"></div>
              <div className="relative bg-card rounded-xl overflow-hidden border-2 border-primary/30">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="font-orbitron text-lg font-bold text-card-foreground mb-2">
                    {selectedCert.title}
                  </h3>
                  <p className="font-rajdhani text-muted-foreground">
                    {selectedCert.issuer} • {selectedCert.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default CertificationsSection;