
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from './types';
import { COMPLIMENTS, MEMORIES, REASONS, ROMANTIC_POEM, WISHES, LETTERS } from './constants';
import HeartBackground from './components/HeartBackground';
import SparkleCursor from './components/SparkleCursor';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.START);
  const [currentComplimentIndex, setCurrentComplimentIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isNoButtonMoved, setIsNoButtonMoved] = useState(false);
  const [revealedReasons, setRevealedReasons] = useState<number[]>([]);
  const [revealedWishes, setRevealedWishes] = useState<number[]>([]);
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state === AppState.PROPOSAL_LOADING) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setState(AppState.PROPOSAL);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(err => console.log("Autoplay blocked, waiting for interaction", err));
    }
  };

  const nextStep = () => {
    if (state === AppState.START) {
      startMusic();
    }

    switch (state) {
      case AppState.START: setState(AppState.COMPLIMENTS); break;
      case AppState.COMPLIMENTS:
        if (currentComplimentIndex < COMPLIMENTS.length - 1) {
          setCurrentComplimentIndex(prev => prev + 1);
        } else {
          setState(AppState.REASONS);
        }
        break;
      case AppState.REASONS: setState(AppState.MEMORIES); break;
      case AppState.MEMORIES: setState(AppState.WISHES); break;
      case AppState.WISHES: setState(AppState.LETTERS); break;
      case AppState.LETTERS: setState(AppState.POEM); break;
      case AppState.POEM: setState(AppState.PROPOSAL_LOADING); break;
    }
  };

  const moveNoButton = () => {
    const newX = Math.random() * (window.innerWidth - 150);
    const newY = Math.random() * (window.innerHeight - 80);
    setNoButtonPos({ x: newX, y: newY });
    setIsNoButtonMoved(true);
  };

  const toggleReason = (index: number) => {
    if (!revealedReasons.includes(index)) {
      setRevealedReasons([...revealedReasons, index]);
    }
  };

  const toggleWish = (id: number) => {
    if (!revealedWishes.includes(id)) {
      setRevealedWishes([...revealedWishes, id]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-rose-50 text-rose-900 selection:bg-rose-200">
      <HeartBackground />
      <SparkleCursor />
      
      <audio 
        ref={audioRef} 
        src="Heavenly - Cigarettes After Sex.mp3" 
        loop 
      />

      <button 
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 p-3 bg-white/40 backdrop-blur-md rounded-full shadow-lg text-rose-500 hover:bg-rose-100 transition-all active:scale-90"
      >
        {isMuted ? '🔇' : '🎵'}
      </button>

      <main className="z-10 w-full max-w-4xl text-center space-y-8 py-10">
        
        {state === AppState.START && (
          <div className="fade-in space-y-8">
            <div className="relative inline-block group">
               <div className="absolute inset-0 animate-ping bg-rose-200 rounded-full opacity-30"></div>
               <h1 className="text-7xl md:text-9xl font-romantic text-rose-600 relative transition-transform group-hover:scale-105">Danya</h1>
            </div>
            <p className="text-2xl md:text-3xl font-light italic text-rose-400">Every moment leads me back to you.</p>
            <button
              onClick={nextStep}
              className="mt-8 px-12 py-5 bg-rose-500 text-white rounded-full font-bold shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:bg-rose-600 transition-all hover:scale-110 active:scale-95 group"
            >
              Begin Our Story <span className="group-hover:translate-x-2 inline-block transition-transform ml-2">💖</span>
            </button>
          </div>
        )}

        {state === AppState.COMPLIMENTS && (
          <div className="fade-in space-y-10 bg-white/40 backdrop-blur-md p-12 rounded-[4rem] shadow-2xl border border-white/60">
            <div className="text-8xl mb-4 animate-bounce duration-[2000ms]">{COMPLIMENTS[currentComplimentIndex].emoji}</div>
            <h2 className="text-4xl md:text-6xl font-serif-elegant italic leading-tight text-rose-800 drop-shadow-sm">
              "{COMPLIMENTS[currentComplimentIndex].text}"
            </h2>
            <div className="flex justify-center gap-4">
              {COMPLIMENTS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 w-3 rounded-full transition-all duration-700 ${i === currentComplimentIndex ? 'bg-rose-500 w-12 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-rose-200'}`}
                />
              ))}
            </div>
            <button
              onClick={nextStep}
              className="px-12 py-4 bg-rose-500 text-white rounded-full font-semibold shadow-lg hover:bg-rose-600 transition-all active:scale-95"
            >
              {currentComplimentIndex === COMPLIMENTS.length - 1 ? "There is so much more..." : "Tell me more"}
            </button>
          </div>
        )}

        {state === AppState.REASONS && (
          <div className="fade-in space-y-10">
            <h2 className="text-5xl font-romantic text-rose-600">The small things that made me fall...</h2>
            <p className="text-rose-400 italic text-xl">Click the hearts to see what's inside</p>
            <div className="flex flex-wrap justify-center gap-5 max-w-2xl mx-auto">
              {REASONS.map((reason, i) => (
                <button
                  key={i}
                  onClick={() => toggleReason(i)}
                  className={`p-5 rounded-[2rem] transition-all duration-700 transform hover:scale-110 ${
                    revealedReasons.includes(i) 
                    ? 'bg-rose-500 text-white shadow-2xl scale-105' 
                    : 'bg-white/70 text-rose-300 border-2 border-dashed border-rose-200 hover:border-rose-400'
                  }`}
                >
                  {revealedReasons.includes(i) ? reason : "❤️ Unveil"}
                </button>
              ))}
            </div>
            {revealedReasons.length >= 4 && (
              <button
                onClick={nextStep}
                className="mt-10 px-10 py-4 bg-rose-400 text-white rounded-full font-semibold hover:bg-rose-500 transition-all shadow-lg animate-pulse"
              >
                Journey through our time →
              </button>
            )}
          </div>
        )}

        {state === AppState.MEMORIES && (
          <div className="fade-in space-y-14 max-w-2xl mx-auto">
            <h2 className="text-6xl font-romantic text-rose-600">Our Timeline</h2>
            <div className="space-y-12 text-left relative px-4">
              <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-gradient-to-b from-rose-200 via-rose-400 to-rose-200 rounded-full opacity-50"></div>
              {MEMORIES.map((m, i) => (
                <div key={i} className="flex items-start gap-8 relative group">
                  <div className="z-10 bg-white border-4 border-rose-400 rounded-full p-4 text-3xl shadow-xl transition-transform group-hover:scale-125">
                    {m.icon}
                  </div>
                  <div className="pt-2 bg-white/30 backdrop-blur-sm p-6 rounded-3xl border border-white/50 flex-1 hover:bg-white/50 transition-colors shadow-sm">
                    <h3 className="font-bold text-rose-600 text-2xl mb-1">{m.title}</h3>
                    <p className="text-rose-800 opacity-90 leading-relaxed text-lg">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={nextStep}
              className="px-12 py-5 bg-rose-500 text-white rounded-full font-semibold shadow-xl hover:bg-rose-600 transition-all"
            >
              To our future...
            </button>
          </div>
        )}

        {state === AppState.WISHES && (
          <div className="fade-in space-y-10">
            <h2 className="text-5xl font-romantic text-rose-600 italic">Wishes for Us</h2>
            <p className="text-rose-400 text-xl">Floating dreams of our life together</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {WISHES.map((wish) => (
                <button
                  key={wish.id}
                  onClick={() => toggleWish(wish.id)}
                  className={`p-8 rounded-[2.5rem] transition-all duration-1000 flex items-center gap-6 ${
                    revealedWishes.includes(wish.id)
                    ? 'bg-white shadow-2xl border-2 border-rose-300 transform scale-105'
                    : 'bg-rose-100/40 border-2 border-transparent hover:bg-rose-200/50'
                  }`}
                >
                  <span className={`text-4xl transition-transform duration-1000 ${revealedWishes.includes(wish.id) ? 'rotate-[360deg]' : ''}`}>
                    {wish.icon}
                  </span>
                  <span className={`text-xl font-medium text-left ${revealedWishes.includes(wish.id) ? 'text-rose-800' : 'text-rose-300'}`}>
                    {revealedWishes.includes(wish.id) ? wish.text : "A wish for tomorrow..."}
                  </span>
                </button>
              ))}
            </div>
            {revealedWishes.length >= 3 && (
              <button onClick={nextStep} className="mt-8 px-12 py-4 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all">
                The Letters for You →
              </button>
            )}
          </div>
        )}

        {state === AppState.LETTERS && (
          <div className="fade-in space-y-12">
            <h2 className="text-5xl font-romantic text-rose-600">Hidden Notes</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {LETTERS.map((letter) => (
                <div key={letter.id} className="relative group">
                  <button
                    onClick={() => setActiveLetter(activeLetter === letter.id ? null : letter.id)}
                    className={`w-64 h-40 rounded-xl transition-all duration-700 flex items-center justify-center border-2 ${
                      activeLetter === letter.id 
                      ? 'bg-white border-rose-500 shadow-2xl -translate-y-4 rotate-1' 
                      : 'bg-rose-100 border-rose-200 hover:border-rose-400'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">{activeLetter === letter.id ? "📂" : "✉️"}</span>
                      <p className="font-serif-elegant italic text-rose-700">{letter.title}</p>
                    </div>
                  </button>
                  {activeLetter === letter.id && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white p-8 rounded-2xl shadow-2xl border border-rose-100 z-20 fade-in text-left">
                      <p className="text-lg font-serif-elegant italic leading-relaxed text-rose-900">
                        {letter.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-12">
              <button onClick={nextStep} className="px-12 py-5 bg-rose-500 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all">
                The Final Verse
              </button>
            </div>
          </div>
        )}

        {state === AppState.POEM && (
          <div className="fade-in space-y-10 max-w-xl mx-auto bg-white/60 backdrop-blur-xl p-14 rounded-[4rem] border-2 border-white/80 shadow-[0_20px_60px_rgba(244,63,94,0.2)] relative">
            <div className="absolute -top-10 -right-10 text-8xl opacity-10 animate-pulse">🕯️</div>
            <h3 className="text-4xl font-romantic text-rose-500 italic mb-6">For My Everything</h3>
            <p className="text-3xl md:text-4xl font-serif-elegant italic whitespace-pre-line leading-relaxed text-rose-950 drop-shadow-sm tracking-wide">
              {ROMANTIC_POEM}
            </p>
            <button
              onClick={nextStep}
              className="mt-10 px-12 py-5 bg-rose-600 text-white rounded-full font-bold shadow-2xl hover:bg-rose-700 transition-all hover:scale-110 active:scale-95"
            >
              Continue, My Heart ❤️
            </button>
          </div>
        )}

        {state === AppState.PROPOSAL_LOADING && (
          <div className="fade-in space-y-10 max-w-lg mx-auto">
            <h2 className="text-4xl font-romantic text-rose-500 mb-4">Searching for the perfect moment...</h2>
            <div className="w-full bg-white h-6 rounded-full overflow-hidden shadow-inner border-2 border-rose-100 p-1">
              <div 
                className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(244,63,94,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-rose-500 font-bold text-2xl tracking-widest">{progress}% Pure Love</p>
          </div>
        )}

        {state === AppState.PROPOSAL && (
          <div className="fade-in space-y-16">
            <div className="relative inline-block scale-150 mb-12">
              <span className="text-9xl animate-pulse">💍</span>
              <div className="absolute -inset-4 bg-rose-300/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-7xl md:text-9xl font-romantic text-rose-600 leading-tight drop-shadow-2xl">
              Danya, will you be my Valentine?
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-20">
              <button
                onClick={() => setState(AppState.ACCEPTED)}
                className="px-20 py-8 bg-rose-600 text-white text-4xl font-black rounded-full shadow-[0_15px_50px_rgba(225,29,72,0.5)] hover:bg-rose-700 hover:scale-125 transition-all active:scale-90 z-20 group relative overflow-hidden"
              >
                <span className="relative z-10">YES! 💖</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
              
              <button
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                style={isNoButtonMoved ? {
                  position: 'fixed',
                  left: noButtonPos.x,
                  top: noButtonPos.y,
                  transition: 'all 0.1s ease-out'
                } : {}}
                className="px-10 py-4 bg-gray-100 text-gray-400 text-xl font-medium rounded-full hover:bg-gray-200 transition-all opacity-60 italic"
              >
                No
              </button>
            </div>
          </div>
        )}

        {state === AppState.ACCEPTED && (
          <div className="fade-in space-y-12 py-16 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-32 pointer-events-none opacity-50 scale-[2]">
               <div className="text-9xl animate-spin-slow">💎</div>
             </div>
            <h1 className="text-8xl md:text-[10rem] font-romantic text-rose-600 animate-bounce tracking-tight">I'm Yours Forever!</h1>
            <p className="text-4xl md:text-5xl font-serif-elegant italic text-rose-800 max-w-2xl mx-auto leading-tight">
              Danya, you've made me the happiest person in existence.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-24">
              <div className="p-12 bg-white/70 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white transform hover:-rotate-1 transition-transform">
                <p className="text-2xl text-rose-500 font-black mb-6 uppercase tracking-[0.2em] border-b-2 border-rose-100 pb-4">Our Celebration</p>
                <ul className="text-3xl space-y-6 font-romantic text-rose-900">
                  <li className="flex items-center gap-4">✨ <span>A magical evening for us</span></li>
                  <li className="flex items-center gap-4">🍷 <span>Toasts to our journey</span></li>
                  <li className="flex items-center gap-4">❤️ <span>A lifetime of us</span></li>
                </ul>
              </div>
              <div className="p-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-[3.5rem] shadow-2xl transform hover:rotate-1 transition-transform">
                <p className="text-2xl font-black mb-6 uppercase tracking-[0.2em] border-b-2 border-rose-400 pb-4">Rozh's Promise</p>
                <p className="text-3xl font-serif-elegant italic leading-relaxed">
                  "I promise to always be your safe harbor, to listen when you need to speak, and to love you more with every heartbeat."
                </p>
              </div>
            </div>

            <div className="pt-32">
              <p className="text-rose-400 font-romantic text-7xl animate-pulse tracking-widest drop-shadow-md">You are my whole world.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 text-rose-300 text-xs font-bold z-10 tracking-[0.3em] uppercase opacity-70">
        Created with infinite love by <span className="text-rose-500">Rozh</span> for his everything
      </footer>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
