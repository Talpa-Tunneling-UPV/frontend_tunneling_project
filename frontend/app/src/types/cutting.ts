// Tipos de dominio para la página de Corte (Cutting)

export type Level = "ok" | "warn" | "crit";

export type CuttingTelemetry = {
  rpm: number;              // Velocidad de rotación
  torque: number;           // Nm
  temperature: number;      // °C
  wearLevel: number;        // %
  advanceRate: number;      // m/h
  cutterPressure: number;   // bar
  vibration: number;        // mm/s
  slurryFlow: number;       // m³/h (caudal lodo)
  isRunning: boolean;       // Cabezal en marcha
};

export type ThresholdCfg = {
  warn: number;
  crit: number;
  invert?: boolean;  // cuando menor es peor
  scaleMax: number;  // máximo para barras
};

export type CuttingMetric = keyof CuttingTelemetry;
