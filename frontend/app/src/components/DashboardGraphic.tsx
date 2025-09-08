import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DataPoint {
    name: string;
    presion: number;
    torque: number;
    velocidad: number;
    temperatura: number;
}

export const DashboardGraphic = () => {

    const [activeTab, setActiveTab] = useState('Presion');
  const [data, setData] = useState<DataPoint[]>([]);

  const tabs = ['Presion', 'Torque', 'Velocidad', 'Temperatura'];

  // Simular datos en tiempo real
  useEffect(() => {
    const generateInitialData = () => {
      const initialData: DataPoint[] = [];
      for (let i = 0; i < 10; i++) {
        initialData.push({
          name: 'Text',
          presion: Math.random() * 100 + 25,
          torque: Math.random() * 80 + 20,
          velocidad: Math.random() * 120 + 30,
          temperatura: Math.random() * 90 + 10,
        });
      }
      setData(initialData);
    };

    generateInitialData();

    // Actualizar datos cada 2 segundos
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          name: 'Text',
          presion: Math.random() * 100 + 25,
          torque: Math.random() * 80 + 20,
          velocidad: Math.random() * 120 + 30,
          temperatura: Math.random() * 90 + 10,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      {/* Título */}
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Monitoreo en tiempo real
      </h1>

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
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.5}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0, 125]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              ticks={[0, 25, 50, 75, 100, 125]}
            />
            
            {/* Línea principal del tab activo */}
            <Line
              type="monotone"
              dataKey={getDataKey(activeTab)}
              stroke={getLineColor(activeTab)}
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: getLineColor(activeTab),
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
            
            {/* Líneas de fondo más tenues para otros parámetros */}
            {tabs
              .filter(tab => tab !== activeTab)
              .map((tab, index) => (
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

      {/* Indicador de estado */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Actualizando en tiempo real</span>
        </div>
      </div>
    </div>
  );
    
}
