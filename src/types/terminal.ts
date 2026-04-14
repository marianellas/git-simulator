import type { GitAction } from './repo';

export type ParsedCommand = {
  command: string;
  flags: Record<string, string | boolean>;
  args: string[];
};

export type ParseError = {
  error: string;
};

export type CommandResult = {
  action: GitAction | null; // null for read-only commands
  output: string;
  isError: boolean;
};

export type CommandHandler = (
  state: import('./repo').RepoState,
  cmd: ParsedCommand,
) => CommandResult;

export type TerminalLine = {
  text: string;
  isError: boolean;
  isCommand?: boolean;
};
