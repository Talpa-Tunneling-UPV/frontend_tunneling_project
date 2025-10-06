import { useState } from "react";
import { MdErrorOutline, MdOutlineWarning, MdOutlineSensors } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { MdEvent } from "react-icons/md";
import { createPortal } from "react-dom";
import { ModalSensor } from "./SensorsList/ModalSensor";
import type { sensorInterface } from "../types";

type EventType = "info" | "warning" | "error";
type SourceType = "todos" | "sensor" | "event";
type SeverityType = "todos" | "error" | "warning" | "info";

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
  const [selectedSource, setSelectedSource] = useState<Set<SourceType>>(new Set(["todos"]));
  const [selectedSeverity, setSelectedSeverity] = useState<Set<SeverityType>>(new Set(["todos"]));
  const [selectedSensor, setSelectedSensor] = useState<sensorInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Preparar datos unificados
  const sensorAlerts = sensors.filter(sensor => 
    sensor.status === "advertencia" || sensor.status === "error"
  ).map(sensor => ({
    id: `sensor-${sensor.title}`,
    source: "sensor" as SourceType,
    severity: sensor.status === "error" ? "error" as SeverityType : "warning" as SeverityType,
    timestamp: new Date().toLocaleString(),
    title: sensor.title,
    description: `${sensor.value} ${sensor.units}`,
    status: sensor.status,
    originalSensor: sensor
  }));

  const eventItems = events.map(event => ({
    id: `event-${event.id}`,
    source: "event" as SourceType,
    severity: event.type as SeverityType,
    timestamp: event.timestamp,
    title: event.description,
    description: "",
    status: event.type,
    originalEvent: event
  }));

  const allItems = [...sensorAlerts, ...eventItems].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Filtrar elementos con lógica mejorada
  const filteredItems = allItems.filter(item => {
    const sourceMatch = selectedSource.has("todos") || selectedSource.has(item.source);
    const severityMatch = selectedSeverity.has("todos") || selectedSeverity.has(item.severity);
    return sourceMatch && severityMatch;
  });

  const toggleSource = (source: SourceType) => {
    const newFilters = new Set(selectedSource);
    
    if (source === "todos") {
      setSelectedSource(new Set(["todos"]));
    } else {
      newFilters.delete("todos");
      
      if (newFilters.has(source)) {
        newFilters.delete(source);
        if (newFilters.size === 0) {
          newFilters.add("todos");
        }
      } else {
        newFilters.add(source);
      }
      
      setSelectedSource(newFilters);
    }
  };

  const toggleSeverity = (severity: SeverityType) => {
    const newFilters = new Set(selectedSeverity);
    
    if (severity === "todos") {
      setSelectedSeverity(new Set(["todos"]));
    } else {
      newFilters.delete("todos");
      
      if (newFilters.has(severity)) {
        newFilters.delete(severity);
        if (newFilters.size === 0) {
          newFilters.add("todos");
        }
      } else {
        newFilters.add(severity);
      }
      
      setSelectedSeverity(newFilters);
    }
  };

  const getItemIcon = (severity: SeverityType) => {
    switch (severity) {
      case "error":
        return <MdErrorOutline className="h-4 w-4 text-red-500" />;
      case "warning":
        return <MdOutlineWarning className="h-4 w-4 text-amber-500" />;
      case "info":
      default:
        return <IoMdInformationCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getItemStyles = (severity: SeverityType) => {
    switch (severity) {
      case "error":
        return {
          container: "bg-red-950/20 border-red-800/30 hover:bg-red-950/30",
          badge: "bg-red-700/80 text-white",
          text: "text-red-200"
        };
      case "warning":
        return {
          container: "bg-amber-950/20 border-amber-800/30 hover:bg-amber-950/30",
          badge: "bg-amber-700/80 text-white",
          text: "text-amber-200"
        };
      case "info":
      default:
        return {
          container: "bg-blue-950/20 border-blue-800/30 hover:bg-blue-950/30",
          badge: "bg-blue-700/80 text-white",
          text: "text-blue-200"
        };
    }
  };

  const handleItemClick = (item: any) => {
    if (item.originalSensor) {
      setSelectedSensor(item.originalSensor);
      setIsModalOpen(true);
    }
  };

  const getSourceIcon = (source: SourceType) => {
    switch (source) {
      case "sensor":
        return <MdOutlineSensors className="w-4 h-4" />;
      case "event":
        return <MdEvent className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: SeverityType) => {
    switch (severity) {
      case "error":
        return <MdErrorOutline className="w-4 h-4" />;
      case "warning":
        return <MdOutlineWarning className="w-4 h-4" />;
      case "info":
        return <IoMdInformationCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSourceCount = (source: SourceType) => {
    if (source === "todos") return allItems.length;
    return allItems.filter(item => item.source === source).length;
  };

  const getSeverityCount = (severity: SeverityType) => {
    if (severity === "todos") return allItems.length;
    return allItems.filter(item => item.severity === severity).length;
  };

  return (
    <div className="bg-card border border-accent rounded-xl h-full flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Header con título */}
      <div className="flex justify-between items-center p-4 pb-2 flex-shrink-0">
        <h2 className="text-xl font-semibold text-foreground">Alertas y Eventos</h2>
      </div>
      
      {/* Filtros unificados */}
      <div className="border-b border-border pb-4 px-4 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedSource(new Set(["todos"]));
              setSelectedSeverity(new Set(["todos"]));
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSource.has("todos") && selectedSeverity.has("todos")
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground hover:bg-muted/50"
            }`}
          >
            <span>Todos</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSource.has("todos") && selectedSeverity.has("todos")
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {allItems.length}
            </span>
          </button>
          
          <button
            onClick={() => toggleSource("sensor")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSource.has("sensor")
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-1">
              {getSourceIcon("sensor")}
              <span>Sensores</span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSource.has("sensor")
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {getSourceCount("sensor")}
            </span>
          </button>
          
          <button
            onClick={() => toggleSource("event")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSource.has("event")
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-1">
              {getSourceIcon("event")}
              <span>Eventos</span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSource.has("event")
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {getSourceCount("event")}
            </span>
          </button>
          
          <button
            onClick={() => toggleSeverity("error")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSeverity.has("error")
                ? "bg-red-600 text-white border-red-600"
                : "bg-background text-muted-foreground border-border hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20 hover:text-red-600"
            }`}
          >
            <div className="flex items-center gap-1">
              {getSeverityIcon("error")}
              <span>Error</span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSeverity.has("error")
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}>
              {getSeverityCount("error")}
            </span>
          </button>
          
          <button
            onClick={() => toggleSeverity("warning")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSeverity.has("warning")
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-background text-muted-foreground border-border hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/20 hover:text-amber-600"
            }`}
          >
            <div className="flex items-center gap-1">
              {getSeverityIcon("warning")}
              <span>Advertencia</span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSeverity.has("warning")
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}>
              {getSeverityCount("warning")}
            </span>
          </button>
          
          <button
            onClick={() => toggleSeverity("info")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              selectedSeverity.has("info")
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-background text-muted-foreground border-border hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center gap-1">
              {getSeverityIcon("info")}
              <span>Info</span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedSeverity.has("info")
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}>
              {getSeverityCount("info")}
            </span>
          </button>
        </div>
      </div>

      {/* Lista de elementos - con scroll mejorado */}
      <div className="flex-1 overflow-y-auto min-h-0 alerts-scroll-container dashboard-variant">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No hay elementos que coincidan con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="p-2 space-y-2 pb-4">
            {filteredItems.map((item) => {
              const styles = getItemStyles(item.severity);
              const isSensor = item.source === 'sensor';
              
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
                      {getItemIcon(item.severity)}
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
                          +
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