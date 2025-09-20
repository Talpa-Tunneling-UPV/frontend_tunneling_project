import { createBrowserRouter } from "react-router"
import Home from "../pages/Home"
import type { PropsWithChildren } from "react"
import { SideNav } from "../components/SideNav"
import TopBar from "../components/TopBar"
import { Sensors } from "../pages/Sensors"
import { Motors } from "../pages/Motors"
import { Cutting } from "../pages/Cutting"
import { Hydraulic } from "../pages/Hydraulic"


const Wrapper = ({ children }: PropsWithChildren) => {
    const handleEmergency = () => {
        // TODO: wire this to your real emergency handler
        // eslint-disable-next-line no-alert
        alert("Botón de emergencia pulsado. Confirmar protocolo.");
    };
        return (
            <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
                <TopBar online onEmergency={handleEmergency} />
                <div className="flex flex-row flex-1 min-h-0 overflow-hidden">
                    <SideNav />
                    <main className="flex-1 min-h-0 overflow-hidden">
                        <div className="h-full w-full overflow-hidden">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
};

const routes = [
    {
        path: "/",
        element: <Wrapper><Home /></Wrapper>
    },
    {
        path: "/sensors",
        element: <Wrapper><Sensors /></Wrapper>
    },
    {
        path: "/motors",
        element: <Wrapper><Motors /></Wrapper>
    },
    {
        path: "/cutting",
        element: <Wrapper><Cutting /></Wrapper>
    },
    {
        path: "/hydraulic",
        element: <Wrapper><Hydraulic /></Wrapper>
    },
]

const router = createBrowserRouter([
    ...routes,
])

export default router