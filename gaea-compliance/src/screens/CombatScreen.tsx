import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import Card from '../components/Card';
import EnemyPanel from '../components/EnemyPanel';
import PlayerPanel from '../components/PlayerPanel';
import { CardInstance } from '../types/game';
import { colors, fonts, spacing, radius } from '../styles/theme';

const SCREEN_W = Dimensions.get('window').width;

export default function CombatScreen() {
  const combat = useGameStore((s) => s.combat);
  const run = useGameStore((s) => s.run);
  const playCardInCombat = useGameStore((s) => s.playCardInCombat);
  const endTurn = useGameStore((s) => s.endTurn);
  const [logOpen, setLogOpen] = useState(false);
  const [choiceCard, setChoiceCard] = useState<CardInstance | null>(null);
  const logScrollRef = useRef<ScrollView>(null);

  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollToEnd({ animated: true });
    }
  }, [combat?.log.length]);

  if (!combat || !run) return null;

  const { player, enemy, hand, deck, discardPile, log, phase } = combat;

  const handleCardPress = (card: CardInstance) => {
    if (phase !== 'player_turn') return;
    if (player.energy < card.cost) return;

    if (card.effect.chooseOne) {
      setChoiceCard(card);
    } else {
      playCardInCombat(card);
    }
  };

  const handleChoiceSelect = (index: 0 | 1) => {
    if (choiceCard) {
      playCardInCombat(choiceCard, index);
      setChoiceCard(null);
    }
  };

  const lastLog = log[log.length - 1] ?? '';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Enemy area */}
      <View style={styles.enemyArea}>
        <EnemyPanel enemy={enemy} />
      </View>

      {/* Last log line */}
      <TouchableOpacity style={styles.logBanner} onPress={() => setLogOpen(true)}>
        <Text style={styles.logBannerText} numberOfLines={1}>
          {lastLog}
        </Text>
        <Text style={styles.logBannerMore}>[LOG]</Text>
      </TouchableOpacity>

      {/* Player area */}
      <View style={styles.playerArea}>
        <PlayerPanel player={player} deckSize={deck.length} discardSize={discardPile.length} />
      </View>

      {/* Hand */}
      <ScrollView
        horizontal
        style={styles.handScroll}
        contentContainerStyle={styles.handContent}
        showsHorizontalScrollIndicator={false}
      >
        {hand.map((card) => (
          <Card
            key={card.instanceId}
            card={card}
            onPress={() => handleCardPress(card)}
            disabled={phase !== 'player_turn' || player.energy < card.cost}
          />
        ))}
        {hand.length === 0 && (
          <Text style={styles.emptyHand}>No cards in hand</Text>
        )}
      </ScrollView>

      {/* End Turn */}
      <TouchableOpacity
        style={[styles.endTurnBtn, phase !== 'player_turn' && styles.endTurnDisabled]}
        onPress={endTurn}
        disabled={phase !== 'player_turn'}
      >
        <Text style={styles.endTurnText}>END TURN</Text>
      </TouchableOpacity>

      {/* Combat Log Modal */}
      <Modal visible={logOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.logModal}>
            <Text style={styles.logTitle}>COMBAT LOG</Text>
            <ScrollView
              ref={logScrollRef}
              style={styles.logScroll}
              onLayout={() => logScrollRef.current?.scrollToEnd()}
            >
              {log.map((line, i) => (
                <Text
                  key={i}
                  style={[
                    styles.logLine,
                    line.startsWith('---') && styles.logDivider,
                    line.includes('neutralized') && styles.logVictory,
                    line.includes('terminated') && styles.logDefeat,
                  ]}
                >
                  {line}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLogOpen(false)}>
              <Text style={styles.closeBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Choice Modal */}
      {choiceCard && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.choiceModal}>
              <Text style={styles.choiceTitle}>STRATEGIC DECISION</Text>
              <Text style={styles.choiceSubtitle}>{choiceCard.name}</Text>
              <View style={styles.choiceButtons}>
                <TouchableOpacity
                  style={[styles.choiceBtn, { borderColor: colors.attack }]}
                  onPress={() => handleChoiceSelect(0)}
                >
                  <Text style={[styles.choiceBtnText, { color: colors.attack }]}>
                    {choiceCard.effect.chooseOneLabels?.[0] ?? 'Option A'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.choiceBtn, { borderColor: colors.blue }]}
                  onPress={() => handleChoiceSelect(1)}
                >
                  <Text style={[styles.choiceBtnText, { color: colors.blue }]}>
                    {choiceCard.effect.chooseOneLabels?.[1] ?? 'Option B'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setChoiceCard(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  enemyArea: {
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  logBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  logBannerText: {
    flex: 1,
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
  },
  logBannerMore: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    fontWeight: 'bold',
  },
  playerArea: {
    padding: spacing.md,
  },
  handScroll: {
    flex: 1,
  },
  handContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'flex-end',
  },
  emptyHand: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    alignSelf: 'center',
    marginTop: spacing.xxl,
  },
  endTurnBtn: {
    margin: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.greenMuted,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  endTurnDisabled: {
    backgroundColor: colors.grayDark,
    borderColor: colors.grayDim,
  },
  endTurnText: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.lg,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logModal: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  logTitle: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  logScroll: {
    maxHeight: 300,
  },
  logLine: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    lineHeight: 16,
    marginBottom: 2,
  },
  logDivider: {
    color: colors.grayDim,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
    marginTop: 4,
  },
  logVictory: {
    color: colors.green,
    fontWeight: 'bold',
  },
  logDefeat: {
    color: colors.red,
    fontWeight: 'bold',
  },
  closeBtn: {
    borderWidth: 1,
    borderColor: colors.grayDim,
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  closeBtnText: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
  },
  choiceModal: {
    width: '90%',
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  choiceTitle: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  choiceSubtitle: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
  },
  choiceButtons: {
    width: '100%',
    gap: spacing.sm,
  },
  choiceBtn: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.bgCard,
  },
  choiceBtnText: {
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
  },
  cancelText: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
  },
});
