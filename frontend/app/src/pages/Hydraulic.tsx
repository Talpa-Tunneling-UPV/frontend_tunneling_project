
import { useEffect, useMemo, useState } from "react";
import { Gauge } from "../components/Gauge";
import OilLevelsList from "../components/OilLevelsList";
import type { PressureData, OilTank, Temperatures, SystemData, Level } from "../types/hydraulic";
import { PRESSURE_MAX_MAIN, PRESSURE_MAX_RETURN, TEMP_MAX, thresholds, levelFor, levelTextCls, levelChipCls } from "../utils/hydraulic";

/* =========================
   Tipos de datos
   ========================= */
/* =========================
  Umbrales (importados de utils)
  ========================= */

/* =========================
   Componente
   ========================= */
export const Hydraulic = () => {
  const [pressureData, setPressureData] = useState<PressureData>({ main: 72.6, return: 23.8 });
  const [oilLevels, setOilLevels] = useState<OilTank[]>([
    { id: "main", name: "Tanque principal", levelPct: 50, capacityL: 1000 },
    { id: "aux", name: "Tanque auxiliar", levelPct: 80, capacityL: 1000 },
    { id: "res", name: "Reserva", levelPct: 25, capacityL: 1000 },
  ]);
  const [temperatures, setTemperatures] = useState<Temperatures>({ inlet: 37.6, outlet: 45.7 });
  const [systemData, setSystemData] = useState<SystemData>({
    flowRate: 45.2,
    viscosity: 32,
    operatingHours: 1247,
    efficiency: 87,
    filterStatus: "OK",
    maintenanceAlert: false,
  });

  // Simulación de telemetría (puedes reemplazar por WebSocket/Query)
  useEffect(() => {
    const interval = setInterval(() => {
      setPressureData((p) => ({
        main: Math.max(0, Math.min(PRESSURE_MAX_MAIN, p.main + (Math.random() - 0.5) * 2)),
        return: Math.max(0, Math.min(PRESSURE_MAX_RETURN, p.return + (Math.random() - 0.5) * 1)),
      }));

      setTemperatures((t) => ({
        inlet: Math.max(20, Math.min(TEMP_MAX, t.inlet + (Math.random() - 0.5) * 0.5)),
        outlet: Math.max(20, Math.min(TEMP_MAX, t.outlet + (Math.random() - 0.5) * 0.5)),
      }));

      setOilLevels((prev) =>
        prev.map((tank) => ({
          ...tank,
          levelPct: Math.max(10, Math.min(95, tank.levelPct + (Math.random() - 0.5) * 1)),
        }))
      );

      setSystemData((s) => ({
        ...s,
        flowRate: Math.max(30, Math.min(60, s.flowRate + (Math.random() - 0.5) * 2)),
        efficiency: Math.max(70, Math.min(95, s.efficiency + (Math.random() - 0.5) * 1)),
        operatingHours: s.operatingHours + 0.01,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Derivar niveles
  const mainPressureLv: Level = levelFor(
    pressureData.main,
    thresholds.pressureMain.warn,
    thresholds.pressureMain.crit
  );
  const returnPressureLv: Level = levelFor(
    pressureData.return,
    thresholds.pressureReturn.warn,
    thresholds.pressureReturn.crit
  );
  const inletTempLv: Level = levelFor(
    temperatures.inlet,
    thresholds.tempIn.warn,
    thresholds.tempIn.crit
  );
  const outletTempLv: Level = levelFor(
    temperatures.outlet,
    thresholds.tempOut.warn,
    thresholds.tempOut.crit
  );
  const efficiencyLv: Level = levelFor(
    systemData.efficiency,
    thresholds.efficiency.warn,
    thresholds.efficiency.crit,
    true
  );

  const deltaPressure = useMemo(() => (pressureData.main - pressureData.return).toFixed(1), [pressureData]);
  const deltaTemp = useMemo(() => (temperatures.outlet - temperatures.inlet).toFixed(1), [temperatures]);

  return (
  <div className="h-screen w-full overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold text-foreground p-6 pb-4">Sistema Hidráulico - Microtuneladora</h1>
        <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Presiones del sistema */}
          <div className="bg-card border border-border rounded-xl p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Presiones del sistema</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${levelChipCls(mainPressureLv)}`}>
                Principal: {pressureData.main.toFixed(1)} bar
              </span>
            </div>

            {/* Gauges de presión */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center">
                <Gauge
                  value={pressureData.main}
                  max={PRESSURE_MAX_MAIN}
                  size={260}
                  thickness={14}
                  label="Presión principal"
                  units="bar"
                  level={mainPressureLv}
      labelClassName="fill-foreground text-[9px] font-medium"
      valueClassName="text-sm font-semibold"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <Gauge
                  value={pressureData.return}
                  max={PRESSURE_MAX_RETURN}
                  size={260}
                  thickness={14}
                  label="Presión de retorno"
                  units="bar"
                  level={returnPressureLv}
      labelClassName="fill-foreground text-[9px] font-medium"
      valueClassName="text-sm font-semibold"
                />
              </div>
            </div>

            {/* KPIs de presión */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-muted/20 border border-border/60 rounded-lg">
                <div className="text-lg font-bold text-foreground">{deltaPressure}</div>
                <div className="text-xs text-muted-foreground">Dif. de presión</div>
              </div>
              <div className="text-center p-4 bg-muted/20 border border-border/60 rounded-lg">
                <div className="text-lg font-bold text-foreground">
                  {Math.round((pressureData.main / PRESSURE_MAX_MAIN) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">% de carga</div>
              </div>
              <div className="text-center p-4 bg-muted/20 border border-border/60 rounded-lg">
                <div className="text-lg font-bold text-primary">{systemData.flowRate.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Flujo L/min</div>
              </div>
              <div className="text-center p-4 bg-muted/20 border border-border/60 rounded-lg">
                <div className={`text-lg font-bold ${levelTextCls(efficiencyLv)}`}>{systemData.efficiency.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">Eficiencia</div>
              </div>
            </div>
          </div>

          {/* Niveles de aceite */}
          <OilLevelsList oilTanks={oilLevels} />

          {/* Estado del sistema */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Estado del sistema</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Viscosidad del aceite</span>
                <span className="font-semibold text-foreground">{systemData.viscosity} cSt</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Horas de operación</span>
                <span className="font-semibold text-foreground">{Math.round(systemData.operatingHours)} h</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Estado de filtros</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full border ${
                    systemData.filterStatus === "OK"
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/40"
                      : systemData.filterStatus === "REVISAR"
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
                      : "bg-red-500/15 text-red-500 border-red-500/40"
                  }`}
                >
                  {systemData.filterStatus}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm text-muted-foreground">Próximo mantenimiento</span>
                <span className="font-semibold text-yellow-500">250 h</span>
              </div>
            </div>
          </div>

          {/* Temperaturas */}
          <div className="bg-card border border-border rounded-xl p-6 xl:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-6">Temperaturas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="flex flex-col items-center justify-center">
                <Gauge
                  value={temperatures.inlet}
                  max={thresholds.tempIn.max}
                  size={240}
                  thickness={12}
                  label="Entrada"
                  units="°C"
                  level={inletTempLv}
                  labelClassName="fill-foreground text-[11px] font-medium"
                  valueClassName="text-sm font-semibold"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <Gauge
                  value={temperatures.outlet}
                  max={thresholds.tempOut.max}
                  size={240}
                  thickness={12}
                  label="Salida"
                  units="°C"
                  level={outletTempLv}
                  labelClassName="fill-foreground text-[11px] font-medium"
                  valueClassName="text-sm font-semibold"
                />
              </div>
            </div>

            <div className="mt-6 bg-muted/20 rounded-lg p-4 inline-flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ΔT</span>
              <span className="text-lg font-bold text-primary">+{deltaTemp} °C</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/* No subcomponentes locales; se usan componentes/ tipos compartidos */
