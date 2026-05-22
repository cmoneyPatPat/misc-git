import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerState } from '../types/game';
import HealthBar from './HealthBar';
import StatusBadge from './StatusBadge';
import { colors, fonts, spacing, radius } from '../styles/theme';

interface Props {
  player: PlayerState;
  deckSize: number;
  discardSize: number;
}

export default function PlayerPanel({ player, deckSize, discardSize }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* HP */}
        <View style={styles.hpSection}>
          <Text style={styles.label}>COMPLIANCE OFFICER</Text>
          <HealthBar hp={player.hp} maxHp={player.maxHp} color={colors.green} />
          {player.block > 0 && (
            <Text style={styles.blockText}>🛡 {player.block}</Text>
          )}
        </View>

        {/* Energy */}
        <View style={styles.energySection}>
          <Text style={styles.label}>ENERGY</Text>
          <Text style={styles.energyText}>
            {player.energy}/{player.maxEnergy}
          </Text>
        </View>
      </View>

      {/* Status row */}
      <StatusBadge status={player.status} />

      {/* Deck/Discard */}
      <View style={styles.pileRow}>
        <Text style={styles.pile}>DECK: {deckSize}</Text>
        <Text style={styles.pile}>DISCARD: {discardSize}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  hpSection: {
    flex: 1,
    gap: 3,
  },
  label: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 1,
  },
  blockText: {
    color: colors.blue,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    fontWeight: 'bold',
  },
  energySection: {
    alignItems: 'center',
    gap: 2,
  },
  energyText: {
    color: colors.yellow,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xxl,
    fontWeight: 'bold',
  },
  pileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pile: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
  },
});
