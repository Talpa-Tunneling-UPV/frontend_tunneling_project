import type { Level, ThresholdCfg, CuttingMetric } from "../types/cutting";

// Umbrales centralizados por métrica + escala para la barra
export const CUTTING_THRESHOLDS: Record<CuttingMetric, ThresholdCfg> = {
  rpm:            { warn: 16,  crit: 20,  scaleMax: 24 },
  torque:         { warn: 900, crit: 1200, scaleMax: 1400 },
  temperature:    { warn: 75,  crit: 90,  scaleMax: 110 },
  wearLevel:      { warn: 60,  crit: 85,  scaleMax: 100 },
  advanceRate:    { warn: 5,   crit: 3,   invert: true, scaleMax: 12 },
  cutterPressure: { warn: 110, crit: 140, scaleMax: 160 },
  vibration:      { warn: 6,   crit: 10,  scaleMax: 12 },
  slurryFlow:     { warn: 12,  crit: 8,   invert: true, scaleMax: 30 },
  isRunning:      { warn: 0,   crit: 0,   scaleMax: 1 }, // no se usa para niveles
};

// Devuelve el nivel según la configuración (invert=true cuando menor es peor)
export function levelFor(metric: CuttingMetric, value: number): Level {
  const t = CUTTING_THRESHOLDS[metric];
  if (!t?.invert) return value >= t.crit ? "crit" : value >= t.warn ? "warn" : "ok";
  return value <= t.crit ? "crit" : value <= t.warn ? "warn" : "ok";
}

export function levelTextCls(l: Level): string {
  return l === "crit" ? "text-red-500" : l === "warn" ? "text-amber-500" : "text-emerald-500";
}

export function levelChipCls(l: Level): string {
  return l === "crit"
    ? "bg-red-500/15 text-red-500 border-red-500/40"
    : l === "warn"
    ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
    : "bg-emerald-500/15 text-emerald-500 border-emerald-500/40";
}

// Hook para calcular el periodo de giro de la imagen de la corona
export function useSpinPeriod(rpm: number, enabled: boolean, slowdown = 4, minPeriodSec = 8) {
  const active = enabled && rpm > 0;
  if (!active) return 0;
  // 60/rpm es s/vuelta; lo frenamos y aseguramos mínimo
  const raw = slowdown * (60 / Math.max(0.1, rpm));
  return Math.max(minPeriodSec, raw);
}

// Ayuda a obtener el peor nivel de un conjunto
export function worstLevel(levels: Level[]): Level {
  return levels.includes("crit") ? "crit" : levels.includes("warn") ? "warn" : "ok";
}
