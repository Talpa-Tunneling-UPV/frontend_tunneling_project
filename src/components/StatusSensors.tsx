
// Maybe in the future it is possible to add to the interface an attribute that is activationFn

import type { sensorInterface } from "../types";

// activationFn is of type () => boolean defines the fn to return true in the data structure of the sensors
type statusSensorType = "online" | "advertencia" | "error" | "offline"
interface sensorType {
    title: string;
    status: statusSensorType
}


const sensors: sensorType[] = [
    {
        title: "En línea",
        status: "online",
    },
    {
        title: "Advertencia",
        status: "advertencia",
    },
    {
        title: "Error",
        status: "error",
    },
    {
        title: "Sin conexión",
        status: "offline"
    },
]


// Función unificada de colores de estado - consistente con SensorsList
const getStatusColor = (status: statusSensorType) => {
    switch (status) {
      case "online":
        return "text-emerald-400 bg-emerald-950/20 border-emerald-800/30"
      case "advertencia":
        return "text-amber-400 bg-amber-950/20 border-amber-800/30"
      case "error":
        return "text-red-400 bg-red-950/20 border-red-800/30"
      case "offline":
        return "text-muted-foreground bg-muted/20 border-border"
      default:
        return "text-muted-foreground bg-muted/20 border-border"
    }
  }

  const getCardStyles = (cardType: statusSensorType) => {
    return getStatusColor(cardType);
  }

  const getTextStyles = (cardType: statusSensorType) => {
    switch (cardType) {
      case "online":
        return "text-emerald-400"
      case "advertencia":
        return "text-amber-400"
      case "error":
        return "text-red-400"
      case "offline":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
}

export const StatusSensors = ({ data }: { data: sensorInterface[]}) => {




    return (
        <div className='bg-card border border-accent rounded-xl p-4 flex flex-col'>
            <div className='flex justify-center font-semibold text-xl pb-4 flex-shrink-0'>
                Estado de sensores
            </div>
            <div className='grid grid-cols-2 gap-4 flex-1'>
                {
                    sensors.map( sensor => (
                        <div key={sensor.title} className={`rounded-lg p-4 text-center border transition-all ${getCardStyles(sensor.status)}`}>
                            <div className="text-lg font-bold">{ sensor.title }</div>
                            <div className={`text-2xl font-bold mt-2 ${getTextStyles(sensor.status)}`}>{ data.filter(el => el.status === sensor.status).length }</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
