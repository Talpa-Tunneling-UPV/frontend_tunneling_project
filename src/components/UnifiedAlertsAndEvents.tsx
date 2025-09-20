import { useState } from "react";
import { MdErrorOutline, MdOutlineWarning, MdFilterList, MdClear } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { createPortal } from "react-dom";
import { ModalSensor } from "./SensorsList/ModalSensor";
import type { sensorInterface } from "../types";

type EventType = "info" | "warning" | "error";
type FilterType = "all" | "sensor-error" | "sensor-warning" | "event-info" | "event-warning" | "event-error";

interface Event {
  id: string;
  timestamp: string;
  description: string;
  type: EventType;
}

interface Props {
  sensors: sensorInterface[];
  events: Event[];
}

const UnifiedAlertsAndEvents = ({ sensors, events }: Props) => {
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<sensorInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Preparar datos unificados
  const sensorAlerts = sensors.filter(sensor => 
    sensor.status === "advertencia" || sensor.status === "error"
  ).map(sensor => ({
    id: `sensor-${sensor.title}`,
    type: sensor.status === "error" ? "sensor-error" as FilterType : "sensor-warning" as FilterType,
    timestamp: new Date().toLocaleString(),
    title: sensor.title,
    description: `${sensor.value} ${sensor.units}`,
    status: sensor.status,
    originalSensor: sensor
  }));

  const eventItems = events.map(event => ({
    id: `event-${event.id}`,
    type: `event-${event.type}` as FilterType,
    timestamp: event.timestamp,
    title: event.description,
    description: "",
    status: event.type,
    originalEvent: event
  }));

  const allItems = [...sensorAlerts, ...eventItems].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Filtrar elementos
  const filteredItems = activeFilters.length === 0 
    ? allItems 
    : allItems.filter(item => activeFilters.includes(item.type));

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const getItemIcon = (type: FilterType) => {
    switch (type) {
      case "sensor-error":
        return <MdErrorOutline className="h-4 w-4 text-red-500" />;
      case "sensor-warning":
        return <MdOutlineWarning className="h-4 w-4 text-amber-500" />;
      case "event-error":
        return <MdErrorOutline className="h-4 w-4 text-red-500" />;
      case "event-warning":
        return <MdOutlineWarning className="h-4 w-4 text-yellow-500" />;
      case "event-info":
      default:
        return <IoMdInformationCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getItemStyles = (type: FilterType) => {
    switch (type) {
      case "sensor-error":
      case "event-error":
        return {
          container: "bg-red-950/20 border-red-800/30 hover:bg-red-950/30",
          badge: "bg-red-700/80 text-white",
          text: "text-red-200"
        };
      case "sensor-warning":
      case "event-warning":
        return {
          container: "bg-amber-950/20 border-amber-800/30 hover:bg-amber-950/30",
          badge: "bg-amber-700/80 text-white",
          text: "text-amber-200"
        };
      case "event-info":
      default:
        return {
          container: "bg-blue-950/20 border-blue-800/30 hover:bg-blue-950/30",
          badge: "bg-blue-700/80 text-white",
          text: "text-blue-200"
        };
    }
  };

  const getFilterButtonStyle = (filter: FilterType) => {
    const isActive = activeFilters.includes(filter);
    const baseStyle = "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors";
    
    switch (filter) {
      case "sensor-error":
      case "event-error":
        return `${baseStyle} ${isActive 
          ? 'bg-red-600 text-white border-red-600' 
          : 'bg-background text-foreground border-border hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20'
        }`;
      case "sensor-warning":
      case "event-warning":
        return `${baseStyle} ${isActive 
          ? 'bg-amber-600 text-white border-amber-600' 
          : 'bg-background text-foreground border-border hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/20'
        }`;
      case "event-info":
        return `${baseStyle} ${isActive 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'bg-background text-foreground border-border hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20'
        }`;
      default:
        return `${baseStyle} ${isActive 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-background text-foreground border-border hover:bg-muted'
        }`;
    }
  };

  const getTypeLabel = (type: FilterType) => {
    switch (type) {
      case "sensor-error": return "Sensor Error";
      case "sensor-warning": return "Sensor Advertencia";
      case "event-error": return "Evento Error";
      case "event-warning": return "Evento Advertencia";
      case "event-info": return "Evento Info";
      default: return type;
    }
  };

  const handleItemClick = (item: any) => {
    if (item.originalSensor) {
      setSelectedSensor(item.originalSensor);
      setIsModalOpen(true);
    }
  };

  const availableFilters: FilterType[] = [
    ...new Set(allItems.map(item => item.type))
  ].sort();

  return (
    <div className="bg-card border border-accent rounded-xl h-full flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Header con filtros */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Alertas y Eventos</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MdFilterList className="h-4 w-4" />
            <span>{filteredItems.length} de {allItems.length}</span>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {availableFilters.map(filter => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={getFilterButtonStyle(filter)}
            >
              {getTypeLabel(filter)}
            </button>
          ))}
          
          {activeFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1"
            >
              <MdClear className="h-3 w-3" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de elementos - con scroll mejorado */}
      <div className="flex-1 overflow-y-auto min-h-0 alerts-scroll-container dashboard-variant">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MdFilterList className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay elementos que coincidan con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="p-2 space-y-2 pb-4">
            {filteredItems.map((item) => {
              const styles = getItemStyles(item.type);
              const isSensor = item.type.startsWith('sensor');
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`rounded-lg border p-3 transition-colors cursor-pointer ${styles.container} ${
                    isSensor ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getItemIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${styles.text} truncate`}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${styles.badge}`}>
                        {isSensor ? 'Sensor' : 'Evento'}
                      </span>
                      {isSensor && (
                        <button className="text-xs px-2 py-1 bg-background/50 text-foreground rounded border border-border hover:bg-background transition-colors">
                          Ver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de sensor */}
      {isModalOpen && selectedSensor && createPortal(
        <ModalSensor setOpen={setIsModalOpen} sensor={selectedSensor} />,
        document.body
      )}
    </div>
  );
};

export default UnifiedAlertsAndEvents;