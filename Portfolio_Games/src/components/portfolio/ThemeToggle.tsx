import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeToggleProps {
  lang: string;
}

const ThemeToggle = ({ lang }: ThemeToggleProps) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`relative w-10 h-10 rounded-full bg-card border-2 border-primary/30 hover:border-primary flex items-center justify-center text-primary transition-all duration-300 ms-2`}
      aria-label="Toggle theme"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;