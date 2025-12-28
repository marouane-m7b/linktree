import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaTrophy, FaMedal, FaGraduationCap, FaCode, FaTimes } from "react-icons/fa";

const awards = [
  {
    icon: "🥇",
    title: "1ère Place Nationale – WorldSkills Maroc (Web Technologies)",
    issuer: "WorldSkills Morocco",
    date: "Jul 2025",
    association: "WorldSkills International",
    description:
      "Classé 1er au niveau national en Web Technologies lors de la sélection nationale au CMC Tamesna, parmi 20 concurrents représentant leurs régions. Sélectionné parmi les 4 meilleurs candidats pour représenter le Maroc dans le programme de préparation à WorldSkills Shanghai 2026. Formation intensive en Front-End et Back-End selon les standards internationaux WorldSkills.",
    images: [],
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: "🥈",
    title: "2ème au niveau régional – WorldSkills Morocco (Web Technologies)",
    issuer: "WorldSkills Morocco",
    date: "Jan 2025",
    association: "WorldSkills International",
    description:
      "Classé dans le Top 2 lors de la sélection régionale Casablanca-Settat en Web Technologies, organisée par l'Institut Spécialisé de Gestion et d'Informatique (ISGI). Sélectionné pour participer à la phase nationale WorldSkills Morocco 2026.",
    images: [],
    color: "from-gray-300 to-gray-400",
  },
  {
    icon: "🎓",
    title: "Diplôme avec mention d'excellence – ISTA Sidi Moumen",
    issuer: "OFPPT",
    date: "Jun 2024",
    association: "Institut Spécialisé de Technologie Appliquée Sidi Moumen",
    description:
      "Diplômé avec une moyenne de 19,02/20, parmi les toutes meilleures notes au Maroc, si ce n'est la meilleure. Formé en Développement Digital avec une maîtrise des technologies modernes telles que React, Laravel, Node.js, Python, SQL, et bien d'autres.",
    images: [],
    color: "from-primary to-secondary",
  },
  {
    icon: "🏆",
    title: "Top 8 – Hackathon Edition 2024 (Intellico Consulting)",
    issuer: "Intellico Consulting",
    date: "May 2024",
    association: "Intellico Consulting",
    description:
      "Participation au Hackathon Senior Edition 2024 en tant que Développeur Full Stack, en collaboration avec deux coéquipiers. Développement d'une plateforme web de formation continue en React.js et Laravel. Classé 8e sur 38 équipes (148 participants) grâce à la qualité du code et à la performance technique.",
    images: [],
    color: "from-accent to-secondary",
  },
];

const AwardsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="awards" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-orbitron text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Recognition
          </span>
          <h2 className="section-title">Honors & Awards</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Achievements and recognitions in competitions and academics
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Glow */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${award.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}
              ></div>

              {/* Card */}
              <div className="relative cyber-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {award.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <h3 className="font-orbitron text-lg font-bold text-card-foreground">
                        {award.title}
                      </h3>
                      <span className="font-orbitron text-xs text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap self-start">
                        {award.date}
                      </span>
                    </div>

                    {/* Issuer & Association */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="font-rajdhani text-sm font-semibold text-secondary">
                        {award.issuer}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-rajdhani text-sm text-muted-foreground">
                        {award.association}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-rajdhani text-muted-foreground leading-relaxed">
                      {award.description}
                    </p>

                    {/* Images */}
                    {award.images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {award.images.map((img, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => setSelectedImage(img)}
                            className="relative group/img overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-300"
                          >
                            <img
                              src={img}
                              alt={`${award.title} - Image ${imgIndex + 1}`}
                              className="w-20 h-20 object-cover group-hover/img:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-xs font-orbitron text-primary-foreground">View</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Award"
            className="max-w-full max-h-[90vh] rounded-xl border-2 border-primary/50 shadow-2xl"
          />
        </motion.div>
      )}
    </section>
  );
};

export default AwardsSection;