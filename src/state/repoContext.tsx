import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { RepoState, GitAction } from '../types/repo';
import { repoReducer } from './repoReducer';
import { initialState } from './initialState';

type RepoContextValue = {
  state: RepoState;
  dispatch: (action: GitAction) => void;
};

const RepoContext = createContext<RepoContextValue | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(repoReducer, initialState);
  return (
    <RepoContext.Provider value={{ state, dispatch }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo(): RepoContextValue {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error('useRepo must be used inside <RepoProvider>');
  return ctx;
}
