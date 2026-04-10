import type { RepoState } from '../types/repo';
import type { ParsedCommand, CommandResult } from '../types/terminal';

export function handleAdd(state: RepoState, cmd: ParsedCommand): CommandResult {
  const files = cmd.args;

  if (files.length === 0) {
    return { action: null, output: 'Nothing specified, nothing added.', isError: true };
  }

  const toAdd =
    files[0] === '.' ? Object.keys(state.workingDir) : files;

  const missing = toAdd.filter((f) => !(f in state.workingDir));
  if (missing.length > 0) {
    return {
      action: null,
      output: `fatal: pathspec '${missing[0]}' did not match any files`,
      isError: true,
    };
  }

  return { action: { type: 'GIT_ADD', files: toAdd }, output: '', isError: false };
}
