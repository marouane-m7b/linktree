import { ReactNode, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CyberBackgroundProps {
  children: ReactNode;
}

const CyberBackground = ({ children }: CyberBackgroundProps) => {
  const { lang } = useLanguage();
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [yazParticles, setYazParticles] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([]);
  const [geometricStars, setGeometricStars] = useState<Array<{ id: number; left: number; top: number; delay: number; size: number }>>([]);

  useEffect(() => {
    if (lang === "ja") {
      // Generate cherry blossom petals for Japanese theme
      const newPetals = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
      }));
      setPetals(newPetals);
      setYazParticles([]);
      setGeometricStars([]);
    } else {
      setPetals([]);
      setYazParticles([]);
      setGeometricStars([]);
    }
  }, [lang]);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${lang === "ja"
          ? "bg-gradient-to-br from-red-50/20 via-background to-red-100/20 dark:from-red-950/20 dark:via-background dark:to-red-900/20"
          : lang === "tz"
            ? "bg-gradient-to-br from-orange-50/20 via-background to-orange-100/20 dark:from-orange-950/20 dark:via-background dark:to-orange-900/20 dune-pattern"
            : lang === "ar"
              ? "bg-gradient-to-br from-gray-50/20 via-background to-gray-100/20 dark:from-gray-950/20 dark:via-background dark:to-gray-900/20 arabesque-pattern"
              : lang === "fr"
                ? "bg-gradient-to-br from-blue-50/20 via-background to-red-50/20 dark:from-blue-950/20 dark:via-background dark:to-red-900/20 parisian-pattern"
                : "bg-gradient-to-br from-secondary/10 via-background to-primary/10"
          }`}></div>
        <div
          className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Glowing orbs */}
        {lang === "ja" ? (
          <>
            {/* Rising sun effect for Japanese theme */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 rising-sun"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-red-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
          </>
        ) : lang === "tz" ? (
          <>
            {/* Saharan/Amazigh effect for Tamazight theme */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-red-800 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
          </>
        ) : lang === "ar" ? (
          <>
            {/* Monochrome glow effect for Arabic theme */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gray-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 dome-glow"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gray-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gray-300 rounded-full mix-blend-screen filter blur-3xl opacity-12 animate-pulse" style={{ animationDelay: "2s" }}></div>
          </>
        ) : lang === "fr" ? (
          <>
            {/* Tricolor glow effect for French theme */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 eiffel-glow"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }}></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
            <div
              className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 start-1/2 w-64 h-64 bg-accent rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-3/4 start-1/3 w-48 h-48 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"
              style={{ animationDelay: "3s" }}
            ></div>
          </>
        )}
      </div>

      {/* Cherry blossom petals for Japanese theme */}
      {lang === "ja" && petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}

      {/* Scanline effect */}
      <div className="fixed inset-0 z-20 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent animate-scanline"
          style={{ height: "200%" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberBackground;
