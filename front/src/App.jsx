import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';


import goodreadsIcon from './assets/goodreads.png';
import malIcon from './assets/myanimelist.png';
import backloggdIcon from './assets/backloggd.png';
import letterboxdIcon from './assets/letterboxd.png';
import serializedIcon from './assets/serializd.png';
import musashiProfile from './assets/musashi.jpg';


const QUESTIONS_DB = [
  { id: 'city_born', text: { en: "What city was I born in?", fr: "Dans quelle ville suis-je né ?", ar: "في أي مدينة ولدت؟" } },
  { id: 'mom_name', text: { en: "What is my mom’s name?", fr: "Quel est le nom de ma mère ?", ar: "ما اسم أمي؟" } },
  { id: 'dream_dest', text: { en: "What’s my dream travel destination?", fr: "Quelle est ma destination de rêve ?", ar: "ما هي وجهة سفري التي أحلم بها؟" } },
  { id: 'current_city', text: { en: "What city do I currently live in?", fr: "Dans quelle ville j'habite ?", ar: "في أي مدينة أعيش حاليا؟" } },
  { id: 'tv_show', text: { en: "What’s my favorite TV show?", fr: "Quelle est ma série préférée ?", ar: "ما هو برنامجي التلفزيوني المفضل؟" } },
  { id: 'animal', text: { en: "What’s my favorite type of animal?", fr: "Quel est mon animal préféré ?", ar: "ما هو حيواني المفضل؟" } },
  { id: 'game', text: { en: "What’s my favorite video game?", fr: "Quel est mon jeu vidéo préféré ?", ar: "ما هي لعبة الفيديو المفضلة لدي؟" } },
  { id: 'subject', text: { en: "What’s my favorite subject in high school?", fr: "Quelle était ma matière préférée au lycée ?", ar: "ما هي مادتي المفضلة في الثانوية؟" } },
  { id: 'anime', text: { en: "What is my favorite anime?", fr: "Quel est mon anime préféré ?", ar: "ما هو الأنمي المفضل لدي؟" } }
];

const UI_TEXT = {
  en: { title: "Security Check", sub: "Choose & answer 2 questions", unlock: "Unlock Profile", placeholder: "Your answer...", select: "Select a question" },
  fr: { title: "Contrôle de Sécurité", sub: "Choisissez 2 questions", unlock: "Déverrouiller", placeholder: "Votre réponse...", select: "Choisir une question" },
  ar: { title: "فحص الأمان", sub: "اختر وأجب عن سؤالين", unlock: "فتح الملف الشخصي", placeholder: "إجابتك...", select: "اختر سؤالاً" }
};


const LINK_THEMES = {
  'Books': { color: 9205843, emoji: '📚' }, // Brown
  'Anime & Manga': { color: 3042722, emoji: '⛩️' }, // Blue
  'Games': { color: 15158332, emoji: '🎮' }, // Red
  'Movies': { color: 4439247, emoji: '🎬' }, // Green (Letterboxd)
  'TV Shows': { color: 1752220, emoji: '📺' }, // Teal
  'Instagram': { color: 13453419, emoji: '📸' }, // Pink
  'GitHub': { color: 2303786, emoji: '💻' }, // Dark Grey
  'LinkedIn': { color: 299355, emoji: '💼' }  // Linkedin Blue
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [lang, setLang] = useState('en'); 
  const [selections, setSelections] = useState({ 0: 'city_born', 1: 'mom_name' });
  const [userAnswers, setUserAnswers] = useState({ 0: '', 1: '' });
  const [inputStatus, setInputStatus] = useState({ 0: 'neutral', 1: 'neutral' }); 
  const [shake, setShake] = useState(false);

  const hasLoggedVisit = useRef(false);
  const isCheckingAuth = useRef(false);

  const callApi = async (endpoint, body) => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  };

  const handleLinkClick = (e, name, url) => {
    e.preventDefault();
    
    const theme = LINK_THEMES[name] || { color: 3447003, emoji: '🔗' };
    
    callApi(`${API_BASE_URL}/api/log`, { 
      message: `${theme.emoji} User clicked on **${name}**`, 
      color: theme.color 
    });
    
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (!hasLoggedVisit.current) {
      callApi(`${API_BASE_URL}/api/log`, { message: "👀 **New Visitor** on the page.", color: 3447003 });
      hasLoggedVisit.current = true;
    }
  }, []);

  useEffect(() => {
    const verifyAnswers = async () => {
      let correctCount = 0;
      const newStatus = { ...inputStatus };
      let hasError = false;

      for (let index of [0, 1]) {
        const questionId = selections[index];
        const rawInput = userAnswers[index] || '';

        if (rawInput.length > 2) {
          const result = await callApi(`${API_BASE_URL}/api/verify`, { questionId, answer: rawInput });
          
          if (result.success) {
            newStatus[index] = 'correct';
            correctCount++;
          } else {
            newStatus[index] = 'error';
            hasError = true;
          }
        } else {
          newStatus[index] = 'neutral';
        }
      }

      setInputStatus(newStatus);

      if (hasError) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      if (correctCount === 2 && !isCheckingAuth.current) {
        isCheckingAuth.current = true;
        
        const authPayload = {
          selections: {
            0: { id: selections[0], answer: userAnswers[0] },
            1: { id: selections[1], answer: userAnswers[1] }
          }
        };

        const authRes = await callApi(`${API_BASE_URL}/api/unlock`, authPayload);
        
        if (authRes.success) {
          setTimeout(() => setIsAuthenticated(true), 300);
        } else {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          isCheckingAuth.current = false;
        }
      } else if (correctCount < 2) {
        isCheckingAuth.current = false;
      }
    };

    const timer = setTimeout(verifyAnswers, 500);
    return () => clearTimeout(timer);

  }, [userAnswers, selections]);

  const handleSelectionChange = (index, value) => {
    setSelections(prev => ({ ...prev, [index]: value }));
    setUserAnswers(prev => ({ ...prev, [index]: '' }));
    setInputStatus(prev => ({ ...prev, [index]: 'neutral' }));
  };

  const handleInputChange = (index, value) => {
    setUserAnswers(prev => ({ ...prev, [index]: value }));
  };

  const getAvailableQuestions = (currentIndex) => {
    const otherIndex = currentIndex === 0 ? 1 : 0;
    const otherSelection = selections[otherIndex];
    return QUESTIONS_DB.filter(q => q.id !== otherSelection || q.id === selections[currentIndex]);
  };

  if (isAuthenticated) {
    const socialLinks = [
      { name: 'Instagram', url: 'https://instagram.com/marwane_m7b', icon: FaInstagram },
      { name: 'GitHub', url: 'https://github.com/marouane-m7b', icon: FaGithub },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/m7b/', icon: FaLinkedin }
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
                  <a 
                    key={index} 
                    href={social.url} 
                    onClick={(e) => handleLinkClick(e, social.name, social.url)}
                    className="text-gray-400 hover:text-gray-800 hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  onClick={(e) => handleLinkClick(e, link.title, link.url)}
                  className={`group flex items-center p-3 rounded-2xl bg-gradient-to-r ${link.color} border ${link.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer`}
                >
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

  return (
    <Background>
      <div 
        className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-full border border-white/50 transition-transform ${shake ? 'animate-shake' : ''}`} 
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
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
          {[0, 1].map((index) => (
            <div key={index} className="relative group bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-purple-200 transition-colors">
              <div className="mb-2">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">
                  {lang === 'ar' ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                </label>
                <select
                  value={selections[index]}
                  onChange={(e) => handleSelectionChange(index, e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-700 outline-none border-none p-0 cursor-pointer"
                >
                  {getAvailableQuestions(index).map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.text[lang]}
                    </option>
                  ))}
                </select>
              </div>

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
                
                <div className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3`}>
                   {inputStatus[index] === 'correct' && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                   {inputStatus[index] === 'error' && <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                </div>
              </div>
            </div>
          ))}

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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </Background>
  );
}