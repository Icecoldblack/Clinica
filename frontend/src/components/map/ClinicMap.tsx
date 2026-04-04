import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Clinic } from '../../services/clinicService';

// Fix Leaflet default marker icons in bundled apps
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom FQHC marker icon (terracotta)
const fqhcIcon = L.divIcon({
  className: '',
  html: `<div style="
    background: #9a4028;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  "><span style="color:white;font-size:14px;font-weight:bold;">✦</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Regular clinic marker (teal)
const regularIcon = L.divIcon({
  className: '',
  html: `<div style="
    background: #14696d;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Helper to recenter map
function MapRecenterer({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface ClinicMapProps {
  clinics: Clinic[];
  center: [number, number];
  activeClinicId?: string | null;
  onMarkerClick?: (clinicId: string) => void;
}

export default function ClinicMap({ clinics, center, activeClinicId, onMarkerClick }: ClinicMapProps) {
  return (
    <MapContainer center={center} zoom={12} className="h-full w-full" scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenterer center={center} />

      {clinics.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.lat, clinic.lng]}
          icon={clinic.isFqhc ? fqhcIcon : regularIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(clinic.id),
          }}
        >
          <Popup>
            <div className="font-body">
              <p className="font-headline font-bold text-sm text-on-surface">
                {clinic.name} {clinic.isFqhc && '✦'}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">{clinic.address}</p>
              {clinic.phone && (
                <a href={`tel:${clinic.phone}`} className="text-xs font-bold text-secondary mt-1 block">
                  {clinic.phone}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
