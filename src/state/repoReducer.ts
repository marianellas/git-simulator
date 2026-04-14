import type { Commit, RepoState, GitAction } from '../types/repo';
import { generateHash } from '../utils/hash';

function currentHeadHash(state: RepoState): string | undefined {
  return state.HEAD.type === 'branch'
    ? state.branches[state.HEAD.name]
    : state.HEAD.hash;
}

export function repoReducer(state: RepoState, action: GitAction): RepoState {
  switch (action.type) {
    case 'GIT_INIT':
      throw new Error('GIT_INIT not implemented');

    case 'GIT_ADD': {
      const index = { ...state.index };
      for (const file of action.files) {
        index[file] = state.workingDir[file];
      }
      return { ...state, index };
    }

    case 'GIT_COMMIT': {
      const parentHash = currentHeadHash(state);
      const hash = generateHash();
      const commit: Commit = {
        hash,
        message: action.message,
        parents: parentHash ? [parentHash] : [],
        author: 'User',
        timestamp: Date.now(),
        treeSnapshot: { ...state.index },
      };
      const commits = { ...state.commits, [hash]: commit };
      if (state.HEAD.type === 'branch') {
        return {
          ...state,
          commits,
          branches: { ...state.branches, [state.HEAD.name]: hash },
        };
      }
      return { ...state, commits, HEAD: { type: 'detached', hash } };
    }

    case 'GIT_BRANCH': {
      if (action.delete) {
        const branches = { ...state.branches };
        delete branches[action.name];
        return { ...state, branches };
      }
      const headHash = currentHeadHash(state);
      if (!headHash) return state;
      return { ...state, branches: { ...state.branches, [action.name]: headHash } };
    }

    case 'GIT_CHECKOUT': {
      // Switch to branch
      if (action.target in state.branches) {
        const hash = state.branches[action.target];
        const snapshot = hash ? (state.commits[hash]?.treeSnapshot ?? {}) : {};
        return {
          ...state,
          HEAD: { type: 'branch', name: action.target },
          index: { ...snapshot },
          workingDir: { ...snapshot },
        };
      }
      // Detached HEAD by hash
      if (action.target in state.commits) {
        const snapshot = state.commits[action.target].treeSnapshot;
        return {
          ...state,
          HEAD: { type: 'detached', hash: action.target },
          index: { ...snapshot },
          workingDir: { ...snapshot },
        };
      }
      return state;
    }

    case 'GIT_CHECKOUT_B': {
      const headHash = currentHeadHash(state);
      const branches = headHash
        ? { ...state.branches, [action.name]: headHash }
        : state.branches;
      return { ...state, HEAD: { type: 'branch', name: action.name }, branches };
    }

    case 'GIT_PUSH':
      throw new Error('GIT_PUSH not implemented');

    case 'GIT_FETCH':
      throw new Error('GIT_FETCH not implemented');

    case 'GIT_REBASE':
      throw new Error('GIT_REBASE not implemented');

    case 'GIT_CHERRY_PICK':
      throw new Error('GIT_CHERRY_PICK not implemented');

    case 'GIT_RESET':
      throw new Error('GIT_RESET not implemented');

    case 'GIT_LOG':
      return state;

    case 'GIT_SHOW':
      return state;

    case 'EDIT_FILE':
      return {
        ...state,
        workingDir: { ...state.workingDir, [action.filename]: action.content },
      };

    case 'DELETE_FILE': {
      const workingDir = { ...state.workingDir };
      delete workingDir[action.filename];
      return { ...state, workingDir };
    }

    default:
      return state;
  }
}
