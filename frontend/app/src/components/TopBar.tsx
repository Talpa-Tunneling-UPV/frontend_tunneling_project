import React from "react";
import logo from "/logoTalpa.svg";

type Props = {
  online?: boolean;
  onEmergency?: () => void;
};

export const TopBar: React.FC<Props> = ({ online = true, onEmergency }) => {
  return (
  <header className="h-14 w-full bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
  <img src={logo} alt="Talpa" className="h-4 w-auto" />
      </div>

      {/* Right: Status + Emergency */}
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
          aria-live="polite"
        >
          <span
            className={[
              "inline-block h-2.5 w-2.5 rounded-full",
              online ? "bg-emerald-500" : "bg-red-500",
            ].join(" ")}
            aria-hidden
          />
          <span className={online ? "text-emerald-600" : "text-red-600"}>
            {online ? "Online" : "Offline"}
          </span>
        </span>

        <button
          type="button"
          onClick={onEmergency}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 ring-offset-2 ring-red-600/70 ring-offset-card/40"
        >
          {/* <span className="inline-block h-2 w-2 rounded-full bg-white" /> */}
          Emergencia
        </button>
      </div>
    </header>
  );
};

export default TopBar;
