import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import WorldSkillsIcon from "../../assets/worldskills.jpg";
import OfpptIcon from "../../assets/ofppt.png";
import IntellicoIcon from "../../assets/intellico.jpg";

const initialAwards = [
  {
    icon: "🥇",
    date: "Jul 2025",
    images: [],
    color: "from-yellow-400 to-amber-500",
    iconImage: WorldSkillsIcon,
  },
  {
    icon: "🥈",
    date: "Jan 2025",
    images: [],
    color: "from-gray-300 to-gray-400",
    iconImage: WorldSkillsIcon,
  },
  {
    icon: "🎓",
    date: "Jun 2024",
    images: [],
    color: "from-primary to-secondary",
    iconImage: OfpptIcon,
  },
  {
    icon: "🏆",
    date: "May 2024",
    images: [],
    color: "from-accent to-secondary",
    iconImage: IntellicoIcon,
  },
];

const AwardsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLanguage();
  const translations = UI_TRANSLATIONS[lang];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const awards = initialAwards.map((award, index) => ({
    ...award,
    title: translations.awards.awards[index].title,
    issuer: translations.awards.awards[index].issuer,
    association: translations.awards.awards[index].association,
    description: translations.awards.awards[index].description,
  }));

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
            {translations.awards.title}
          </span>
          <h2 className="section-title">{translations.awards.subtitle}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {translations.awards.description}
          </p>
        </motion.div>

        {/* Awards Slider */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {awards.map((award, index) => (
              <CarouselItem key={index}>
                <motion.div
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
                          className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${award.color}`}
                        >
                          <img src={award.iconImage} alt={award.title} className="w-full h-full object-cover rounded-md" />
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
                                  <span className="text-xs font-orbitron text-primary-foreground">{translations.awards.view}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
            className="absolute top-6 end-6 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt={translations.awards.award}
            className="max-w-full max-h-[90vh] rounded-xl border-2 border-primary/50 shadow-2xl"
          />
        </motion.div>
      )}
    </section>
  );
};

export default AwardsSection;