import { UI_TRANSLATIONS } from "@/lib/translations";
import { additionalProjects, additionalCertifications, careerProfile } from "./careerEnrichment";
import type { Language } from "@/contexts/LanguageContext";
import skillEnhanceCover from "@/assets/Projects/SkillEnhance-concept-v1.png";
import absence from "@/assets/Projects/Ofppt_Absence.jpg";
import store from "@/assets/Projects/Ecommerce.png";
import establishments from "@/assets/Projects/Ofppt_Etab.jpg";
import movies from "@/assets/Projects/Movies.jpg";
import gpa from "@/assets/Projects/GPA_Bac.jpg";
import siyaqati from "@/assets/Projects/Siya9ati.jpg";
import cognitado from "@/assets/Projects/Cognitado.jpg";
import aiCertificate from "@/assets/Certifications/Enset AI.jpg";
import scrumCertificate from "@/assets/Certifications/IBM Scrum Master.jpg";
import metaCertificate from "@/assets/Certifications/Meta Front-End Developer.jpg";
import gitCertificate from "@/assets/Certifications/Git And Github Google.jpg";
import promptCertificate from "@/assets/Certifications/Prompt Engineering.jpg";
import worldSkills from "@/assets/worldskills.jpg";
import ofppt from "@/assets/ofppt.png";
import intellico from "@/assets/intellico.jpg";

export type CodexTab = "about" | "projects" | "experience" | "awards" | "certifications" | "skills" | "contact";

const projectMeta = [
  { image: absence, tags: ["React", "Laravel", "Material UI", "MySQL"], url: "https://www.youtube.com/watch?v=OeQKoDtrgZs", kind: "video" },
  { image: store, tags: ["React", "Laravel", "MySQL", "Commerce"], url: "https://mostaql.com/portfolio/2299929-unified-commerce-mobile", kind: "project" },
  { image: establishments, tags: ["Spring Boot", "React", "MySQL", "Spring Security"], url: "https://www.youtube.com/watch?v=AnA_hifaxbU", kind: "video" },
  { image: movies, tags: ["Jakarta EE", "JavaScript", "MySQL", "JDBC"], url: "https://www.youtube.com/watch?v=hvjqyGa_ua0", kind: "video" },
  { image: gpa, tags: ["HTML", "CSS", "JavaScript", "Mobile"], url: "https://www.youtube.com/watch?v=qdPSBcK0adU", kind: "video" },
  { image: siyaqati, tags: ["PHP", "JavaScript", "Education"], url: "https://siya9ati.unaux.com", kind: "project", extraUrl: "https://www.youtube.com/@ncoodew" },
  { image: cognitado, tags: ["JavaFX", "Spring AI", "Google Calendar", "Gantt"], url: "https://www.youtube.com/watch?v=ESe_f_gRfMA", kind: "video" },
];

const certificationMeta = [
  { image: aiCertificate, issuer: "ENSET Mohammedia", date: "Sep 2025", credentialId: "24ba0533-132f-429f-b30c-a5334d646241", skills: ["Artificial Intelligence", "Machine Learning"], credential: "", titles: ["Introduction to Modern AI", "Introduction à l'IA moderne", "مقدمة في الذكاء الاصطناعي الحديث"] },
  { image: scrumCertificate, issuer: "IBM", date: "Aug 2024", credentialId: "ABZET6SO2939", skills: ["Scrum", "Agile"], credential: "https://www.coursera.org/account/accomplishments/specialization/ABZET6SO2939", titles: ["IBM IT Scrum Master Specialization", "Spécialisation IBM IT Scrum Master", "تخصص إدارة المشاريع الرشيقة IBM"] },
  { image: metaCertificate, issuer: "Meta", date: "Aug 2024", credentialId: "CSMWSHPQRZ6Q", skills: ["React", "JavaScript"], credential: "https://www.coursera.org/account/accomplishments/professional-cert/CSMWSHPQRZ6Q", titles: ["Meta Front-End Developer Professional Certificate", "Certificat professionnel Meta Front-End Developer", "شهادة ميتا الاحترافية لتطوير الواجهات الأمامية"] },
  { image: gitCertificate, issuer: "Google", date: "Jul 2024", credentialId: "TEWNDN998JGR", skills: ["Git", "GitHub", "Collaboration"], credential: "https://coursera.org/verify/TEWNDN998JGR", titles: ["Introduction to Git and GitHub", "Introduction à Git et GitHub", "مقدمة إلى Git وGitHub"] },
  { image: promptCertificate, issuer: "Vanderbilt University", date: "Jul 2024", credentialId: "JLHFNSIMFQ1G", skills: ["Prompt Engineering", "AI"], credential: "https://www.coursera.org/account/accomplishments/specialization/JLHFNSIMFQ1G", titles: ["Prompt Engineering for Educators Specialization", "Spécialisation en ingénierie de prompts pour enseignants", "تخصص هندسة الأوامر للمعلمين"] },
];

const awardMeta = [
  { image: worldSkills, date: "Jul 2025", icon: "Ⅰ" },
  { image: worldSkills, date: "Jan 2025", icon: "Ⅱ" },
  { image: ofppt, date: "Jun 2024", icon: "✦" },
  { image: intellico, date: "May 2024", icon: "Ⅷ" },
];

const experienceMeta = [
  { period: "Nov 2025 — Present", type: "education" },
  { period: "Jun 2025 — Nov 2025", type: "honor" },
  { period: "Sep 2024 — Jul 2025", type: "education" },
  { period: "Apr 2025 — May 2025", type: "work" },
  { period: "Apr 2024 — Jun 2024", type: "work" },
  { period: "Feb 2024 — May 2024", type: "work" },
  { period: "May 2024", type: "work" },
  { period: "Jan 2024 — Mar 2024", type: "work" },
  { period: "Sep 2022 — Jun 2024", type: "education" },
  { period: "Dec 2022 — May 2023", type: "work" },
  { period: "Sep 2018 — Jun 2021", type: "education" },
];

export function getPortfolioData(lang: Language) {
  const t = UI_TRANSLATIONS[lang];
  const languageIndex = lang === "en" ? 0 : lang === "fr" ? 1 : 2;
  const projects = [...projectMeta.map((item, index) => ({ ...item, extraUrl: "", ...t.work.projects[index] })), ...additionalProjects.map(item => ({ ...item, image: item.titles[0] === "Skill Enhance" ? skillEnhanceCover : "", extraUrl: "", title: item.titles[languageIndex], description: item.descriptions[languageIndex] }))];
  projects[0].tags = ["React", "TypeScript", "Laravel", "Material UI", "MySQL", "Git"];
  projects[2].tags = ["Spring Boot", "React", "PostgreSQL", "Postman", "Git"];
  projects[5].extraUrl = "https://www.youtube.com/watch?v=n6hUkQR_w08";
  const awards = awardMeta.map((item, index) => ({ ...item, ...t.awards.awards[index] }));
  const experiences = experienceMeta.map((item, index) => ({ ...item, ...t.experience.experiences[index] }));
  const certifications = [...additionalCertifications, ...certificationMeta].map(item => ({ ...item, title: item.titles[languageIndex], meta: t.certifications }));
  experiences[0] = { ...experiences[0], period: "Nov 2025 — Jun 2027 (expected)", company: "ENSET Mohammedia · Université Hassan II", description: ["Master’s degree in progress. Distributed systems, AI, data structures, DevOps/MLOps and distributed-system security.", "Master en cours : systèmes distribués, IA, structures de données, DevOps/MLOps et sécurité des systèmes distribués.", "الماستر قيد الدراسة: الأنظمة الموزعة والذكاء الاصطناعي وهياكل البيانات وDevOps/MLOps وأمن الأنظمة الموزعة."][languageIndex] };
  experiences[2] = { ...experiences[2], company: "Faculté Polydisciplinaire de Sidi Bennour · Université Chouaïb Doukkali", description: ["Professional Bachelor’s in Computer Science & Applied Mathematics. Grade: 16.06/20. Web, Java/UML, J2EE, Big Data and information security.", "Licence professionnelle en informatique et mathématiques appliquées. Note : 16,06/20. Web, Java/UML, J2EE, Big Data et sécurité.", "إجازة مهنية في المعلوميات والرياضيات التطبيقية. المعدل: 16.06/20. الويب وJava/UML وJ2EE والبيانات الضخمة وأمن المعلومات."][languageIndex] };
  awards[0].description = ["First place nationally in Web Technologies at WorldSkills Morocco in July 2025; selected for the Shanghai 2026 preparation programme.", "Première place nationale en technologies web à WorldSkills Maroc en juillet 2025 ; sélection pour le programme de préparation de Shanghai 2026.", "المركز الأول وطنياً في تقنيات الويب في WorldSkills المغرب في يوليو 2025، والاختيار لبرنامج التحضير لشنغهاي 2026."][languageIndex];
  experiences[1].description = awards[0].description;
  awards[3].description = ["Team participant in the Intellico senior hackathon in May 2024. Built Skill Enhance with React and Laravel.", "Participation en équipe au hackathon senior Intellico en mai 2024. Création de Skill Enhance avec React et Laravel.", "المشاركة ضمن فريق في هاكاثون Intellico في مايو 2024 وبناء Skill Enhance باستخدام React وLaravel."][languageIndex];
  experiences[6].description = awards[3].description;
  return { t, projects, awards, experiences, certifications, profile: { role: careerProfile.roles[languageIndex], bio: careerProfile.bios[languageIndex] } };
}

export const skillGroups = [
  { key: "frontend", skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js", "Redux", "Angular (academic)", "Sass", "HTML5", "CSS3"] },
  { key: "backend", skills: ["Laravel", "PHP", "Python", "Node.js", "Spring Boot", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Spring AI", "Java", "Jakarta EE", "Flask", "SocketIO", "Redis", "JDBC", "JWT", "WebSockets", "REST APIs"] },
  { key: "mobile", skills: ["React Native", "TypeScript", "Android", "Mobile UX"] },
  { key: "tools", skills: ["Git", "GitHub", "Docker", "Linux", "Maven", "uv", "WordPress", "Sanity", "Mailpit", "Postman", "Jira", "VS Code", "Figma", "Canva", "MS Office"] },
  { key: "ai", skills: ["Spring AI", "Groq", "LLM integration", "RAG", "Multi-agent systems", "Pandas", "NumPy", "scikit-learn", "XGBoost", "Optuna", "SHAP"] },
  { key: "desktop", skills: ["JavaFX", "FXML", "Java 21", "JDBC"] },
  { key: "methodologies", skills: ["Scrum", "Agile", "UML", "Waterfall", "MVC", "REST API", "Team leadership"] },
  { key: "systems", skills: ["Windows 7 / 10 / 11", "Ubuntu", "Arch Linux", "Linux Mint", "Kali Linux"] },
];

export const socialLinks = [
  { label: "GitHub", url: "https://github.com/marouane-m7b", mark: "GH" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/m7b/", mark: "in" },
  { label: "Instagram", url: "https://instagram.com/marwane_m7b", mark: "◎" },
];
