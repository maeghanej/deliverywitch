import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useGeolocation } from '../../location/hooks/useGeolocation';
import { useLocationEventStore } from '../../location/stores/locationEventStore';
import { calculateDistance } from '../../delivery/utils/distance';
import type { LocationPoint } from '../../location/types/LocationEvents';
import type { Feature, FeatureCollection, Point } from 'geojson';

// Set your Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFlZ2hhbmVqIiwiYSI6ImNtYXp0aGdmbzA1eTUybG9nMml5dm4yczIifQ.oZ52QvKYkwZGhigZpSCzUw';
mapboxgl.accessToken = MAPBOX_TOKEN;

const DEFAULT_INTERACTION_RADIUS = 20; // meters

interface LocationFeatureProperties {
  id: string;
  radius: number;
  isInRange: boolean;
}

export const GameMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const playerMarker = useRef<mapboxgl.Marker | null>(null);
  const locationMarkers = useRef<{ [key: string]: { marker: mapboxgl.Marker, circle?: mapboxgl.Layer } }>({});

  const { coordinates, status } = useGeolocation();
  const nearbyLocations = useLocationEventStore(state => state.nearbyLocations);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 16,
      center: coordinates ? [coordinates.longitude, coordinates.latitude] : [-122.4194, 37.7749]
    });

    newMap.addControl(new mapboxgl.NavigationControl());

    // Add source for interaction ranges
    newMap.on('load', () => {
      newMap.addSource('interaction-ranges', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        } as FeatureCollection
      });
    });

    map.current = newMap;

    return () => {
      newMap.remove();
      map.current = null;
    };
  }, [coordinates]);

  // Update player position
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !coordinates) return;

    // Center map on first position
    if (!playerMarker.current) {
      currentMap.setCenter([coordinates.longitude, coordinates.latitude]);
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
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(currentMap);
    } else {
      playerMarker.current.setLngLat([coordinates.longitude, coordinates.latitude]);
    }

    // Smooth map movement
    currentMap.easeTo({
      center: [coordinates.longitude, coordinates.latitude],
      duration: 1000
    });
  }, [coordinates]);

  // Update location markers and interaction ranges
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !coordinates) return;

    // Remove old markers
    Object.values(locationMarkers.current).forEach(({ marker }) => marker.remove());
    locationMarkers.current = {};

    // Update interaction ranges source
    const source = currentMap.getSource('interaction-ranges') as mapboxgl.GeoJSONSource;
    if (source) {
      const features: Feature<Point, LocationFeatureProperties>[] = nearbyLocations.map(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.coordinates.longitude, location.coordinates.latitude]
        },
        properties: {
          id: location.id,
          radius: DEFAULT_INTERACTION_RADIUS,
          isInRange: calculateDistance(coordinates, location.coordinates) <= DEFAULT_INTERACTION_RADIUS
        }
      }));

      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

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

      // Add interaction range circle
      const circleId = `circle-${location.id}`;
      if (!currentMap.getLayer(circleId)) {
        currentMap.addLayer({
          id: circleId,
          type: 'circle',
          source: 'interaction-ranges',
          paint: {
            'circle-radius': ['*', ['get', 'radius'], 2], // Convert meters to pixels (approximate)
            'circle-color': [
              'case',
              ['get', 'isInRange'],
              'rgba(76, 175, 80, 0.2)', // Green when in range
              'rgba(255, 152, 0, 0.1)' // Orange when out of range
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': [
              'case',
              ['get', 'isInRange'],
              'rgba(76, 175, 80, 0.5)',
              'rgba(255, 152, 0, 0.3)'
            ]
          },
          filter: ['==', ['get', 'id'], location.id]
        });
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold">${location.name}</h3>
              ${location.description ? `<p>${location.description}</p>` : ''}
              ${calculateDistance(coordinates, location.coordinates) <= DEFAULT_INTERACTION_RADIUS 
                ? '<p class="text-green-600">In range - Click to interact!</p>' 
                : ''}
            `)
        )
        .addTo(currentMap);

      locationMarkers.current[location.id] = { 
        marker,
        circle: currentMap.getLayer(circleId) as mapboxgl.Layer
      };
    });
  }, [nearbyLocations, coordinates]);

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