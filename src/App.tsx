import { useCallback, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal/Terminal';
import { GraphPanel } from './components/Graph/GraphPanel';
import { FileEditor } from './components/FileEditor/FileEditor';
import { InternalsPanel } from './components/Internals/InternalsPanel';

const PANEL_BORDER = '1px solid #1e293b';
const MIN_WIDTH = 180;
const MAX_TERMINAL_WIDTH = 700;

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '0.4rem 0.75rem',
        borderBottom: PANEL_BORDER,
        fontSize: '12px',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: '#0f172a',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function ResizeHandle({ onDrag }: { onDrag: (dx: number) => void }) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      onDrag(e.clientX - lastX.current);
      lastX.current = e.clientX;
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [onDrag]);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        width: '4px',
        flexShrink: 0,
        background: 'transparent',
        borderRight: PANEL_BORDER,
        cursor: 'col-resize',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#3b82f6')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    />
  );
}

function App() {
  const [terminalWidth, setTerminalWidth] = useState(340);
  const [graphOpen, setGraphOpen] = useState(true);

  const handleTerminalResize = useCallback((dx: number) => {
    setTerminalWidth((w) => Math.min(MAX_TERMINAL_WIDTH, Math.max(MIN_WIDTH, w + dx)));
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0f1a',
        overflow: 'hidden',
      }}
    >
      <Header />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left — Terminal */}
        <div
          style={{
            width: terminalWidth,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <PanelLabel>Terminal</PanelLabel>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Terminal />
          </div>
        </div>

        <ResizeHandle onDrag={handleTerminalResize} />

        {/* Middle — Commit Graph */}
        <div
          style={{
            width: graphOpen ? 220 : 28,
            flexShrink: 0,
            borderRight: PANEL_BORDER,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.2s ease',
          }}
        >
          <GraphPanel open={graphOpen} onToggle={() => setGraphOpen((v) => !v)} />
        </div>

        {/* Right — Working Directory + Internals */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Working Directory */}
          <div
            style={{
              flex: '0 0 45%',
              borderBottom: PANEL_BORDER,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <PanelLabel>Working Directory</PanelLabel>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <FileEditor />
            </div>
          </div>

          {/* Internals */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <PanelLabel>Internals</PanelLabel>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <InternalsPanel />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
