import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function RestScreen() {
  const run = useGameStore((s) => s.run);
  const rest = useGameStore((s) => s.rest);

  if (!run) return null;
  const healAmount = Math.floor(run.maxHp * 0.3);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.icon}>◉</Text>
        <Text style={styles.title}>BREAK ROOM</Text>
        <Text style={styles.subtitle}>Floor {run.map.floor}</Text>

        <View style={styles.card}>
          <Text style={styles.flavor}>
            The fluorescent light flickers. Someone has left{'\n'}
            a motivational poster: "COMPLIANCE IS CARE."{'\n\n'}
            The vending machine dispenses synthetic{'\n'}
            coffee. It tastes like liability waivers.{'\n\n'}
            You check your OmniCorp wellness app.{'\n'}
            It shows a green checkmark.
          </Text>
        </View>

        <View style={styles.hpRow}>
          <Text style={styles.hpText}>
            HP: {run.hp}/{run.maxHp}
          </Text>
          <Text style={styles.healText}>
            → Heal {healAmount} HP
          </Text>
          <Text style={styles.hpText}>
            → {Math.min(run.maxHp, run.hp + healAmount)}/{run.maxHp}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={rest}>
          <Text style={styles.buttonText}>TAKE BREAK (+{healAmount} HP)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
  icon: {
    color: colors.green,
    fontSize: 48,
    textShadowColor: colors.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  title: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xxl,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  subtitle: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    maxWidth: 320,
  },
  flavor: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  hpRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  hpText: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
  },
  healText: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.greenMuted,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  buttonText: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
