import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function VictoryScreen() {
  const run = useGameStore((s) => s.run);
  const restartGame = useGameStore((s) => s.restartGame);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.icon}>★</Text>
        <Text style={styles.title}>MISSION ACCOMPLISHED</Text>
        <Text style={styles.subtitle}>FOREVER GREEN INITIATIVE: RATIFIED</Text>

        <View style={styles.card}>
          <Text style={styles.flavor}>
            The Secretary has been neutralized.{'\n\n'}
            The Forever Green Initiative passes{'\n'}
            through the Administrative Review Board{'\n'}
            at 11:58 PM on New Year's Eve.{'\n\n'}
            It deregulates 94% of existing{'\n'}
            environmental enforcement mechanisms.{'\n\n'}
            OmniCorp stock rises 34% overnight.{'\n\n'}
            You receive a performance bonus{'\n'}
            and a certificate of appreciation.{'\n\n'}
            The certificate is printed on{'\n'}
            <Text style={styles.flavorBold}>recycled paper</Text>.
          </Text>
        </View>

        {run && (
          <View style={styles.statsBlock}>
            <Text style={styles.statsLabel}>FINAL COMPLIANCE REPORT</Text>
            <Text style={styles.stat}>Deck Size: {run.deck.length} cards</Text>
            <Text style={styles.stat}>Gold Accumulated: {run.gold}</Text>
            <Text style={styles.stat}>Relics Acquired: {run.relics.length}</Text>
            <Text style={styles.stat}>
              Final HP: {run.hp}/{run.maxHp}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>NEW ASSIGNMENT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    padding: spacing.xl,
    gap: spacing.xl,
    alignItems: 'center',
    minHeight: '100%',
    justifyContent: 'center',
  },
  icon: {
    color: colors.yellow,
    fontSize: 64,
    textShadowColor: colors.yellow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    color: colors.yellow,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xxl,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: colors.yellow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.yellow + '44',
    borderRadius: radius.md,
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    maxWidth: 340,
  },
  flavor: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  flavorBold: {
    color: colors.green,
    fontWeight: 'bold',
  },
  statsBlock: {
    borderWidth: 1,
    borderColor: colors.yellow + '33',
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
    backgroundColor: colors.yellow + '22',
    borderWidth: 1.5,
    borderColor: colors.yellow,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  buttonText: {
    color: colors.yellow,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});
