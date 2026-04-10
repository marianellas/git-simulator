import type { RepoState } from '../types/repo';
import type { ParsedCommand, CommandResult } from '../types/terminal';

export function handleCheckout(state: RepoState, cmd: ParsedCommand): CommandResult {
  const createFlag = cmd.flags['b'] === true;
  const target = cmd.args[0];

  if (!target) {
    return { action: null, output: 'fatal: you must specify a branch', isError: true };
  }

  if (createFlag) {
    if (target in state.branches) {
      return {
        action: null,
        output: `fatal: A branch named '${target}' already exists`,
        isError: true,
      };
    }
    return {
      action: { type: 'GIT_CHECKOUT_B', name: target },
      output: `Switched to a new branch '${target}'`,
      isError: false,
    };
  }

  // Switch to existing branch
  if (target in state.branches) {
    if (state.HEAD.type === 'branch' && state.HEAD.name === target) {
      return { action: null, output: `Already on '${target}'`, isError: false };
    }
    return {
      action: { type: 'GIT_CHECKOUT', target },
      output: `Switched to branch '${target}'`,
      isError: false,
    };
  }

  // Detached HEAD by hash
  if (target in state.commits) {
    return {
      action: { type: 'GIT_CHECKOUT', target },
      output: `HEAD is now at ${target}`,
      isError: false,
    };
  }

  return {
    action: null,
    output: `error: pathspec '${target}' did not match any file(s) known to git`,
    isError: true,
  };
}
