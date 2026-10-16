import { useLayoutEffect, useRef, useState } from 'react';

type Point = [number, number];

const VARIANTS: { d: string; from: Point; to: Point }[] = [
  { d: 'M 92 246 C 140 246, 150 176, 194 174 S 252 122, 270 116', from: [92, 246], to: [270, 116] },
  { d: 'M 96 122 C 150 122, 156 196, 204 200 S 258 236, 270 240', from: [96, 122], to: [270, 240] },
  { d: 'M 88 190 C 124 140, 176 250, 214 186 S 256 128, 274 140', from: [88, 190], to: [274, 140] },
];

const COLS = [60, 76, 52, 84, 60, 70];
const ROWS = [50, 64, 44, 70, 52, 60];
const GAP = 14;

const BLOCKS = (() => {
  const out: { x: number; y: number; w: number; h: number; park: boolean }[] = [];
  let y = -20;
  for (let r = 0; y < 380; r++) {
    const h = ROWS[r % ROWS.length];
    let x = -24;
    for (let c = 0; x < 380; c++) {
      const w = COLS[(c + r * 2) % COLS.length];
      out.push({ x, y, w, h, park: (r === 1 && c === 3) || (r === 3 && c === 0) });
      x += w + GAP;
    }
    y += h + GAP;
  }
  return out;
})();

interface Props {
  seed: number;
  /** 0–1 along the route. */
  progress: number;
  showCourier: boolean;
  searching: boolean;
}

/**
 * A stylised city map. Routes sit inside the centre of a square viewBox so
 * `slice` can crop the edges at any aspect ratio without losing a pin.
 * Real map SDKs drop in here later (Mapbox, Google Maps).
 */
export function RouteMap({ seed, progress, showCourier, searching }: Props) {
  const v = VARIANTS[seed % VARIANTS.length];
  const measureRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState<Point | null>(null);

  useLayoutEffect(() => {
    const p = measureRef.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * progress);
    setPos([pt.x, pt.y]);
  }, [progress, v]);

  return (
    <svg className="map" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <filter id="map-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="360" height="360" className="map-street" />
      {BLOCKS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="9" className={b.park ? 'map-park' : 'map-block'} />
      ))}
      <path d="M -10 300 C 80 282, 170 318, 380 288 L 380 380 L -10 380 Z" className="map-water" />

      <path ref={measureRef} d={v.d} className="route-base" />
      <path d={v.d} className="route-done" pathLength={1} style={{ strokeDashoffset: 1 - progress }} />

      {/* Pickup */}
      <g transform={`translate(${v.from[0]} ${v.from[1]})`}>
        {searching && (
          <>
            <circle r="10" className="map-pulse" />
            <circle r="10" className="map-pulse" style={{ animationDelay: '900ms' }} />
          </>
        )}
        <circle r="8" className="pin-pickup" filter="url(#map-shadow)" />
        <circle r="3" className="pin-pickup-core" />
      </g>

      {/* Drop-off */}
      <g transform={`translate(${v.to[0]} ${v.to[1]})`}>
        <path d="M0 0 C -6 -8, -11 -12, -11 -19 A 11 11 0 1 1 11 -19 C 11 -12, 6 -8, 0 0 Z" className="pin-drop" filter="url(#map-shadow)" />
        <circle cy="-19" r="4" className="pin-drop-core" />
      </g>

      {showCourier && pos && (
        <g className="courier" style={{ transform: `translate(${pos[0]}px, ${pos[1]}px)` }}>
          <circle r="13" className="courier-halo" />
          <circle r="9" className="courier-body" filter="url(#map-shadow)" />
          <circle r="3.2" className="courier-core" />
        </g>
      )}
    </svg>
  );
}
