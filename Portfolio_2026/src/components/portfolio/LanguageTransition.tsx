import { useEffect, useState, useRef } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

import japanHero    from "@/assets/Japan_Hero.jpg";
import frenchHero   from "@/assets/French_Hero.jpg";
import arabicHero   from "@/assets/Arabic_Hero.jpg";
import amazighHero  from "@/assets/Amazigh_Hero.jpg";
import englishHero  from "@/assets/English_Hero.jpg";

const LANG_CONFIG: Record<
  Language,
  {
    gradient: [string, string, string];
    symbol: string;
    label: string;
    heroImage: string;
    dir: "ltr" | "rtl";
    accentColor: string;
  }
> = {
  en: {
    gradient: ["#0f0c29", "#302b63", "#24243e"],
    symbol: "Aa",
    label: "English",
    heroImage: englishHero,
    dir: "ltr",
    accentColor: "#a78bfa",
  },
  ja: {
    gradient: ["#1a0000", "#dc2626", "#7f1d1d"],
    symbol: "日",
    label: "日本語",
    heroImage: japanHero,
    dir: "ltr",
    accentColor: "#fca5a5",
  },
  tz: {
    gradient: ["#1c0a00", "#ea580c", "#78350f"],
    symbol: "ⵣ",
    label: "Tamazight",
    heroImage: amazighHero,
    dir: "ltr",
    accentColor: "#fb923c",
  },
  ar: {
    gradient: ["#050505", "#1f2937", "#374151"],
    symbol: "ع",
    label: "العربية",
    heroImage: arabicHero,
    dir: "rtl",
    accentColor: "#9ca3af",
  },
  fr: {
    gradient: ["#00003a", "#1e40af", "#991b1b"],
    symbol: "Ff",
    label: "Français",
    heroImage: frenchHero,
    dir: "ltr",
    accentColor: "#93c5fd",
  },
};

const STYLES = `
  @keyframes lt-curtain-in {
    0%   { clip-path: circle(0% at 50% 50%); }
    100% { clip-path: circle(80% at 50% 50%); }
  }
  @keyframes lt-curtain-out {
    0%   { clip-path: circle(80% at 50% 50%); opacity: 1; }
    100% { clip-path: circle(0% at 50% 50%);  opacity: 0; }
  }
  @keyframes lt-hero-reveal {
    0%   { opacity: 0; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1.04); }
  }
  @keyframes lt-ripple-1 {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.85; }
    100% { transform: translate(-50%,-50%) scale(3.6); opacity: 0; }
  }
  @keyframes lt-ripple-2 {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
    100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
  }
  @keyframes lt-ripple-3 {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.35; }
    100% { transform: translate(-50%,-50%) scale(2.1); opacity: 0; }
  }
  @keyframes lt-symbol-pop {
    0%   { transform: translate(-50%,-50%) scale(0.1) rotate(-20deg); opacity: 0; filter: blur(24px); }
    50%  { transform: translate(-50%,-50%) scale(1.1) rotate(2deg);   opacity: 1; filter: blur(0); }
    80%  { transform: translate(-50%,-50%) scale(0.97) rotate(-1deg); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2.8) rotate(6deg);   opacity: 0; filter: blur(16px); }
  }
  @keyframes lt-label-up {
    0%   { transform: translateX(-50%) translateY(24px); opacity: 0; }
    35%  { transform: translateX(-50%) translateY(0);    opacity: 1; }
    75%  { transform: translateX(-50%) translateY(0);    opacity: 1; }
    100% { transform: translateX(-50%) translateY(-18px); opacity: 0; }
  }
  @keyframes lt-shimmer-line {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(120%); }
  }
  @keyframes lt-vignette-pulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 0.85; }
  }
`;

const LanguageTransition = () => {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [displayLang, setDisplayLang] = useState<Language>(lang);
  const [imgLoaded, setImgLoaded] = useState(false);
  const prevLangRef = useRef<Language>(lang);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    if (timerRef.current) clearTimeout(timerRef.current);

    // Pause all background animations
    document.body.classList.add('transition-active');

    setImgLoaded(false);
    setDisplayLang(lang);
    setPhase("in");

    timerRef.current = setTimeout(() => {
      setPhase("out");
      timerRef.current = setTimeout(() => {
        setPhase("idle");
        // Resume animations after transition
        document.body.classList.remove('transition-active');
      }, 520);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.body.classList.remove('transition-active');
    };
  }, [lang]);

  if (phase === "idle") return null;

  const cfg = LANG_CONFIG[displayLang] ?? LANG_CONFIG.en;
  const [c1, c2, c3] = cfg.gradient;
  const isOut = phase === "out";

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Background: hero image + gradient overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9997,
          overflow: "hidden",
          animation: isOut
            ? "lt-curtain-out 0.52s cubic-bezier(0.4,0,1,1) forwards"
            : "lt-curtain-in 0.58s cubic-bezier(0.22,1,0.36,1) forwards",
          pointerEvents: "none",
        }}
      >
        {/* Hero photo */}
        <img
          src={cfg.heroImage}
          alt=""
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(3px) saturate(1.2) brightness(0.55)",
            animation: imgLoaded ? "lt-hero-reveal 0.6s ease forwards" : undefined,
            opacity: imgLoaded ? undefined : 0,
            transition: "opacity 0.3s",
          }}
        />

        {/* Language palette color grade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse at 40% 35%, ${c2}bb 0%, transparent 60%),
              radial-gradient(ellipse at 70% 75%, ${c3}99 0%, transparent 55%),
              linear-gradient(160deg, ${c1}dd 0%, ${c2}99 50%, ${c3}cc 100%)
            `,
            mixBlendMode: "multiply",
          }}
        />

        {/* Deep vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
            animation: "lt-vignette-pulse 1.4s ease-in-out infinite",
          }}
        />

        {/* Shimmer sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "45%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
            animation: "lt-shimmer-line 1.3s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Ripple rings ── */}
      {[
        { anim: "lt-ripple-1 0.9s cubic-bezier(0.2,0,0.8,1) forwards", delay: "0s",    size: "min(90vw,90vh)", border: `3px solid ${cfg.accentColor}` },
        { anim: "lt-ripple-2 0.8s cubic-bezier(0.2,0,0.8,1) forwards", delay: "0.07s", size: "min(70vw,70vh)", border: `2px solid ${cfg.accentColor}88` },
        { anim: "lt-ripple-3 0.7s cubic-bezier(0.2,0,0.8,1) forwards", delay: "0.14s", size: "min(50vw,50vh)", border: `1.5px solid ${cfg.accentColor}55` },
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
            animationDelay: r.delay,
            pointerEvents: "none",
            boxShadow: `0 0 50px ${cfg.accentColor}33`,
          }}
        />
      ))}

      {/* ── Center symbol ── */}
      <div
        style={{
          position: "fixed",
          zIndex: 10001,
          top: "50%",
          left: "50%",
          fontSize: "clamp(72px, 16vw, 170px)",
          fontWeight: 900,
          color: "#fff",
          direction: cfg.dir,
          pointerEvents: "none",
          userSelect: "none",
          animation: "lt-symbol-pop 1.15s cubic-bezier(0.22,1,0.36,1) forwards",
          textShadow: `
            0 0 40px ${cfg.accentColor},
            0 0 80px ${cfg.accentColor}88,
            0 0 160px ${c2}66,
            0 6px 30px rgba(0,0,0,0.6)
          `,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "-0.02em",
        }}
      >
        {cfg.symbol}
      </div>

      {/* ── Language label ── */}
      <div
        style={{
          position: "fixed",
          zIndex: 10001,
          bottom: "26%",
          left: "50%",
          pointerEvents: "none",
          userSelect: "none",
          animation: "lt-label-up 1.15s cubic-bezier(0.22,1,0.36,1) forwards",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)`,
          }}
        />
        <span
          style={{
            fontSize: "clamp(12px, 1.8vw, 17px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
            direction: cfg.dir,
            textShadow: `0 0 20px ${cfg.accentColor}88`,
          }}
        >
          {cfg.label}
        </span>
        <div
          style={{
            width: "24px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${cfg.accentColor}66, transparent)`,
          }}
        />
      </div>
    </>
  );
};

export default LanguageTransition;