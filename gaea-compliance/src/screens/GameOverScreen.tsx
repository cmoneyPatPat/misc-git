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

const FAILURE_LINES = [
  '"Your file has been transferred to Inactive Personnel."',
  '"Thank you for your service. Please return your badge."',
  '"OmniCorp regrets to inform you that your contract has been terminated."',
  '"Your compliance record has been archived. Permanently."',
  '"Performance metrics: insufficient. Reassignment: unavailable."',
];

export default function GameOverScreen() {
  const run = useGameStore((s) => s.run);
  const restartGame = useGameStore((s) => s.restartGame);

  const line = FAILURE_LINES[Math.floor(Math.random() * FAILURE_LINES.length)];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.icon}>✕</Text>
        <Text style={styles.title}>ASSIGNMENT FAILED</Text>
        <Text style={styles.subtitle}>COMPLIANCE RECORD: TERMINATED</Text>

        <View style={styles.card}>
          <Text style={styles.flavor}>{line}</Text>
        </View>

        {run && (
          <View style={styles.statsBlock}>
            <Text style={styles.statsLabel}>FINAL REPORT</Text>
            <Text style={styles.stat}>Deck Size: {run.deck.length} cards</Text>
            <Text style={styles.stat}>Gold Accumulated: {run.gold}</Text>
            <Text style={styles.stat}>Act Reached: {run.act}</Text>
            <Text style={styles.stat}>Floor: {run.map.floor}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>NEW ASSIGNMENT</Text>
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
    color: colors.red,
    fontSize: 56,
    fontWeight: 'bold',
    textShadowColor: colors.red,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    color: colors.red,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xxl,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  subtitle: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.redDim + '44',
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    maxWidth: 320,
  },
  flavor: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    gap: spacing.xs,
    width: '100%',
    maxWidth: 320,
  },
  statsLabel: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  stat: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
  },
  button: {
    backgroundColor: colors.redDim + '33',
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  buttonText: {
    color: colors.red,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});
