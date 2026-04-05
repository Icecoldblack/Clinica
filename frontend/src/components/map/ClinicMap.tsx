import { useEffect, useRef, useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { HospitalResult } from '../../services/insuranceService';

interface ClinicMapProps {
  hospitals: HospitalResult[];
  center: { lat: number; lng: number };
  activeHospitalId?: string | null;
  onMarkerClick?: (id: string) => void;
}

// ─── Easing ────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Smooth camera controller ──────────────────────────────────
function MapController({
  hospitals,
  activeHospitalId,
  center,
  onZoomChanged,
}: {
  hospitals: HospitalResult[];
  activeHospitalId?: string | null;
  center: { lat: number; lng: number };
  onZoomChanged: (zoom: number) => void;
}) {
  const map = useMap();
  const animFrameRef = useRef<number>(0);

  // Report zoom level to parent so markers can scale
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('zoom_changed', () => {
      onZoomChanged(map.getZoom() || 12);
    });
    // Fire initial value
    onZoomChanged(map.getZoom() || 12);
    return () => google.maps.event.removeListener(listener);
  }, [map, onZoomChanged]);

  const animateCamera = useCallback(
    (targetLat: number, targetLng: number, targetZoom: number, durationMs = 800) => {
      if (!map) return;

      // Cancel any running animation
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      const startLat = map.getCenter()?.lat() ?? targetLat;
      const startLng = map.getCenter()?.lng() ?? targetLng;
      const startZoom = map.getZoom() ?? 12;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const raw = Math.min(elapsed / durationMs, 1);
        const t = easeInOutCubic(raw);

        map.moveCamera({
          center: { lat: lerp(startLat, targetLat, t), lng: lerp(startLng, targetLng, t) },
          zoom: lerp(startZoom, targetZoom, t),
        });

        if (raw < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [map],
  );

  useEffect(() => {
    if (!map) return;

    if (activeHospitalId) {
      const h = hospitals.find((h) => h.id === activeHospitalId);
      if (h) animateCamera(h.lat, h.lng, 15, 900);
    } else if (hospitals.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      hospitals.forEach((h) => bounds.extend({ lat: h.lat, lng: h.lng }));
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    } else {
      animateCamera(center.lat, center.lng, 12, 700);
    }
  }, [map, activeHospitalId, hospitals, center, animateCamera]);

  // Cleanup on unmount
  useEffect(() => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }, []);

  return null;
}

// ─── Marker component ──────────────────────────────────────────
function HospitalMarker({
  hospital,
  isActive,
  zoom,
  onClick,
}: {
  hospital: HospitalResult;
  isActive: boolean;
  zoom: number;
  onClick: () => void;
}) {
  // Dynamic sizing based on zoom
  const show = zoom >= 9;
  if (!show) return null;

  // Label visibility: only show on active or when zoomed in enough
  const showLabel = isActive || zoom >= 14;
  const labelScale = isActive ? 1 : Math.min(1, Math.max(0, (zoom - 13) / 3));

  // Color based on insurance status
  let bg = '#d97706'; // amber = unknown
  let border = '#b45309';
  let icon = '?';

  if (hospital.acceptsInsurance === true) {
    bg = '#16a34a';
    border = '#15803d';
    icon = '✓';
  } else if (hospital.acceptsInsurance === false) {
    bg = '#dc2626';
    border = '#b91c1c';
    icon = '✕';
  }

  // Pin size scales gently with zoom
  const baseSize = isActive ? 36 : Math.min(32, Math.max(20, (zoom - 8) * 4));

  return (
    <AdvancedMarker
      position={{ lat: hospital.lat, lng: hospital.lng }}
      onClick={onClick}
      zIndex={isActive ? 100 : 1}
    >
      <div
        className="flex flex-col items-center"
        style={{
          transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Label pill */}
        <div
          className="rounded-lg px-2.5 py-1 mb-1.5 shadow-lg pointer-events-none select-none"
          style={{
            backgroundColor: bg,
            borderColor: border,
            maxWidth: showLabel ? 220 : 0,
            opacity: showLabel ? labelScale : 0,
            transform: `scale(${showLabel ? Math.max(0.7, labelScale) : 0.5})`,
            transition: 'opacity 0.35s ease, transform 0.35s ease, max-width 0.35s ease',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="text-white font-bold text-xs leading-none tracking-tight">
            {hospital.name}
          </span>
        </div>

        {/* Pin dot */}
        <div
          className="rounded-full shadow-lg cursor-pointer flex items-center justify-center border-2"
          style={{
            width: baseSize,
            height: baseSize,
            backgroundColor: bg,
            borderColor: isActive ? '#ffffff' : border,
            boxShadow: isActive
              ? `0 0 0 3px ${bg}40, 0 4px 12px ${bg}60`
              : `0 2px 6px ${bg}40`,
            transition:
              'width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          <span
            className="text-white font-extrabold leading-none"
            style={{ fontSize: Math.max(10, baseSize * 0.4) }}
          >
            {icon}
          </span>
        </div>
      </div>
    </AdvancedMarker>
  );
}

// ─── Main map ──────────────────────────────────────────────────
export default function ClinicMap({
  hospitals,
  center,
  activeHospitalId,
  onMarkerClick,
}: ClinicMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [zoom, setZoom] = useState(12);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        mapId="DEMO_MAP_ID"
        className="w-full h-full"
        gestureHandling="greedy"
        zoomControl={true}
        streetViewControl={true}
        mapTypeControl={true}
        fullscreenControl={true}
      >
        <MapController
          hospitals={hospitals}
          activeHospitalId={activeHospitalId}
          center={center}
          onZoomChanged={setZoom}
        />

        {hospitals.map((h) => (
          <HospitalMarker
            key={h.id}
            hospital={h}
            isActive={activeHospitalId === h.id}
            zoom={zoom}
            onClick={() => onMarkerClick?.(h.id)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
