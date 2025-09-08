import React from "react";
import type { OilTank } from "../types/hydraulic";
import { ProgressBar } from "./ProgressBar";

type Props = { oilTanks: OilTank[] };

export const OilLevelsList: React.FC<Props> = ({ oilTanks }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Niveles de aceite</h2>
        <span className="text-xs text-muted-foreground">{oilTanks.length} tanques</span>
      </div>
      <div className="space-y-5">
        {oilTanks.map((tank) => (
          <div key={tank.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{tank.name}</span>
                <span className="text-xs text-muted-foreground">({tank.capacityL.toLocaleString()} L)</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{Math.round(tank.levelPct)}%</span>
            </div>
            <ProgressBar currentValue={tank.levelPct} maxValue={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OilLevelsList;
