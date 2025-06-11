import { Marker } from 'react-map-gl';
import { useDeliveryStore } from '../stores/deliveryStore';
import { useLocationEventStore } from '../../location/stores/locationEventStore';
import { DeliveryStatus } from '../types';
import { LocationType } from '../../location/types/LocationEvents';

export const DeliveryMarkers = () => {
  const { activeDelivery } = useDeliveryStore();
  const { activeLocations } = useLocationEventStore();

  // Filter quest locations
  const questLocations = activeLocations.filter(loc => loc.type === LocationType.QUEST);

  return (
    <>
      {/* Quest Locations */}
      {questLocations.map(location => (
        <Marker
          key={location.id}
          latitude={location.coordinates.latitude}
          longitude={location.coordinates.longitude}
          anchor="bottom"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-white text-lg">{location.icon || '❗'}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
          </div>
        </Marker>
      ))}

      {/* Active Delivery Markers */}
      {activeDelivery && (
        <>
          {/* Pickup Location */}
          {activeDelivery.status === DeliveryStatus.ACCEPTED && (
            <Marker
              latitude={activeDelivery.pickupLocation.coordinates.latitude}
              longitude={activeDelivery.pickupLocation.coordinates.longitude}
              anchor="bottom"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">📦</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rotate-45" />
              </div>
            </Marker>
          )}

          {/* Dropoff Location */}
          {(activeDelivery.status === DeliveryStatus.ACCEPTED || 
            activeDelivery.status === DeliveryStatus.PICKED_UP) && (
            <Marker
              latitude={activeDelivery.dropoffLocation.coordinates.latitude}
              longitude={activeDelivery.dropoffLocation.coordinates.longitude}
              anchor="bottom"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏠</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45" />
              </div>
            </Marker>
          )}
        </>
      )}
    </>
  );
}; 