import { useState, useEffect } from 'react';

// Import your icons from assets folder
import goodreadsIcon from './assets/goodreads.png';
import malIcon from './assets/myanimelist.png';
import backloggdIcon from './assets/backloggd.png';
import letterboxdIcon from './assets/letterboxd.png';
import serializedIcon from './assets/serializd.png';
import musashiProfile from './assets/musashi.jpg'

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password - will hash later
  const correctPassword = 'fatiha';
  
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/marwane_m7b', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'GitHub', url: 'https://github.com/marouane-m7b', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/m7b/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
  ];

  const links = [
    { title: 'Books', url: 'https://www.goodreads.com/marouane_m7b', bgColor: 'bg-amber-100', textColor: 'text-amber-900', iconBg: 'bg-white', iconImg: goodreadsIcon },
    { title: 'Anime & Manga', url: 'https://myanimelist.net/profile/marouane_m7b', bgColor: 'bg-blue-100', textColor: 'text-blue-900', iconBg: 'bg-white', iconImg: malIcon },
    { title: 'Games', url: 'https://backloggd.com/u/marouane_m7b/games', bgColor: 'bg-gray-100', textColor: 'text-gray-900', iconBg: 'bg-white', iconImg: backloggdIcon },
    { title: 'Movies', url: 'https://boxd.it/c4xHT', bgColor: 'bg-orange-100', textColor: 'text-orange-900', iconBg: 'bg-white', iconImg: letterboxdIcon },
    { title: 'TV Shows', url: 'https://www.serializd.com/user/marouane_m7b/diary', bgColor: 'bg-teal-100', textColor: 'text-teal-900', iconBg: 'bg-white', iconImg: serializedIcon }
  ];
  
  // Load attempts and lock status from localStorage on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockUntil = localStorage.getItem('lockUntil');
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockUntil) {
      const lockUntil = parseInt(storedLockUntil);
      const now = Date.now();
      
      if (lockUntil > now) {
        setIsLocked(true);
        setLockTimer(Math.ceil((lockUntil - now) / 1000));
      } else {
        // Lock expired, clear it
        localStorage.removeItem('lockUntil');
        localStorage.removeItem('loginAttempts');
        setAttempts(0);
      }
    }
  }, []);

  // Handle lock timer countdown
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            localStorage.removeItem('lockUntil');
            localStorage.removeItem('loginAttempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleSubmit = () => {
    if (isLocked) return;

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    // Case-insensitive comparison
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setIsAuthenticated(true);
      // Clear attempts on successful login
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockUntil');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= 3) {
        const lockUntil = Date.now() + (30 * 1000); // 30 seconds from now
        localStorage.setItem('lockUntil', lockUntil.toString());
        setError('Too many attempts. Please wait 30 seconds.');
        setIsLocked(true);
        setLockTimer(30);
        setPassword('');
      } else {
        setError(`Incorrect password. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`);
        setPassword('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                <img 
                  src={musashiProfile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Marouane Mahboub</h1>
              <p className="text-gray-600 text-sm mb-4">Welcome</p>
              
              <div className="flex justify-center gap-4 mb-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${link.bgColor} rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
                >
                  <div className={`${link.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden`}>
                    <img src={link.iconImg} alt={link.title} className="w-10 h-10 object-contain p-0 m-0" />
                  </div>
                  <span className={`${link.textColor} font-semibold flex-1 text-left`}>{link.title}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h1>
          <p className="text-gray-600 text-sm">Enter the password to continue</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              disabled={isLocked}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter password"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm text-center">
              Locked for {lockTimer} second{lockTimer !== 1 ? 's' : ''}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLocked}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? 'Locked' : 'Continue'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Attempts: {attempts}/3
          </p>
        </div>
      </div>
    </div>
  );
}