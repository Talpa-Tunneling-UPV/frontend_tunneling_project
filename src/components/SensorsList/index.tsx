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
  const [activeFilters, setActiveFilters] = useState<Set<sensorsTypes>>(new Set(["todos"]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSensor = useRef<null | sensorInterface>(null)
  
  const handleOnOpenModal = (sensor: sensorInterface) => {
    selectedSensor.current = sensor;
    setIsModalOpen(true);
  }
  
  const toggleFilter = (filterType: sensorsTypes) => {
    const newFilters = new Set(activeFilters);
    
    if (filterType === "todos") {
      // Si seleccionamos "todos", limpiamos todos los demás filtros
      setActiveFilters(new Set(["todos"]));
    } else {
      // Removemos "todos" si existe
      newFilters.delete("todos");
      
      if (newFilters.has(filterType)) {
        newFilters.delete(filterType);
        // Si no quedan filtros, activamos "todos"
        if (newFilters.size === 0) {
          newFilters.add("todos");
        }
      } else {
        newFilters.add(filterType);
      }
      
      setActiveFilters(newFilters);
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters(new Set(["todos"]));
  };
  
  const getFilteredSensors = () => {
    if (activeFilters.has("todos")) {
      return data;
    }
    return data.filter(sensor => activeFilters.has(sensor.type));
  };

  return (
    <div className="flex flex-col h-full space-y-4 bg-card border border-accent rounded-xl p-4">
      {/* Header con título y botón limpiar filtros */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-semibold text-foreground">Lista de Sensores</h2>
       {/* {!activeFilters.has("todos") && activeFilters.size > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
          >
            Limpiar filtros
          </button>
        )}*/}
      </div>
      
      {/* Filtros */}
      <div className="border-b border-border pb-4 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeFilters.has(tab.type);
            const count = tab.type === "todos" ? data.length : data.filter(sensor => sensor.type === tab.type).length;
            
            return (
              <button
                key={tab.title}
                onClick={() => toggleFilter(tab.type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-1">
                  {getIcon(tab.type)}
                  {tab.title}
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full flex items-center justify-center ${
                  isActive 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de sensores */}
      <div className="flex-1 min-h-0 alerts-scroll-container">
        <div className="space-y-3 p-2">
          {getFilteredSensors().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay sensores que coincidan con los filtros seleccionados
            </div>
          ) : (
            getFilteredSensors().map((sensor) => (
              <div key={sensor.title} className="bg-background border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {getIcon(sensor.type)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {sensor.title}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {sensor.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        Valor
                      </p>
                      <p className="font-bold text-lg text-foreground">
                        {sensor.value + sensor.units}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center ${getStatusColor(
                          sensor.status
                        )}`}
                      >
                        {getStatusText(sensor.status)}
                      </span>
                      <button
                        onClick={() => handleOnOpenModal(sensor)}
                        className="px-4 py-2 text-sm font-medium bg-muted text-foreground border border-border hover:bg-muted/80 rounded-md transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {
        isModalOpen && createPortal(<ModalSensor sensor={selectedSensor.current} setOpen={setIsModalOpen} />, document.body)
      }
    </div>
  );
};
