import { SensorsAlertsList } from "../components/SensorsAlertsList"
import { SensorsList } from "../components/SensorsList"
import { StatusSensors } from "../components/StatusSensors"
import type { sensorInterface } from "../types"


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

  //! TODO: implementar la petición API


  return (
    <div className="bg-background w-full flex flex-col gap-4 text-foreground h-[100vh] overflow-y-scroll p-4">
        <div className="grid grid-cols-3 gap-4">
            <div>
                <StatusSensors data={data} />
            </div>
            <div className="col-span-2">
                <SensorsAlertsList data={data} />
            </div>
        </div>
        <div>
          <SensorsList data={data} />
        </div>
    </div>
  )
}
