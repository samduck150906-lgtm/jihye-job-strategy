import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, MailOpen, Heart, Stars } from 'lucide-react';

const LETTER_PASSWORD = 'Ejrqnftn1!';
const LETTER_CONTENT = `지혜야 말만으로 응원한다고 하는게 아니라 내 일, 내 가족의 일처럼 응원하고 있어. 꼭 잘 되어야 할 필요가 있는건 아니니까 그냥 니가 어떨 때 행복한지를 알고 매일 행복했으면 좋겠어. 그리고, 이런 하루하루들이 과도기가 아니라 모두 의미 있는 시간들임을 알고 더 행복하길 바랄게.
-름이 드림`;

export function OwlLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsUnlocked(false);
      setPassword('');
      setError(false);
    }, 300);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === LETTER_PASSWORD) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 z-40 group focus:outline-none"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
        onClick={handleOpen}
      >
        <div className="relative">
          {/* Sparkles effect */}
          <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="w-16 h-16 bg-[#1a1412] border-2 border-[#3d2b1f] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.15)] relative overflow-hidden group-hover:border-[#ffd700] transition-colors duration-500">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3d2b1f]/50 to-transparent"></div>
            
            <span className="text-3xl relative z-10 filter drop-shadow-md pb-1 pl-1">🦉</span>
            <span className="absolute bottom-2 right-2 text-xl z-20 transform rotate-12 drop-shadow-lg">✉️</span>
          </div>
          
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="bg-[#1a1412] border border-[#3d2b1f] text-yellow-200/90 text-xs px-3 py-1.5 rounded-full font-serif shadow-lg flex items-center gap-1.5">
              <Stars className="w-3 h-3" /> 름이에게 온 편지
            </span>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#14100e] border border-[#3d2b1f] rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(255,215,0,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 opacity-50"></div>
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-[#8b7355] hover:text-yellow-400 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {!isUnlocked ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-[#1a1412] rounded-full border border-[#3d2b1f] flex items-center justify-center mb-6 shadow-inner">
                    <Lock className="w-6 h-6 text-[#8b7355]" />
                  </div>
                  <h3 className="text-xl font-serif text-yellow-500/90 mb-2">마법의 편지 봉인</h3>
                  <p className="text-sm text-[#8b7355] mb-8 leading-relaxed">
                    부엉이가 물고 온 이 편지는 특별한 마법으로 묶여있습니다.<br/>
                    오직 주인만이 열어볼 수 있습니다.
                  </p>
                  
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        autoFocus
                        className={`w-full bg-[#0a0807] border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[#3d2b1f] focus:border-yellow-600/50'} rounded-lg px-4 py-3 text-center text-yellow-100 placeholder:text-[#5c4b37] focus:outline-none transition-colors tracking-widest font-mono text-sm shadow-inner`}
                      />
                      {error && (
                        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="absolute -bottom-6 left-0 w-full text-xs text-red-400">
                          올바르지 않은 주문입니다.
                        </motion.p>
                      )}
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#2c1f16] to-[#3d2b1f] hover:from-[#3d2b1f] hover:to-[#4a3525] border border-[#5c4b37] text-yellow-500/90 py-3 rounded-lg font-medium transition-all shadow-lg active:scale-[0.98]"
                    >
                      봉인 해제하기
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="p-8 relative"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10 pointer-events-none"></div>
                  
                  <div className="flex justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"></div>
                    <MailOpen className="w-8 h-8 text-yellow-500 relative z-10" />
                  </div>
                  
                  <div className="p-6 bg-[#1a1412] rounded-xl border border-[#3d2b1f] relative group">
                    <div className="absolute -top-3 -left-3 text-3xl opacity-20 group-hover:opacity-40 transition-opacity transform -rotate-12 duration-500">✨</div>
                    <div className="absolute -bottom-3 -right-3 text-3xl opacity-20 group-hover:opacity-40 transition-opacity transform rotate-12 duration-500">🌟</div>
                    
                    <p className="text-yellow-100/90 font-serif leading-loose text-sm sm:text-base whitespace-pre-wrap relative z-10">
                      {LETTER_CONTENT}
                    </p>
                    
                    <div className="mt-8 flex justify-end items-center gap-2 text-yellow-600/80">
                      <Heart className="w-4 h-4 fill-yellow-600/80" />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
