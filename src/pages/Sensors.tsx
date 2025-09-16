import { SensorsAlertsList } from "../components/SensorsAlertsList"
import { SensorsList } from "../components/SensorsList"
import { StatusSensors } from "../components/StatusSensors"
import type { sensorInterface } from "../types"

/**
 * Integración API + WebSocket (Redis pub/sub) para Sensores — sin polling
 *
 * Objetivo: snapshot inicial por REST con TanStack Query y tiempo real por WS.
 *
 * 1) Snapshot inicial (REST + TanStack Query)
 *    - GET /api/sensors
 *      200 OK: Array<sensorInterface>
 *      Donde sensorInterface (simplificado) incluye:
 *        {
 *          id: string,
 *          title: string,
 *          value: number,
 *          units: string,
 *          status: 'online'|'advertencia'|'error'|'offline',
 *          type: 'presion'|'temperatura'|'posicion'|'rotacion'|'caudal'|'gas',
 *          updatedAt?: string
 *        }
 *    - Opción A: derivar en el cliente el resumen (StatusSensors) y alertas (SensorsAlertsList) a partir del array.
 *    - Opción B (alternativa si quieres optimizar):
 *        GET /api/sensors/summary → { online: number, advertencia: number, error: number, offline: number }
 *        GET /api/sensors/alerts?limit=50 → Array<sensorInterface> (solo los que estén en advertencia|error)
 *    - Histórico para modal (gráfica 24h por sensor):
 *        GET /api/sensors/{id}/history?from=ISO&to=ISO&interval=1h
 *        200 OK: Array<{ time: string, value: number }>
 *
 *    Ejemplo con TanStack Query (pseudocódigo):
 *      const sensorsQuery = useQuery({
 *        queryKey: ['sensors','all'],
 *        queryFn: () => fetch('/api/sensors').then(r => r.json() as Promise<sensorInterface[]>),
 *        staleTime: 60_000,         // cachea el snapshot
 *        refetchOnWindowFocus: false,
 *        refetchInterval: false     // sin polling
 *      })
 *
 * 2) Tiempo real (WS con backend puente a Redis pub/sub)
 *    - Conectar a wss://<host>/ws (o el endpoint que tengas)
 *    - Suscribirte a los canales:
 *        'sensors:values'   → actualizaciones de valor y estado de sensores
 *        'sensors:alerts'   → (opcional) nuevos sensores en advertencia/error
 *    - Mensaje esperado (ejemplo):
 *        { channel: 'sensors:values', payload: { id: string, value: number, status?: string, updatedAt?: string } }
 *        { channel: 'sensors:alerts', payload: sensorInterface }
 *    - Integración con TanStack Query: actualizar caches en onmessage sin re-fetch:
 *        queryClient.setQueryData(['sensors','all'], (prev = []) =>
 *          prev.map(s => s.id === payload.id ? { ...s, value: payload.value, status: payload.status ?? s.status, updatedAt: payload.updatedAt } : s)
 *        )
 *        queryClient.setQueryData(['sensors','alerts',{ limit: 50 }], (prev = []) =>
 *          // decide si insertar/quitar según nuevo estado
 *        )
 *    - Para histórico del modal en tiempo real (si quieres stream por sensor):
 *        Canal dedicado p.ej. `sensors:history:{id}`
 *        payload: { time: string, value: number }
 *
 * 3) Umbrales/negocio (dónde decidir alertas)
 *    - Puedes enviar `status` ya calculado desde el backend (recomendado) según tus umbrales.
 *    - O enviar thresholds junto a cada sensor y valorar en el cliente.
 *
 */

const data: sensorInterface[] = [
  {
    title: "Presión del circuito de avance",
    value: 180,
    units: "bar",
    status: "online",
    type: "presion"
  },
  {
    title: "Presión en cabeza de corte",
    value: 1.2,
    units: "bar",
    status: "advertencia",
    type: "presion"
  },
  {
    title: "Presión inyección de bentonita",
    value: 3.5,
    units: "bar",
    status: "online",
    type: "presion"
  },
  {
    title: "Temperatura aceite hidráulico",
    value: 75,
    units: "°C",
    status: "advertencia",
    type: "temperatura"
  },
  {
    title: "Temperatura motor principal",
    value: 88,
    units: "°C",
    status: "online",
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
    title: "Desviación vertical (Láser)",
    value: 8,
    units: "mm",
    status: "online",
    type: "posicion"
  },
  {
    title: "Avance total de la máquina",
    value: 122.5,
    units: "m",
    status: "online",
    type: "posicion"
  },
  {
    title: "Velocidad cabeza de corte",
    value: 5,
    units: "rpm",
    status: "online",
    type: "rotacion"
  },
  {
    title: "Par motor (Torque)",
    value: 75,
    units: "%",
    status: "advertencia",
    type: "rotacion"
  },
  {
    title: "Caudal de lodos (extracción)",
    value: 150,
    units: "m³/h",
    status: "online",
    type: "caudal"
  },
  {
    title: "Detector de Metano (CH4)",
    value: 1200,
    units: "ppm",
    status: "error",
    type: "gas"
  },
  {
    title: "Nivel de Oxígeno (O2)",
    value: 20.9,
    units: "%",
    status: "online",
    type: "gas"
  },
  {
    title: "Detector de Monóxido (CO)",
    value: 0,
    units: "ppm",
    status: "offline",
    type: "gas"
  },
]


export const Sensors = () => {

  //! TODO: Integración
  // - Cargar snapshot inicial con TanStack Query: ['sensors','all']
  // - Abrir WS y suscribirse a 'sensors:values' y (opcional) 'sensors:alerts'
  // - En cada mensaje, actualizar la cache de Query para reflejar en StatusSensors, SensorsAlertsList y SensorsList.
  // - Para ModalSensor (cuando abras el modal):
  //     GET /api/sensors/{id}/history?from&to&interval (Query sin polling, staleTime: Infinity)
  //     y/o suscripción temporal al canal `sensors:history:{id}` para push.


  return (
    <div className="bg-background w-full h-full flex flex-col text-foreground overflow-hidden">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
          Sensores
        </h1>
        <div className="flex-1 overflow-hidden px-3 lg:px-4 pb-3 lg:pb-4 min-h-0 flex flex-col gap-3">
          {/* Header section - fixed height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-shrink-0">
            <div className="lg:col-span-1">
                <StatusSensors data={data} />
            </div>
            <div className="lg:col-span-2">
                <SensorsAlertsList data={data} />
            </div>
        </div>
        {/* Main content - flexible height */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <SensorsList data={data} />
          </div>
        </div>
    </div>
  )
}
