import type { ParsedCommand, ParseError } from '../types/terminal';

// Short flags that consume the next token as their value
const VALUE_FLAGS = new Set(['m']);

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (const ch of input) {
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === ' ' && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function parseGitCommand(input: string): ParsedCommand | ParseError {
  const trimmed = input.trim();
  const withoutGit = trimmed.startsWith('git ')
    ? trimmed.slice(4).trim()
    : trimmed;

  if (!withoutGit) return { error: 'usage: git <command> [args]' };

  const tokens = tokenize(withoutGit);
  const command = tokens[0];
  const rest = tokens.slice(1);

  const flags: Record<string, string | boolean> = {};
  const args: string[] = [];

  let i = 0;
  while (i < rest.length) {
    const token = rest[i];

    if (token.startsWith('--')) {
      const long = token.slice(2);
      const eqIdx = long.indexOf('=');
      if (eqIdx !== -1) {
        flags[long.slice(0, eqIdx)] = long.slice(eqIdx + 1);
      } else {
        flags[long] = true;
      }
    } else if (token.startsWith('-') && token.length > 1) {
      const flag = token.slice(1);
      const next = rest[i + 1];
      if (VALUE_FLAGS.has(flag) && next !== undefined && !next.startsWith('-')) {
        flags[flag] = next;
        i++;
      } else {
        flags[flag] = true;
      }
    } else {
      args.push(token);
    }

    i++;
  }

  return { command, flags, args };
}
