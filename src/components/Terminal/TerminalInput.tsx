import { useState, type KeyboardEvent } from 'react';

type Props = {
  history: string[];
  onSubmit: (input: string) => void;
};

export function TerminalInput({ history, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) onSubmit(trimmed);
      setValue('');
      setHistoryIndex(-1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(history[next] ?? '');
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5ch' }}>
      <span style={{ color: '#4ade80', userSelect: 'none' }}>$</span>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'inherit',
          font: 'inherit',
          caretColor: '#4ade80',
        }}
      />
    </div>
  );
}
