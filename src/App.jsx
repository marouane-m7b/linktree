import { useState, useEffect } from 'react';

// Import your icons
import goodreadsIcon from './assets/goodreads.png';
import malIcon from './assets/myanimelist.png';
import backloggdIcon from './assets/backloggd.png';
import letterboxdIcon from './assets/letterboxd.png';
import serializedIcon from './assets/serializd.png';
import musashiProfile from './assets/musashi.jpg';

// --- SECURITY UTILS ---

// 1. Normalize: Remove accents, lowercase, trim extra spaces
const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// 2. Encode: Using Base64 to hide answers from plain text
// This ensures "fatiha" matches "ZmF0aWhh"
const encodeAnswer = (str) => {
  try {
    return btoa(str);
  } catch (e) {
    return '';
  }
};

// --- DATA CONFIGURATION ---

const QUESTIONS_DB = [
  {
    id: 'city_born',
    text: { en: "What city was I born in?", fr: "Dans quelle ville suis-je né ?", ar: "في أي مدينة ولدت؟" },
    // casablanca, casa
    validHashes: ["Y2FzYWJsYW5jYQ==", "Y2FzYQ=="] 
  },
  {
    id: 'mom_name',
    text: { en: "What is my mom’s name?", fr: "Quel est le nom de ma mère ?", ar: "ما اسم أمي؟" },
    // fatiha
    validHashes: ["ZmF0aWhh"] 
  },
  {
    id: 'dream_dest',
    text: { en: "What’s my dream travel destination?", fr: "Quelle est ma destination de rêve ?", ar: "ما هي وجهة سفري التي أحلم بها؟" },
    // japan, japon, tokyo
    validHashes: ["amFwYW4=", "amFwb24=", "dG9reW8="]
  },
  {
    id: 'current_city',
    text: { en: "What city do I currently live in?", fr: "Dans quelle ville j'habite ?", ar: "في أي مدينة أعيش حاليا؟" },
    // mohammedia
    validHashes: ["bW9oYW1tZWRpYQ=="]
  },
  {
    id: 'tv_show',
    text: { en: "What’s my favorite TV show?", fr: "Quelle est ma série préférée ?", ar: "ما هو برنامجي التلفزيوني المفضل؟" },
    // better call saul, bcs, breaking bad
    validHashes: ["YmV0dGVyIGNhbGwgc2F1bA==", "YmNz", "YnJlYWtpbmcgYmFk"]
  },
  {
    id: 'animal',
    text: { en: "What’s my favorite type of animal?", fr: "Quel est mon animal préféré ?", ar: "ما هو حيواني المفضل؟" },
    // cats, cat, chat, chats
    validHashes: ["Y2F0cw==", "Y2F0", "Y2hhdA==", "Y2hhdHM="]
  },
  {
    id: 'game',
    text: { en: "What’s my favorite video game?", fr: "Quel est mon jeu vidéo préféré ?", ar: "ما هي لعبة الفيديو المفضلة لدي؟" },
    // resident evil, re, residentevil
    validHashes: ["cmVzaWRlbnQgZXZpbA==", "cmU=", "cmVzaWRlbnRldmls"]
  },
  {
    id: 'subject',
    text: { en: "What’s my favorite subject in school?", fr: "Quelle était ma matière préférée ?", ar: "ما هي مادتي الدراسية المفضلة؟" },
    // svt, biology
    validHashes: ["c3Z0", "YmlvbG9neQ=="]
  },
  {
    id: 'anime',
    text: { en: "What is my favorite anime?", fr: "Quel est mon anime préféré ?", ar: "ما هو الأنمي المفضل لدي؟" },
    // hunter x hunter, hunterxhunter, hxh
    validHashes: ["aHVudGVyIHggaHVudGVy", "aHVudGVyeGh1bnRlcg==", "aHho"]
  }
];

const UI_TEXT = {
  en: { title: "Security Check", sub: "Choose & answer 2 questions", unlock: "Unlock Profile", placeholder: "Your answer...", select: "Select a question" },
  fr: { title: "Contrôle de Sécurité", sub: "Choisissez 2 questions", unlock: "Déverrouiller", placeholder: "Votre réponse...", select: "Choisir une question" },
  ar: { title: "فحص الأمان", sub: "اختر وأجب عن سؤالين", unlock: "فتح الملف الشخصي", placeholder: "إجابتك...", select: "اختر سؤالاً" }
};

const Background = ({ children }) => (
  <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f3f4f6]">
    <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
    <div className="relative z-10 w-full max-w-md">
      {children}
    </div>
  </div>
);

export default function PasswordGate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState('en'); 
  
  // Default selections: City born (0) and Mom Name (1)
  const [selections, setSelections] = useState({
    0: QUESTIONS_DB[0].id,
    1: QUESTIONS_DB[1].id
  });

  const [userAnswers, setUserAnswers] = useState({ 0: '', 1: '' });
  const [inputStatus, setInputStatus] = useState({ 0: 'neutral', 1: 'neutral' }); 

  // --- REAL-TIME VALIDATION EFFECT ---
  useEffect(() => {
    let correctCount = 0;
    const newStatus = { ...inputStatus };

    [0, 1].forEach((index) => {
      const selectedId = selections[index];
      const questionObj = QUESTIONS_DB.find(q => q.id === selectedId);
      
      const rawInput = userAnswers[index] || '';
      // Only check if user has typed something
      if (rawInput.length > 0) {
        const normalized = normalize(rawInput);
        const hash = encodeAnswer(normalized);
        
        if (questionObj && questionObj.validHashes.includes(hash)) {
          newStatus[index] = 'correct';
          correctCount++;
        } else {
          // Optional: Only show error if length > 2 to avoid red box while just starting to type
          newStatus[index] = rawInput.length > 2 ? 'error' : 'neutral';
        }
      } else {
        newStatus[index] = 'neutral';
      }
    });

    setInputStatus(newStatus);

    // Auto-unlock if both are correct
    if (correctCount === 2) {
      // Small delay for visual satisfaction
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 300);
    }
  }, [userAnswers, selections]);

  const handleSelectionChange = (index, value) => {
    setSelections(prev => ({ ...prev, [index]: value }));
    setUserAnswers(prev => ({ ...prev, [index]: '' }));
    setInputStatus(prev => ({ ...prev, [index]: 'neutral' }));
  };

  const handleInputChange = (index, value) => {
    setUserAnswers(prev => ({ ...prev, [index]: value }));
  };

  // --- PROFILE VIEW (AUTHENTICATED) ---
  if (isAuthenticated) {
    const socialLinks = [
      { name: 'Instagram', url: 'https://instagram.com/marwane_m7b', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
      { name: 'GitHub', url: 'https://github.com/marouane-m7b', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/m7b/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
    ];

    const links = [
      { title: 'Books', url: 'https://www.goodreads.com/marouane_m7b', color: 'from-amber-50 to-amber-100', borderColor: 'border-amber-200', textAccent: 'text-amber-900', iconImg: goodreadsIcon },
      { title: 'Anime & Manga', url: 'https://myanimelist.net/profile/marouane_m7b', color: 'from-blue-50 to-blue-100', borderColor: 'border-blue-200', textAccent: 'text-blue-900', iconImg: malIcon },
      { title: 'Games', url: 'https://backloggd.com/u/marouane_m7b/games', color: 'from-gray-50 to-gray-100', borderColor: 'border-gray-200', textAccent: 'text-gray-900', iconImg: backloggdIcon },
      { title: 'Movies', url: 'https://boxd.it/c4xHT', color: 'from-orange-50 to-orange-100', borderColor: 'border-orange-200', textAccent: 'text-orange-900', iconImg: letterboxdIcon },
      { title: 'TV Shows', url: 'https://www.serializd.com/user/marouane_m7b/diary', color: 'from-teal-50 to-teal-100', borderColor: 'border-teal-200', textAccent: 'text-teal-900', iconImg: serializedIcon }
    ];

    return (
      <Background>
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 animate-fade-in">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-32 h-32">
                   <img src={musashiProfile} alt="Profile" className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Marouane Mahboub</h1>
                  <span className="text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Software Engineer, Web Developer • AI & LLM</p>
              </div>
              <div className="flex gap-4 mt-5">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={`group flex items-center p-3 rounded-2xl bg-gradient-to-r ${link.color} border ${link.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out`}>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mr-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <img src={link.iconImg} alt={link.title} className="w-full h-full object-cover" />
                  </div>
                  <span className={`${link.textAccent} font-bold text-lg flex-1`}>{link.title}</span>
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className={`w-4 h-4 ${link.textAccent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Background>
    );
  }

  // --- SECURITY GATE VIEW ---
  return (
    <Background>
      <div className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-full border border-white/50`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Language Switcher */}
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'en' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`}>🇺🇸 EN</button>
          <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'fr' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`}>🇫🇷 FR</button>
          <button onClick={() => setLang('ar')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'ar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`}>🇲🇦 AR</button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-3 mb-3 shadow-lg shadow-purple-500/30">
            <svg className="w-7 h-7 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">{UI_TEXT[lang].title}</h1>
          <p className="text-gray-500 text-xs mt-1">{UI_TEXT[lang].sub}</p>
        </div>

        <div className="space-y-6">
          {/* Loop for 2 question slots */}
          {[0, 1].map((index) => (
            <div key={index} className="relative group bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-purple-200 transition-colors">
              {/* Question Dropdown */}
              <div className="mb-2">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">
                  {lang === 'ar' ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                </label>
                <select
                  value={selections[index]}
                  onChange={(e) => handleSelectionChange(index, e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-700 outline-none border-none p-0 cursor-pointer"
                >
                  {QUESTIONS_DB.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.text[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Answer Input */}
              <div className="relative">
                <input
                  type="text"
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm
                    ${inputStatus[index] === 'error' ? 'border-red-300 bg-red-50 focus:ring-red-200' : 
                      inputStatus[index] === 'correct' ? 'border-green-300 bg-green-50 text-green-700' : 
                      'border-gray-200 bg-white focus:ring-4 focus:ring-purple-100 focus:border-purple-500'}
                  `}
                  placeholder={UI_TEXT[lang].placeholder}
                  autoComplete="off"
                />
                
                {/* Status Icons */}
                <div className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3`}>
                   {inputStatus[index] === 'correct' && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                   {/* Only show error icon if explicitly marked error */}
                   {inputStatus[index] === 'error' && <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                </div>
              </div>
            </div>
          ))}

          {/* Button is mostly visual now since unlock is automatic, but nice to keep for affordance */}
          <button
            disabled={true}
            className="w-full mt-4 bg-gradient-to-r from-gray-300 to-gray-400 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed opacity-50"
          >
            {UI_TEXT[lang].unlock} (Auto)
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Background>
  );
}