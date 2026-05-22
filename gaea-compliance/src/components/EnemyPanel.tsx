import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { EnemyState } from '../types/game';
import HealthBar from './HealthBar';
import StatusBadge from './StatusBadge';
import { colors, fonts, spacing, radius } from '../styles/theme';

interface Props {
  enemy: EnemyState;
}

function intentIcon(type: string): string {
  switch (type) {
    case 'attack': return '⚡';
    case 'defend': return '🛡';
    case 'debuff': return '☣';
    case 'buff': return '↑';
    case 'special': return '★';
    default: return '?';
  }
}

function intentColor(type: string): string {
  switch (type) {
    case 'attack': return colors.red;
    case 'defend': return colors.blue;
    case 'debuff': return colors.yellow;
    case 'buff': return colors.green;
    default: return colors.gray;
  }
}

export default function EnemyPanel({ enemy }: Props) {
  const intent = enemy.intent;
  const iColor = intentColor(intent.type);

  return (
    <View style={styles.container}>
      {/* Enemy name/title */}
      <Text style={styles.name}>{enemy.name}</Text>
      <Text style={styles.title}>{enemy.title}</Text>

      {/* Intent */}
      <View style={[styles.intentBadge, { borderColor: iColor }]}>
        <Text style={styles.intentIcon}>{intentIcon(intent.type)}</Text>
        <Text style={[styles.intentLabel, { color: iColor }]}>
          {intent.label}
          {intent.damage ? ` (${intent.damage}${intent.times && intent.times > 1 ? `×${intent.times}` : ''})` : ''}
        </Text>
      </View>

      {/* Block */}
      {enemy.block > 0 && (
        <View style={styles.blockRow}>
          <Text style={styles.blockText}>🛡 {enemy.block}</Text>
        </View>
      )}

      {/* HP */}
      <View style={styles.hpRow}>
        <HealthBar hp={enemy.hp} maxHp={enemy.maxHp} color={colors.red} />
      </View>

      {/* Status effects */}
      <StatusBadge status={enemy.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 180,
  },
  name: {
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: fonts.size.lg,
    fontWeight: 'bold',
  },
  title: {
    color: colors.red,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  intentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.bgCard,
  },
  intentIcon: {
    fontSize: fonts.size.md,
  },
  intentLabel: {
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    fontWeight: 'bold',
  },
  blockRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  blockText: {
    color: colors.blue,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
  },
  hpRow: {
    width: '100%',
  },
});
