export type FileMap = Record<string, string>; // filename -> content

export type Commit = {
  hash: string;
  message: string;
  parents: string[];      // [] = root, [h] = normal, [h1, h2] = merge commit
  author: string;
  timestamp: number;
  treeSnapshot: FileMap;
};

export type HEAD =
  | { type: 'branch'; name: string }
  | { type: 'detached'; hash: string };

export type RemoteRepo = {
  commits: Record<string, Commit>;
  branches: Record<string, string>; // branch name -> commit hash
};

export type RepoState = {
  commits: Record<string, Commit>;
  branches: Record<string, string>;
  tags: Record<string, string>;
  HEAD: HEAD;
  index: FileMap;
  workingDir: FileMap;
  remotes: Record<string, RemoteRepo>;
  upstreamTracking: Record<string, string>; // local branch -> "remote/branch"
};

export type GitAction =
  | { type: 'GIT_INIT' }
  | { type: 'GIT_ADD'; files: string[] }
  | { type: 'GIT_COMMIT'; message: string }
  | { type: 'GIT_BRANCH'; name: string; delete?: boolean }
  | { type: 'GIT_CHECKOUT'; target: string }
  | { type: 'GIT_CHECKOUT_B'; name: string }
  | { type: 'GIT_PUSH'; remote: string; branch: string; setUpstream?: boolean }
  | { type: 'GIT_FETCH'; remote: string }
  | { type: 'GIT_REBASE'; onto: string }
  | { type: 'GIT_CHERRY_PICK'; hash: string }
  | { type: 'GIT_RESET'; mode: 'soft' | 'mixed' | 'hard'; target: string }
  | { type: 'GIT_LOG' }
  | { type: 'GIT_SHOW'; target: string }
  | { type: 'EDIT_FILE'; filename: string; content: string }
  | { type: 'DELETE_FILE'; filename: string };
