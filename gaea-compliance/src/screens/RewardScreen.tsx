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
import Card from '../components/Card';
import { CardDefinition } from '../types/game';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function RewardScreen() {
  const rewardCards = useGameStore((s) => s.rewardCards);
  const rewardGold = useGameStore((s) => s.rewardGold);
  const run = useGameStore((s) => s.run);
  const claimReward = useGameStore((s) => s.claimReward);

  if (!run) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>MISSION COMPLETE</Text>
        <Text style={styles.subtitle}>SELECT A CARD TO ADD TO YOUR DOSSIER</Text>

        <View style={styles.goldRow}>
          <Text style={styles.goldText}>+ {rewardGold} GOLD RECEIVED</Text>
        </View>

        {/* Card choices */}
        <View style={styles.cardsRow}>
          {rewardCards.map((card) => (
            <TouchableOpacity key={card.id} onPress={() => claimReward(card)}>
              <View style={styles.cardWrapper}>
                <Card card={card} />
                <View style={[styles.rarityBanner, { backgroundColor: getRarityBg(card.rarity) }]}>
                  <Text style={styles.rarityText}>{card.rarity.toUpperCase()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => claimReward(null)}>
          <Text style={styles.skipText}>SKIP — PROCEED TO MAP</Text>
        </TouchableOpacity>

        {/* Deck reminder */}
        <View style={styles.deckInfo}>
          <Text style={styles.deckLabel}>CURRENT DECK ({run.deck.length} cards)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.deckRow}>
              {run.deck.map((c, i) => (
                <Card key={`${c.id}_${i}`} card={c} small />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getRarityBg(rarity: string): string {
  if (rarity === 'rare') return colors.rare + '33';
  if (rarity === 'uncommon') return colors.uncommon + '33';
  return colors.common + '22';
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.xl,
    alignItems: 'center',
  },
  title: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xxl,
    fontWeight: 'bold',
    letterSpacing: 3,
    textShadowColor: colors.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
    textAlign: 'center',
  },
  goldRow: {
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.yellow + '11',
  },
  goldText: {
    color: colors.yellow,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  rarityBanner: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  rarityText: {
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  skipBtn: {
    borderWidth: 1,
    borderColor: colors.grayDim,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  skipText: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    letterSpacing: 1,
  },
  deckInfo: {
    width: '100%',
    gap: spacing.sm,
  },
  deckLabel: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
  },
  deckRow: {
    flexDirection: 'row',
    gap: 3,
  },
});
