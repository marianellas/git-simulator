import type { RepoState } from '../types/repo';
import type { ParsedCommand, CommandResult } from '../types/terminal';

export function handleStatus(state: RepoState, _cmd: ParsedCommand): CommandResult {
  const { commits, branches, HEAD, index, workingDir } = state;

  const headHash = HEAD.type === 'branch' ? branches[HEAD.name] : HEAD.hash;
  const headSnapshot = headHash ? (commits[headHash]?.treeSnapshot ?? {}) : {};

  // Staged: in index and different from HEAD snapshot
  const staged = Object.keys(index).filter((f) => index[f] !== headSnapshot[f]);
  // Staged deletions: in HEAD but removed from index
  const stagedDeleted = Object.keys(headSnapshot).filter((f) => !(f in index));
  // Unstaged: in index but workingDir differs
  const unstaged = Object.keys(index).filter((f) => workingDir[f] !== index[f]);
  // Untracked: in workingDir but not in index
  const untracked = Object.keys(workingDir).filter((f) => !(f in index));

  const lines: string[] = [];

  if (HEAD.type === 'branch') {
    lines.push(`On branch ${HEAD.name}`);
  } else {
    lines.push(`HEAD detached at ${HEAD.hash}`);
  }

  if (staged.length === 0 && stagedDeleted.length === 0 && unstaged.length === 0 && untracked.length === 0) {
    lines.push('nothing to commit, working tree clean');
    return { action: null, output: lines.join('\n'), isError: false };
  }

  if (staged.length > 0 || stagedDeleted.length > 0) {
    lines.push('', 'Changes to be committed:');
    staged.forEach((f) => lines.push(`\tnew file:   ${f}`));
    stagedDeleted.forEach((f) => lines.push(`\tdeleted:    ${f}`));
  }

  if (unstaged.length > 0) {
    lines.push('', 'Changes not staged for commit:');
    unstaged.forEach((f) => lines.push(`\tmodified:   ${f}`));
  }

  if (untracked.length > 0) {
    lines.push('', 'Untracked files:');
    untracked.forEach((f) => lines.push(`\t${f}`));
  }

  return { action: null, output: lines.join('\n'), isError: false };
}
