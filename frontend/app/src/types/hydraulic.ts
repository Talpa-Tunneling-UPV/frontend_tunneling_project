export type Level = "ok" | "warn" | "crit";

export type PressureData = { main: number; return: number };

export type OilTank = {
  id: string;
  name: string;
  levelPct: number; // 0..100
  capacityL: number; // capacidad en litros
};

export type Temperatures = { inlet: number; outlet: number };

export type SystemData = {
  flowRate: number; // L/min
  viscosity: number; // cSt
  operatingHours: number;
  efficiency: number; // %
  filterStatus: "OK" | "REVISAR" | "CAMBIAR";
  maintenanceAlert: boolean;
};
