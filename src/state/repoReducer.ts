import type { RepoState, GitAction } from '../types/repo';

export function repoReducer(state: RepoState, action: GitAction): RepoState {
  switch (action.type) {
    case 'GIT_INIT':
      throw new Error('GIT_INIT not implemented');

    case 'GIT_ADD':
      throw new Error('GIT_ADD not implemented');

    case 'GIT_COMMIT':
      throw new Error('GIT_COMMIT not implemented');

    case 'GIT_BRANCH':
      throw new Error('GIT_BRANCH not implemented');

    case 'GIT_CHECKOUT':
      throw new Error('GIT_CHECKOUT not implemented');

    case 'GIT_CHECKOUT_B':
      throw new Error('GIT_CHECKOUT_B not implemented');

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
      return state; // read-only

    case 'GIT_SHOW':
      return state; // read-only

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
