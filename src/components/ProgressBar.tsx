
interface Props {
    currentValue: number;
    maxValue: number;
    warnThreshold?: number; // Porcentaje para advertencia (default: 60%)
    critThreshold?: number; // Porcentaje para crítico (default: 80%)
    inverse?: boolean; // Si true, invierte la lógica (menor es peor)
}

export const ProgressBar = ({ 
    currentValue, 
    maxValue, 
    warnThreshold = 60, 
    critThreshold = 80,
    inverse = false 
} : Props) => {
    const percentage = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));
    
    // Determinar color según umbral
    const getBarColor = () => {
        if (inverse) {
            // Para valores donde menor es peor (ej: eficiencia, nivel de aceite)
            if (percentage < 100 - critThreshold) return '#ef4444'; // rojo
            if (percentage < 100 - warnThreshold) return '#f59e0b'; // amarillo
            return '#22c55e'; // verde
        } else {
            // Para valores donde mayor es peor (ej: temperatura, presión)
            if (percentage >= critThreshold) return '#ef4444'; // rojo
            if (percentage >= warnThreshold) return '#f59e0b'; // amarillo
            return '#22c55e'; // verde
        }
    };
    
    const barColor = getBarColor();
    
    return (
        <div className="w-full bg-accent rounded-full h-2 relative">
            <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                    width: `${percentage}%`,
                    backgroundColor: barColor
                }}
            />
            <div 
                className="absolute top-0 w-3 h-2 rounded-sm transform -translate-x-1/2 transition-all duration-500" 
                style={{ 
                    left: `${percentage}%`,
                    backgroundColor: barColor,
                    opacity: 0.8
                }} 
            />
        </div>    
    )
}

