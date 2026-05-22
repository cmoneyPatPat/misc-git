import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/theme';

interface Props {
  hp: number;
  maxHp: number;
  label?: string;
  color?: string;
}

export default function HealthBar({ hp, maxHp, label, color = colors.green }: Props) {
  const pct = Math.max(0, Math.min(1, hp / maxHp));
  const barColor = pct > 0.5 ? color : pct > 0.25 ? colors.yellow : colors.red;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.text, { color: barColor }]}>
        {hp}/{maxHp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    color: colors.grayDim,
    fontSize: fonts.size.xs,
    fontFamily: fonts.mono,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: colors.grayDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  text: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.mono,
    fontWeight: 'bold',
  },
});
