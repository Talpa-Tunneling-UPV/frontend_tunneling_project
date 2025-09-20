import { ProgressBar } from "../components/ProgressBar"
import { CuttingHeadMap } from "../components/CuttingHeadMap"
import UnifiedAlertsAndEvents from "../components/UnifiedAlertsAndEvents"
import type { sensorInterface } from "../types"

type eventType = "info" | "warning" | "error"
type MetricCard = { title: string; value: number; measure: string; maxValue: number }
type EventLogItem = { id: string; timestamp: string; description: string; type: eventType }

const DEMO_EVENTS: EventLogItem[] = [
  { id: "1", timestamp: "2025-09-18 19:45:00", description: "Sistema iniciado correctamente", type: "info" },
  { id: "2", timestamp: "2025-09-18 19:42:15", description: "Conexión con PLC establecida", type: "info" },
  { id: "3", timestamp: "2025-09-18 19:40:30", description: "Fallo en comunicación con sensor de gas", type: "error" },
  { id: "4", timestamp: "2025-09-18 19:38:45", description: "Temperatura del motor elevada", type: "warning" },
  { id: "5", timestamp: "2025-09-18 19:35:20", description: "Mantenimiento programado completado", type: "info" },
  { id: "6", timestamp: "2025-09-18 19:32:10", description: "Presión del circuito fuera de rango", type: "warning" },
  { id: "7", timestamp: "2025-09-18 19:30:05", description: "Backup de datos realizado", type: "info" },
  { id: "8", timestamp: "2025-09-18 19:28:00", description: "Alerta de vibración excesiva", type: "warning" },
  { id: "9", timestamp: "2025-09-18 19:25:30", description: "Error en sensor de posición", type: "error" },
  { id: "10", timestamp: "2025-09-18 19:23:15", description: "Sistema de refrigeración activado", type: "info" },
  { id: "11", timestamp: "2025-09-18 19:20:45", description: "Presión hidráulica baja", type: "warning" },
  { id: "12", timestamp: "2025-09-18 19:18:20", description: "Calibración de sensores completada", type: "info" },
  { id: "13", timestamp: "2025-09-18 19:15:10", description: "Fallo crítico en motor principal", type: "error" },
  { id: "14", timestamp: "2025-09-18 19:12:35", description: "Temperatura de aceite elevada", type: "warning" },
  { id: "15", timestamp: "2025-09-18 19:10:00", description: "Inicio de secuencia de perforación", type: "info" },
]

const DEMO_METRICS: MetricCard[] = [
  { title: "Presion", value: 43.0, measure: "Bar", maxValue: 65 },
  { title: "Velocidad", value: 0.1, measure: "m/s", maxValue: 0.5 },
  { title: "Temperatura", value: 70, measure: "C", maxValue: 130 },
  { title: "Torque", value: 20, measure: "RPM", maxValue: 50 },
]

const DEMO_SENSORS: sensorInterface[] = [
  {
    title: "Presión del circuito de avance",
    value: 180,
    units: "bar",
    status: "online",
    type: "presion"
  },
  {
    title: "Presión en cabeza de corte",
    value: 220,
    units: "bar",
    status: "advertencia",
    type: "presion"
  },
  {
    title: "Temperatura aceite hidráulico",
    value: 95,
    units: "°C",
    status: "error",
    type: "temperatura"
  },
  {
    title: "Desviación horizontal (Láser)",
    value: -25,
    units: "mm",
    status: "error",
    type: "posicion"
  },
  {
    title: "Velocidad de rotación",
    value: 15,
    units: "rpm",
    status: "advertencia",
    type: "rotacion"
  },
  {
    title: "Caudal de lodos",
    value: 85,
    units: "m³/h",
    status: "advertencia",
    type: "caudal"
  },
  {
    title: "Detector de Metano (CH4)",
    value: 1200,
    units: "ppm",
    status: "error",
    type: "gas"
  },
]

function Home() {
  const events: EventLogItem[] = DEMO_EVENTS

  return (
    <div className="h-full flex flex-col w-full bg-background overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
        Dashboard
      </h1>
      <div className="flex-1 overflow-hidden px-3 lg:px-4 pb-3 lg:pb-4 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0 mb-3 dashboard-metrics">
          {DEMO_METRICS.map(metric => (
            <div key={metric.title} className="rounded-lg border border-accent bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-1 p-2 relative">
                <div className="text-xs text-muted-foreground">
                  {metric.title}
                </div>
                <div className="tracking-tight text-base font-semibold tabular-nums">
                  {`${metric.value} ${metric.measure}`}
                </div>
              </div>
              <div className="flex p-2 pt-0 flex-col items-start gap-1 text-sm">
                <ProgressBar maxValue={metric.maxValue} currentValue={metric.value} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Columna izquierda: Vistas de cabeza de corte y lateral */}
          <div className="min-h-0" style={{ height: '100%' }}>
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0" style={{ minHeight: '500px' }}>
                <CuttingHeadMap />
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Alertas y eventos unificados */}
          <div className="min-h-0" style={{ height: '100%' }}>
            <UnifiedAlertsAndEvents sensors={DEMO_SENSORS} events={events} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
