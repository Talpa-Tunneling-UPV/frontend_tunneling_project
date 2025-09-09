import { useRef, useState } from "react";
import { FaWater } from "react-icons/fa6";
import { GiPositionMarker, GiClockwiseRotation } from "react-icons/gi";
import { MdGasMeter } from "react-icons/md";
import { PiGauge } from "react-icons/pi";
import { TbTemperature } from "react-icons/tb";
import { ModalSensor } from "./ModalSensor";
import { createPortal } from "react-dom";
import type { sensorInterface, sensorsTypes } from "../../types";

interface tabInterface {
  title: string;
  type: sensorsTypes;
}

const getStatusColor = (
  status: "online" | "advertencia" | "error" | "offline"
) => {
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

const getIcon = (type: sensorsTypes) => {
  switch (type) {
    case "presion":
      return <PiGauge />;
    case "caudal":
      return <FaWater />;
    case "gas":
      return <MdGasMeter />;
    case "posicion":
      return <GiPositionMarker />;
    case "rotacion":
      return <GiClockwiseRotation />;
    case "temperatura":
      return <TbTemperature />;
    default:
      return null;
  }
};
const tabs: tabInterface[] = [
  {
    title: "Todos",
    type: "todos",
  },
  {
    title: "Presión",
    type: "presion",
  },
  {
    title: "Temperatura",
    type: "temperatura",
  },
  {
    title: "Posición",
    type: "posicion",
  },
  {
    title: "Rotación",
    type: "rotacion",
  },
  {
    title: "Caudal",
    type: "caudal",
  },
  {
    title: "Gas",
    type: "gas",
  },
];





export const SensorsList = ({data}: {data: sensorInterface[]}) => {
  const [activeTab, setActiveTab] = useState<sensorsTypes>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSensor = useRef<null | sensorInterface>(null)
  const handleOnOpenModal = (sensor: sensorInterface) => {
    selectedSensor.current = sensor;
    setIsModalOpen(true);
  }
  const getFilteredSensors = () => {
    if (activeTab === "todos") {
      return data;
    }
    return data.filter(sensor => sensor.type == activeTab)
  };

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => setActiveTab(tab.type)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.type
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <div className="flex justify-center items-center">
                <div className="flex gap-1 justify-center items-center">
                  {getIcon(tab.type)}
                  {tab.title}
                </div>
                <span className="ml-1 px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {tab.type === "todos" ? data.length : data.filter(sensor => sensor.type === tab.type).length}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid max-h-[52vh] overflow-auto gap-4">
        {getFilteredSensors().map((sensor) => (
          <div key={sensor.title} className="bg-card border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getIcon(sensor.type)}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">
                  {sensor.title}
                </h3>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Valor:{" "}
                    <span className="font-bold text-lg">
                      {sensor.value + sensor.units}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      sensor.status
                    )}`}
                  >
                    {sensor.status}
                  </span>
                  <button
                    onClick={() => handleOnOpenModal(sensor)}
                    className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
        isModalOpen && createPortal(<ModalSensor sensor={selectedSensor.current} setOpen={setIsModalOpen} />, document.body)
      }
    </div>
  );
};
