import React from "react";
import { ProgressBar } from "../components/ProgressBar";
import type { CuttingTelemetry, Level } from "../types/cutting";
import { CUTTING_THRESHOLDS as THRESHOLDS, levelFor, levelTextCls, levelChipCls, useSpinPeriod, worstLevel } from "../utils/cutting";

/* =========================
   Datos de ejemplo (mock)
   ========================= */
const cuttingData: CuttingTelemetry = {
  rpm: 14.6,
  torque: 780,
  temperature: 68.3,
  wearLevel: 32,
  advanceRate: 8.4,
  cutterPressure: 95,
  vibration: 3.2,
  slurryFlow: 18.5,
  isRunning: true, // estado real del cabezal
};

/* =========================
   Subcomponentes UI
   ========================= */

function Kpi(props: { label: string; value: string; hint?: string }) {
  return (
    <div className="text-center p-4 bg-muted/60 border border-border/60 rounded-lg">
      <div className="text-xl font-bold text-foreground">{props.value}</div>
      <div className="text-xs text-muted-foreground">{props.label}</div>
      {props.hint && <div className="text-[10px] text-muted-foreground/80 mt-1">{props.hint}</div>}
    </div>
  );
}

/* =========================
   Página
   ========================= */

export const Cutting = () => {
  // Niveles por métrica usando la tabla centralizada de umbrales
  const rpmLv  = levelFor("rpm", cuttingData.rpm);
  const tqLv   = levelFor("torque", cuttingData.torque);
  const tempLv = levelFor("temperature", cuttingData.temperature);
  const wearLv = levelFor("wearLevel", cuttingData.wearLevel);
  const vibLv  = levelFor("vibration", cuttingData.vibration);
  const presLv = levelFor("cutterPressure", cuttingData.cutterPressure);
  const flowLv = levelFor("slurryFlow", cuttingData.slurryFlow);
  const advLv  = levelFor("advanceRate", cuttingData.advanceRate);

  // Peor estado global
  const worst: Level = worstLevel([rpmLv, tqLv, tempLv, wearLv, vibLv, presLv, flowLv, advLv]);

  // Preferencia de UI: activar/desactivar animación de giro (no afecta isRunning)
  const [spinEnabled, setSpinEnabled] = React.useState(true);

  // Giro más lento: factor de desaceleración + periodo mínimo
  const spinPeriodSec = useSpinPeriod(cuttingData.rpm, cuttingData.isRunning && spinEnabled, 4, 8);

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
        Sistema de Corte
      </h1>
      <div className="flex-1 overflow-hidden px-3 lg:px-4 pb-3 lg:pb-4 min-h-0 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl w-full">
        {/* Left Card: imagen con animación y toggle de UI */}
        <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">Corona de Corte</h3>
              {/* Toggle para activar/desactivar solo la animación visual */}
              <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                Giro visual
                <button
                  type="button"
                  role="switch"
                  aria-checked={spinEnabled}
                  onClick={() => setSpinEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                    spinEnabled ? "bg-primary/80 border-primary" : "bg-muted border-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-card shadow transition-transform ${
                      spinEnabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Imagen de la corona: gira solo si isRunning y el toggle están activos */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto">
              <img
                src="/cutting_head.png"
                alt="Corona de Corte"
                className={`w-full h-full ${spinEnabled && cuttingData.isRunning ? "animate-spin" : ""}`}
                style={
                  spinEnabled && cuttingData.isRunning
                    ? { animationDuration: `${spinPeriodSec}s`, animationTimingFunction: "linear", willChange: "transform" }
                    : undefined
                }
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Estado:{" "}
              <span className={`font-medium px-2 py-0.5 rounded-full border ${levelChipCls(worst)}`}>
                {cuttingData.isRunning
                  ? worst === "ok" ? "Operativo" : worst === "warn" ? "Advertencia" : "Crítico"
                  : "Parado"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: parámetros con ProgressBar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Parámetros de Operación</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${levelChipCls(worst)}`}>
              {worst === "ok" ? "Estable" : worst === "warn" ? "Vigilar" : "Intervenir"}
            </span>
          </div>

          {/* KPIs principales */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Kpi label="Vel. Rotación" value={`${cuttingData.rpm.toFixed(1)} RPM`} />
            <Kpi label="Torque" value={`${cuttingData.torque.toFixed(0)} Nm`} />
            <Kpi label="Presión Cabezal" value={`${cuttingData.cutterPressure.toFixed(0)} bar`} />
          </div>

      {/* Filas con etiqueta + valor + ProgressBar (usa tus tokens y escalas) */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Temperatura</span>
                <span className={`text-sm font-semibold ${levelTextCls(tempLv)}`}>{cuttingData.temperature.toFixed(1)} °C</span>
              </div>
        <ProgressBar currentValue={cuttingData.temperature} maxValue={THRESHOLDS.temperature.scaleMax} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Desgaste de Herramientas</span>
                <span className={`text-sm font-semibold ${levelTextCls(wearLv)}`}>{cuttingData.wearLevel}%</span>
              </div>
        <ProgressBar currentValue={cuttingData.wearLevel} maxValue={THRESHOLDS.wearLevel.scaleMax} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Vibración</span>
                <span className={`text-sm font-semibold ${levelTextCls(vibLv)}`}>{cuttingData.vibration.toFixed(1)} mm/s</span>
              </div>
        <ProgressBar currentValue={cuttingData.vibration} maxValue={THRESHOLDS.vibration.scaleMax} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Caudal de Lodos</span>
                <span className={`text-sm font-semibold ${levelTextCls(flowLv)}`}>{cuttingData.slurryFlow.toFixed(1)} m³/h</span>
              </div>
        <ProgressBar currentValue={cuttingData.slurryFlow} maxValue={THRESHOLDS.slurryFlow.scaleMax} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Avance</span>
                <span className={`text-sm font-semibold ${levelTextCls(advLv)}`}>{cuttingData.advanceRate.toFixed(1)} m/h</span>
              </div>
        <ProgressBar currentValue={cuttingData.advanceRate} maxValue={THRESHOLDS.advanceRate.scaleMax} />
            </div>
          </div>

          {/* Métricas adicionales compactas */}
          <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-border">
            <div className="text-center p-3 bg-muted/60 border border-border/60 rounded-lg">
              <div className={`text-lg font-bold ${levelTextCls(tempLv)}`}>{cuttingData.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-muted-foreground">Temp. Cabezal</div>
            </div>
            <div className="text-center p-3 bg-muted/60 border border-border/60 rounded-lg">
              <div className={`text-lg font-bold ${levelTextCls(wearLv)}`}>{cuttingData.wearLevel}%</div>
              <div className="text-xs text-muted-foreground">Desgaste</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

/*
API esperada para Cutting (mínimo viable)
----------------------------------------
GET /api/cutting/telemetry
{
  rpm: number,
  torque: number,
  temperature: number,
  wearLevel: number,
  advanceRate: number,
  cutterPressure: number,
  vibration: number,
  slurryFlow: number,
  isRunning: boolean,
  updatedAt?: string // ISO opcional
}

Opcionales útiles
- GET /api/cutting/thresholds
  Map de umbrales para sobreescribir CUTTING_THRESHOLDS si quieres que vengan del backend.
  {
    temperature: { warn: number, crit: number, scaleMax: number },
    ...
  }

- Tiempo real: WS/SSE en /ws/cutting con mensajes parciales
  { rpm?:number, torque?:number, isRunning?:boolean, ... }

Contratos/Notas
- Los valores son números en unidades del UI (°C, Nm, bar, etc.).
- Si cambian las unidades, ajusta el front o devuelve también { units: {...} }.
- La vista sólo necesita lectura; acciones (start/stop) pueden ir en otro endpoint.
*/
