import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useGeolocation } from '../../location/hooks/useGeolocation';
import { useLocationEventStore } from '../../location/stores/locationEventStore';
import type { LocationPoint } from '../../location/types/LocationEvents';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFlZ2hhbmVqIiwiYSI6ImNtYXp0aGdmbzA1eTUybG9nMml5dm4yczIifQ.oZ52QvKYkwZGhigZpSCzUw';

export const GameMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const playerMarker = useRef<mapboxgl.Marker | null>(null);
  const locationMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const { coordinates, status } = useGeolocation();
  const nearbyLocations = useLocationEventStore(state => state.nearbyLocations);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 16
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update player position
  useEffect(() => {
    if (!map.current || !coordinates || status !== 'success') return;

    const { latitude, longitude } = coordinates;

    // Center map on first position
    if (!playerMarker.current) {
      map.current.setCenter([longitude, latitude]);
    }

    // Create or update player marker
    if (!playerMarker.current) {
      const el = document.createElement('div');
      el.className = 'player-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4CAF50';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

      playerMarker.current = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    } else {
      playerMarker.current.setLngLat([longitude, latitude]);
    }

    // Smooth map movement
    map.current.easeTo({
      center: [longitude, latitude],
      duration: 1000
    });
  }, [coordinates, status]);

  // Update location markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    Object.values(locationMarkers.current).forEach(marker => marker.remove());
    locationMarkers.current = {};

    // Add new markers
    nearbyLocations.forEach((location: LocationPoint) => {
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = 'rgba(255,255,255,0.2)';
      el.style.border = '2px solid #FF9800';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.innerHTML = location.icon || '📍';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold">${location.name}</h3>
              ${location.description ? `<p>${location.description}</p>` : ''}
            `)
        )
        .addTo(map.current);

      locationMarkers.current[location.id] = marker;
    });
  }, [nearbyLocations]);

  return (
    <div 
      ref={mapContainer} 
      className="fixed inset-0 z-0"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0 
      }}
    />
  );
}; 