import type { RepoState } from '../types/repo';
import type { ParsedCommand, CommandResult } from '../types/terminal';

function getHeadSnapshot(state: RepoState): Record<string, string> {
  const hash =
    state.HEAD.type === 'branch'
      ? state.branches[state.HEAD.name]
      : state.HEAD.hash;
  return hash ? (state.commits[hash]?.treeSnapshot ?? {}) : {};
}

export function handleCommit(state: RepoState, cmd: ParsedCommand): CommandResult {
  const message = cmd.flags['m'];
  if (!message || typeof message !== 'string') {
    return {
      action: null,
      output: 'Aborting commit due to empty commit message.',
      isError: true,
    };
  }

  const headSnapshot = getHeadSnapshot(state);
  const indexKeys = Object.keys(state.index);
  const headKeys = Object.keys(headSnapshot);

  const hasChanges =
    indexKeys.some((f) => state.index[f] !== headSnapshot[f]) ||
    headKeys.some((f) => !(f in state.index));

  if (!hasChanges) {
    return { action: null, output: 'nothing to commit, working tree clean', isError: false };
  }

  return { action: { type: 'GIT_COMMIT', message }, output: '', isError: false };
}
