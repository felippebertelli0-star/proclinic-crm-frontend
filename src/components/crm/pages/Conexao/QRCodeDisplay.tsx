/**
 * QR Code Display - QR Code SVG premium com animação de scanner
 * Qualidade: Ultra Premium AAA
 */

'use client';

import React, { useMemo } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  scanning?: boolean;
}

// Gerador de padrão pseudo-QR determinístico a partir do value
function generatePattern(value: string, gridSize: number = 25): boolean[][] {
  const grid: boolean[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(false));

  // Hash simples do value
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }

  // Preencher padrão aleatório determinístico
  let seed = Math.abs(hash);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      grid[y][x] = (seed / 233280) > 0.52;
    }
  }

  // Padrões de posicionamento (cantos)
  const drawFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isEdge = y === 0 || y === 6 || x === 0 || x === 6;
        const isInner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        grid[startY + y][startX + x] = isEdge || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);

  // Limpar espaços em branco ao redor dos finders
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if ((y === 7 || x === 7) && y < 8 && x < 8) {
        if (y < gridSize && x < gridSize) grid[y][x] = false;
        if (y < gridSize && gridSize - 1 - x + 7 >= gridSize - 8) {
          const mx = gridSize - 1 - x;
          if (mx >= gridSize - 8) grid[y][mx] = false;
        }
      }
    }
  }
  // Separadores
  for (let i = 0; i < 8; i++) {
    if (grid[7]?.[i] !== undefined) grid[7][i] = false;
    if (grid[i]?.[7] !== undefined) grid[i][7] = false;
    if (grid[7]?.[gridSize - 1 - i] !== undefined) grid[7][gridSize - 1 - i] = false;
    if (grid[i]?.[gridSize - 8] !== undefined) grid[i][gridSize - 8] = false;
    if (grid[gridSize - 8]?.[i] !== undefined) grid[gridSize - 8][i] = false;
    if (grid[gridSize - 1 - i]?.[7] !== undefined) grid[gridSize - 1 - i][7] = false;
  }

  return grid;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 220, scanning = true }) => {
  const grid = useMemo(() => generatePattern(value, 25), [value]);
  const cellSize = size / 25;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        background: '#fff',
        borderRadius: '12px',
        padding: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      <svg width={size - 20} height={size - 20} viewBox={`0 0 ${25 * cellSize} ${25 * cellSize}`}>
        {grid.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000"
                rx={cellSize * 0.15}
              />
            ) : null
          )
        )}
      </svg>

      {/* Scanner line animada */}
      {scanning && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #25D366 50%, transparent)',
              boxShadow: '0 0 12px #25D366, 0 0 24px #25D366',
              animation: 'qrScan 2.5s ease-in-out infinite',
              borderRadius: '2px',
            }}
          />

          {/* Corner brackets */}
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
        </>
      )}

      <style>{`
        @keyframes qrScan {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(${size - 26}px); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const common: React.CSSProperties = {
    position: 'absolute',
    width: '18px',
    height: '18px',
    borderColor: '#25D366',
    borderStyle: 'solid',
    borderWidth: 0,
  };
  const pos: React.CSSProperties =
    position === 'tl'
      ? { top: '4px', left: '4px', borderTopWidth: '3px', borderLeftWidth: '3px', borderTopLeftRadius: '6px' }
      : position === 'tr'
      ? { top: '4px', right: '4px', borderTopWidth: '3px', borderRightWidth: '3px', borderTopRightRadius: '6px' }
      : position === 'bl'
      ? { bottom: '4px', left: '4px', borderBottomWidth: '3px', borderLeftWidth: '3px', borderBottomLeftRadius: '6px' }
      : { bottom: '4px', right: '4px', borderBottomWidth: '3px', borderRightWidth: '3px', borderBottomRightRadius: '6px' };
  return <div style={{ ...common, ...pos }} />;
}
