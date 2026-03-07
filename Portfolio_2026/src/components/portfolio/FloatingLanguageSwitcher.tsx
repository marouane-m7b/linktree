import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { code: Language; nativeLabel: string; flag: string }[] = [
    { code: "en", nativeLabel: "English", flag: "🇬🇧" },
    { code: "fr", nativeLabel: "Français", flag: "🇫🇷" },
    { code: "ar", nativeLabel: "العربية", flag: "🇸🇦" },
    { code: "ja", nativeLabel: "日本語", flag: "🇯🇵" },
    { code: "ru", nativeLabel: "Русский", flag: "🇷🇺" },
    { code: "tz", nativeLabel: "ⵜⴰⵎⴰⵣⵉⵖⵜ", flag: "ⵣ" },
];

const FloatingLanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const activeLang = languages.find((l) => l.code === lang) || languages[0];

    const handleLanguageChange = (code: Language) => {
        setLang(code);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9998]">
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-[9997] bg-black/20 backdrop-blur-sm"
                    style={{
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                />
            )}
            
            {/* Language Menu */}
            {isOpen && (
                <div
                    className="absolute bottom-20 right-0 w-64 bg-background/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl overflow-hidden z-[9998]"
                    style={{
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Languages className="w-4 h-4" />
                            <span>Select Language</span>
                        </div>
                    </div>

                    {/* Language Options */}
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLanguageChange(l.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    lang === l.code
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : "text-foreground hover:bg-primary/10"
                                }`}
                            >
                                <span className="font-semibold text-lg flex-1 text-left">{l.nativeLabel}</span>
                                {lang === l.code && (
                                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-3 px-5 py-3 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/30 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95"
            >
                <span className="text-lg font-semibold text-primary">{activeLang.nativeLabel}</span>
                <ChevronDown 
                    className="w-4 h-4 text-primary transition-transform duration-300" 
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                />
            </button>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default FloatingLanguageSwitcher;
