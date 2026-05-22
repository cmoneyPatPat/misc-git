import { create } from 'zustand';
import {
  RunState,
  CombatState,
  Screen,
  CardDefinition,
  CardInstance,
  MapNode,
} from '../types/game';
import { ALL_CARDS, STARTER_CARD_IDS, getCardById, getRewardPool } from '../data/cards';
import { getEnemyById } from '../data/enemies';
import { generateMap } from '../engine/map';
import { initCombat, playCard, endPlayerTurnFull } from '../engine/combat';
import { ALL_RELICS } from '../data/relics';
import { CardRarity } from '../types/game';

let instanceCounter = 0;
function makeInstance(def: CardDefinition): CardInstance {
  return { ...def, instanceId: `${def.id}_${++instanceCounter}` };
}

function pickRewardCards(): CardDefinition[] {
  const rarityRoll = Math.random();
  let rarities: CardRarity[];
  if (rarityRoll < 0.6) rarities = ['common', 'common', 'uncommon'];
  else if (rarityRoll < 0.9) rarities = ['common', 'uncommon', 'rare'];
  else rarities = ['uncommon', 'rare', 'rare'];

  const picks: CardDefinition[] = [];
  for (const rarity of rarities) {
    const pool = getRewardPool(rarity);
    const filtered = pool.filter((c) => !picks.find((p) => p.id === c.id));
    if (filtered.length > 0) {
      picks.push(filtered[Math.floor(Math.random() * filtered.length)]);
    }
  }
  return picks;
}

function handleVictory(
  combat: CombatState,
  run: RunState,
  pendingNodeId: string | null,
): Partial<GameStore> {
  const node = run.map.nodes.find((n) => n.id === pendingNodeId);
  const isBoss = node?.type === 'boss';
  const goldEarned = isBoss ? 80 : Math.floor(Math.random() * 20) + 15;
  const healOnKill = run.relics.some((r) => r.effect === 'heal_on_kill');
  const newHp = Math.min(run.maxHp, combat.player.hp + (healOnKill ? 4 : 0));
  const rewardCards = pickRewardCards();
  const newRun: RunState = { ...run, hp: newHp, gold: run.gold + goldEarned };

  if (isBoss && run.act === 1) {
    const act2Map = generateMap(2);
    const relic = ALL_RELICS[Math.floor(Math.random() * ALL_RELICS.length)];
    return {
      screen: 'reward',
      run: { ...newRun, act: 2, map: act2Map, relics: [...newRun.relics, relic] },
      rewardCards,
      rewardGold: goldEarned,
    };
  }

  if (isBoss && run.act === 2) {
    return { screen: 'victory', run: newRun };
  }

  return { screen: 'reward', run: newRun, rewardCards, rewardGold: goldEarned };
}

interface GameStore {
  screen: Screen;
  run: RunState | null;
  combat: CombatState | null;
  rewardCards: CardDefinition[];
  rewardGold: number;
  pendingNodeId: string | null;

  startRun: () => void;
  selectMapNode: (nodeId: string) => void;
  playCardInCombat: (card: CardInstance, choiceIndex?: 0 | 1) => void;
  endTurn: () => void;
  claimReward: (card: CardDefinition | null) => void;
  rest: () => void;
  goToMap: () => void;
  restartGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'title',
  run: null,
  combat: null,
  rewardCards: [],
  rewardGold: 0,
  pendingNodeId: null,

  startRun: () => {
    const map = generateMap(1);
    const run: RunState = {
      gold: 50,
      hp: 72,
      maxHp: 72,
      deck: STARTER_CARD_IDS.map((id) => getCardById(id)!),
      relics: [],
      map,
      act: 1,
      started: true,
    };
    set({ screen: 'map', run, combat: null });
  },

  selectMapNode: (nodeId: string) => {
    const { run } = get();
    if (!run) return;

    const node = run.map.nodes.find((n) => n.id === nodeId);
    if (!node || !node.available) return;

    const updatedNodes = run.map.nodes.map((n) => {
      if (n.id === nodeId) return { ...n, visited: true, available: false };
      if (node.connections.includes(n.id)) return { ...n, available: true };
      return n;
    });

    const updatedMap = { ...run.map, nodes: updatedNodes, currentNodeId: nodeId, floor: node.floor };
    const updatedRun = { ...run, map: updatedMap };

    if (node.type === 'rest') {
      set({ screen: 'rest', run: updatedRun, pendingNodeId: nodeId });
    } else if (node.type === 'event') {
      set({ screen: 'event', run: updatedRun, pendingNodeId: nodeId });
    } else if (node.type === 'combat' || node.type === 'elite' || node.type === 'boss') {
      const enemyDef = node.enemyId ? getEnemyById(node.enemyId) : undefined;
      if (!enemyDef) return;

      const deckInstances = updatedRun.deck.map((d) => makeInstance(d));
      const combatState = initCombat(deckInstances, enemyDef, updatedRun.hp, updatedRun.maxHp, updatedRun.relics);
      set({ screen: 'combat', run: updatedRun, combat: combatState, pendingNodeId: nodeId });
    }
  },

  playCardInCombat: (card: CardInstance, choiceIndex?: 0 | 1) => {
    const { combat, run, pendingNodeId } = get();
    if (!combat || !run) return;

    if (card.effect.chooseOne && choiceIndex === undefined) {
      set({ combat: { ...combat, choiceCard: card } });
      return;
    }

    const newCombat = playCard(combat, card, run.relics, choiceIndex);
    set({ combat: newCombat });

    if (newCombat.phase === 'victory') {
      set(handleVictory(newCombat, run, pendingNodeId));
    } else if (newCombat.phase === 'defeat') {
      set({ screen: 'gameover' });
    }
  },

  endTurn: () => {
    const { combat, run, pendingNodeId } = get();
    if (!combat || !run) return;

    const enemyDef = getEnemyById(combat.enemy.definitionId);
    if (!enemyDef) return;

    const newCombat = endPlayerTurnFull(combat, enemyDef.pattern, run.relics);
    const updatedRun = { ...run, hp: newCombat.player.hp };
    set({ combat: newCombat, run: updatedRun });

    if (newCombat.phase === 'victory') {
      set(handleVictory(newCombat, updatedRun, pendingNodeId));
    } else if (newCombat.phase === 'defeat') {
      set({ screen: 'gameover' });
    }
  },

  claimReward: (card: CardDefinition | null) => {
    const { run } = get();
    if (!run) return;
    const newDeck = card ? [...run.deck, card] : run.deck;
    set({ run: { ...run, deck: newDeck }, screen: 'map', rewardCards: [] });
  },

  rest: () => {
    const { run } = get();
    if (!run) return;
    const healed = Math.floor(run.maxHp * 0.3);
    set({ run: { ...run, hp: Math.min(run.maxHp, run.hp + healed) }, screen: 'map' });
  },

  goToMap: () => set({ screen: 'map' }),

  restartGame: () => set({ screen: 'title', run: null, combat: null, rewardCards: [], rewardGold: 0 }),
}));
