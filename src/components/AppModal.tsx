import { useState, useEffect } from 'react';
import { useJobs, type Stage } from '../contexts/JobContext';
import { X } from 'lucide-react';

const STAGES: { id: Stage; label: string }[] = [
  { id: 'planning', label: '전략 수립 (Planning)' },
  { id: 'applied', label: '100개 돌려막기 (Applied)' },
  { id: 'interview', label: '면접/과제 (Interview)' },
  { id: 'offer', label: '합격 (Offered)' },
  { id: 'rejected', label: '쿨하게 탈락 (Rejected)' },
];

export function AppModal({ open, onClose, editId }: { open: boolean, onClose: () => void, editId: string | null }) {
  const { applications, addApp, updateApp } = useJobs();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState<Stage>('planning');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    if (open && editId) {
      const existing = applications.find(a => a.id === editId);
      if (existing) {
        setCompany(existing.company);
        setRole(existing.role);
        setStage(existing.stage);
        setAppliedDate(existing.appliedDate || '');
        setNotes(existing.notes || '');
        setSalary(existing.salary || '');
      }
    } else if (open) {
      setCompany('');
      setRole('');
      setStage('planning');
      setAppliedDate('');
      setNotes('');
      setSalary('');
    }
  }, [open, editId, applications]);

  if (!open) return null;

  const handleSave = () => {
    if (!company.trim() || !role.trim()) {
      alert('기업명과 직무를 입력해주세요.');
      return;
    }
    const data = {
      company: company.trim(),
      role: role.trim(),
      stage,
      appliedDate: appliedDate.trim(),
      notes: notes.trim(),
      salary: salary.trim()
    };
    if (editId) {
      updateApp(editId, data);
    } else {
      addApp(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-[#222] rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">{editId ? '지원 내역 수정' : '새 지원처 추가'}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">기업명</label>
            <input value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="예: 토스" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">직무</label>
            <input value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="예: PM / 서비스 기획" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">상태</label>
            <select value={stage} onChange={e => setStage(e.target.value as Stage)} className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary">
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">지원일/일정</label>
            <input type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">메모 (진행 상황, 과제 등)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" placeholder="서류 합격 기원..." />
          </div>
          <div className="pt-2 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#333] text-slate-300 hover:bg-[#222] transition-colors">취소</button>
            <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">{editId ? '수정하기' : '추가하기'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
