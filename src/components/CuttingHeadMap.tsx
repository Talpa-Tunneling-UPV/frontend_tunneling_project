import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L, { CRS, type LatLngBoundsExpression, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect, useState } from "react";

/* =========================
   Tipos y datos para cabeza de corte
   ========================= */

// Estado del sensor/componente
type ComponentStatus = "ok" | "warn" | "error";

// Marcador de componente en la cabeza de corte
type ComponentMarker = {
  id: string;
  label: string;
  position: [number, number]; // [y, x] en coordenadas de imagen
  status: ComponentStatus;
  type: "sensor" | "motor" | "hydraulic";
  value?: number;
  units?: string;
};

/* =========================
   Configuración
   ========================= */

const GLOBAL_IMAGE = "/global.png";
const MAP_MIN_ZOOM = 0;
const MAP_MAX_ZOOM = 3;
const DEV_LOG_CLICKS = import.meta.env.DEV;

// Color por estado
const statusColor = (s: ComponentStatus) =>
  s === "ok" ? "#22c55e" : s === "warn" ? "#f59e0b" : "#ef4444";

// Datos de ejemplo para componentes en la imagen global (ajustados para escala 0.4)
const COMPONENTS: ComponentMarker[] = [
  { id: "1", label: "Sensor P1", position: [80, 100], status: "ok", type: "sensor", value: 180, units: "bar" },
  { id: "2", label: "Sensor P2", position: [120, 100], status: "warn", type: "sensor", value: 220, units: "bar" },
  { id: "3", label: "Motor M1", position: [100, 80], status: "error", type: "motor", value: 0, units: "rpm" },
  { id: "4", label: "Hidráulico H1", position: [100, 120], status: "ok", type: "hydraulic", value: 150, units: "l/min" },
];

/* =========================
   Utilidades
   ========================= */

// Hook para obtener las dimensiones de una imagen
function useImageDimensions(url: string) {
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log(`Imagen cargada: ${url}, dimensiones: ${img.width}x${img.height}`);
      setDimensions({width: img.width, height: img.height});
    };
    img.onerror = () => {
      console.error(`Error cargando imagen: ${url}`);
    };
    img.src = url;
  }, [url]);
  
  return dimensions;
}

// Hook para obtener bounds de la imagen global
function useGlobalBounds() {
  const globalDimensions = useImageDimensions(GLOBAL_IMAGE);
  
  const [bounds, setBounds] = useState<{
    combined: LatLngBoundsExpression | null,
    global: LatLngBoundsExpression | null
  }>({ combined: null, global: null });
  
  useEffect(() => {
    if (globalDimensions) {
      // Factor de escala para la imagen global
      const scaleFactor = 0.4; // Escala al 40% del tamaño original (más pequeña)
      
      const scaledWidth = globalDimensions.width * scaleFactor;
      const scaledHeight = globalDimensions.height * scaleFactor;
      
      // Bounds combinados centrados
      const paddingTop = 20;
      const paddingBottom = 20;
      const paddingSides = 20;
      const combined = [[-paddingTop, -paddingSides], [scaledHeight + paddingBottom, scaledWidth + paddingSides]] as LatLngBoundsExpression;
      
      // Bounds para la imagen global (centrada)
      const global = [[0, 0], [scaledHeight, scaledWidth]] as LatLngBoundsExpression;
      
      setBounds({ combined, global });
    }
  }, [globalDimensions]);
  
  return bounds;
}

// Crear icono HTML para componente
function makeComponentIcon(label: string, status: ComponentStatus, type: string) {
  const typeColor = type === "sensor" ? "#3b82f6" : type === "motor" ? "#8b5cf6" : "#10b981";
  
  return L.divIcon({
    className: "leaflet-div-icon component-div-icon",
    html: `
      <div
        class="component-marker"
        style="
          --component-color: ${typeColor};
          --component-status: ${statusColor(status)};
          background: var(--card);
          border: 2px solid var(--component-status);
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--card-foreground);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          white-space: nowrap;
        "
      >
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--component-status);
          display: inline-block;
          margin-right: 6px;
        "></div>
        ${label}
      </div>
    `,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
}

// Contenido del popup
function buildComponentPopupHTML(c: ComponentMarker) {
  return `
    <div class="component-popup" style="
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 200px;
      color: var(--card-foreground);
    ">
      <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">
        ${c.label}
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
        <div>
          <span style="color: var(--muted-foreground);">Tipo:</span>
          <span style="margin-left: 8px; font-weight: 500;">${c.type}</span>
        </div>
        <div>
          <span style="color: var(--muted-foreground);">Estado:</span>
          <span style="
            margin-left: 8px;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
            background: ${statusColor(c.status)}20;
            color: ${statusColor(c.status)};
          ">
            ${c.status === "ok" ? "Normal" : c.status === "warn" ? "Advertencia" : "Error"}
          </span>
        </div>
        ${c.value !== undefined ? `
        <div>
          <span style="color: var(--muted-foreground);">Valor:</span>
          <span style="margin-left: 8px; font-weight: 500;">${c.value} ${c.units || ""}</span>
        </div>
        ` : ""}
      </div>
    </div>
  `;
}

// Componente para logging de clicks (desarrollo)
function ClickLogger({ enabled }: { enabled: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleClick = (e: LeafletMouseEvent) => {
      console.log("Coordenadas click:", [e.latlng.lat, e.latlng.lng]);
    };
    
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, enabled]);
  
  return null;
}

// Capa de marcadores
function ComponentLayer({ components }: { components: ComponentMarker[] }) {
  const map = useMap();
  
  useEffect(() => {
    const markers: L.Marker[] = [];
    
    components.forEach(component => {
      const marker = L.marker(
        [component.position[0], component.position[1]],
        { icon: makeComponentIcon(component.label, component.status, component.type) }
      );
      
      marker.bindPopup(buildComponentPopupHTML(component));
      marker.addTo(map);
      markers.push(marker);
    });
    
    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, components]);
  
  return null;
}

/* =========================
   Componente principal
   ========================= */

export function CuttingHeadMap() {
  const bounds = useGlobalBounds();
  
  if (!bounds.combined || !bounds.global) {
    return (
      <div className="h-full w-full bg-card rounded-lg border border-border flex items-center justify-center">
        <div className="text-muted-foreground">
          Cargando vista global…
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        crs={CRS.Simple}
        bounds={bounds.combined}
        maxBounds={bounds.combined}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "var(--background)" }}
      >
        {/* Imagen global */}
        <ImageOverlay url={GLOBAL_IMAGE} bounds={bounds.global} />
        
        {/* Logger de coordenadas (solo desarrollo) */}
        <ClickLogger enabled={DEV_LOG_CLICKS} />
        
        {/* Marcadores de componentes en la imagen global */}
        <ComponentLayer components={COMPONENTS} />
      </MapContainer>
    </div>
  );
}
