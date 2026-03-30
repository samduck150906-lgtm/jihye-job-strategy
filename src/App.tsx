import React, { useState } from 'react';
import { LayoutDashboard, KanbanSquare, CalendarDays, Rocket, Target, Send, CheckCircle2, XCircle, TrendingUp, Search, Plus, Bell, UserCircle2, Lock, Unlock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useJobs, type Stage } from './contexts/JobContext';
import { AppModal } from './components/AppModal';
import { CalendarView } from './components/CalendarView';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGES: { id: Stage; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'planning', label: '전략 수립 (Planning)', color: 'border-slate-500', icon: <Target className="w-4 h-4 text-slate-400" /> },
  { id: 'applied', label: '100개 돌려막기 (Applied)', color: 'border-primary', icon: <Send className="w-4 h-4 text-blue-400" /> },
  { id: 'interview', label: '면접/과제 (Interview)', color: 'border-accent', icon: <TrendingUp className="w-4 h-4 text-purple-400" /> },
  { id: 'offer', label: '합격 (Offered)', color: 'border-green-500', icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
  { id: 'rejected', label: '쿨하게 탈락 (Rejected)', color: 'border-red-500', icon: <XCircle className="w-4 h-4 text-red-400" /> },
];

export default function App() {
  const { applications, editMode, enterEdit, exitEdit, deleteApp } = useJobs();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'board' | 'calendar'>('board');
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.stage === 'applied' || a.stage === 'interview' || a.stage === 'offer' || a.stage === 'rejected').length,
    interviews: applications.filter(a => a.stage === 'interview').length,
    offers: applications.filter(a => a.stage === 'offer').length,
    successRate: applications.filter(a => a.stage !== 'planning').length > 0 
        ? Math.round((applications.filter(a => a.stage === 'offer').length / applications.filter(a => a.stage !== 'planning').length) * 100) 
        : 0
  };

  const filteredApps = applications.filter(a => 
    a.company.toLowerCase().includes(search.toLowerCase()) || 
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    (a.notes && a.notes.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAuth = () => {
    if (editMode) {
      exitEdit();
    } else {
      const pw = prompt('비밀번호를 입력하세요 (Enter Password):');
      if (pw) {
        if (!enterEdit(pw)) {
          alert('비밀번호가 틀렸습니다.');
        }
      }
    }
  };

  const openAddModal = () => {
    if (!editMode) return alert('편집 모드로 먼저 로그인 해주세요!');
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editMode) return;
    setEditId(id);
    setModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editMode) return;
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      deleteApp(id);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060606] text-slate-200 font-sans selection:bg-primary/30">
      
      <AppModal open={modalOpen} onClose={() => setModalOpen(false)} editId={editId} />

      {/* SIDEBAR */}
      <aside className="w-72 border-r border-[#1f1f1f] bg-[#0a0a0a] flex flex-col p-4 z-10 sticky top-0 h-screen">
        <div className="flex items-start gap-3 mb-10 px-2 mt-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 mt-1">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
            지혜의 취준<br/>
            <span className="text-primary/90">근데 전략적사고를 곁들인</span>
          </h1>
        </div>

        <nav className="space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="대시보드 (Dashboard)" />
          <NavItem active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<KanbanSquare size={18} />} label="칸반 보드 (Board)" />
          <NavItem active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<CalendarDays size={18} />} label="일정 관리 (Calendar)" />
        </nav>

        <div className="mt-auto px-4 py-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-[#222]">
          <div className="text-xs text-textDim mb-1 font-medium">현재 합격률 (Success Rate)</div>
          <div className="text-2xl font-bold text-white mb-2">{stats.successRate}%</div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${stats.successRate}%` }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full" 
            />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden bg-[#060606]">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center bg-[#141414] border border-[#222] rounded-full px-4 py-1.5 w-80 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-textDim mr-2" />
            <input 
              type="text" 
              placeholder="기업명, 직무 검색..." 
              className="bg-transparent border-none outline-none text-sm w-full text-text placeholder:text-textDim/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleAuth} className="text-textDim hover:text-white transition-colors relative" title="Edit Mode">
              {editMode ? <Unlock className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-slate-500" />}
            </button>
            <button className="text-textDim hover:text-white transition-colors relative hidden sm:block">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-[#222]">
              <div className="text-sm font-medium text-white hidden sm:block">지혜 (Jihye)</div>
              <UserCircle2 className="w-6 h-6 text-textDim" />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <StatCard title="전체 기획 (Total)" value={stats.total} icon={<Target className="text-slate-400" />} />
                  <StatCard title="지원 완료 (Applied)" value={stats.applied} icon={<Send className="text-blue-400" />} delay={0.1} />
                  <StatCard title="면접 대기 (Interviews)" value={stats.interviews} icon={<TrendingUp className="text-purple-400" />} delay={0.2} />
                  <StatCard title="최종 합격 (Offers)" value={stats.offers} icon={<CheckCircle2 className="text-green-400" />} highlight delay={0.3} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">주간 지원 현황 (돌려막기 트래커)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2 pb-4 border-b border-[#222]">
                      {[4, 12, 8, 15, 22, 5, 18].map((v, i) => (
                        <div key={i} className="w-full bg-[#1a1a1a] rounded-t-sm flex flex-col justify-end group">
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${(v/25)*100}%` }}
                            transition={{ duration: 0.8, delay: i*0.1 }}
                            className="w-full bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-md group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-textDim px-2">
                       <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 overflow-y-auto max-h-[380px] custom-scrollbar">
                    <h3 className="font-semibold text-white mb-4">최근 액션 (Recent Actions)</h3>
                    {filteredApps.length === 0 ? (
                       <p className="text-sm text-textDim italic">새로운 지원 내역이 없습니다.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredApps.slice(0, 10).map((app) => (
                          <div key={app.id} className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full", STAGES.find(s=>s.id===app.stage)?.color.replace('border-', 'bg-') || 'bg-slate-500')} />
                            <div>
                              <div className="text-sm text-white font-medium">{app.company}</div>
                              <div className="text-xs text-textDim">{STAGES.find(s=>s.id===app.stage)?.label.split(' ')[0]} • {app.appliedDate || 'No date'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'board' && (
              <motion.div key="board" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">지원 현황 칸반 (Pipeline)</h2>
                    <p className="text-sm text-textDim mt-1">100개 지원 가보자고. 전략적으로 드랍하고 붙기.</p>
                  </div>
                  <button 
                    onClick={openAddModal}
                    className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <Plus size={16} /> 새 지원처 추가
                  </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar h-full min-h-[500px]">
                  {STAGES.map(stage => {
                    const stageApps = filteredApps.filter(a => a.stage === stage.id);
                    return (
                      <div key={stage.id} className="flex-1 min-w-[280px] flex flex-col max-w-[320px]">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            {stage.icon}
                            <h3 className="font-medium text-[13px] text-white break-words">{stage.label}</h3>
                          </div>
                          <span className="text-xs font-semibold bg-[#2a2a2a] text-text rounded-full px-2 py-0.5 min-w-[20px] text-center border border-[#333]">
                            {stageApps.length}
                          </span>
                        </div>
                        
                        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-2 flex-1 overflow-y-auto space-y-2">
                          <AnimatePresence>
                            {stageApps.map(app => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={app.id} 
                                className="bg-[#141414] border border-[#222] p-3 rounded-lg hover:border-[#333] transition-colors cursor-pointer group relative"
                                onClick={(e) => openEditModal(app.id, e)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-white text-sm leading-snug">{app.company}</h4>
                                  {editMode && (
                                    <button 
                                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300 p-1 bg-[#222] rounded-md"
                                      onClick={(e) => handleDelete(app.id, e)}
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </div>
                                <div className="text-[13px] text-primary/90 font-medium mb-3">{app.role}</div>
                                {app.appliedDate && (
                                  <div className="text-xs text-textDim flex items-center gap-1.5 mb-2 bg-[#0a0a0a] w-fit px-2 py-1 rounded border border-[#1a1a1a]">
                                    <CalendarDays size={12} /> {app.appliedDate}
                                  </div>
                                )}
                                {app.notes && (
                                  <div className="text-[11px] text-textDim border-l-2 border-[#333] pl-2 mt-2 leading-relaxed h-auto whitespace-pre-line">
                                    {app.notes}
                                  </div>
                                )}
                                
                                {editMode && (
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    클릭하여 수정
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {stageApps.length === 0 && (
                            <div className="h-24 flex items-center justify-center text-xs text-[#444] border border-dashed border-[#222] rounded-lg m-1">
                              비어있음 (Empty)
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div key="calendar" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full">
                <CalendarView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTS ---
function NavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
        active ? "bg-primary/10 text-primary border border-primary/20" : "text-textDim hover:bg-[#141414] hover:text-white border border-transparent"
      )}
    >
      <span className={cn("transition-colors", active ? "text-primary" : "text-[#555] group-hover:text-textDim")}>{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, highlight, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-5 rounded-xl border relative overflow-hidden",
        highlight ? "bg-gradient-to-br from-[#1a2e1f] to-[#0a0a0a] border-green-500/20" : "bg-[#0a0a0a] border-[#1f1f1f]"
      )}
    >
      {highlight && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-[40px] rounded-full pointer-events-none" />
      )}
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium text-textDim mb-1">{title}</div>
        <div className="p-2 rounded-lg bg-[#141414] border border-[#222]">
          {icon}
        </div>
      </div>
      <div className={cn("text-3xl font-bold mt-2", highlight ? "text-green-400" : "text-white")}>{value}</div>
    </motion.div>
  );
}
