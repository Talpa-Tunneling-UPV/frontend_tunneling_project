export interface sensorInterface {
  title: string;
  value: number;
  units: string;
  type: sensorsTypes;
  status: statusTypes;
}

export type statusTypes = "online" | "advertencia" | "error" | "offline";

export type sensorsTypes =
  | "todos"
  | "presion"
  | "temperatura"
  | "posicion"
  | "rotacion"
  | "caudal"
  | "gas";
