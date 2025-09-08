import React from "react";

type Level = "ok" | "warn" | "crit";

export type GaugeProps = {
  value: number;
  max: number;
  size?: number; // px
  thickness?: number; // stroke width
  label?: string;
  units?: string;
  level?: Level; // controls color; if not provided, default neutral
  showTicks?: number; // number of major ticks across the arc
  labelClassName?: string;
  valueClassName?: string;
};

// Simple semicircular gauge (180°) with track and progress arc.
export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  size = 180,
  thickness = 10,
  label,
  units,
  level,
  showTicks = 5,
  labelClassName,
  valueClassName,
}) => {
  const pct = Math.max(0, Math.min(1, value / max));

  // SVG geometry (viewBox 0 0 100 60 for a 180° arc)
  const vbW = 100;
  const vbH = 60;
  const cx = 50;
  const cy = 50;
  const r = 45; // radius

  // Semicircle path from left (5,50) to right (95,50)
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Approximate arc length (πr)
  const arcLen = Math.PI * r;
  const dashArray = arcLen;
  const dashOffset = (1 - pct) * arcLen;

  const colorCls = !level
    ? "text-primary"
    : level === "crit"
    ? "text-red-500"
    : level === "warn"
    ? "text-amber-500"
    : "text-emerald-500";

  const px = size;
  const strokeW = (thickness / size) * vbW; // scale thickness relative to viewBox

  // Generate ticks along the arc
  const ticks = Array.from({ length: showTicks + 1 }, (_, i) => i / showTicks);

  return (
    <div style={{ width: px, height: px / 2 }} className="flex flex-col items-center justify-end">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width={px}
        height={px / 2}
        className="overflow-visible"
        aria-label={label}
        role="img"
      >
        {/* Track */}
        <path
          d={d}
          fill="none"
          className="text-border/60"
          stroke="currentColor"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={d}
          fill="none"
          className={colorCls}
          stroke="currentColor"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
        {/* Ticks */}
        {ticks.map((t, idx) => {
          const angle = Math.PI * (1 - t); // from π to 0
          const tr = r + 1.5;
          const tickLen = 3.5;
          const x1 = cx + tr * Math.cos(angle);
          const y1 = cy - tr * Math.sin(angle);
          const x2 = cx + (tr - tickLen) * Math.cos(angle);
          const y2 = cy - (tr - tickLen) * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="text-border/80"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}
        {/* Value label */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className={`${labelClassName ?? "fill-foreground text-xs font-medium"} select-none`}
        >
          {label ?? ""}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          className={`${valueClassName ?? "text-base font-semibold"} ${colorCls} fill-current select-none`}
        >
          {value.toFixed(1)}{units ? ` ${units}` : ""}
        </text>
      </svg>
    </div>
  );
};

export default Gauge;
