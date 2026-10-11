import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CyberBackgroundProps {
  children: ReactNode;
}

const CyberBackground = ({ children }: CyberBackgroundProps) => {
  const { lang } = useLanguage();
  const theme = lang === "ar"
    ? "bg-gradient-to-br from-gray-50/20 via-background to-gray-100/20 dark:from-gray-950/20 dark:via-background dark:to-gray-900/20 arabesque-pattern"
    : lang === "fr"
      ? "bg-gradient-to-br from-blue-50/20 via-background to-red-50/20 dark:from-blue-950/20 dark:via-background dark:to-red-900/20 parisian-pattern"
      : "bg-gradient-to-br from-secondary/10 via-background to-primary/10";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${theme}`} />
        <div className="absolute inset-0 animate-grid-move" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.08) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {lang === "ar" ? <>
          <div className="dome-glow absolute top-20 right-20 h-96 w-96 rounded-full bg-gray-400 opacity-15 mix-blend-screen blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-gray-500 opacity-10 mix-blend-screen blur-3xl" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-gray-300 opacity-10 mix-blend-screen blur-3xl" style={{ animationDelay: "2s" }} />
        </> : lang === "fr" ? <>
          <div className="eiffel-glow absolute top-20 right-20 h-96 w-96 rounded-full bg-blue-500 opacity-20 mix-blend-screen blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-red-500 opacity-15 mix-blend-screen blur-3xl" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-blue-400 opacity-15 mix-blend-screen blur-3xl" style={{ animationDelay: "2s" }} />
        </> : <>
          <div className="absolute top-1/4 start-1/4 h-96 w-96 animate-pulse rounded-full bg-secondary opacity-15 mix-blend-screen blur-3xl" />
          <div className="absolute bottom-1/4 end-1/4 h-96 w-96 animate-pulse rounded-full bg-primary opacity-15 mix-blend-screen blur-3xl" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 start-1/2 h-64 w-64 animate-pulse rounded-full bg-accent opacity-15 mix-blend-screen blur-3xl" style={{ animationDelay: "2s" }} />
          <div className="absolute top-3/4 start-1/3 h-48 w-48 animate-pulse rounded-full bg-primary opacity-10 mix-blend-screen blur-3xl" style={{ animationDelay: "3s" }} />
        </>}
      </div>
      <div className="pointer-events-none fixed inset-0 z-20 opacity-[0.02]"><div className="absolute inset-0 h-[200%] animate-scanline bg-gradient-to-b from-transparent via-primary to-transparent" /></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberBackground;
