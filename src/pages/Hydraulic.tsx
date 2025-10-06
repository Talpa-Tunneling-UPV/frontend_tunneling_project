
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
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
        Sistema Hidráulico
      </h1>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 lg:px-4 pb-4 min-h-0">
        {/* Layout principal en 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna izquierda - Presiones y Temperaturas */}
          <div className="space-y-4">
            {/* Métricas clave */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-foreground mb-2">Presión Principal</div>
                <div className={`text-3xl font-bold ${levelTextCls(mainPressureLv)}`}>
                  {pressureData.main.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">bar</div>
                <div className="text-xs text-muted-foreground mb-1">Carga</div>
                <div className={`text-lg font-bold ${levelTextCls(mainPressureLv)}`}>
                  {Math.round((pressureData.main / PRESSURE_MAX_MAIN) * 100)}%
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-foreground mb-2">Temperatura Salida</div>
                <div className={`text-3xl font-bold ${levelTextCls(outletTempLv)}`}>
                  {temperatures.outlet.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">°C</div>
                <div className="text-xs text-muted-foreground mb-1">Delta T</div>
                <div className="text-lg font-bold text-primary">
                  +{deltaTemp}°C
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-foreground mb-2">Eficiencia</div>
                <div className={`text-3xl font-bold ${levelTextCls(efficiencyLv)}`}>
                  {systemData.efficiency.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">%</div>
                <div className="text-xs text-muted-foreground mb-1">Estado</div>
                <div className={`text-lg font-bold ${levelTextCls(efficiencyLv)}`}>
                  {efficiencyLv === "ok" ? "Óptima" : efficiencyLv === "warn" ? "Vigilar" : "Crítica"}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-foreground mb-2">Flujo</div>
                <div className="text-3xl font-bold text-primary">
                  {systemData.flowRate.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">L/min</div>
                <div className="text-xs text-muted-foreground mb-1">Delta P</div>
                <div className="text-lg font-bold text-foreground">
                  {deltaPressure} bar
                </div>
              </div>
            </div>

            {/* Gauges de presión */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">Presiones</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <Gauge
                    value={pressureData.main}
                    max={PRESSURE_MAX_MAIN}
                    size={180}
                    thickness={12}
                    label="Principal"
                    units="bar"
                    level={mainPressureLv}
                    labelClassName="fill-foreground text-[10px] font-medium"
                    valueClassName="text-sm font-bold"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <Gauge
                    value={pressureData.return}
                    max={PRESSURE_MAX_RETURN}
                    size={180}
                    thickness={12}
                    label="Retorno"
                    units="bar"
                    level={returnPressureLv}
                    labelClassName="fill-foreground text-[10px] font-medium"
                    valueClassName="text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Temperaturas */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">Temperaturas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <Gauge
                    value={temperatures.inlet}
                    max={thresholds.tempIn.max}
                    size={160}
                    thickness={10}
                    label="Entrada"
                    units="°C"
                    level={inletTempLv}
                    labelClassName="fill-foreground text-[10px] font-medium"
                    valueClassName="text-sm font-bold"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <Gauge
                    value={temperatures.outlet}
                    max={thresholds.tempOut.max}
                    size={160}
                    thickness={10}
                    label="Salida"
                    units="°C"
                    level={outletTempLv}
                    labelClassName="fill-foreground text-[10px] font-medium"
                    valueClassName="text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Niveles y Estado */}
          <div className="space-y-4">
            {/* Niveles de aceite */}
            <OilLevelsList oilTanks={oilLevels} />

            {/* Estado del sistema */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">Estado del Sistema</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-foreground">Viscosidad</span>
                  </div>
                  <span className="font-bold text-foreground">{systemData.viscosity} <span className="text-xs text-muted-foreground">cSt</span></span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-foreground">Horas operación</span>
                  </div>
                  <span className="font-bold text-foreground">{Math.round(systemData.operatingHours)} <span className="text-xs text-muted-foreground">h</span></span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      systemData.filterStatus === "OK" ? "bg-emerald-500" :
                      systemData.filterStatus === "REVISAR" ? "bg-amber-500" : "bg-red-500"
                    }`}></div>
                    <span className="text-sm font-medium text-foreground">Estado filtros</span>
                  </div>
                  <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                    systemData.filterStatus === "OK"
                      ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/40"
                      : systemData.filterStatus === "REVISAR"
                      ? "bg-amber-500/15 text-amber-500 border border-amber-500/40"
                      : "bg-red-500/15 text-red-500 border border-red-500/40"
                  }`}>
                    {systemData.filterStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-foreground">Mantenimiento en</span>
                  </div>
                  <span className="font-bold text-amber-600 dark:text-amber-500">250 <span className="text-xs">h</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

