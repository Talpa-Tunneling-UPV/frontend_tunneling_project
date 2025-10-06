/*
============================================================
  Motores — plano con Leaflet + clusters (modo simple)
  ---------------------------------------------------
  Qué es esto
  - Pone una imagen PNG como plano (ImageOverlay) y usa CRS.Simple
    (coordenadas = píxeles del plano).
  - Pinta nodos como chips HTML (divIcon) con color por zona y estado
    (ok/warn/error).
  - Agrupa por zona con leaflet.markercluster y el icono del cluster
    enseña la severidad (aro rojo/ámbar si hay error/aviso).
  - Click en nodo → popup con métricas básicas.

  Cómo añadir nodos sin adivinar coordenadas
  - Activa DEV_LOG_CLICKS (abajo).
  - Haz click en el punto del plano → verás en consola [y, x]
    listos para pegar en position.
  - Cuando acabes, lo desactivas.

  Estructura rápida
  - Tipos/datos: ZoneId, NodeStatus, NodeMarker, ZONES, NODES.
  - Config: ruta del PNG, zooms, radio cluster, toggle DEV.
  - Helpers: useImageBounds (bounds del PNG), HTML/estilos del nodo y popup.
  - Capas: ZoneClusterLayer (una por zona), ClickLogger (dev).
  - Componente: Motors.

  CSS que debe existir (míralo en tu index.css)
  - .node-marker, .node-dot, .node-label
  - .cluster-marker, .cluster-count
  - .motor-popup, .pop-*

  Layout
  - Este componente usa h-full. El alto total lo pone el layout global
    (TopBar + contenido) para evitar doble scroll.

  Datos desde la API (lo que esperamos)
  - Nodos (GET /api/motors/nodes):
    [
      {
        id: string,
        label: string,
        position: [y, x],        // coordenadas en pixeles del plano (CRS.Simple)
        status: 'ok'|'warn'|'error',
        zone: 'front'|'middle'|'rear',
        tempC: number,
        rpm: number,
        currentA: number,
        updatedAt?: string       // ISO opcional
      }, ...
    ]

  - Plano (opcional, GET /api/motors/plan):
    { imageUrl: string, width?: number, height?: number }
    Si no envías width/height, este componente ya los detecta cargando la imagen.

  - Tiempo real (opcional):
    WebSocket/SSE con eventos tipo { id, status?, tempC?, rpm?, currentA? } para
    actualizar nodos sin recargar.

  - Config (opcional):
    { clusterRadius, zonesMeta } para ajustar radios/colores por zona.
============================================================
*/

import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L, { CRS, type LatLngBoundsExpression, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect, useMemo, useState } from "react";

/* =========================
   Tipos y datos de ejemplo
   ========================= */

// Zonas principales del plano
type ZoneId = "front" | "middle" | "rear";

// Estado del nodo/motor
type NodeStatus = "ok" | "warn" | "error";

// Estructura del marcador (nodo)
interface NodeMarker {
  id: string;
  label: string;
  // En CRS.Simple se usan coordenadas [y, x] en pixeles del plano
  position: [number, number];
  status: NodeStatus;
  zone: ZoneId;
  tempC: number;
  rpm: number;
  currentA: number;
}

// Metadatos por zona (usa tus tokens de CSS)
type ZoneMeta = { name: string; nameShort: string; color: string };
const ZONES: Record<ZoneId, ZoneMeta> = {
  front: { name: "Frente", nameShort: "F", color: "var(--chart-1)" },
  middle: { name: "Centro", nameShort: "C", color: "var(--chart-3)" },
  rear: { name: "Cola", nameShort: "R", color: "var(--chart-5)" },
};

// Datos de ejemplo (mueve esto a un archivo de datos/API cuando lo tengas)
const NODES: NodeMarker[] = [
  { id: "1", label: "Motor1", position: [774, 128], status: "ok",    zone: "front",  tempC: 62, rpm: 1450, currentA: 18.2 },
  { id: "2", label: "Motor2", position: [694, 131], status: "warn",  zone: "front",  tempC: 82, rpm: 1520, currentA: 23.9 },
  { id: "3", label: "Motor3", position: [720, 180], status: "error",zone: "front",   tempC: 96, rpm: 0,    currentA: 0.0 },
  { id: "4", label: "Motor4", position: [779, 126], status: "error",zone: "front",   tempC: 96, rpm: 0,    currentA: 0.0 },
  { id: "5", label: "Motor5", position: [754, 346], status: "ok",    zone: "middle", tempC: 58, rpm: 1300, currentA: 12.4 },
  { id: "6", label: "Motor6", position: [701, 344], status: "ok",    zone: "middle", tempC: 58, rpm: 1300, currentA: 12.4 },
  { id: "7", label: "Motor7", position: [760, 520], status: "ok",  zone: "rear",   tempC: 54, rpm: 900,  currentA: 7.8 },
];

/* =========================
   Configuración y utilidades
   ========================= */

const IMAGE_URL = "/lateral.png"; // coloca lateral.png en /public
const MAP_MIN_ZOOM = 0;
const MAP_MAX_ZOOM = 3;
const CLUSTER_RADIUS = 60; // radio de agrupación pensado para minZoom=0
// Toggle herramienta de desarrollo: log de coordenadas al hacer click
// Por defecto usa el modo de desarrollo de Vite
const DEV_LOG_CLICKS = import.meta.env.DEV; // cambia a true/false a voluntad

// Color por estado (punto y acentos)
const statusColor = (s: NodeStatus) =>
  s === "ok" ? "#22c55e" : s === "warn" ? "#f59e0b" : "#ef4444";

// Fondo y borde del chip según estado (para que “parezca nodo”)
const statusBg = (s: NodeStatus) =>
  s === "error" ? "rgba(239, 68, 68, .16)"
  : s === "warn" ? "rgba(245, 158, 11, .18)"
  : "var(--card)";

const statusBorder = (s: NodeStatus) =>
  s === "error" ? "rgba(239, 68, 68, .55)"
  : s === "warn" ? "rgba(245, 158, 11, .55)"
  : "var(--border)";

// Carga la imagen y devuelve los bounds en CRS.Simple
function useImageBounds(url: string) {
  const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setBounds([[0, 0], [h, w]]);
    };
  }, [url]);
  return bounds;
}

// Crea el icono HTML (divIcon) con estilo de “nodo”
function makeNodeIcon(label: string, zoneColor: string, status: NodeStatus) {
  return L.divIcon({
    // Mantener la clase base de Leaflet + nuestra clase para evitar overrides
    className: "leaflet-div-icon node-div-icon",
    html: `
      <div
        class="node-marker"
        style="
          --node-color:${zoneColor};
          --node-status:${statusColor(status)};
          --node-bg:${statusBg(status)};
          --node-border:${statusBorder(status)};
          color:var(--card-foreground);
        "
      >
        <span class="node-dot"></span>
        <span class="node-label">${label}</span>
      </div>
    `,
    // El tamaño lo define el contenido (chip); estos valores evitan artefactos
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
}

// Contenido del popup (aparece al hacer click)
function buildPopupHTML(n: NodeMarker) {
  return `
    <div class="pop">
      <div class="pop-header">
        <span class="pop-dot" style="background:${statusColor(n.status)}"></span>
        <span class="pop-title">${n.label}</span>
      </div>
      <div class="pop-sub">Zona: ${ZONES[n.zone].name}</div>
      <div class="pop-metrics">
        <div class="kv"><span>Temp</span><strong>${n.tempC} °C</strong></div>
        <div class="kv"><span>RPM</span><strong>${n.rpm}</strong></div>
        <div class="kv"><span>Corriente</span><strong>${n.currentA} A</strong></div>
      </div>
    </div>
  `;
}

/* ==========================================
   Capa de clustering por zona (v5 compatible)
   ========================================== */

function ZoneClusterLayer(props: { zoneId: ZoneId; markers: NodeMarker[] }) {
  const { zoneId, markers } = props;
  const map = useMap();

  useEffect(() => {
    // Icono del cluster: color de anillo por severidad agregada (error > warn > zona)
    const iconCreateFunction = (cluster: any) => {
      const children = cluster.getAllChildMarkers() as any[];
      let hasError = false;
      let hasWarn = false;
      for (const m of children) {
        const st = (m as any).nodeStatus as NodeStatus | undefined;
        if (st === "error") { hasError = true; break; }
        if (st === "warn") hasWarn = true;
      }
      const ring = hasError ? "#ef4444" : hasWarn ? "#f59e0b" : ZONES[zoneId].color;
      return L.divIcon({
        className: "cluster-div-icon",
        html: `
          <div class="cluster-marker" style="--node-color:${ring}">
            <span class="cluster-count">${cluster.getChildCount()}</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
    };

    // Grupo de clusters (plugin leaflet.markercluster)
    const group = (L as any).markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: CLUSTER_RADIUS,
      iconCreateFunction,
    });

    // Añade cada nodo como marker con su popup
    markers.forEach((n) => {
      const marker = L.marker(n.position as any, {
        icon: makeNodeIcon(n.label, ZONES[n.zone].color, n.status),
      });
      // Guardamos el estado para cálculo de severidad en el cluster
      (marker as any).nodeStatus = n.status;

      marker.bindPopup(buildPopupHTML(n), {
        className: "motor-popup",
        autoClose: true,
        closeButton: false,
        closeOnClick: true,
        keepInView: true,
      });

      group.addLayer(marker);
    });

  map.addLayer(group);
    return () => {
      map.removeLayer(group);
      group.clearLayers();
    };
  }, [map, zoneId, markers]);

  return null;
}

/* =========================
   Componente principal
   ========================= */

// Componente de desarrollo para loguear coordenadas al click
function ClickLogger({ enabled }: { enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
  const handler = (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng; // En CRS.Simple: lat=y, lng=x
      const y = lat;
      const x = lng;
      // Redondeos útiles para pegar en el array [y, x]
      const yRound = Math.round(y);
      const xRound = Math.round(x);
      // Log formateado
      // eslint-disable-next-line no-console
      console.log("[Map click] latlng:", { lat, lng }, " | position [y,x]:", [yRound, xRound]);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, enabled]);
  return null;
}

export function Motors() {
  // Obtiene los bounds reales de la imagen (necesario para CRS.Simple)
  const bounds = useImageBounds(IMAGE_URL);

  // Agrupa los nodos por zona (solo se calcula una vez)
  const nodesByZone = useMemo(() => {
    const grouped: Record<ZoneId, NodeMarker[]> = { front: [], middle: [], rear: [] };
    NODES.forEach((n) => grouped[n.zone].push(n));
    return grouped;
  }, []);

  if (!bounds) {
    return (
      <div className="h-full w-full bg-background flex flex-col overflow-hidden">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
          Motores
        </h1>
        <div className="flex-1 flex items-center justify-center">
          Cargando plano…
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-bold text-foreground p-3 lg:p-4 pb-2 flex-shrink-0">
        Motores
      </h1>
      <div className="flex-1 overflow-hidden px-3 lg:px-4 pb-4 min-h-0">
        <div className="h-full w-full rounded-lg overflow-hidden border border-border">
          <MapContainer
        crs={CRS.Simple}
        bounds={bounds}
        
        maxBounds={bounds}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
        // Fondo del lienzo (para transparencias del PNG)
        style={{ background: "var(--background)" }}
      >
        {/* Imagen base del plano */}
        <ImageOverlay url={IMAGE_URL} bounds={bounds} />

  {/* Logger de coordenadas (solo desarrollo) */}
  <ClickLogger enabled={DEV_LOG_CLICKS} />

  {/* Una capa de clusters por zona para controlar color/estilo */}
        <ZoneClusterLayer zoneId="front"  markers={nodesByZone.front} />
        <ZoneClusterLayer zoneId="middle" markers={nodesByZone.middle} />
        <ZoneClusterLayer zoneId="rear"   markers={nodesByZone.rear} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
