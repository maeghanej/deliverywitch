import { useState } from 'react';
import { Modal, Button, Text, Group, Stack, Badge } from '@mantine/core';
import { useWorldStore } from '../stores/worldStore';
import { useInteractionStore } from '../stores/interactionStore';
import type { Interaction } from '../types/Interaction';
import { RELATIONSHIP_TIERS } from '../types/Interaction';

interface CharacterInteractionProps {
  characterId: string;
  onClose: () => void;
}

export const CharacterInteraction = ({ characterId, onClose }: CharacterInteractionProps) => {
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  
  const character = useWorldStore(state => state.characters[characterId]);
  const { increaseRelationship, unlockLocation } = useWorldStore();
  const { getAvailableInteractions, trackInteraction } = useInteractionStore();

  if (!character) return null;

  const availableInteractions = getAvailableInteractions(characterId);
  const currentTier = RELATIONSHIP_TIERS.find(tier => tier.tier === character.relationshipTier);
  const nextTier = RELATIONSHIP_TIERS.find(tier => tier.requiredPoints > character.relationshipLevel);

  const handleInteractionChoice = (interaction: Interaction, choiceIndex: number) => {
    const choice = interaction.choices?.[choiceIndex];
    if (!choice) return;

    // Apply rewards
    const totalPoints = choice.reward.relationshipPoints + (choice.reward.bonusPoints?.amount || 0);
    increaseRelationship(characterId, totalPoints);
    trackInteraction(characterId, interaction.type);

    // Handle unlocks
    if (choice.unlockId) {
      unlockLocation(choice.unlockId);
    }

    // Show reward message
    setRewardMessage(
      `${choice.reward.description}${choice.reward.bonusPoints 
        ? `\n+${choice.reward.bonusPoints.amount} bonus points: ${choice.reward.bonusPoints.reason}` 
        : ''}`
    );

    // Clear selected interaction
    setSelectedInteraction(null);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={
        <Group>
          <Text size="lg" fw={500}>{character.name}</Text>
          <Badge color="blue">
            {currentTier?.name} ({character.relationshipLevel}/100)
          </Badge>
        </Group>
      }
      size="lg"
    >
      <Stack>
        {/* Character description */}
        <Text size="sm" c="dimmed">
          {character.description}
        </Text>

        {/* Progress to next tier */}
        {nextTier && (
          <Text size="sm" c="dimmed">
            {nextTier.requiredPoints - character.relationshipLevel} points until {nextTier.name}
          </Text>
        )}

        {/* Reward message */}
        {rewardMessage && (
          <Text color="green" size="sm" mb="md">
            {rewardMessage}
          </Text>
        )}

        {/* Available interactions */}
        {!selectedInteraction && (
          <Stack>
            {availableInteractions.map((interaction, index) => (
              <Button
                key={`${interaction.type}-${index}`}
                variant="light"
                onClick={() => setSelectedInteraction(interaction)}
              >
                {interaction.text}
              </Button>
            ))}
          </Stack>
        )}

        {/* Interaction choices */}
        {selectedInteraction && selectedInteraction.choices && (
          <Stack>
            <Text>{selectedInteraction.text}</Text>
            {selectedInteraction.choices.map((choice, index) => (
              <Button
                key={index}
                variant="light"
                onClick={() => handleInteractionChoice(selectedInteraction, index)}
              >
                {choice.text}
              </Button>
            ))}
            <Button variant="subtle" onClick={() => setSelectedInteraction(null)}>
              Back
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}; 