import { IoMdInformationCircle } from "react-icons/io";
import { MdError, MdOutlineWarning } from "react-icons/md";

interface Event {
    id: string;
    timestamp: string;
    description: string;
    type: "info" | "error" | "warning";
}

interface Props {
    events: Event[];
}

export const EventLog = ({ events }: Props) => {
    
    const getTypeClasses = (type: Event["type"]) => {
        switch(type) {
            case "error": 
                return "text-destructive"
            case "info":
                return "text-foreground"
            case "warning":
                return "text-yellow-600"
        }
    }

    const getTypeIcon = (type: Event["type"]) => {
        switch (type) {
        case "error":
            return <MdError className="h-5 w-5 flex-shrink-0 text-red-500" />
        case "warning":
            return <MdOutlineWarning className="h-5 w-5 flex-shrink-0 text-yellow-500" />
        case "info":
        default:
            return <IoMdInformationCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
        }
    }
    
    return (
        <div className="w-full max-h-[100vh] overflow-hidden overflow-y-scroll rounded-lg border border-border bg-card shadow-md">
            {/* Header */}
            <div className="border-b sticky top-0 bg-card border-border p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Registro de Eventos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Actividad reciente del sistema.</p>
            </div>

            {/* Event List Area */}
            <div className="w-full">
        {events.length === 0 ? (
        <p className="p-4 text-center text-muted-foreground">No hay eventos para mostrar.</p>
                ) : (
                <div>
                    {events.map((event) => (
                    <div
                        key={event.id}
            className="flex cursor-pointer items-center justify-between border-b border-border p-3 transition-colors hover:bg-muted/50"
                    >
                        {/* Icon and Event Description */}
                        <div className="flex flex-1 items-center space-x-3 pr-4">
                        {getTypeIcon(event.type)}
                        <p className={`text-sm font-medium ${getTypeClasses(event.type)}`}>{event.description}</p>
                        </div>
                        {/* Timestamp */}
                        <div className="flex-shrink-0 text-right">
            <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}
