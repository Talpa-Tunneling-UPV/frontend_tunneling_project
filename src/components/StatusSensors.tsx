
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
        title: "Online",
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
        title: "Offline",
        status: "offline"
    },
]


const getCardStyles = (cardType: statusSensorType) => {
    switch (cardType) {
      case "online":
        return "bg-emerald-950/20 border-emerald-800/30 text-emerald-200"
      case "advertencia":
        return "bg-amber-950/20 border-amber-800/30 text-amber-200"
      case "error":
        return "bg-red-950/20 border-red-800/30 text-red-200"
      case "offline":
        return "bg-muted border-border text-muted-foreground"
      default:
        return "bg-muted border-border text-muted-foreground"
    }
  }

  const getTextStyles = (cardType: statusSensorType) => {
    switch (cardType) {
      case "online":
        return "text-emerald-300"
      case "advertencia":
        return "text-amber-300"
      case "error":
        return "text-red-300"
      case "offline":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
}

export const StatusSensors = ({ data }: { data: sensorInterface[]}) => {




    return (
        <div className='bg-card border border-accent rounded-xl min-h-32 p-2'>
            <div className='flex justify-center font-semibold text-2xl pb-2'>
                Estado de sensores
            </div>
            <div className='grid grid-cols-2 gap-4'>
                {
                    sensors.map( sensor => (
                        <div key={sensor.title} className={`rounded-lg p-4 text-center border ${getCardStyles(sensor.status)}`}>
                            <div className="text-xl font-bold">{ sensor.title }</div>
                            <div className={`text-sm ${getTextStyles(sensor.status)}`}>{ data.filter(el => el.status === sensor.status).length }</div>
                        </div>
                    ))
                }
            </div>
            
        </div>
    )
}
