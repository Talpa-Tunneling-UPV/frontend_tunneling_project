import { PiGauge } from "react-icons/pi";
import type { sensorsTypes } from "../types";
import { FaWater } from "react-icons/fa6";
import { MdGasMeter } from "react-icons/md";
import { GiClockwiseRotation, GiPositionMarker } from "react-icons/gi";
import { TbTemperature } from "react-icons/tb";

export const getSensorIcon = (type: sensorsTypes, options?: any) => {
  switch (type) {
    case "presion":
      return <PiGauge  {...options} />;
    case "caudal":
      return <FaWater {...options} />;
    case "gas":
      return <MdGasMeter {...options}  />;
    case "posicion":
      return <GiPositionMarker {...options} />;
    case "rotacion":
      return <GiClockwiseRotation {...options} />;
    case "temperatura":
      return <TbTemperature {...options} />;
    default:
      return null;
  }
};