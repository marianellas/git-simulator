import { useState } from 'react';
import { useRepo } from '../../state/repoContext';
import { FileList } from './FileList';

export function FileEditor() {
  const { state, dispatch } = useRepo();
  const [selected, setSelected] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string | null>(null);

  const files = Object.keys(state.workingDir);
  const content = selected !== null ? state.workingDir[selected] ?? '' : '';

  function handleSelect(filename: string) {
    setNewFileName(null);
    setSelected(filename);
  }

  function handleContentChange(value: string) {
    if (!selected) return;
    dispatch({ type: 'EDIT_FILE', filename: selected, content: value });
  }

  function handleNewFile() {
    setNewFileName('');
    setSelected(null);
  }

  function handleNewFileKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const name = newFileName?.trim();
      if (name) {
        dispatch({ type: 'EDIT_FILE', filename: name, content: '' });
        setSelected(name);
      }
      setNewFileName(null);
    }
    if (e.key === 'Escape') {
      setNewFileName(null);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
        fontSize: '14px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '160px', flexShrink: 0 }}>
        <FileList
          files={files}
          selected={selected}
          onSelect={handleSelect}
          onNew={handleNewFile}
        />
        {newFileName !== null && (
          <input
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleNewFileKeyDown}
            placeholder="filename"
            style={{
              margin: '0 0.5rem 0.5rem',
              padding: '0.3rem 0.5rem',
              background: '#1e293b',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              color: '#e2e8f0',
              font: 'inherit',
              fontSize: '12px',
              outline: 'none',
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div
              style={{
                padding: '0.4rem 0.75rem',
                borderBottom: '1px solid #334155',
                fontSize: '12px',
                color: '#64748b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{selected}</span>
              <button
                onClick={() => {
                  dispatch({ type: 'DELETE_FILE', filename: selected });
                  setSelected(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '0 0.25rem',
                }}
              >
                delete
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e2e8f0',
                font: 'inherit',
                padding: '0.75rem',
                resize: 'none',
                lineHeight: '1.6',
              }}
            />
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
            }}
          >
            select a file to edit
          </div>
        )}
      </div>
    </div>
  );
}
