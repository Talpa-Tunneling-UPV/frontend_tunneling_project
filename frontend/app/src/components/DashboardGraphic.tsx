import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProgressBar } from "./ProgressBar";

export interface DataPoint {
    name: string;
    presion: number;
    torque: number;
    velocidad: number;
    temperatura: number;
}

/**
 * Props mínimos para el DashboardGraphic:
 * - data: DataPoint[]  -> Serie estática con las claves: name, presion, torque, velocidad, temperatura.
 */
interface Props { data: DataPoint[] }
export const DashboardGraphic = ({ data }: Props) => {

    const [activeTab, setActiveTab] = useState('Presion');

  const tabs = ['Presion', 'Torque', 'Velocidad', 'Temperatura'];

  // 'data' ahora viene como prop desde Home

  const getLineColor = (tab: string) => {
    const colors = {
      Presion: '#3B82F6',
      Torque: '#10B981',
      Velocidad: '#8B5CF6',
      Temperatura: '#F59E0B',
    };
    return colors[tab as keyof typeof colors] || '#3B82F6';
  };

  const getDataKey = (tab: string) => {
    const keys = {
      Presion: 'presion',
      Torque: 'torque',
      Velocidad: 'velocidad',
      Temperatura: 'temperatura',
    };
    return keys[tab as keyof typeof keys] || 'presion';
  };

  // Tooltip personalizado similar al del ModalSensor
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

    const clamped = Math.min(100, Math.max(0, Number(val)));

    return (
      <div
        className="rounded-lg shadow-xl border border-border bg-white text-[#111827] p-3 min-w-[180px] backdrop-blur-md"
        style={{
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
        </div>
        <div className="mt-3">
          <ProgressBar currentValue={clamped} maxValue={100} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      {/* Título */}
  <h1 className="text-2xl font-bold text-foreground mb-6">Tendencias de sensores</h1>

      {/* Pestañas */}
      <div className="mb-6">
        <div className="flex bg-accent rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-accent-foreground hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#ffffff" 
              opacity={0.15}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#ffffff' }}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#ffffff' }}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ffffff", strokeWidth: 1, strokeOpacity: 0.2 }}
              wrapperStyle={{ outline: "none" }}
            />
            
            {/* Línea principal del tab activo */}
            <Line
              type="monotone"
              dataKey={getDataKey(activeTab)}
              stroke={getLineColor(activeTab)}
              strokeWidth={2.5}
              dot={{ fill: getLineColor(activeTab), strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#ffffff' }}
              isAnimationActive={true}
            />
            
            {/* Líneas de fondo más tenues para otros parámetros */}
            {tabs
              .filter(tab => tab !== activeTab)
              .map((tab) => (
                <Line
                  key={tab}
                  type="monotone"
                  dataKey={getDataKey(tab)}
                  stroke={getLineColor(tab)}
                  strokeWidth={2}
                  strokeOpacity={0.3}
                  dot={false}
                />
              ))
            }
          </LineChart>
        </ResponsiveContainer>
      </div>

  {/* Indicador de estado eliminado: datos estáticos */}
    </div>
  );
    
}
