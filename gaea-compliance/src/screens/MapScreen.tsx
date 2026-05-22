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
import { MapNode, NodeType } from '../types/game';
import { colors, fonts, spacing, radius } from '../styles/theme';

function nodeLabel(type: NodeType): string {
  switch (type) {
    case 'combat': return 'COMBAT';
    case 'elite': return 'ELITE';
    case 'boss': return 'BOSS';
    case 'rest': return 'REST';
    case 'event': return 'EVENT';
    case 'shop': return 'SHOP';
  }
}

function nodeColor(type: NodeType): string {
  switch (type) {
    case 'combat': return colors.red;
    case 'elite': return '#ff8833';
    case 'boss': return '#ff0055';
    case 'rest': return colors.green;
    case 'event': return colors.blue;
    case 'shop': return colors.yellow;
  }
}

function nodeIcon(type: NodeType): string {
  switch (type) {
    case 'combat': return '⚔';
    case 'elite': return '☠';
    case 'boss': return '★';
    case 'rest': return '◉';
    case 'event': return '◈';
    case 'shop': return '$';
  }
}

interface NodeButtonProps {
  node: MapNode;
  onPress: () => void;
}

function NodeButton({ node, onPress }: NodeButtonProps) {
  const col = nodeColor(node.type);
  return (
    <TouchableOpacity
      style={[
        styles.node,
        {
          borderColor: node.visited ? colors.grayDark : node.available ? col : colors.grayDark,
          backgroundColor: node.visited
            ? colors.bgCard
            : node.available
            ? col + '22'
            : colors.bgCard,
          opacity: node.visited ? 0.4 : node.available ? 1 : 0.3,
        },
      ]}
      onPress={onPress}
      disabled={!node.available}
    >
      <Text style={[styles.nodeIcon, { color: node.available ? col : colors.grayDim }]}>
        {nodeIcon(node.type)}
      </Text>
      <Text style={[styles.nodeLabel, { color: node.available ? col : colors.grayDim }]}>
        {nodeLabel(node.type)}
      </Text>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const run = useGameStore((s) => s.run);
  const selectMapNode = useGameStore((s) => s.selectMapNode);

  if (!run) return null;

  const { nodes } = run.map;
  const floors = Array.from(new Set(nodes.map((n) => n.floor))).sort((a, b) => a - b);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.act}>ACT {run.act}</Text>
          <Text style={styles.subtitle}>OPERATIONAL MAP</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statText}>HP: {run.hp}/{run.maxHp}</Text>
          <Text style={styles.statText}>DECK: {run.deck.length}</Text>
          <Text style={styles.statText}>GOLD: {run.gold}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.mapContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Render floors bottom-to-top */}
        {[...floors].reverse().map((floor) => {
          const floorNodes = nodes.filter((n) => n.floor === floor);
          return (
            <View key={floor} style={styles.floorRow}>
              <Text style={styles.floorLabel}>F{floor}</Text>
              <View style={styles.nodesRow}>
                {floorNodes.map((node) => (
                  <NodeButton
                    key={node.id}
                    node={node}
                    onPress={() => selectMapNode(node.id)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Relics */}
      {run.relics.length > 0 && (
        <View style={styles.relicsBar}>
          {run.relics.map((r) => (
            <View key={r.id} style={styles.relic}>
              <Text style={styles.relicText}>{r.name}</Text>
            </View>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  act: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xl,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 2,
  },
  stats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statText: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
  },
  scroll: {
    flex: 1,
  },
  mapContainer: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  floorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  floorLabel: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    width: 24,
    textAlign: 'right',
  },
  nodesRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  node: {
    width: 80,
    height: 64,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  nodeIcon: {
    fontSize: fonts.size.xl,
  },
  nodeLabel: {
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  relicsBar: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgCard,
    flexWrap: 'wrap',
  },
  relic: {
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  relicText: {
    color: colors.yellow,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
  },
});
