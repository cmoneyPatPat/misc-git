import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { CardInstance, CardDefinition } from '../types/game';
import { colors, fonts, spacing, radius } from '../styles/theme';

const SCREEN_W = Dimensions.get('window').width;
export const CARD_WIDTH = Math.min(120, (SCREEN_W - 40) / 4);
export const CARD_HEIGHT = CARD_WIDTH * 1.55;

interface Props {
  card: CardInstance | CardDefinition;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  small?: boolean;
}

function typeColor(type: string) {
  if (type === 'attack') return colors.attack;
  if (type === 'skill') return colors.skill;
  if (type === 'power') return colors.power;
  return colors.gray;
}

function rarityColor(rarity: string) {
  if (rarity === 'rare') return colors.rare;
  if (rarity === 'uncommon') return colors.uncommon;
  return colors.common;
}

function describeEffect(card: CardInstance | CardDefinition): string {
  const e = card.effect;
  const parts: string[] = [];
  if (e.damage) {
    const rep = e.times && e.times > 1 ? `${e.damage}×${e.times}` : `${e.damage}`;
    parts.push(`Deal ${rep} dmg`);
  }
  if (e.damageEqualToBlock) parts.push('Deal dmg = block');
  if (e.block) parts.push(`Gain ${e.block} block`);
  if (e.draw) parts.push(`Draw ${e.draw}`);
  if (e.applyVulnerable) parts.push(`Vuln ${e.applyVulnerable}`);
  if (e.applyWeak) parts.push(`Weak ${e.applyWeak}`);
  if (e.applyExposed) parts.push(`Exposed ${e.applyExposed}`);
  if (e.applySilenced) parts.push(`Silence ${e.applySilenced}`);
  if (e.applyConfused) parts.push(`Confuse ${e.applyConfused}`);
  if (e.gainEnergy) parts.push(`+${e.gainEnergy} energy/turn`);
  if (e.doubleNextAttack) parts.push('2× next attack');
  if (e.extraCardNextTurn) parts.push('+1 card/turn');
  if (e.extraEnergyNextTurn) parts.push('+1 energy next turn');
  if (e.exhaust) parts.push('Exhaust');
  if (e.exhaustHand) parts.push(`Exhaust hand, ${e.damagePerExhausted} dmg/card`);
  if (e.chooseOne && e.chooseOneLabels) {
    return `Choose: ${e.chooseOneLabels[0]} OR ${e.chooseOneLabels[1]}`;
  }
  return parts.join(' · ') || '—';
}

export default function Card({ card, onPress, disabled, selected, small }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const w = small ? CARD_WIDTH * 0.8 : CARD_WIDTH;
  const h = small ? CARD_HEIGHT * 0.8 : CARD_HEIGHT;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 1.08, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const borderColor = selected ? colors.green : rarityColor(card.rarity);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.card,
          { width: w, height: h, borderColor, opacity: disabled ? 0.45 : 1 },
          { transform: [{ scale }] },
        ]}
      >
        {/* Cost bubble */}
        <View style={[styles.cost, { backgroundColor: typeColor(card.type) }]}>
          <Text style={styles.costText}>{card.cost}</Text>
        </View>

        {/* Name */}
        <Text style={[styles.name, { fontSize: small ? 8 : 9 }]} numberOfLines={2}>
          {card.name}
        </Text>

        {/* Type bar */}
        <View style={[styles.typeBar, { backgroundColor: typeColor(card.type) + '33' }]}>
          <Text style={[styles.typeText, { color: typeColor(card.type) }]}>
            {card.type.toUpperCase()}
          </Text>
        </View>

        {/* Effect */}
        <Text style={[styles.effect, { fontSize: small ? 7 : 8 }]} numberOfLines={4}>
          {describeEffect(card)}
        </Text>

        {/* Flavor */}
        {!small && (
          <Text style={styles.flavor} numberOfLines={2}>
            {card.flavor}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderRadius: radius.card,
    padding: spacing.xs,
    margin: 3,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cost: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  costText: {
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    fontWeight: 'bold',
  },
  name: {
    color: colors.white,
    fontFamily: fonts.mono,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  typeBar: {
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 3,
    alignSelf: 'center',
  },
  typeText: {
    fontFamily: fonts.mono,
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  effect: {
    color: colors.gray,
    fontFamily: fonts.mono,
    textAlign: 'center',
    lineHeight: 10,
  },
  flavor: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: 6,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 8,
  },
});
