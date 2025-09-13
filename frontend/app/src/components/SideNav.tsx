import { FaGauge } from "react-icons/fa6";
import { GiCircularSaw } from "react-icons/gi";
import { IoMdHome } from "react-icons/io";
import { MdOutlineSensors, MdMenuOpen, MdMenu } from "react-icons/md";
import { TbEngine } from "react-icons/tb";
import { NavLink } from "react-router";
import { useState, useEffect } from "react";

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
    /*{
        title: "Controles",
        icon: TbSteeringWheelFilled,
        url: "/controls"
    },
    {
        title: "Cinta transportadora",
        icon: MdConveyorBelt,
        url: "/convey"
    },*/
]

export const SideNav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileOverlay, setShowMobileOverlay] = useState(false);

    // Detectar si es móvil y colapsar automáticamente
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && !isCollapsed) {
                setShowMobileOverlay(true);
            } else {
                setShowMobileOverlay(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (isMobile) {
            setShowMobileOverlay(!isCollapsed);
        }
    };

    const handleOverlayClick = () => {
        if (isMobile) {
            setIsCollapsed(true);
            setShowMobileOverlay(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && showMobileOverlay && (
                <div 
                    className="sidebar-mobile-overlay active"
                    onClick={handleOverlayClick}
                />
            )}

            <div
                className={[
                    "relative flex h-full text-sidebar-foreground flex-col bg-sidebar bg-clip-border shadow-xl transition-all duration-300 ease-in-out z-50",
                    isCollapsed ? "w-16 overflow-hidden" : "w-full max-w-[16rem] overflow-hidden",
                    isMobile && !isCollapsed ? "fixed left-0 top-0 h-screen" : ""
                ].join(" ")}
            >
                {/* Toggle Button */}
                <div className="flex justify-between items-center p-4 pb-2">
                    {!isCollapsed && <div className="h-2" />}
                    <button
                        onClick={toggleCollapse}
                        className={[
                            "flex items-center justify-center h-8 w-8 rounded-md transition-colors outline-none",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            "focus-visible:ring-2 ring-offset-2 ring-sidebar-ring/70 ring-offset-sidebar/40",
                            isCollapsed ? "mx-auto" : "ml-auto"
                        ].join(" ")}
                        title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                    >
                        {isCollapsed ? <MdMenuOpen size={18} /> : <MdMenu size={18} />}
                    </button>
                </div>

                <nav className={[
                    "flex flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 overflow-y-auto overflow-x-hidden",
                    isCollapsed ? "px-1" : "px-2"
                ].join(" ")}>
                    {
                        listElements.map(element => (
                            <NavLink
                                key={element.url}
                                to={element.url}
                                className={({ isActive }) =>
                                    [
                                        "sidebar-item group relative flex items-center w-full rounded-lg transition-all duration-200 outline-none",
                                        "focus-visible:ring-2 ring-offset-2 ring-sidebar-ring/70 ring-offset-sidebar/40",
                                        isActive
                                            ? "bg-primary/10 text-sidebar-foreground hover:bg-primary/15"
                                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isCollapsed ? "gap-0 px-2 py-2 justify-center" : "gap-3 px-3 py-2"
                                    ].join(" ")
                                }
                                onClick={() => {
                                    if (isMobile && !isCollapsed) {
                                        setIsCollapsed(true);
                                        setShowMobileOverlay(false);
                                    }
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active left indicator - solo visible cuando no está colapsado */}
                                        {!isCollapsed && (
                                            <span
                                                className={[
                                                    "absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-all",
                                                    isActive ? "bg-primary opacity-100" : "bg-primary/50 opacity-0 group-hover:opacity-60",
                                                ].join(" ")}
                                            />
                                        )}
                                        {/* Icon */}
                                        <span
                                            className={[
                                                "grid place-items-center h-8 w-8 rounded-md transition-colors flex-shrink-0",
                                                isActive ? "bg-primary text-primary-foreground" : "bg-sidebar-accent/50 text-sidebar-foreground",
                                            ].join(" ")}
                                        >
                                            <element.icon size={18} />
                                        </span>
                                        {/* Label - solo visible cuando no está colapsado */}
                                        {!isCollapsed && (
                                            <span className="truncate text-[0.95rem] leading-none transition-opacity duration-200">
                                                {element.title}
                                            </span>
                                        )}
                                        {/* Tooltip personalizado para estado colapsado */}
                                        {isCollapsed && !isMobile && (
                                            <div className="sidebar-tooltip">
                                                {element.title}
                                            </div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                </nav>

                {/* Footer - solo visible cuando no está colapsado */}
                {!isCollapsed && (
                    <footer className="mt-auto pt-3 px-3 text-xs text-muted-foreground/80 transition-opacity duration-200">
                        <div className="border-t border-sidebar-border/60 pt-3">
                            <span>v1.0 • © UPV</span>
                        </div>
                    </footer>
                )}
            </div>
        </>
    );
};
