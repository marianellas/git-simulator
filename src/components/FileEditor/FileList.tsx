type Props = {
  files: string[];
  selected: string | null;
  onSelect: (filename: string) => void;
  onNew: () => void;
};

export function FileList({ files, selected, onSelect, onNew }: Props) {
  return (
    <div
      style={{
        width: '160px',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '0.5rem',
          borderBottom: '1px solid #334155',
          fontSize: '11px',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Working Dir
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {files.length === 0 && (
          <div style={{ padding: '0.5rem', color: '#475569', fontSize: '13px' }}>
            No files
          </div>
        )}
        {files.map((f) => (
          <div
            key={f}
            onClick={() => onSelect(f)}
            style={{
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              fontSize: '13px',
              background: f === selected ? '#1e3a5f' : 'transparent',
              color: f === selected ? '#93c5fd' : '#cbd5e1',
              borderLeft: f === selected ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            {f}
          </div>
        ))}
      </div>
      <button
        onClick={onNew}
        style={{
          margin: '0.5rem',
          padding: '0.4rem',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '4px',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        + New file
      </button>
    </div>
  );
}
