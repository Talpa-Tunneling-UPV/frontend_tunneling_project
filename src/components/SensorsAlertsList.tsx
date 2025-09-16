import { MdErrorOutline, MdOutlineWarning } from "react-icons/md";
import type { sensorInterface, statusTypes } from "../types";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalSensor } from "./SensorsList/ModalSensor";


export const SensorsAlertsList = ({ data }: { data: sensorInterface[]}) => {

  return (
    <div className="bg-card flex flex-col gap-2 border border-accent rounded-xl min-h-full max-h-[30vh] p-2">
      <div className="flex justify-center font-semibold text-2xl pb-2">
        Sensores en alerta
      </div>
      {/* Here is the alert list */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden overflow-y-auto">
        {data.filter(el => el.status === "advertencia" || el.status === "error").map((alert) => (
            <AlertRow key={alert.title+alert.status} {...alert} />
        ))}
      </div>
    </div>
  );
};

const AlertRow = (alert: sensorInterface) => {

  const getAlertStyles = (alertType: statusTypes) => {
    switch (alertType) {
      case "advertencia":
        return {
          container: "bg-amber-950/20 border-amber-800/30",
          icon: "bg-amber-600/80",
          text: "text-amber-200",
          badge: "bg-amber-700/80",
          button:
            "bg-amber-900/30 text-amber-300 border-amber-700/50 hover:bg-amber-900/50",
        };
      case "error":
        return {
          container: "bg-red-950/20 border-red-800/30",
          icon: "bg-red-600/80",
          text: "text-red-200",
          badge: "bg-red-700/80",
          button:
            "bg-red-900/30 text-red-300 border-red-700/50 hover:bg-red-900/50",
        };
      default:
        return {
          container: "bg-muted border-border",
          icon: "bg-muted-foreground",
          text: "text-muted-foreground",
          badge: "bg-muted-foreground",
          button: "bg-card text-muted-foreground border-border hover:bg-muted",
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
            className={`rounded-md px-3 py-1 text-xs font-medium text-white ${styles.badge}`}
          >
            {alert.status === "error" ? "Error" : "Advertencia"}
          </span>
          <button
            onClick={() => {
              selectedSensor.current = alert;
              setIsModalOpen(true);
            }}
            className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${styles.button}`}
          >
            Detalles
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
