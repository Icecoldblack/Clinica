import { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { HospitalResult } from '../../services/insuranceService';

interface ClinicMapProps {
  hospitals: HospitalResult[];
  center: { lat: number; lng: number };
  activeHospitalId?: string | null;
  onMarkerClick?: (id: string) => void;
}

function MapController({
  hospitals,
  activeHospitalId,
  center,
}: {
  hospitals: HospitalResult[];
  activeHospitalId?: string | null;
  center: { lat: number; lng: number };
}) {
  const map = useMap();
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!map) return;
    
    // Clear any outgoing animations if the user clicks rapidly
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    if (activeHospitalId) {
      const activeHospital = hospitals.find((h) => h.id === activeHospitalId);
      if (activeHospital) {
        const target = { lat: activeHospital.lat, lng: activeHospital.lng };
        const currentZoom = map.getZoom() || 12;
        
        // Simulating the smooth "zoom out, go over, zoom in" effect
        if (currentZoom > 13) {
          map.setZoom(13); // Zoom out
          timeouts.current.push(setTimeout(() => {
            map.panTo(target); // Pan to new loc
            timeouts.current.push(setTimeout(() => {
              map.setZoom(16); // Zoom in slightly more than before
            }, 600)); 
          }, 350));
        } else {
          // If already zoomed out enough, just pan and zoom in
          map.panTo(target);
          timeouts.current.push(setTimeout(() => {
            map.setZoom(16);
          }, 500));
        }
      }
    } else {
      map.setZoom(11);
      timeouts.current.push(setTimeout(() => map.panTo(center), 200));
    }
  }, [map, activeHospitalId, hospitals, center]);

  return null;
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
        zoomControl={true}
        streetViewControl={true}
      >
        <MapController hospitals={hospitals} activeHospitalId={activeHospitalId} center={center} />

        {hospitals.map((h) => {
          let bgClass = 'bg-amber-500 border-amber-600';
          let icon = '?';

          if (h.acceptsInsurance === true) {
            bgClass = 'bg-green-500 border-green-600';
            icon = '✓';
          } else if (h.acceptsInsurance === false) {
            bgClass = 'bg-red-500 border-red-600';
            icon = '✕';
          }

          const isActive = activeHospitalId === h.id;

          return (
            <AdvancedMarker
              key={h.id}
              position={{ lat: h.lat, lng: h.lng }}
              onClick={() => onMarkerClick?.(h.id)}
              zIndex={isActive ? 100 : 1}
            >
              <div 
                className={`flex items-center rounded-full shadow-lg border-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom cursor-pointer ${bgClass}`}
                style={{
                   padding: isActive ? '4px 6px' : '0px',
                   transform: isActive ? 'scale(1.1) translateY(-10px)' : 'scale(1) translateY(0)',
                }}
              >
                <div className={`flex-shrink-0 flex items-center justify-center transition-all ${isActive ? 'w-6 h-6' : 'w-8 h-8'}`}>
                  <span className="text-white font-extrabold text-sm leading-none mt-[1px]">{icon}</span>
                </div>
                
                <div 
                  className="text-white font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-500"
                  style={{
                    maxWidth: isActive ? '300px' : '0px',
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? '4px' : '0px',
                    marginRight: isActive ? '4px' : '0px',
                  }}
                >
                  {h.name}
                </div>
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
