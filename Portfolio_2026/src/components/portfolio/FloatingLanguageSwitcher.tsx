import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "EN", flag: "US" },
    { code: "fr", label: "FR", flag: "FR" },
    { code: "ar", label: "AR", flag: "MA" },
    { code: "ja", label: "JA", flag: "🇯🇵" },
    { code: "tz", label: "TZ", flag: "ⵣ" },
];

const FloatingLanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const activeLang = languages.find((l) => l.code === lang) || languages[0];

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-2 shadow-2xl"
                    >
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => {
                                    setLang(l.code);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${lang === l.code
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    }`}
                            >
                                <span className="text-lg">{l.flag}</span>
                                <span className="font-orbitron">{l.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 backdrop-blur-md border border-primary/30 text-primary shadow-lg hover:shadow-primary/25 hover:bg-primary/20 transition-all duration-300"
            >
                <div className="relative flex items-center justify-center">
                    <Globe className="w-6 h-6 absolute transition-opacity duration-300 opacity-20" />
                    <span className="font-bold font-orbitron text-lg z-10">{activeLang.flag}</span>
                </div>
            </motion.button>
        </div>
    );
};

export default FloatingLanguageSwitcher;
