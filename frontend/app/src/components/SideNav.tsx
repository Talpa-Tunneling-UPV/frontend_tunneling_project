import { FaGauge } from "react-icons/fa6";
import { GiCircularSaw } from "react-icons/gi";
import { IoMdHome } from "react-icons/io";
import { MdConveyorBelt, MdOutlineSensors } from "react-icons/md";
import { TbEngine, TbSteeringWheelFilled } from "react-icons/tb";
import { NavLink } from "react-router";

const listElements = [
    {
        title: "Dasboard",
        icon: IoMdHome,
        url: "/"
    },
    {
        title: "Sensores",
        icon: MdOutlineSensors,
        url: "/sensors"
    },
    {
        title: "Motores",
        icon: TbEngine,
        url: "/motors"
    },
    {
        title: "Corte",
        icon: GiCircularSaw,
        url: "/cutting"
    },
    {
        title: "Sistema hidráulico",
        icon: FaGauge,
        url: "/hydraulic"
    },
    {
        title: "Controles",
        icon: TbSteeringWheelFilled,
        url: "/controls"
    },
    {
        title: "Cinta transportadora",
        icon: MdConveyorBelt,
        url: "/convey"
    },
]

export const SideNav = () => {
    return (
        <div
            className="relative flex h-full w-full max-w-[16rem] text-sidebar-foreground flex-col bg-sidebar bg-clip-border p-4 shadow-xl overflow-hidden">
            <div className="h-2" />
            <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 overflow-auto">
                {
                    listElements.map(element => (
                        <NavLink
                        key={element.url}
                        to={element.url}
                        className={({ isActive }) =>
                            [
                                "group relative flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors outline-none",
                                "focus-visible:ring-2 ring-offset-2 ring-sidebar-ring/70 ring-offset-sidebar/40",
                                isActive
                                    ? "bg-primary/10 text-sidebar-foreground hover:bg-primary/15"
                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            ].join(" ")
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active left indicator */}
                                <span
                                    className={[
                                        "absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-all",
                                        isActive ? "bg-primary opacity-100" : "bg-primary/50 opacity-0 group-hover:opacity-60",
                                    ].join(" ")}
                                />
                                {/* Icon */}
                                <span
                                    className={[
                                        "grid place-items-center h-8 w-8 rounded-md",
                                        isActive ? "bg-primary text-primary-foreground" : "bg-sidebar-accent/50 text-sidebar-foreground",
                                    ].join(" ")}
                                >
                                    {<element.icon size={18} />}
                                </span>
                                {/* Label */}
                                <span className="truncate text-[0.95rem] leading-none">{element.title}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <footer className="mt-auto pt-3 px-3 text-xs text-muted-foreground/80">
                <div className="border-t border-sidebar-border/60 pt-3">
                    <span>v1.0 • © UPV</span>
                </div>
            </footer>
        </div>
    );
};
