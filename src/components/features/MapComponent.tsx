import React, { useEffect, useRef } from 'react';

interface LocationPin {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface MapComponentProps {
  locations?: LocationPin[];
  zoom?: number;
  height?: string;
  center?: [number, number];
}

// Simple map component using OpenStreetMap/Leaflet
export const MapComponent: React.FC<MapComponentProps> = ({
  locations = [
    {
      name: '3D Sawmill Head Office',
      lat: -25.7461,
      lng: 28.2313,
      address: 'Johannesburg, South Africa',
    },
  ],
  zoom = 10,
  height = '400px',
  center = [-25.7461, 28.2313],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      // Add CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);

      // Load script
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        if (mapContainer.current && !map.current) {
          // Initialize map
          const L = (window as any).L;
          map.current = L.map(mapContainer.current).setView(center, zoom);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map.current);

          // Add markers
          locations.forEach((location) => {
            const marker = L.marker([location.lat, location.lng])
              .addTo(map.current)
              .bindPopup(
                `<div class="font-semibold text-gray-900">${location.name}</div><div class="text-sm text-gray-600">${location.address}</div>`
              );
          });
        }
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, locations]);

  return (
    <div
      ref={mapContainer}
      style={{
        height,
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      className="border border-gray-200 dark:border-gray-700 shadow-lg"
    />
  );
};
