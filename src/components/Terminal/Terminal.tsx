import { useEffect, useRef, useState } from 'react';
import { useRepo } from '../../state/repoContext';
import { execute } from '../../commands/index';
import type { TerminalLine } from '../../types/terminal';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';

export function Terminal() {
  const { state, dispatch } = useRepo();
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'git simulator — type a git command to get started', isError: false },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function handleSubmit(input: string) {
    const result = execute(state, input);

    const newLines: TerminalLine[] = [
      { text: `$ ${input}`, isError: false, isCommand: true },
      ...(result.output ? [{ text: result.output, isError: result.isError }] : []),
    ];

    setLines((prev) => [...prev, ...newLines]);
    setHistory((prev) => [input, ...prev]);

    if (result.action) {
      dispatch(result.action);
    }
  }

  return (
    <div
      style={{
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
        fontSize: '14px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable output area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1rem 0.5rem' }}>
        <TerminalOutput lines={lines} />
        <div ref={bottomRef} />
      </div>

      {/* Pinned input at bottom */}
      <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
        <TerminalInput history={history} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
