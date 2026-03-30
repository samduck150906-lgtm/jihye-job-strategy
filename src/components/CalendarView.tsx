import { useState } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, parseISO 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useJobs, type Stage } from '../contexts/JobContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGE_COLORS: Record<Stage, string> = {
  planning: 'bg-slate-500',
  applied: 'bg-blue-500',
  interview: 'bg-purple-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500'
};

export function CalendarView() {
  const { applications } = useJobs();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  // Weekday headers
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 h-full flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
          <button 
            onClick={today}
            className="text-xs font-medium text-textDim bg-[#141414] hover:bg-[#1f1f1f] border border-[#222] px-2 py-1 rounded transition-colors"
          >
            오늘
          </button>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#141414] text-textDim hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#141414] text-textDim hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day, i) => (
            <div 
              key={day} 
              className={cn(
                "text-center text-xs font-medium py-2",
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-textDim"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 gap-px bg-[#1f1f1f] flex-1 border border-[#1f1f1f] border-b-0 rounded-lg overflow-hidden">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);
            const isSunday = day.getDay() === 0;

            // Find apps for this day
            const dayApps = applications.filter(app => {
              if (!app.appliedDate) return false;
              try {
                return isSameDay(parseISO(app.appliedDate), day);
              } catch (e) {
                return false;
              }
            });

            return (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "bg-[#0a0a0a] p-2 min-h-[90px] border-b border-[#1f1f1f]",
                  !isCurrentMonth && "bg-[#060606] opacity-40"
                )}
              >
                <div className="flex justify-between items-start mb-1 h-6">
                  <span className={cn(
                    "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isDayToday ? "bg-primary text-white" : 
                    isSunday ? "text-red-400/80" : "text-slate-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayApps.map(app => (
                    <div 
                      key={app.id} 
                      className="flex items-center gap-1.5 truncate text-[11px] font-medium leading-none px-1.5 py-1 rounded bg-[#141414] border border-[#222]"
                      title={`${app.company} - ${app.role}`}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", STAGE_COLORS[app.stage] || 'bg-slate-500')} />
                      <span className="text-slate-200 truncate">{app.company}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
