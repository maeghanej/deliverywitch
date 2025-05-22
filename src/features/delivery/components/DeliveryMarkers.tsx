import { Marker } from 'react-map-gl';
import { useDeliveryStore } from '../stores/deliveryStore';
import { DeliveryStatus } from '../types';

export const DeliveryMarkers = () => {
  const { activeDelivery } = useDeliveryStore();

  if (!activeDelivery) return null;

  return (
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
  );
}; 