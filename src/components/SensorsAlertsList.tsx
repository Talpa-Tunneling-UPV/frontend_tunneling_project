import { MdErrorOutline, MdOutlineWarning } from "react-icons/md";
import type { sensorInterface, statusTypes } from "../types";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalSensor } from "./SensorsList/ModalSensor";


export const SensorsAlertsList = ({ data }: { data: sensorInterface[]}) => {

  return (
    <div className="bg-card flex flex-col border border-accent rounded-xl h-full p-4">
      <div className="flex justify-center font-semibold text-xl pb-4 flex-shrink-0">
        Sensores en alerta
      </div>
      {/* Here is the alert list */}
      <div className="flex-1 min-h-0 alerts-scroll-container">
        <div className="space-y-3 p-1">
          {data.filter(el => el.status === "advertencia" || el.status === "error").length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay sensores en alerta
            </div>
          ) : (
            data.filter(el => el.status === "advertencia" || el.status === "error").map((alert) => (
              <AlertRow key={alert.title+alert.status} {...alert} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Función para obtener el texto traducido del estado
const getStatusText = (status: "online" | "advertencia" | "error" | "offline") => {
  switch (status) {
    case "advertencia":
      return "Advertencia";
    case "error":
      return "Error";
    case "online":
      return "En línea";
    case "offline":
      return "Sin conexión";
  }
};

const AlertRow = (alert: sensorInterface) => {

  // Función unificada de colores de estado - igual que en SensorsList
  const getStatusColor = (status: "online" | "advertencia" | "error" | "offline") => {
    switch (status) {
      case "online":
        return "text-emerald-400 bg-emerald-950/20";
      case "advertencia":
        return "text-amber-400 bg-amber-950/20";
      case "error":
        return "text-red-400 bg-red-950/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getAlertStyles = (alertType: statusTypes) => {
    switch (alertType) {
      case "advertencia":
        return {
          container: "bg-amber-950/20 border-amber-800/30",
          icon: "bg-amber-600/80",
          text: "text-amber-200",
        };
      case "error":
        return {
          container: "bg-red-950/20 border-red-800/30",
          icon: "bg-red-600/80",
          text: "text-red-200",
        };
      default:
        return {
          container: "bg-muted border-border",
          icon: "bg-muted-foreground",
          text: "text-muted-foreground",
        };
    }
  };

  const styles = getAlertStyles(alert.status);
  const isError = alert.status === "error";
  const selectedSensor = useRef<sensorInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.icon}`}
          >
            {isError ? (
              <MdErrorOutline color="white" />
            ) : (
              <MdOutlineWarning color="white" />
            )}
          </div>
          <span className={`font-medium ${styles.text}`}>{alert.title}</span>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center ${getStatusColor(alert.status)}`}
          >
            {getStatusText(alert.status)}
          </span>
          <button
            onClick={() => {
              selectedSensor.current = alert;
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-sm font-medium bg-muted text-foreground border border-border hover:bg-muted/80 rounded-md transition-colors"
          >
            +
          </button>
        </div>
      </div>
      { isModalOpen && createPortal(
        <ModalSensor setOpen={setIsModalOpen} sensor={selectedSensor.current} />,
        document.body
      )}
    </div>
  );
};
