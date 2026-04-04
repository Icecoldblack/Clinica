import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Clinic } from '../../services/clinicService';

interface ClinicMapProps {
  clinics: Clinic[];
  center: { lat: number; lng: number };
  activeClinicId?: string | null;
  onMarkerClick?: (clinicId: string) => void;
}

export default function ClinicMap({ clinics, center, activeClinicId, onMarkerClick }: ClinicMapProps) {
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
        {clinics.map((item: any) => {
          let bg = '#14696d'; // teal default
          let glyph = '';
          let scale = 1.0;

          if (item.isHospital) {
            if (item.acceptsInsurance === true) {
              bg = '#16a34a'; // green
              glyph = '✓';
              scale = 1.2;
            } else if (item.acceptsInsurance === false) {
              bg = '#dc2626'; // red
              glyph = '✕';
            } else {
              bg = '#d97706'; // yellow/amber
              glyph = '?';
            }
          } else if (item.isFqhc) {
            bg = '#9a4028'; // terracotta
            glyph = '✦';
            scale = 1.4;
          }

          return (
            <AdvancedMarker
              key={item.id}
              position={{ lat: item.lat, lng: item.lng }}
              onClick={() => onMarkerClick?.(item.id)}
              zIndex={activeClinicId === item.id ? 100 : 1}
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
