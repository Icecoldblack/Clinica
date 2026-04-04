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
        {clinics.map((clinic) => (
          <AdvancedMarker
            key={clinic.id}
            position={{ lat: clinic.lat, lng: clinic.lng }}
            onClick={() => onMarkerClick?.(clinic.id)}
            zIndex={activeClinicId === clinic.id ? 100 : 1}
          >
            <Pin
              background={clinic.isFqhc ? '#9a4028' : '#14696d'}
              borderColor={'#ffffff'}
              glyphColor={'#ffffff'}
              glyph={clinic.isFqhc ? '✦' : ''}
              scale={clinic.isFqhc ? 1.4 : 1.0}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
