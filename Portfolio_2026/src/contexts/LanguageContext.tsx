import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "fr" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLang] = useState<Language>(() => {
    // Initialize language from localStorage or default to 'en'
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("portfolio_lang");
      return savedLanguage === "fr" || savedLanguage === "ar" ? savedLanguage : "en";
    }
    return "en";
  });

  useEffect(() => {
    // Update localStorage whenever language changes
    localStorage.setItem("portfolio_lang", lang);
    // Set dir attribute on html for RTL languages like Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Apply Arabic theme
    if (lang === "ar") {
      document.documentElement.classList.add("arabic-theme");
    } else {
      document.documentElement.classList.remove("arabic-theme");
    }

    // Apply French theme
    if (lang === "fr") {
      document.documentElement.classList.add("french-theme");
    } else {
      document.documentElement.classList.remove("french-theme");
    }

  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
