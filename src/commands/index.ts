import type { RepoState } from '../types/repo';
import type { CommandHandler, CommandResult } from '../types/terminal';
import { parseGitCommand } from '../parser/parseCommand';
import { handleAdd } from './add';
import { handleCommit } from './commit';
import { handleBranch } from './branch';
import { handleCheckout } from './checkout';
import { handleStatus } from './status';

const handlers: Record<string, CommandHandler> = {
  add: handleAdd,
  commit: handleCommit,
  branch: handleBranch,
  checkout: handleCheckout,
  status: handleStatus,
};

const HELP_TEXT = `usage: git <command> [args]

Supported commands:

  add <file|.>          Stage file(s) for commit
  commit -m <message>   Record staged changes as a new commit
  branch                List branches
  branch <name>         Create a new branch at HEAD
  branch -d <name>      Delete a branch
  checkout <branch>     Switch to a branch
  checkout -b <branch>  Create and switch to a new branch
  checkout <hash>       Detach HEAD at a specific commit
  status                Show working tree status

Type 'git help' or 'git -h' to show this message.`;

export function execute(state: RepoState, input: string): CommandResult {
  const parsed = parseGitCommand(input);

  if ('error' in parsed) {
    return { action: null, output: parsed.error, isError: true };
  }

  if (parsed.command === 'help' || parsed.flags['h'] === true) {
    return { action: null, output: HELP_TEXT, isError: false };
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
