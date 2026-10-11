import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BookOpen, BriefcaseBusiness, ExternalLink, GraduationCap, Mail, MapPin, Phone, Sparkles, Trophy, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPortfolioData, skillGroups, socialLinks, type CodexTab } from "./gamePortfolioData";
import "./PortfolioCodex.css";

type Props = { initialTab: CodexTab; onClose: () => void };
const tabOrder: CodexTab[] = ["about", "projects", "experience", "awards", "certifications", "skills", "contact"];

export default function PortfolioCodex({ initialTab, onClose }: Props) {
  const { lang } = useLanguage();
  const { t, projects, experiences, awards, certifications } = getPortfolioData(lang);
  const [active, setActive] = useState<CodexTab>(initialTab);
  const [skillFilter, setSkillFilter] = useState("all");
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const rtl = lang === "ar";
  const labels: Record<CodexTab, string> = {
    about: t.about.title, projects: t.work.subtitle, experience: t.experience.subtitle,
    awards: t.awards.subtitle, certifications: t.certifications.subtitle,
    skills: t.skills.subtitle, contact: t.contact.letsWorkTogether,
  };
  const english = lang === "en";
  const french = lang === "fr";
  const copy = {
    close: english ? "Return to the world" : french ? "Retour au monde" : "العودة إلى العالم",
    chapter: english ? "FIELD ARCHIVE" : french ? "ARCHIVES DE TERRAIN" : "أرشيف الرحلة",
    all: english ? "All disciplines" : french ? "Toutes les disciplines" : "كل التخصصات",
    credential: english ? "View credential" : french ? "Voir le certificat" : "عرض الشهادة",
    open: english ? "Open project" : french ? "Voir le projet" : "افتح المشروع",
    watch: english ? "Watch showcase" : french ? "Voir la démo" : "شاهد العرض",
    systems: english ? "Operating systems" : french ? "Systèmes d’exploitation" : "أنظمة التشغيل",
    credentialId: english ? "Credential ID" : french ? "Identifiant du certificat" : "رقم الشهادة",
    statYears: t.about.stats.experience, statProjects: t.about.stats.projects,
    statRecognition: english ? "National title" : french ? "Titre national" : "لقب وطني",
    statCertificates: english ? "Credentials" : french ? "Certificats" : "الشهادات",
    education: english ? "Education" : french ? "Formation" : "التعليم",
    work: english ? "Experience" : french ? "Expérience" : "الخبرة",
    honor: english ? "Competition" : french ? "Compétition" : "مسابقة",
    meta: english ? "Selected work · 2022 — 2026" : french ? "Projets sélectionnés · 2022 — 2026" : "أعمال مختارة · ٢٠٢٢ — ٢٠٢٦",
    scroll: english ? "Scroll to explore" : french ? "Défiler pour explorer" : "مرر لاستكشاف المزيد",
    cta: t.contact.chat, explore: english ? "Explore the realm" : french ? "Explorer le royaume" : "استكشف العالم",
    location: t.contact.basedIn,
  };
  const featuredGroups = skillGroups.filter((group) => skillFilter === "all" || group.key === skillFilter);

  const chapterTitle = active === "about" ? (english ? "A builder, by craft." : french ? "Bâtir, par passion." : "صانعٌ بالفطرة.")
    : active === "projects" ? (english ? "Things brought to life." : french ? "Des idées devenues réalité." : "أفكار تحولت إلى واقع.")
    : active === "experience" ? (english ? "Every chapter built the next." : french ? "Chaque chapitre prépare le suivant." : "كل مرحلة تمهد لما يليها.")
    : active === "awards" ? (english ? "Proof earned the hard way." : french ? "La reconnaissance, méritée." : "إنجازات استحقت التقدير.")
    : active === "certifications" ? (english ? "The craft, kept in motion." : french ? "Un savoir-faire toujours en mouvement." : "معرفة تنمو باستمرار.")
    : active === "skills" ? (english ? "A well-stocked toolkit." : french ? "Une boîte à outils complète." : "عدة عمل متكاملة.")
    : t.contact.letsWorkTogether;

  return (
    <motion.div className="codex-shell" role="dialog" aria-modal="true" aria-label={copy.chapter} dir={rtl ? "rtl" : "ltr"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="codex-backdrop" onClick={onClose} />
      <motion.section className="codex-frame" initial={{ opacity: 0, y: 26, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .99 }} transition={{ duration: .34, ease: [.2, .75, .22, 1] }}>
        <header className="codex-header">
          <div className="codex-brand"><span className="codex-brand-mark"><BookOpen size={17} /></span><span><small>M7B · THE WAYFINDER</small><b>{copy.chapter}</b></span></div>
          <span className="codex-progress" dir="ltr"><i /> {tabOrder.indexOf(active) + 1} <em>/</em> {tabOrder.length}</span>
          <button className="codex-close" onClick={onClose}><span>{copy.close}</span><X size={17} /></button>
        </header>
        <nav className="codex-tabs" aria-label={copy.chapter}>
          {tabOrder.map((tab, index) => <button key={tab} className={active === tab ? "is-active" : ""} onClick={() => setActive(tab)}><span className="codex-tab-index">0{index + 1}</span>{labels[tab]}</button>)}
        </nav>
        <div className="codex-scroll" key={active}>
          <AnimatePresence mode="wait">
            <motion.main key={active} className="codex-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -9 }} transition={{ duration: .2 }}>
              <div className="codex-eyebrow"><Sparkles size={13} /> {active === "projects" ? copy.meta : labels[active]}</div>
              <h1 className="codex-title">{chapterTitle}</h1>

              {active === "about" && <>
                <p className="codex-lead">{t.hero.description}</p>
                <div className="codex-stat-grid">
                  {[["03+", copy.statYears], ["11+", copy.statProjects], ["01", copy.statRecognition], ["05", copy.statCertificates]].map(([number, label], i) => <article key={label} className="codex-stat" style={{ "--stat-delay": `${i * 70}ms` } as React.CSSProperties}><small>{label}</small><b>{number}</b><span>✳</span></article>)}
                </div>
                <div className="codex-about-grid"><article className="codex-about-card"><span className="codex-glyph">⌘</span><h2>{t.about.services.fullStackTitle}</h2><p>{t.about.services.fullStackDescription}</p></article><article className="codex-about-card"><span className="codex-glyph">◉</span><h2>{english ? "Frontend development" : french ? "Développement frontend" : "تطوير الواجهات الأمامية"}</h2><p>{english ? "Responsive, accessible interfaces with thoughtful visual details and smooth interactions." : french ? "Des interfaces réactives et accessibles, soignées dans leurs détails et leurs interactions." : "واجهات متجاوبة وسهلة الاستخدام، بتفاصيل بصرية مدروسة وتفاعلات سلسة."}</p></article><article className="codex-about-card"><span className="codex-glyph">◈</span><h2>{t.about.services.mobileTitle}</h2><p>{t.about.services.mobileDescription}</p></article><article className="codex-about-card"><span className="codex-glyph">⌘</span><h2>{english ? "Backend development" : french ? "Développement backend" : "تطوير الواجهات الخلفية"}</h2><p>{english ? "Secure APIs, database design, and dependable application logic built around real product needs." : french ? "Des API sécurisées, une conception de bases de données et une logique applicative fiable." : "واجهات برمجية آمنة، وتصميم قواعد بيانات، ومنطق تطبيقات موثوق يلبي احتياجات المنتج."}</p></article><article className="codex-about-card"><span className="codex-glyph">✧</span><h2>{english ? "Artificial Intelligence" : french ? "Intelligence artificielle" : "الذكاء الاصطناعي"}</h2><p>{english ? "I explore practical AI and LLM applications, joining new tools with human-centered product design." : french ? "J'explore des applications pratiques de l'IA et des LLM, alliées à une conception centrée sur l'humain." : "أستكشف تطبيقات عملية للذكاء الاصطناعي والنماذج اللغوية، بتصميم يضع الإنسان في المقام الأول."}</p></article></div>
              </>}

              {active === "projects" && <div className="codex-project-grid">{projects.map((project, index) => <motion.article key={project.title} className="codex-project" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .045 }}>
                <button className="codex-project-visual" onClick={() => setZoomImage({ src: project.image, title: project.title })} aria-label={project.title}><img src={project.image} alt={project.title} loading={index < 3 ? "eager" : "lazy"} /><span className="codex-project-number">{String(index + 1).padStart(2, "0")} / 07</span><span className="codex-image-open"><ArrowUpRight size={18} /></span></button>
                <div className="codex-project-copy"><small>{english ? "FIELD WORK" : french ? "PROJET DE TERRAIN" : "مشروع ميداني"} · {project.tags.slice(0, 2).join(" / ")}</small><h2>{project.title}</h2><p>{project.description}</p><div className="codex-tags">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div><a className="codex-card-link" href={project.url} target="_blank" rel="noreferrer">{project.kind === "video" ? copy.watch : copy.open}<ArrowUpRight size={14} /></a>{project.extraUrl && <a className="codex-card-link" href={project.extraUrl} target="_blank" rel="noreferrer">{english ? "More from the project" : french ? "En savoir plus sur le projet" : "المزيد عن المشروع"}<ArrowUpRight size={14} /></a>}</div>
              </motion.article>)}</div>}

              {active === "experience" && <><div className="codex-timeline">{experiences.map((item, index) => <motion.article key={item.title} className="codex-time-entry" initial={{ opacity: 0, x: rtl ? 12 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .035 }}><span className="codex-time-spine"><i /></span><div className="codex-time-card"><div className="codex-time-meta"><small>{item.period}</small><span>{item.type === "education" ? <GraduationCap size={13} /> : item.type === "honor" ? <Trophy size={13} /> : <BriefcaseBusiness size={13} />}{item.type === "education" ? copy.education : item.type === "honor" ? copy.honor : copy.work}</span></div><h2>{item.title}</h2><b>{item.company}</b><p>{item.description}</p></div></motion.article>)}</div><blockquote className="codex-testimonial"><p>“{t.experience.testimonial.quote}”</p><footer><b>{t.experience.testimonial.client}</b><span>{t.experience.testimonial.project}</span></footer></blockquote></>}

              {active === "awards" && <div className="codex-award-grid">{awards.map((award, index) => <motion.article key={award.title} className="codex-award" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .07 }}><div className="codex-award-emblem"><img src={award.image} alt="" /><span>{award.icon}</span></div><div className="codex-award-meta">{award.date}<span>✦</span>{award.issuer}</div><h2>{award.title}</h2><p>{award.description}</p><small>{award.association}</small></motion.article>)}</div>}

              {active === "certifications" && <div className="codex-cert-grid">{certifications.map((cert, index) => <motion.article key={cert.title} className="codex-cert" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}><button className="codex-cert-image" disabled={!cert.image} onClick={() => cert.image && setZoomImage({ src: cert.image, title: cert.title })} aria-label={cert.title}>{cert.image ? <img src={cert.image} alt={cert.title} loading="lazy" /> : <span>{english ? "Certificate image coming soon" : french ? "Image du certificat à venir" : "صورة الشهادة قريباً"}</span>}<span><ArrowUpRight size={16} /></span></button><div className="codex-cert-copy"><small>{cert.issuer} <i /> {cert.date}</small><h2>{cert.title}</h2><div className="codex-tags">{cert.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><small className="codex-credential-id">{copy.credentialId}: {cert.credentialId}</small>{cert.credential ? <a className="codex-card-link" href={cert.credential} target="_blank" rel="noreferrer">{copy.credential}<ExternalLink size={13} /></a> : <button className="codex-card-link" disabled={!cert.image} onClick={() => cert.image && setZoomImage({ src: cert.image, title: cert.title })}>{copy.credential}<ArrowUpRight size={13} /></button>}</div></motion.article>)}</div>}

              {active === "skills" && <>
                <p className="codex-lead">{t.skills.description}</p>
                <div className="codex-filter-row"><button className={skillFilter === "all" ? "is-active" : ""} onClick={() => setSkillFilter("all")}>{copy.all}</button>{skillGroups.map((group) => <button className={skillFilter === group.key ? "is-active" : ""} key={group.key} onClick={() => setSkillFilter(group.key)}>{group.key === "systems" ? copy.systems : (t.skills.categories[group.key as keyof typeof t.skills.categories] ?? (group.key === "ai" ? (english ? "AI & Data" : french ? "IA & données" : "الذكاء الاصطناعي والبيانات") : (english ? "Desktop" : french ? "Desktop" : "سطح المكتب")))}</button>)}</div>
                <div className="codex-skills">{featuredGroups.flatMap((group) => group.skills).map((skill, i) => <motion.span key={skill} initial={{ opacity: 0, scale: .91 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .018 }}><i>{String(i + 1).padStart(2, "0")}</i>{skill}<ArrowUpRight size={13} /></motion.span>)}</div>
                <div className="codex-spoken"><small>{t.skills.languagesTitle}</small><span>Darija <i>{t.skills.languageLevels.native}</i></span><span>Arabic <i>{t.skills.languageLevels.fluent}</i></span><span>English <i>{t.skills.languageLevels.intermediate}</i></span><span>French <i>{t.skills.languageLevels.intermediate}</i></span></div>
              </>}

              {active === "contact" && <div className="codex-contact-layout"><div className="codex-contact-copy"><span className="codex-contact-sigil">✳</span><h2>{t.contact.chat}</h2><p>{t.contact.chatDescription}</p><a className="codex-send" href="mailto:marouane.ma7boub@gmail.com"><Mail size={16} /> marouane.ma7boub@gmail.com <ArrowUpRight size={16} /></a></div><div className="codex-contact-facts"><span><Phone size={16} /><i>{t.contact.phone}</i><b>+212 706 452 165</b></span><span><MapPin size={16} /><i>{t.contact.location}</i><b>{copy.location}</b></span><div className="codex-socials">{socialLinks.map((social) => <a href={social.url} target="_blank" rel="noreferrer" key={social.label} aria-label={social.label}><b>{social.mark}</b><span>{social.label}</span><ArrowUpRight size={13} /></a>)}</div></div></div>}

              <footer className="codex-content-footer"><span>M7B <i>✳</i> {labels[active]}</span><button onClick={onClose}>{copy.explore}<ArrowDownRight size={14} /></button></footer>
            </motion.main>
          </AnimatePresence>
        </div>
        <div className="codex-bottomline"><span>ARCHIVE SYNCED <i /></span><span>{copy.scroll}</span><span>© MAROUANE MAHBOUB</span></div>
      </motion.section>
      <AnimatePresence>{zoomImage && <motion.div className="codex-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoomImage(null)}><button aria-label="Close image"><X size={20} /></button><img src={zoomImage.src} alt={zoomImage.title} /><span>{zoomImage.title}</span></motion.div>}</AnimatePresence>
    </motion.div>
  );
}
