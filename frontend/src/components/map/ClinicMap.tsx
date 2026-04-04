import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { HospitalResult } from '../../services/insuranceService';

interface ClinicMapProps {
  hospitals: HospitalResult[];
  center: { lat: number; lng: number };
  activeHospitalId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function ClinicMap({ hospitals, center, activeHospitalId, onMarkerClick }: ClinicMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        mapId="DEMO_MAP_ID"
        className="w-full h-full"
        gestureHandling="greedy"
      >
        {hospitals.map((h) => {
          let bg = '#d97706'; // amber = unknown
          let glyph = '?';
          let scale = 1.0;

          if (h.acceptsInsurance === true) {
            bg = '#16a34a'; // green
            glyph = '✓';
            scale = 1.2;
          } else if (h.acceptsInsurance === false) {
            bg = '#dc2626'; // red
            glyph = '✕';
          }

          return (
            <AdvancedMarker
              key={h.id}
              position={{ lat: h.lat, lng: h.lng }}
              onClick={() => onMarkerClick?.(h.id)}
              zIndex={activeHospitalId === h.id ? 100 : 1}
            >
              <Pin
                background={bg}
                borderColor={'#ffffff'}
                glyphColor={'#ffffff'}
                glyph={glyph}
                scale={scale}
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
