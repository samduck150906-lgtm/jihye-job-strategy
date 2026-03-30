import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MailOpen, Heart, Stars, Mail } from 'lucide-react';

const LETTER_CONTENT = `지혜야 말만으로 응원한다고 하는게 아니라 내 일, 내 가족의 일처럼 응원하고 있어. 꼭 잘 되어야 할 필요가 있는건 아니니까 그냥 니가 어떨 때 행복한지를 알고 매일 행복했으면 좋겠어. 그리고, 이런 하루하루들이 과도기가 아니라 모두 의미 있는 시간들임을 알고 더 행복하길 바랄게.
-름이 드림`;

export function OwlLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenBigOwl, setHasSeenBigOwl] = useState(false);

  // Use localStorage so the big owl doesn't appear on every single component remount, 
  // but only on first visit (optional). Let's just use state so it runs once per page load.
  useEffect(() => {
    const seen = sessionStorage.getItem('seen_owl_letter');
    if (seen) setHasSeenBigOwl(true);
  }, []);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setHasSeenBigOwl(true);
    sessionStorage.setItem('seen_owl_letter', 'true');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseBigOwl = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasSeenBigOwl(true);
    sessionStorage.setItem('seen_owl_letter', 'true');
  };

  return (
    <>
      {/* 1. Flying Big Owl to Center (Initial) */}
      <AnimatePresence>
        {!hasSeenBigOwl && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -300, y: -200 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 300, transition: { duration: 0.5 } }}
            transition={{ type: "spring", stiffness: 50, damping: 15, duration: 2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              className="pointer-events-auto relative cursor-pointer group flex flex-col items-center"
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.05 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              <button 
                onClick={handleCloseBigOwl} 
                className="absolute -top-4 -right-4 w-8 h-8 bg-[#1a1412] border border-[#3d2b1f] rounded-full text-[#8b7355] hover:text-white flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-[50px] animate-pulse"></div>
              
              <div className="w-40 h-40 bg-[#1a1412] border-4 border-[#3d2b1f] rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.3)] relative overflow-hidden group-hover:border-[#ffd700] transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3d2b1f]/50 to-transparent"></div>
                <span className="text-[70px] relative z-10 filter drop-shadow-xl pl-2 pb-2">🦉</span>
                <span className="absolute bottom-4 right-6 text-3xl z-20 transform rotate-[-15deg] drop-shadow-2xl">💌</span>
              </div>
              
              <div className="mt-6">
                <span className="bg-[#1a1412] border border-[#ffd700]/50 text-yellow-200 text-sm sm:text-base px-6 py-2.5 rounded-full font-serif shadow-[0_0_20px_rgba(255,215,0,0.2)] flex items-center gap-2">
                  <Stars className="w-4 h-4 text-yellow-400" /> 
                  름이에게서 편지가 도착했습니다!
                  <Stars className="w-4 h-4 text-yellow-400" />
                </span>
                <div className="text-center mt-2 text-yellow-500/80 text-xs animate-bounce">
                  클릭해서 열어보기
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Small Bottom-Right Owl (After seeing the big one) */}
      <AnimatePresence>
        {hasSeenBigOwl && !isOpen && (
          <motion.button
            key="small-owl"
            className="fixed bottom-8 right-8 z-40 group focus:outline-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ 
              scale: { type: "spring", stiffness: 200, damping: 20 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={handleOpenLetter}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-yellow-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="w-14 h-14 bg-[#1a1412] border-2 border-[#3d2b1f] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden group-hover:border-[#ffd700]/60 transition-colors duration-500">
                <span className="text-2xl relative z-10 filter drop-shadow-md pb-1 pl-1">🦉</span>
                <span className="absolute bottom-1.5 right-1.5 text-base z-20 transform rotate-12">✉️</span>
              </div>
              
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="bg-[#1a1412] border border-[#3d2b1f] text-yellow-200/90 text-xs px-3 py-1.5 rounded-full font-serif shadow-lg flex items-center gap-1.5">
                  름이의 편지 <Mail className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 3. The Opened Letter Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#14100e] border shadow-2xl rounded-2xl w-full max-w-md shadow-[0_0_80px_rgba(255,215,0,0.1)] relative overflow-hidden"
              style={{ borderColor: '#5c4326 '}}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 opacity-60"></div>
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-[#8b7355] hover:text-yellow-400 transition-colors z-20 bg-[#1a1412] p-1.5 rounded-full border border-[#3d2b1f] hover:border-yellow-500/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-10 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10 pointer-events-none"></div>
                
                <div className="flex justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-[30px] rounded-full"></div>
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <MailOpen className="w-10 h-10 text-yellow-400 relative z-10 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  </motion.div>
                </div>
                
                <div className="px-6 py-8 bg-gradient-to-b from-[#1f1816] to-[#14100e] rounded-xl border border-[#3d2b1f]/60 relative group shadow-inner">
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-3 -left-3 text-2xl opacity-40 text-yellow-300 drop-shadow-md"
                  >
                    ✨
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-3 -right-3 text-2xl opacity-40 text-yellow-300 drop-shadow-md"
                  >
                    🌟
                  </motion.div>
                  
                  <p className="text-[#eaddce] font-serif leading-[2.2] text-[15px] sm:text-[16px] whitespace-pre-wrap relative z-10 tracking-[0.02em] font-medium break-keep">
                    {LETTER_CONTENT}
                  </p>
                  
                  <div className="mt-8 flex justify-end items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-5 h-5 fill-red-500/80 text-red-500/80 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
