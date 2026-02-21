import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "fr" | "ar" | "ja";

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
      return (localStorage.getItem("portfolio_lang") as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    // Update localStorage whenever language changes
    localStorage.setItem("portfolio_lang", lang);
    // Set dir attribute on html for RTL languages like Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Apply Japanese theme
    if (lang === "ja") {
      document.documentElement.classList.add("japan-theme");
    } else {
      document.documentElement.classList.remove("japan-theme");
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
