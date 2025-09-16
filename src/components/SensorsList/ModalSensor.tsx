import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { sensorInterface } from "../../types";
import { getSensorIcon } from "../../utils";
import { ProgressBar } from "../ProgressBar";


interface Props {
    setOpen: (value: boolean) => void;
    sensor: sensorInterface | null
}

export const ModalSensor = ({ setOpen, sensor }: Props) => {

  // Mock chart data for the last 24 hours
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 100),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const val = payload[0]?.value as number;

    const status = val >= 90 ? {
      text: "Crítico",
      dotClass: "bg-red-500",
      textClass: "text-red-600"
    } : val >= 75 ? {
      text: "Advertencia",
      dotClass: "bg-amber-400",
      textClass: "text-amber-500"
    } : {
      text: "Normal",
      dotClass: "bg-emerald-400",
      textClass: "text-emerald-500"
    };

    return (
      <div
        className="rounded-lg shadow-xl border border-border bg-white text-[#111827] p-3 min-w-[180px] backdrop-blur-md"
        style={{
          // Fallback to theme tokens when present
          backgroundColor: "var(--card)",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.textClass}`}>
              <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
              {status.text}
            </span>
          </div>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold leading-none">{Number(val).toFixed(0)}</span>
          {/* <span className="text-sm text-muted-foreground mb-[2px]">%</span> */}
        </div>
        <div className="mt-3">
          {/* <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-black"
              style={{ width: `${Math.min(100, Math.max(0, Number(val))) }%` }}
            />
          </div> */}
          <ProgressBar currentValue={val} maxValue={100} />
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-0 left-0 z-50 h-[100vh] w-[100vw] bg-black/40 flex flex-col justify-center items-center" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false)}}>
        <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Cabecera */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {getSensorIcon(sensor?.type || "presion", { color: "white", size: 32 })}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{ sensor?.title }</h2>
                <p className="text-sm text-muted-foreground">
                  ID: sns-{Math.random().toString(36).substr(2, 6)} | Tipo: {sensor?.type}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 hover:cursor-pointer" fill="none" color="white" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Contenido */}
          <div className="p-10 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-8 min-h-0">
              {/* Gráfica */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Gráfica (Últimas 24h)</h3>
                <div className="bg-muted/20 rounded-lg p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" opacity={0.15} />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#ffffff", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#ffffff", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "#ffffff", strokeWidth: 1, strokeOpacity: 0.2 }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        dot={{ fill: "var(--primary)", strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, fill: "#ffffff" }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Datos derecha */}
              <div className="flex-1 space-y-12 min-w-0">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Valor</h3>
                  <div className="text-4xl font-bold text-foreground">{sensor?.value.toFixed(1) + " " + sensor?.units}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Rango de Operación</h3>
                  <div className="space-y-4">
                    <ProgressBar currentValue={sensor?.value || 0} maxValue={100} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Umbrales</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-sm text-foreground">Advertencia: 75%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-sm text-foreground">Crítico: 90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
