import React from "react";

type Level = "ok" | "warn" | "crit";

export type TankThresholds = {
  warnLow: number; // percent
  critLow: number; // percent
  warnHigh: number; // percent
  critHigh: number; // percent
};

export type TankLevelProps = {
  name: string;
  levelPct: number; // 0..100
  capacityL?: number; // if provided, shown under gauge
  thresholds?: TankThresholds;
};

const defaultThresholds: TankThresholds = {
  warnLow: 30,
  critLow: 15,
  warnHigh: 90,
  critHigh: 95,
};

function computeLevel(v: number, t: TankThresholds): Level {
  if (v <= t.critLow || v >= t.critHigh) return "crit";
  if (v <= t.warnLow || v >= t.warnHigh) return "warn";
  return "ok";
}

export const TankLevel: React.FC<TankLevelProps> = ({ name, levelPct, capacityL, thresholds }) => {
  const t = thresholds ?? defaultThresholds;
  const lv = computeLevel(levelPct, t);

  const chipCls =
    lv === "crit"
      ? "bg-red-500/15 text-red-500 border-red-500/40"
      : lv === "warn"
      ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
      : "bg-emerald-500/15 text-emerald-500 border-emerald-500/40";

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center line-clamp-2 min-h-5 px-1">
        {name}
      </h3>

      <div className="relative w-16 h-48 mx-auto rounded-lg border border-border bg-muted/10 overflow-hidden">
        {/* Fill */}
        <div
          className={`absolute bottom-0 w-full bg-gradient-to-t ${
            lv === "crit"
              ? "from-red-500 to-red-400/70"
              : lv === "warn"
              ? "from-amber-500 to-amber-400/70"
              : "from-primary to-primary/70"
          } transition-all duration-700`}
          style={{ height: `${Math.max(0, Math.min(100, levelPct))}%` }}
        />
        {/* Percent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground mix-blend-difference">
            {Math.round(levelPct)}%
          </span>
        </div>
        {/* Marks */}
        {[25, 50, 75].map((line) => (
          <div key={line} className="absolute w-full h-px bg-border/70" style={{ bottom: `${line}%` }} />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {capacityL != null && (
          <span className="text-xs text-muted-foreground">{capacityL.toLocaleString()} L</span>
        )}
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${chipCls}`}>
          {lv.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default TankLevel;
