import type { RepoState } from '../types/repo';
import type { CommandHandler, CommandResult } from '../types/terminal';
import { parseGitCommand } from '../parser/parseCommand';
import { handleAdd } from './add';
import { handleCommit } from './commit';
import { handleBranch } from './branch';
import { handleCheckout } from './checkout';

const handlers: Record<string, CommandHandler> = {
  add: handleAdd,
  commit: handleCommit,
  branch: handleBranch,
  checkout: handleCheckout,
};

export function execute(state: RepoState, input: string): CommandResult {
  const parsed = parseGitCommand(input);

  if ('error' in parsed) {
    return { action: null, output: parsed.error, isError: true };
  }

  const handler = handlers[parsed.command];
  if (!handler) {
    return {
      action: null,
      output: `git: '${parsed.command}' is not a git command. See 'git help'.`,
      isError: true,
    };
  }

  return handler(state, parsed);
}
