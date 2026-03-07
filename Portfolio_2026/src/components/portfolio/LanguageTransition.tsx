import { useEffect, useState, useRef } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

// Per-language personality config
const LANG_CONFIG: Record<
  Language,
  {
    gradient: string[];
    symbol: string;
    label: string;
    particleChar: string[];
    dir: "ltr" | "rtl";
  }
> = {
  en: {
    gradient: ["#0f0c29", "#302b63", "#24243e"],
    symbol: "Aa",
    label: "English",
    particleChar: ["A", "Z", "E", "n", "g"],
    dir: "ltr",
  },
  ja: {
    gradient: ["#1a0000", "#dc2626", "#7f1d1d"],
    symbol: "日",
    label: "日本語",
    particleChar: ["あ", "い", "う", "え", "お", "語"],
    dir: "ltr",
  },
  tz: {
    gradient: ["#1c0a00", "#ea580c", "#78350f"],
    symbol: "ⵣ",
    label: "Tamazight",
    particleChar: ["ⵣ", "ⵎ", "ⵓ", "ⵔ", "ⵀ"],
    dir: "ltr",
  },
  ar: {
    gradient: ["#050505", "#1f2937", "#374151"],
    symbol: "ض",
    label: "العربية",
    particleChar: ["ع", "ر", "ب", "ي", "ة"],
    dir: "rtl",
  },
  fr: {
    gradient: ["#00003a", "#1e40af", "#991b1b"],
    symbol: "Ff",
    label: "Français",
    particleChar: ["F", "R", "A", "N", "Ç"],
    dir: "ltr",
  },
};

interface Particle {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  opacity: number;
}

const generateParticles = (lang: Language, count = 18): Particle[] => {
  const chars = LANG_CONFIG[lang]?.particleChar ?? ["•"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    char: chars[i % chars.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 14 + Math.random() * 42,
    delay: Math.random() * 0.4,
    duration: 0.6 + Math.random() * 0.5,
    rotation: (Math.random() - 0.5) * 60,
    opacity: 0.08 + Math.random() * 0.18,
  }));
};

// ── Ripple burst from center ──────────────────────────────────────────────────
const RIPPLE_STYLE = `
  @keyframes lt-ripple {
    0%   { transform: translate(-50%, -50%) scale(0);    opacity: 0.9; }
    60%  { opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(3.5);  opacity: 0; }
  }
  @keyframes lt-ripple2 {
    0%   { transform: translate(-50%, -50%) scale(0);    opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(2.8);  opacity: 0; }
  }
  @keyframes lt-ripple3 {
    0%   { transform: translate(-50%, -50%) scale(0);    opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(2.2);  opacity: 0; }
  }
  @keyframes lt-curtain-in {
    0%   { clip-path: circle(0% at 50% 50%); }
    55%  { clip-path: circle(75% at 50% 50%); }
    100% { clip-path: circle(75% at 50% 50%); }
  }
  @keyframes lt-curtain-out {
    0%   { clip-path: circle(75% at 50% 50%); opacity: 1; }
    100% { clip-path: circle(0% at 50% 50%);  opacity: 0; }
  }
  @keyframes lt-symbol-pop {
    0%   { transform: translate(-50%, -50%) scale(0.2) rotate(-15deg); opacity: 0; filter: blur(20px); }
    45%  { transform: translate(-50%, -50%) scale(1.15) rotate(3deg);  opacity: 1; filter: blur(0); }
    70%  { transform: translate(-50%, -50%) scale(0.95) rotate(-1deg); opacity: 1; }
    85%  { transform: translate(-50%, -50%) scale(1.02) rotate(0deg);  opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2.5)  rotate(5deg);  opacity: 0; filter: blur(12px); }
  }
  @keyframes lt-label-slide {
    0%   { transform: translateX(-50%) translateY(30px); opacity: 0; }
    40%  { transform: translateX(-50%) translateY(0);    opacity: 1; }
    80%  { transform: translateX(-50%) translateY(0);    opacity: 1; }
    100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  }
  @keyframes lt-particle-float {
    0%   { transform: translate(0, 0) rotate(0deg) scale(0);   opacity: 0; }
    20%  { opacity: var(--p-op); scale: 1; }
    80%  { opacity: var(--p-op); }
    100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0); opacity: 0; }
  }
  @keyframes lt-shimmer {
    0%, 100% { opacity: 0.03; }
    50%       { opacity: 0.09; }
  }
  @keyframes lt-lines-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const LanguageTransition = () => {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [displayLang, setDisplayLang] = useState<Language>(lang);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevLangRef = useRef<Language>(lang);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;

    if (timerRef.current) clearTimeout(timerRef.current);

    setDisplayLang(lang);
    setParticles(generateParticles(lang));
    setPhase("in");

    timerRef.current = setTimeout(() => {
      setPhase("out");
      timerRef.current = setTimeout(() => setPhase("idle"), 500);
    }, 900);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lang]);

  if (phase === "idle") return null;

  const cfg = LANG_CONFIG[displayLang] ?? LANG_CONFIG.en;
  const [c1, c2, c3] = cfg.gradient;
  const isOut = phase === "out";

  return (
    <>
      <style>{RIPPLE_STYLE}</style>

      {/* ── Main curtain ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: `radial-gradient(ellipse at 30% 40%, ${c2}cc, transparent 60%),
                       radial-gradient(ellipse at 70% 70%, ${c3}99, transparent 55%),
                       linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
          animation: isOut
            ? "lt-curtain-out 0.5s cubic-bezier(0.4,0,1,1) forwards"
            : "lt-curtain-in 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
          pointerEvents: "none",
        }}
      >
        {/* Diagonal shimmer lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 28px,
              rgba(255,255,255,0.035) 28px,
              rgba(255,255,255,0.035) 29px
            )`,
            animation: "lt-shimmer 1.2s ease-in-out infinite",
          }}
        />

        {/* Sweeping light band */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: "lt-lines-sweep 1.1s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Ripple rings ── */}
      {[
        { size: "min(95vw, 95vh)", anim: "lt-ripple 0.85s cubic-bezier(0.2,0,0.8,1) forwards", border: `3px solid ${c2}` },
        { size: "min(75vw, 75vh)", anim: "lt-ripple2 0.75s 0.08s cubic-bezier(0.2,0,0.8,1) forwards", border: `2px solid ${c2}88` },
        { size: "min(55vw, 55vh)", anim: "lt-ripple3 0.65s 0.14s cubic-bezier(0.2,0,0.8,1) forwards", border: `1.5px solid ${c3}66` },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            zIndex: 9999,
            top: "50%",
            left: "50%",
            width: r.size,
            height: r.size,
            borderRadius: "50%",
            border: r.border,
            animation: r.anim,
            pointerEvents: "none",
            boxShadow: `0 0 40px ${c2}44`,
          }}
        />
      ))}

      {/* ── Floating characters ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={
            {
              position: "fixed",
              zIndex: 10000,
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 700,
              pointerEvents: "none",
              direction: cfg.dir,
              "--p-op": p.opacity,
              "--dx": `${(Math.random() - 0.5) * 120}px`,
              "--dy": `${(Math.random() - 0.5) * 120}px`,
              "--rot": `${p.rotation}deg`,
              animation: `lt-particle-float ${p.duration}s ${p.delay}s cubic-bezier(0.4,0,0.6,1) forwards`,
              textShadow: `0 0 20px ${c2}, 0 0 40px ${c2}88`,
              userSelect: "none",
            } as React.CSSProperties
          }
        >
          {p.char}
        </div>
      ))}

      {/* ── Big center symbol ── */}
      <div
        style={{
          position: "fixed",
          zIndex: 10001,
          top: "50%",
          left: "50%",
          fontSize: "clamp(80px, 18vw, 180px)",
          fontWeight: 900,
          color: "#ffffff",
          direction: cfg.dir,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          animation: "lt-symbol-pop 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
          textShadow: `0 0 60px ${c2}, 0 0 120px ${c2}88, 0 4px 30px rgba(0,0,0,0.5)`,
          userSelect: "none",
          letterSpacing: "-0.02em",
          fontFamily: "'Georgia', serif",
        }}
      >
        {cfg.symbol}
      </div>

      {/* ── Language label ── */}
      <div
        style={{
          position: "fixed",
          zIndex: 10001,
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          animation: "lt-label-slide 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          userSelect: "none",
        }}
      >
        {/* Thin rule */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)`,
            marginBottom: "4px",
          }}
        />
        <span
          style={{
            fontSize: "clamp(13px, 2vw, 18px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            direction: cfg.dir,
          }}
        >
          {cfg.label}
        </span>
      </div>
    </>
  );
};

export default LanguageTransition;