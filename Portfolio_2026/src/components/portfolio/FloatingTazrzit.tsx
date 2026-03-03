import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import tazrzitImg from "@/assets/tazrzit.png";

const FloatingTazrzit = () => {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show when language is Tamazight
    setIsVisible(lang === "tz");
  }, [lang]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Tazrzit watermark - Like a traditional Amazigh seal */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden flex items-center justify-center">
        <div className="tazrzit-watermark">
          <img 
            src={tazrzitImg} 
            alt="" 
            className="w-96 h-96 opacity-5" 
            style={{ filter: 'sepia(1) saturate(5) hue-rotate(10deg) brightness(1.2)' }} 
          />
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        .tazrzit-watermark {
          animation: tazrzitWatermark 3s ease-out forwards;
          opacity: 0;
        }

        @keyframes tazrzitWatermark {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @media (max-width: 768px) {
          .tazrzit-watermark img {
            width: 16rem;
            height: 16rem;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingTazrzit;
