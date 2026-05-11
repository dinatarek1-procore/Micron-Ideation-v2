export const W = 240;
export const H = 132;

const NAV_H = 16;
const HEADER_H = 20;

const bg = '#f4f5f6';
const nav = '#111827';
const header = '#e5e7eb';
const card = '#ffffff';
const line = '#d1d5db';
const divider = '#d1d5db';
const tab = '#d1d5db';
const tabActive = '#374151';

export function ToolLandingThumbnail() {
  const cardY = NAV_H + HEADER_H + 10;
  const cardH = H - cardY - 10;
  const cardW = (W - 16 - 8) / 3;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      {/* Global nav */}
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect x={0} y={NAV_H - 4} width={W} height={4} fill={nav} />
      {/* Page header */}
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 6} width={48} height={6} rx={2} fill={line} />
      {/* 3 hub cards */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={8 + i * (cardW + 4)}
            y={cardY}
            width={cardW}
            height={cardH}
            rx={4}
            fill={card}
            stroke={line}
            strokeWidth={1}
          />
          <rect
            x={8 + i * (cardW + 4) + 6}
            y={cardY + 8}
            width={cardW - 12}
            height={5}
            rx={2}
            fill={line}
          />
          <rect
            x={8 + i * (cardW + 4) + 6}
            y={cardY + 18}
            width={cardW - 20}
            height={4}
            rx={2}
            fill={tab}
          />
          <rect
            x={8 + i * (cardW + 4) + 6}
            y={cardY + 26}
            width={cardW - 16}
            height={4}
            rx={2}
            fill={tab}
          />
        </g>
      ))}
    </svg>
  );
}

/** Mini wireframe: tool landing chrome with Recycle Bin tab accent. */
export function RecycleBinThumbnail() {
  const cardY = NAV_H + HEADER_H + 10;
  const cardH = H - cardY - 10;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 6} width={48} height={6} rx={2} fill={line} />
      <rect
        x={8}
        y={NAV_H + HEADER_H + 2}
        width={72}
        height={5}
        rx={2}
        fill={tabActive}
      />
      <rect
        x={86}
        y={NAV_H + HEADER_H + 2}
        width={56}
        height={5}
        rx={2}
        fill={tab}
      />
      <rect
        x={8}
        y={cardY}
        width={W - 16}
        height={cardH}
        rx={4}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      <rect
        x={20}
        y={cardY + 16}
        width={W - 56}
        height={6}
        rx={2}
        fill={line}
      />
      <rect x={20} y={cardY + 30} width={W - 80} height={4} rx={2} fill={tab} />
      <rect
        x={20}
        y={cardY + 40}
        width={W - 100}
        height={4}
        rx={2}
        fill={tab}
      />
      <rect
        x={W / 2 - 14}
        y={cardY + cardH / 2 - 10}
        width={28}
        height={22}
        rx={3}
        fill="none"
        stroke={tabActive}
        strokeWidth={2}
      />
      <path
        d={`M ${W / 2 - 8} ${cardY + cardH / 2 + 6} L ${W / 2 + 8} ${cardY + cardH / 2 + 6}`}
        stroke={tabActive}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ItemDetailThumbnail() {
  const contentY = NAV_H + HEADER_H + 2;
  const contentH = H - contentY - 6;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      {/* Global nav */}
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect x={0} y={NAV_H - 4} width={W} height={4} fill={nav} />
      {/* Page header with tabs */}
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 5} width={32} height={5} rx={2} fill={tabActive} />
      <rect x={44} y={NAV_H + 5} width={28} height={5} rx={2} fill={tab} />
      <rect x={76} y={NAV_H + 5} width={28} height={5} rx={2} fill={tab} />
      {/* Content card */}
      <rect
        x={6}
        y={contentY}
        width={W - 12}
        height={contentH}
        rx={4}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      {/* Section label */}
      <rect
        x={14}
        y={contentY + 8}
        width={40}
        height={4}
        rx={2}
        fill={tabActive}
      />
      <line
        x1={6}
        y1={contentY + 18}
        x2={W - 6}
        y2={contentY + 18}
        stroke={divider}
        strokeWidth={1}
      />
      {/* Field rows */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={14}
            y={contentY + 24 + i * 14}
            width={36}
            height={4}
            rx={2}
            fill={tab}
          />
          <rect
            x={80}
            y={contentY + 24 + i * 14}
            width={60}
            height={4}
            rx={2}
            fill={line}
          />
        </g>
      ))}
    </svg>
  );
}

/** Settings template: tabs + form card + sticky-style footer bar. */
export function SettingsPageThumbnail() {
  const contentY = NAV_H + HEADER_H + 2;
  const footerH = 12;
  const footerY = H - footerH - 4;
  const contentH = footerY - contentY - 4;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect x={0} y={NAV_H - 4} width={W} height={4} fill={nav} />
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 5} width={36} height={5} rx={2} fill={tabActive} />
      <rect x={48} y={NAV_H + 5} width={52} height={5} rx={2} fill={tab} />
      <rect
        x={6}
        y={contentY}
        width={W - 12}
        height={contentH}
        rx={4}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      <rect
        x={14}
        y={contentY + 8}
        width={48}
        height={4}
        rx={2}
        fill={tabActive}
      />
      <line
        x1={6}
        y1={contentY + 18}
        x2={W - 6}
        y2={contentY + 18}
        stroke={divider}
        strokeWidth={1}
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={14}
            y={contentY + 24 + i * 14}
            width={36}
            height={4}
            rx={2}
            fill={tab}
          />
          <rect
            x={80}
            y={contentY + 24 + i * 14}
            width={72}
            height={4}
            rx={2}
            fill={line}
          />
        </g>
      ))}
      <rect
        x={6}
        y={footerY}
        width={W - 12}
        height={footerH}
        rx={3}
        fill={header}
        stroke={line}
      />
      <rect
        x={W - 52}
        y={footerY + 3}
        width={22}
        height={6}
        rx={2}
        fill={tab}
      />
      <rect
        x={W - 26}
        y={footerY + 3}
        width={18}
        height={6}
        rx={2}
        fill={tabActive}
      />
    </svg>
  );
}

export function NewToolThumbnail() {
  const contentY = NAV_H + HEADER_H + 8;
  const contentH = H - contentY - 8;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      {/* Global nav */}
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect x={0} y={NAV_H - 4} width={W} height={4} fill={nav} />
      {/* Page header */}
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 6} width={52} height={6} rx={2} fill={line} />
      {/* Action buttons on the right */}
      <rect x={W - 38} y={NAV_H + 6} width={14} height={6} rx={2} fill={tab} />
      <rect
        x={W - 20}
        y={NAV_H + 6}
        width={14}
        height={6}
        rx={2}
        fill={tabActive}
      />
      {/* Filter/toolbar row */}
      <rect
        x={6}
        y={contentY}
        width={W - 12}
        height={12}
        rx={3}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      <rect x={12} y={contentY + 4} width={20} height={4} rx={2} fill={tab} />
      <rect x={36} y={contentY + 4} width={20} height={4} rx={2} fill={tab} />
      {/* Main content card with table rows */}
      <rect
        x={6}
        y={contentY + 16}
        width={W - 12}
        height={contentH - 16}
        rx={3}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={14}
            y={contentY + 24 + i * 12}
            width={W - 28}
            height={1}
            fill={divider}
          />
          <rect
            x={14}
            y={contentY + 27 + i * 12}
            width={44}
            height={4}
            rx={2}
            fill={tab}
          />
          <rect
            x={90}
            y={contentY + 27 + i * 12}
            width={30}
            height={4}
            rx={2}
            fill={line}
          />
          <rect
            x={150}
            y={contentY + 27 + i * 12}
            width={22}
            height={4}
            rx={2}
            fill={tab}
          />
        </g>
      ))}
    </svg>
  );
}

export function SplitListThumbnail() {
  const splitX = Math.round(W * 0.42);
  const rowH = 16;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      {/* Left panel — table */}
      <rect x={0} y={0} width={splitX} height={H} fill={card} rx={4} />
      {/* Column header */}
      <rect x={0} y={0} width={splitX} height={rowH} fill={header} />
      <rect x={8} y={5} width={28} height={4} rx={2} fill={tab} />
      <rect x={44} y={5} width={20} height={4} rx={2} fill={tab} />
      {/* Rows */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x={0}
            y={rowH + i * rowH}
            width={splitX}
            height={rowH}
            fill={i === 1 ? '#eff6ff' : 'transparent'}
          />
          <rect
            x={1}
            y={rowH + i * rowH}
            width={splitX - 2}
            height={1}
            fill={divider}
          />
          <rect
            x={8}
            y={rowH + i * rowH + 6}
            width={24}
            height={4}
            rx={2}
            fill={i === 1 ? '#93c5fd' : line}
          />
          <rect
            x={40}
            y={rowH + i * rowH + 6}
            width={16}
            height={4}
            rx={2}
            fill={tab}
          />
        </g>
      ))}
      {/* Divider */}
      <line
        x1={splitX}
        y1={0}
        x2={splitX}
        y2={H}
        stroke={divider}
        strokeWidth={1.5}
      />
      {/* Right panel — detail */}
      <rect
        x={splitX + 8}
        y={8}
        width={W - splitX - 14}
        height={6}
        rx={2}
        fill={tabActive}
      />
      <rect x={splitX + 8} y={20} width={30} height={4} rx={2} fill={tab} />
      <rect
        x={splitX + 8}
        y={28}
        width={W - splitX - 22}
        height={4}
        rx={2}
        fill={line}
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={splitX + 8}
            y={40 + i * 18}
            width={28}
            height={4}
            rx={2}
            fill={tab}
          />
          <rect
            x={splitX + 8}
            y={48 + i * 18}
            width={W - splitX - 22}
            height={4}
            rx={2}
            fill={line}
          />
        </g>
      ))}
    </svg>
  );
}

export function HubsDashboardThumbnail() {
  const contentY = NAV_H + HEADER_H + 6;
  const gutter = 4;
  const padX = 6;
  const fullW = W - padX * 2;

  // Row 1: two equal half-width cards
  const r1H = 34;
  const r1W = (fullW - gutter) / 2;

  // Row 2: narrow (40%) + wide (60%)
  const r2H = 34;
  const r2NarrowW = Math.round((fullW - gutter) * 0.38);
  const r2WideW = fullW - gutter - r2NarrowW;

  // Row 3: full-width
  const r3H = H - contentY - r1H - r2H - gutter * 2 - 4;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill={bg} rx={4} />
      {/* Global nav */}
      <rect width={W} height={NAV_H} fill={nav} rx={4} />
      <rect x={0} y={NAV_H - 4} width={W} height={4} fill={nav} />
      {/* Page header */}
      <rect y={NAV_H} width={W} height={HEADER_H} fill={header} />
      <rect x={8} y={NAV_H + 6} width={44} height={6} rx={2} fill={line} />

      {/* Row 1 — two equal cards */}
      {[0, 1].map((i) => (
        <g key={i}>
          <rect
            x={padX + i * (r1W + gutter)}
            y={contentY}
            width={r1W}
            height={r1H}
            rx={3}
            fill={card}
            stroke={line}
            strokeWidth={1}
          />
          <rect
            x={padX + i * (r1W + gutter) + 6}
            y={contentY + 7}
            width={r1W * 0.45}
            height={4}
            rx={2}
            fill={tabActive}
          />
          <rect
            x={padX + i * (r1W + gutter) + 6}
            y={contentY + 15}
            width={r1W * 0.65}
            height={3}
            rx={2}
            fill={tab}
          />
          <rect
            x={padX + i * (r1W + gutter) + 6}
            y={contentY + 22}
            width={r1W * 0.5}
            height={3}
            rx={2}
            fill={tab}
          />
        </g>
      ))}

      {/* Row 2 — narrow + wide */}
      {[
        { w: r2NarrowW, x: padX },
        { w: r2WideW, x: padX + r2NarrowW + gutter },
      ].map(({ w, x }, i) => (
        <g key={i}>
          <rect
            x={x}
            y={contentY + r1H + gutter}
            width={w}
            height={r2H}
            rx={3}
            fill={card}
            stroke={line}
            strokeWidth={1}
          />
          <rect
            x={x + 6}
            y={contentY + r1H + gutter + 7}
            width={w * 0.45}
            height={4}
            rx={2}
            fill={tabActive}
          />
          <rect
            x={x + 6}
            y={contentY + r1H + gutter + 15}
            width={w * 0.7}
            height={3}
            rx={2}
            fill={tab}
          />
          <rect
            x={x + 6}
            y={contentY + r1H + gutter + 22}
            width={w * 0.55}
            height={3}
            rx={2}
            fill={tab}
          />
        </g>
      ))}

      {/* Row 3 — full-width */}
      <rect
        x={padX}
        y={contentY + r1H + r2H + gutter * 2}
        width={fullW}
        height={r3H}
        rx={3}
        fill={card}
        stroke={line}
        strokeWidth={1}
      />
      <rect
        x={padX + 6}
        y={contentY + r1H + r2H + gutter * 2 + 6}
        width={50}
        height={4}
        rx={2}
        fill={tabActive}
      />
      {[0, 1].map((i) => (
        <rect
          key={i}
          x={padX + 6}
          y={contentY + r1H + r2H + gutter * 2 + 14 + i * 8}
          width={fullW - 12}
          height={3}
          rx={2}
          fill={tab}
        />
      ))}
    </svg>
  );
}
