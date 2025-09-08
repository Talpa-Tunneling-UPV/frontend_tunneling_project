import type { Level } from "../types/hydraulic";

export const PRESSURE_MAX_MAIN = 160; // bar
export const PRESSURE_MAX_RETURN = 60; // bar
export const TEMP_MAX = 100; // °C

export const thresholds = {
  pressureMain: { warn: 110, crit: 140, max: PRESSURE_MAX_MAIN },
  pressureReturn: { warn: 35, crit: 45, max: PRESSURE_MAX_RETURN },
  tempIn: { warn: 70, crit: 85, max: TEMP_MAX },
  tempOut: { warn: 75, crit: 90, max: TEMP_MAX },
  efficiency: { warn: 80, crit: 70, max: 100, invert: true as const }, // invert: menos es peor
};

export function levelFor(value: number, warn: number, crit: number, invert = false): Level {
  if (!invert) return value >= crit ? "crit" : value >= warn ? "warn" : "ok";
  return value <= crit ? "crit" : value <= warn ? "warn" : "ok";
}

export function levelTextCls(l: Level) {
  return l === "crit" ? "text-red-500" : l === "warn" ? "text-amber-500" : "text-emerald-500";
}

export function levelChipCls(l: Level) {
  return l === "crit"
    ? "bg-red-500/15 text-red-500 border-red-500/40"
    : l === "warn"
    ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
    : "bg-emerald-500/15 text-emerald-500 border-emerald-500/40";
}
