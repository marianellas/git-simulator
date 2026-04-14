import type { TerminalLine } from '../../types/terminal';

type Props = {
  lines: TerminalLine[];
};

export function TerminalOutput({ lines }: Props) {
  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line.isCommand ? '#84cc16' : line.isError ? '#f87171' : 'inherit',
            whiteSpace: 'pre-wrap',
          }}
        >
          {line.text}
        </div>
      ))}
    </>
  );
}
