export function MiniBar({ value, max, color, height = 6 }) {
  return (
    <div style={{ width: '100%', height, background: 'rgba(255,255,255,0.06)', borderRadius: height / 2 }}>
      <div style={{
        width: `${Math.min((value / max) * 100, 100)}%`, height: '100%',
        background: color, borderRadius: height / 2,
        transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      }} />
    </div>
  );
}

export function MacroRing({ value, max, color, size = 52, stroke = 5, label, unit = 'g' }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const offset = c - Math.min(value / max, 1) * c;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }} />
      </svg>
      <span className="mono" style={{ fontSize: 13, fontWeight: 600, color }}>{value}{unit}</span>
      <span className="label-xs">{label}</span>
    </div>
  );
}
