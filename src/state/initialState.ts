import type { RepoState } from '../types/repo';

export const initialState: RepoState = {
  commits: {},
  branches: {},
  tags: {},
  HEAD: { type: 'branch', name: 'main' },
  index: {},
  workingDir: {},
  remotes: {},
  upstreamTracking: {},
};
