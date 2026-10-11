import { useEffect, useState } from "react";
import { Sparkles, SparklesIcon } from "lucide-react";

const AnimationToggle = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("animations_enabled") !== "false";
    }
    return true;
  });

  useEffect(() => {
    if (animationsEnabled) {
      document.body.classList.remove("animations-disabled");
      localStorage.setItem("animations_enabled", "true");
    } else {
      document.body.classList.add("animations-disabled");
      localStorage.setItem("animations_enabled", "false");
    }
  }, [animationsEnabled]);

  return (
    <button
      onClick={() => setAnimationsEnabled(!animationsEnabled)}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:scale-110 group"
      aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
      title={animationsEnabled ? "Disable animations" : "Enable animations"}
    >
      {animationsEnabled ? (
        <Sparkles className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
      ) : (
        <SparklesIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
};

export default AnimationToggle;
