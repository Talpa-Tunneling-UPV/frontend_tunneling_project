import { DashboardGraphic, type DataPoint } from "../components/DashboardGraphic"
import { EventLog } from "../components/EventLog"
import { ProgressBar } from "../components/ProgressBar"

type eventType = "info" | "warning" | "error"

// Tipos locales de datos que esperamos de la API
type MetricCard = { title: string; value: number; measure: string; maxValue: number }
type EventLogItem = { id: string; timestamp: string; description: string; type: eventType }

// Datos demo por defecto (fallback mientras no haya API)
const DEMO_EVENTS: EventLogItem[] = [
  { id: "1", timestamp: "2025-08-11 10:00:00", description: "Usuario 'admin' inició sesión.", type: "info" },
  { id: "2", timestamp: "2025-08-11 10:05:15", description: "Se creó un nuevo registro de producto.", type: "info" },
  { id: "3", timestamp: "2025-08-11 10:10:30", description: "Error al procesar la solicitud de pago.", type: "error" },
  { id: "4", timestamp: "2025-08-11 10:15:45", description: "Se actualizó la configuración del sistema.", type: "info" },
  { id: "5", timestamp: "2025-08-11 10:20:00", description: "Tarea programada 'limpieza de caché' completada.", type: "info" },
  { id: "6", timestamp: "2025-08-11 10:25:10", description: "Intento de acceso fallido desde IP 192.168.1.100.", type: "warning" },
  { id: "7", timestamp: "2025-08-11 10:30:20", description: "Notificación de stock bajo para el artículo X.", type: "warning" },
  { id: "8", timestamp: "2025-08-11 10:35:30", description: "Se generó un informe mensual de ventas.", type: "info" },
  { id: "9", timestamp: "2025-08-11 10:40:40", description: "Copia de seguridad de la base de datos fallida.", type: "error" },
  { id: "10", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" },
]

const DEMO_METRICS: MetricCard[] = [
  { title: "Presion", value: 43.0, measure: "Bar", maxValue: 65 },
  { title: "Velocidad", value: 0.1, measure: "m/s", maxValue: 0.5 },
  { title: "Temperatura", value: 70, measure: "°C", maxValue: 130 },
  { title: "Torque", value: 20, measure: "RPM", maxValue: 50 },
]


export const Home = () => {
  // Integración con TanStack Query y WS (Redis pub/sub) – sin polling:
  // - Usar @tanstack/react-query solo para carga inicial (snapshot) y cache (sin polling).
  // - Tiempo real por WebSocket: el backend reenvía mensajes de Redis pub/sub (telemetry y events).
  //
  // Ejemplos (pseudocódigo, descomentarlo al integrar React Query):
  // const metricsQuery = useQuery({
  //   queryKey: ['metrics','current'],
  //   queryFn: () => fetch('/api/metrics/current').then(r => r.json() as Promise<MetricCard[]>),
  //   staleTime: 30_000,   // cachea 30s o el tiempo que convenga
  //   gcTime: 5 * 60_000,
  //   refetchOnWindowFocus: false,
  //   refetchInterval: false, // sin polling
  // })
  // // Pre-carga opcional de eventos (snapshot inicial). El flujo principal de eventos es por WS.
  // const eventsQuery = useQuery({
  //   queryKey: ['events', { limit: 100 }],
  //   queryFn: () => fetch('/api/events?limit=100').then(r => r.json() as Promise<EventLogItem[]>),
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  //   refetchInterval: false,
  // })
  // const dashboardHistQuery = useQuery({
  //   queryKey: ['telemetry','dashboard',{ from, to, interval: '1h' }],
  //   queryFn: () => fetch(`/api/telemetry/dashboard?from=${from}&to=${to}&interval=1h`).then(r => r.json() as Promise<DataPoint[]>),
  //   staleTime: Infinity, // histórico no cambia
  //   refetchOnWindowFocus: false,
  //   refetchInterval: false, // sin polling
  // })
  //
  // WebSocket (Redis pub/sub a través del backend):
  // - Conectar a wss://<host>/ws
  // - Suscribirse a canales: telemetry:dashboard (gráficos) y events (registro)
  // - Actualizar caches de React Query manualmente (queryClient.setQueryData) al recibir mensajes
  //
  // Ejemplo (pseudocódigo):
  // useEffect(() => {
  //   const ws = new WebSocket('wss://<host>/ws')
  //   ws.onopen = () => ws.send(JSON.stringify({ action: 'subscribe', channels: ['telemetry:dashboard','events'] }))
  //   ws.onmessage = (ev) => {
  //     const msg = JSON.parse(ev.data)
  //     if (msg.channel === 'telemetry:dashboard') {
  //       const point: DataPoint = msg.payload
  //       queryClient.setQueryData(['telemetry','dashboard','live'], (prev: DataPoint[] = []) => [...prev, point].slice(-12))
  //     }
  //     if (msg.channel === 'events') {
  //       const evt: EventLogItem = msg.payload
  //       // Prepend y recorta buffer. Si precargaste con Query, actualiza esa cache.
  //       queryClient.setQueryData(['events',{ limit: 100 }], (prev: EventLogItem[] = []) => [evt, ...prev].slice(0, 100))
  //     }
  //   }
  //   return () => ws.close()
  // }, [])

  // Datos demo (constantes) mientras se integra React Query y WS
  
  
  // const metrics: MetricCard[] = DEMO_METRICS
  
  console.log(import.meta.env)

  const events: EventLogItem[] = DEMO_EVENTS
  const DASHBOARD_DATA: DataPoint[] = [
    { name: '00:00', presion: 20, torque: 35, velocidad: 40, temperatura: 22 },
    { name: '01:00', presion: 28, torque: 38, velocidad: 45, temperatura: 24 },
    { name: '02:00', presion: 35, torque: 42, velocidad: 50, temperatura: 26 },
    { name: '03:00', presion: 42, torque: 47, velocidad: 55, temperatura: 28 },
    { name: '04:00', presion: 50, torque: 53, velocidad: 60, temperatura: 30 },
    { name: '05:00', presion: 58, torque: 60, velocidad: 64, temperatura: 33 },
    { name: '06:00', presion: 65, torque: 66, velocidad: 68, temperatura: 36 },
    { name: '07:00', presion: 72, torque: 70, velocidad: 73, temperatura: 39 },
    { name: '08:00', presion: 78, torque: 74, velocidad: 76, temperatura: 42 },
    { name: '09:00', presion: 83, torque: 78, velocidad: 80, temperatura: 45 },
    { name: '10:00', presion: 88, torque: 82, velocidad: 84, temperatura: 48 },
    { name: '11:00', presion: 92, torque: 86, velocidad: 88, temperatura: 50 },
  ]

  return (
    <div className="h-full flex flex-col w-full bg-background overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
        Dashboard
      </h1>
      <div className="flex-1 overflow-hidden px-3 lg:px-4 pb-3 lg:pb-4 min-h-0">
        {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        {DEMO_METRICS.map(metric => (
          <div key={metric.title} className="rounded-lg border border-accent bg-card text-card-foreground shadow @container/card">
            <div className="flex flex-col space-y-1 p-3 relative">
              <div className="text-xs text-muted-foreground">
                {metric.title}
              </div>
              <div className="tracking-tight @[250px]/card:text-xl text-lg font-semibold tabular-nums">
                {`${metric.value} ${metric.measure}`}
              </div>
            </div>
            <div className="flex p-3 pt-0 flex-col items-start gap-1 text-sm">
              <ProgressBar maxValue={metric.maxValue} currentValue={metric.value} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Gráficos y logs - área flexible */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-3 flex-1 min-h-0 overflow-hidden">
        <div className="min-h-0">
          <DashboardGraphic data={DASHBOARD_DATA} />
        </div>
        <div className="min-h-0">
          <EventLog events={events} />
        </div>
      </div>
      </div>
    </div>
  )
}
