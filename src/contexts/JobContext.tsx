import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LOCAL_KEY = 'jihye_job_strategy_v1';
const ADMIN_PASSWORD = 'Ejrqnftn1!';

export type Stage = 'planning' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  company: string;
  role: string;
  stage: Stage;
  appliedDate: string;
  notes?: string;
  salary?: string;
}

interface JobContextType {
  editMode: boolean;
  enterEdit: (pw: string) => boolean;
  exitEdit: () => void;
  applications: Application[];
  addApp: (app: Omit<Application, 'id'>) => void;
  updateApp: (id: string, app: Omit<Application, 'id'>) => void;
  deleteApp: (id: string) => void;
}

const JobContext = createContext<JobContextType | null>(null);

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be inside JobProvider');
  return ctx;
}

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.applications) {
          setApplications(parsed.applications);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  const saveToStorage = useCallback((items: Application[]) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ applications: items }));
    } catch {}
  }, []);

  const enterEdit = useCallback((pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      setEditMode(true);
      return true;
    }
    return false;
  }, []);

  const exitEdit = useCallback(() => setEditMode(false), []);

  const addApp = useCallback((app: Omit<Application, 'id'>) => {
    const newItem = { ...app, id: 'app_' + Date.now() };
    setApplications(prev => {
      const next = [...prev, newItem];
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const updateApp = useCallback((id: string, app: Omit<Application, 'id'>) => {
    setApplications(prev => {
      const next = prev.map(p => p.id === id ? { ...app, id } : p);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const deleteApp = useCallback((id: string) => {
    setApplications(prev => {
      const next = prev.filter(p => p.id !== id);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  if (!loaded) return null;

  return (
    <JobContext.Provider value={{
      editMode, enterEdit, exitEdit,
      applications, addApp, updateApp, deleteApp
    }}>
      {children}
    </JobContext.Provider>
  );
}
