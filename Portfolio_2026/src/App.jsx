import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import confetti from 'canvas-confetti';

import goodreadsIcon from './assets/goodreads.png';
import malIcon from './assets/myanimelist.png';
import backloggdIcon from './assets/backloggd.png';
import letterboxdIcon from './assets/letterboxd.png';
import serializedIcon from './assets/serializd.png';
import musashiProfile from './assets/musashi.jpg';

const QUESTIONS_DB = [
  { id: 'city_born', text: { en: "What city was I born in?", fr: "Dans quelle ville suis-je né ?", ar: "في أي مدينة ولدت؟" } },
  { id: 'mom_name', text: { en: "What is my mom's name?", fr: "Quel est le nom de ma mère ?", ar: "ما اسم أمي؟" } },
  { id: 'dream_dest', text: { en: "What's my dream travel destination?", fr: "Quelle est ma destination de rêve ?", ar: "ما هي وجهة سفري التي أحلم بها؟" } },
  { id: 'current_city', text: { en: "What city do I currently live in?", fr: "Dans quelle ville j'habite ?", ar: "في أي مدينة أعيش حاليا؟" } },
  { id: 'tv_show', text: { en: "What's my favorite TV show?", fr: "Quelle est ma série préférée ?", ar: "ما هو برنامجي التلفزيوني المفضل؟" } },
  { id: 'animal', text: { en: "What's my favorite type of animal?", fr: "Quel est mon animal préféré ?", ar: "ما هو حيواني المفضل؟" } },
  { id: 'game', text: { en: "What's my favorite video game?", fr: "Quel est mon jeu vidéo préféré ?", ar: "ما هي لعبة الفيديو المفضلة لدي؟" } },
  { id: 'subject', text: { en: "What's my favorite subject in high school?", fr: "Quelle était ma matière préférée au lycée ?", ar: "ما هي مادتي المفضلة في الثانوية؟" } },
  { id: 'anime', text: { en: "What is my favorite anime?", fr: "Quel est mon anime préféré ?", ar: "ما هو الأنمي المفضل لدي؟" } }
];

const UI_TEXT = {
  en: { title: "Security Check", sub: "Choose & answer 2 questions", unlock: "Unlock Profile", placeholder: "Your answer...", select: "Select a question" },
  fr: { title: "Contrôle de Sécurité", sub: "Choisissez 2 questions", unlock: "Déverrouiller", placeholder: "Votre réponse...", select: "Choisir une question" },
  ar: { title: "فحص الأمان", sub: "اختر وأجب عن سؤالين", unlock: "فتح الملف الشخصي", placeholder: "إجابتك...", select: "اختر سؤالاً" }
};

const LINK_THEMES = {
  'Books': { color: 9205843, emoji: '📚' },
  'Anime & Manga': { color: 3042722, emoji: '⛩️' },
  'Games': { color: 15158332, emoji: '🎮' },
  'Movies': { color: 4439247, emoji: '🎬' },
  'TV Shows': { color: 1752220, emoji: '📺' },
  'Instagram': { color: 13453419, emoji: '📸' },
  'GitHub': { color: 2303786, emoji: '💻' },
  'LinkedIn': { color: 299355, emoji: '💼' }
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Background = ({ children }) => (
  <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-hidden">
    {/* Animated grid background */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }}></div>
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
    
    {/* Scanline effect */}
    <div className="fixed inset-0 z-20 pointer-events-none opacity-5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent" style={{ 
        height: '200%', 
        animation: 'scanline 8s linear infinite' 
      }}></div>
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
      return { success: false, error: e.message};
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
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
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
      // { title: 'Books', url: 'https://www.goodreads.com/marouane_m7b', gradient: 'from-amber-600 via-yellow-500 to-amber-600', glow: 'shadow-amber-500/50', iconImg: goodreadsIcon },
      { title: 'Portfolio', url: 'https://m7b.dev', gradient: 'from-purple-500 via-pink-500 to-red-500', glow: 'shadow-purple-500/50', iconImg: musashiProfile },
      { title: 'Movies', url: 'https://boxd.it/c4xHT', gradient: 'from-orange-500 via-yellow-500 to-orange-500', glow: 'shadow-orange-500/50', iconImg: letterboxdIcon },
      { title: 'Anime & Manga', url: 'https://myanimelist.net/profile/marouane_m7b', gradient: 'from-blue-500 via-cyan-500 to-blue-500', glow: 'shadow-blue-500/50', iconImg: malIcon },
      { title: 'TV Shows', url: 'https://www.serializd.com/user/marouane_m7b/diary', gradient: 'from-teal-500 via-green-500 to-teal-500', glow: 'shadow-teal-500/50', iconImg: serializedIcon },
      { title: 'Games', url: 'https://backloggd.com/u/marouane_m7b/games', gradient: 'from-red-500 via-pink-500 to-purple-500', glow: 'shadow-red-500/50', iconImg: backloggdIcon },
    ];

    return (
      <Background>
        <div className="w-full bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-cyan-500/30 animate-fade-in relative">
          {/* Glowing border animation */}
          <div className="absolute inset-0 rounded-3xl animate-border-glow pointer-events-none"></div>
          
          <div className="p-8 relative">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-6">
                {/* Rotating rings */}
                <div className="absolute -inset-4 animate-spin-slow">
                  <div className="h-full w-full rounded-full border-2 border-cyan-500/30 border-t-cyan-500"></div>
                </div>
                <div className="absolute -inset-6 animate-spin-slow-reverse">
                  <div className="h-full w-full rounded-full border-2 border-purple-500/30 border-r-purple-500"></div>
                </div>
                
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500 shadow-lg shadow-cyan-500/50">
                  <img src={musashiProfile} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="text-center space-y-3 relative z-10">
                {/* Name Section - Smaller (2xl), Solid Cyan, Matched Badge */}
                <div className="flex items-center justify-center gap-1.5">
                  <h1 className="text-2xl font-bold text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    Marouane Mahboub
                  </h1>
                  
                  {/* Verified Badge - Sized to match text (w-6 h-6) */}
                  <span className="text-cyan-400 animate-pulse">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>

                {/* Subtitle */}
                <div className="inline-block relative">
                   <div className="absolute -inset-1 bg-pink-500/20 blur-sm rounded-lg"></div>
                   <p className="relative font-mono text-pink-400 text-[10px] font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
                     Software Engineer • AI & LLM
                   </p>
                </div>

                {/* HUD Loading Bar */}
                <div className="flex flex-col items-center justify-center mt-2 gap-1">
                  <div className="flex gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-1 w-1 bg-cyan-500 transform -skew-x-12" 
                        style={{ 
                          animation: `pulse 1.5s infinite ${i * 0.05}s`,
                          opacity: 0.3 
                        }}
                      ></div>
                    ))}
                  </div>
                  {/* <span className="text-[9px] text-cyan-500/50 font-mono tracking-widest uppercase animate-pulse">
                    System Online
                  </span> */}
                </div>
              </div>
              
              <div className="flex gap-6 mt-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    onClick={(e) => handleLinkClick(e, social.name, social.url)}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
                    <div className="relative text-cyan-400 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12">
                      <social.icon className="w-7 h-7" />
                    </div>
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
                  className="group relative block cursor-pointer"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${link.gradient} rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-300 ${link.glow}`}></div>
                  <div className="relative flex items-center p-4 rounded-2xl bg-black border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden">
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <div className={`relative w-12 h-12 bg-white rounded-xl mr-4 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ${link.glow} shadow-lg overflow-hidden`}>
                      <img src={link.iconImg} alt={link.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="relative text-cyan-300 group-hover:text-white font-black text-lg flex-1 tracking-wide transition-colors duration-300">
                      {link.title}
                    </span>
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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
        className={`relative bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full border-2 border-cyan-500/50 transition-transform ${shake ? 'animate-shake' : ''}`} 
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-purple-500/50 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-purple-500/50 rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/50 rounded-br-2xl"></div>

        <div className="flex justify-end gap-2 mb-6">
          <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all duration-300 ${lang === 'en' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent shadow-lg shadow-cyan-500/50' : 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500'}`}>
            🇺🇸 EN
          </button>
          <button onClick={() => setLang('fr')} className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all duration-300 ${lang === 'fr' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent shadow-lg shadow-purple-500/50' : 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500'}`}>
            🇫🇷 FR
          </button>
          <button onClick={() => setLang('ar')} className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all duration-300 ${lang === 'ar' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent shadow-lg shadow-pink-500/50' : 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500'}`}>
            🇲🇦 AR
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/50 relative animate-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl blur-md opacity-50"></div>
            <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 tracking-wider">
            {UI_TEXT[lang].title}
          </h1>
          <p className="text-cyan-300/70 text-sm font-bold uppercase tracking-widest">{UI_TEXT[lang].sub}</p>
        </div>

        <div className="space-y-6">
          {[0, 1].map((index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-black/50 rounded-xl p-4 border-2 border-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-300">
                <div className="mb-3">
                  <label className="block text-[10px] uppercase font-black text-cyan-400 mb-2 tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      {index + 1}
                    </span>
                    {lang === 'ar' ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                  </label>
                  <select
                    value={selections[index]}
                    onChange={(e) => handleSelectionChange(index, e.target.value)}
                    className="w-full bg-black/50 text-sm font-bold text-cyan-300 outline-none border-2 border-cyan-500/30 rounded-lg p-2 cursor-pointer hover:border-cyan-500 transition-all duration-300"
                  >
                    {getAvailableQuestions(index).map((q) => (
                      <option key={q.id} value={q.id} className="bg-black">
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
                      w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-sm font-bold
                      ${inputStatus[index] === 'error' ? 'border-red-500 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/30' : 
                        inputStatus[index] === 'correct' ? 'border-green-500 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/30' : 
                        'border-cyan-500/30 bg-black/50 text-cyan-300 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/30'}
                    `}
                    placeholder={UI_TEXT[lang].placeholder}
                    autoComplete="off"
                  />
                  
                  <div className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3`}>
                     {inputStatus[index] === 'correct' && (
                       <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                     )}
                     {inputStatus[index] === 'error' && (
                       <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            disabled={true}
            className="relative w-full mt-6 group cursor-not-allowed"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 font-black py-4 px-6 rounded-xl border-2 border-gray-600 uppercase tracking-wider">
              {UI_TEXT[lang].unlock} (Auto)
            </div>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-10px) rotate(-2deg); }
          75% { transform: translateX(10px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 12s linear infinite;
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.5); }
        }
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: text-shimmer 4s ease-in-out infinite;
        }
      `}</style>
    </Background>
  );
}