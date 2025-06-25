
import { Link, useLocation } from "react-router-dom";

function SideBarView(props) {
    const location = useLocation();
    const currentPath = location.pathname;

    const linkClass = (path) =>
        `px-4 py-2 rounded-md font-medium transition-colors w-full text-left ${
            currentPath === path
                ? "bg-[#6E89BB]"
                : "hover:bg-white/20"
        }`;

    return (
        <div className="flex flex-col content-start items-start bg-[#00338D] w-64 text-white space-y-2 p-5">
            <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
            <Link to="/sensors" className={linkClass("/sensors")}>Sensors</Link>
            <Link to="/controls" className={linkClass("/controls")}>Controls</Link>
            <Link to="/motors" className={linkClass("/motors")}>Motors</Link>
            <Link to="/hydraulic" className={linkClass("/hydraulic")}>Hydraulic System</Link>
            <Link to="/cutter" className={linkClass("/cutter")}>Head Cutter</Link>
            <Link to="/transport" className={linkClass("/transport")}>Debris Transports</Link>
        </div>
    );
}

export default SideBarView;
