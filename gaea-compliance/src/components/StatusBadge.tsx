import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusEffects } from '../types/game';
import { colors, fonts } from '../styles/theme';

interface Props {
  status: StatusEffects;
}

const STATUS_CONFIG: { key: keyof StatusEffects; symbol: string; color: string; label: string }[] = [
  { key: 'vulnerable', symbol: 'VUL', color: colors.red, label: 'Vulnerable' },
  { key: 'weak', symbol: 'WEK', color: colors.yellow, label: 'Weak' },
  { key: 'exposed', symbol: 'EXP', color: colors.blue, label: 'Exposed' },
  { key: 'silenced', symbol: 'SIL', color: colors.gray, label: 'Silenced' },
  { key: 'confused', symbol: 'CON', color: colors.power, label: 'Confused' },
  { key: 'evidence', symbol: 'EVD', color: '#ff8833', label: 'Evidence' },
  { key: 'publicOutrage', symbol: 'OUT', color: '#ff4488', label: 'Outrage' },
];

export default function StatusBadge({ status }: Props) {
  const active = STATUS_CONFIG.filter((s) => status[s.key] > 0);
  if (active.length === 0) return null;

  return (
    <View style={styles.row}>
      {active.map((s) => (
        <View key={s.key} style={[styles.badge, { borderColor: s.color }]}>
          <Text style={[styles.symbol, { color: s.color }]}>{s.symbol}</Text>
          <Text style={[styles.count, { color: s.color }]}>{status[s.key]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    backgroundColor: colors.bgCard,
    gap: 2,
  },
  symbol: {
    fontFamily: fonts.mono,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
