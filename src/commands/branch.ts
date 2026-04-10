import type { RepoState } from '../types/repo';
import type { ParsedCommand, CommandResult } from '../types/terminal';

export function handleBranch(state: RepoState, cmd: ParsedCommand): CommandResult {
  const deleteFlag = cmd.flags['d'] === true || cmd.flags['D'] === true;
  const name = cmd.args[0];
  const currentBranch = state.HEAD.type === 'branch' ? state.HEAD.name : null;

  // List branches
  if (!name && !deleteFlag) {
    const branchNames = new Set([
      ...Object.keys(state.branches),
      ...(currentBranch ? [currentBranch] : []),
    ]);
    if (branchNames.size === 0) return { action: null, output: '', isError: false };
    const output = [...branchNames]
      .map((b) => (b === currentBranch ? `* ${b}` : `  ${b}`))
      .join('\n');
    return { action: null, output, isError: false };
  }

  if (!name) {
    return { action: null, output: 'fatal: branch name required', isError: true };
  }

  if (deleteFlag) {
    if (!(name in state.branches)) {
      return { action: null, output: `error: branch '${name}' not found`, isError: true };
    }
    if (currentBranch === name) {
      return {
        action: null,
        output: `error: Cannot delete the branch '${name}' which you are currently on`,
        isError: true,
      };
    }
    return {
      action: { type: 'GIT_BRANCH', name, delete: true },
      output: `Deleted branch ${name}.`,
      isError: false,
    };
  }

  // Create branch
  if (name in state.branches) {
    return {
      action: null,
      output: `fatal: A branch named '${name}' already exists`,
      isError: true,
    };
  }

  const headHash =
    state.HEAD.type === 'branch'
      ? state.branches[state.HEAD.name]
      : state.HEAD.hash;

  if (!headHash) {
    return {
      action: null,
      output: `fatal: Not a valid object name: 'HEAD'`,
      isError: true,
    };
  }

  return { action: { type: 'GIT_BRANCH', name }, output: '', isError: false };
}
