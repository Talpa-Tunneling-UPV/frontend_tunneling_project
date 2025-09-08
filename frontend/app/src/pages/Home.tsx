import { DashboardGraphic } from "../components/DashboardGraphic"
import { EventLog } from "../components/EventLog"
import { ProgressBar } from "../components/ProgressBar"

type eventType = "info" | "warning" | "error"

const dummyEvents = [
    { id: "1", timestamp: "2025-08-11 10:00:00", description: "Usuario 'admin' inició sesión.", type: "info" as eventType},
    { id: "2", timestamp: "2025-08-11 10:05:15", description: "Se creó un nuevo registro de producto.", type: "info" as eventType},
    {
      id: "3",
      timestamp: "2025-08-11 10:10:30",
      description: "Error al procesar la solicitud de pago.",
      type: "error" as eventType,
    },
    {
      id: "4",
      timestamp: "2025-08-11 10:15:45",
      description: "Se actualizó la configuración del sistema.",
      type: "info" as eventType,
    },
    {
      id: "5",
      timestamp: "2025-08-11 10:20:00",
      description: "Tarea programada 'limpieza de caché' completada.",
      type: "info" as eventType,
    },
    {
      id: "6",
      timestamp: "2025-08-11 10:25:10",
      description: "Intento de acceso fallido desde IP 192.168.1.100.",
      type: "warning" as eventType,
    },
    {
      id: "7",
      timestamp: "2025-08-11 10:30:20",
      description: "Notificación de stock bajo para el artículo X.",
      type: "warning" as eventType,
    },
    { id: "8", timestamp: "2025-08-11 10:35:30", description: "Se generó un informe mensual de ventas.", type: "info" as eventType},
    {
      id: "9",
      timestamp: "2025-08-11 10:40:40",
      description: "Copia de seguridad de la base de datos fallida.",
      type: "error" as eventType,
    },
    { id: "10", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" as eventType},
    { id: "11", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" as eventType},
    { id: "12", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" as eventType},
    { id: "13", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" as eventType},
    { id: "14", timestamp: "2025-08-11 10:45:50", description: "Nuevo usuario 'juan.perez' registrado.", type: "info" as eventType},
  ]

const metrics = [
    {
        title: "Presion",
        value: 43.0,
        measure: "Bar",
        maxValue: 65,
    },
    {
        title: "Velocidad",
        value: 0.1,
        measure: "m/s",
        maxValue: 0.5,
    },
    {
        title: "Temperatura",
        value: 70,
        measure: "°C",
        maxValue: 130
    },
    {
        title: "Torque",
        value: 20,
        measure: "RPM",
        maxValue: 50
    }
]


export const Home = () => {
  return (
    <div className="h-[100vh] flex flex-col w-[100%] bg-background p-4 overflow-scroll">
        <div className="grid grid-cols-4 gap-4">
            {metrics.map(metric => (
                <div key={metric.title} className="rounded-xl border border-accent bg-card text-card-foreground shadow @container/card">
                    <div className="flex flex-col space-y-1.5 p-6 relative">
                        <div className="text-sm text-muted-foreground">
                            {metric.title}
                        </div>
                        <div className="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                            {`${metric.value} ${metric.measure}`}
                        </div>
                    </div>
                    <div className="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
                        <ProgressBar maxValue={metric.maxValue} currentValue={metric.value} />
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grow-1 grid-cols-2 gap-4 mt-4 max-h-12">
            <DashboardGraphic />
            <EventLog events={dummyEvents} />

        </div>
    </div>
  )
}
