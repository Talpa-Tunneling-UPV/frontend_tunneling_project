
interface Props {
    currentValue: number;
    maxValue: number;
}

export const ProgressBar = ({ currentValue, maxValue } : Props) => {
    const percentage = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));
    return (
        <div className="w-full bg-accent rounded-full h-2 relative">
            <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
            <div className="absolute top-0 w-3 h-2 bg-foreground rounded-sm transform -translate-x-1/2 transition-all duration-500" style={{ left: `${percentage}%` }} />
        </div>    
    )
}

