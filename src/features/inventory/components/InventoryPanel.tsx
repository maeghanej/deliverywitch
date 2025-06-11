import { useInventoryStore } from '../stores/inventoryStore';
import { Paper, Stack, Text, Badge } from '@mantine/core';
import { useLocationEventStore } from '../../location/stores/locationEventStore';

export const InventoryPanel = () => {
  const items = useInventoryStore(state => state.items);
  const locations = useLocationEventStore(state => state.activeLocations);

  if (items.length === 0) {
    return null;
  }

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location?.name || 'Unknown Location';
  };

  return (
    <Paper
      className="fixed top-20 right-4 p-4 z-10 max-w-sm"
      shadow="md"
      radius="md"
    >
      <Stack gap="sm">
        <Text fw={500} size="lg">
          Inventory
        </Text>
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Text size="sm">{item.name}</Text>
                <Text size="sm" c="dimmed">→</Text>
                <Text size="sm">{getLocationName(item.destination)}</Text>
              </div>
              <Text size="xs" c="dimmed">
                Value: {item.value} coins
              </Text>
            </div>
            <Badge color="yellow">
              In Transit
            </Badge>
          </div>
        ))}
      </Stack>
    </Paper>
  );
}; 