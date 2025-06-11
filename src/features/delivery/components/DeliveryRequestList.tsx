import { useEffect } from 'react';
import { Stack, Paper, Text, Button, Badge, Group } from '@mantine/core';
import { useDeliveryRequestStore } from '../stores/deliveryRequestStore';
import type { DeliveryRequest } from '../types/DeliveryRequest';

interface DeliveryRequestListProps {
  locationId: string;
  onAcceptRequest: (request: DeliveryRequest) => void;
}

export const DeliveryRequestList = ({ locationId, onAcceptRequest }: DeliveryRequestListProps) => {
  const { 
    getActiveRequestsForLocation, 
    generateNewRequest, 
    cleanupExpiredRequests 
  } = useDeliveryRequestStore();

  // Clean up expired requests and potentially generate new ones
  useEffect(() => {
    cleanupExpiredRequests();
    
    // 30% chance to generate a new request if there are none
    const activeRequests = getActiveRequestsForLocation(locationId);
    if (activeRequests.length === 0 && Math.random() < 0.3) {
      generateNewRequest(locationId);
    }
  }, [locationId]);

  const requests = getActiveRequestsForLocation(locationId);

  if (requests.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="md">
        No delivery requests at the moment.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {requests.map((request) => (
        <Paper key={request.id} p="md" withBorder>
          <Stack gap="xs">
            {/* Villager Info */}
            <Group justify="space-between">
              <Text fw={500}>{request.villager.name}</Text>
              <Badge color={request.item.timeLimit ? 'red' : 'blue'}>
                {request.item.timeLimit ? `${request.item.timeLimit}min` : 'No time limit'}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {request.villager.description}
            </Text>

            {/* Item Info */}
            <Group gap="xs">
              <Text size="sm" fw={500}>
                Requests: {request.item.name}
              </Text>
              {request.item.specialEffect && (
                <Badge size="sm" variant="dot">
                  {request.item.specialEffect}
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              {request.item.description}
            </Text>

            {/* Reward */}
            <Group justify="space-between" mt="sm">
              <Text size="sm" c="dimmed">
                Reward: {request.reward} points
              </Text>
              <Button
                size="sm"
                variant="light"
                onClick={() => onAcceptRequest(request)}
                disabled={request.accepted}
              >
                {request.accepted ? 'Delivery in Progress' : 'Accept Delivery'}
              </Button>
            </Group>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}; 