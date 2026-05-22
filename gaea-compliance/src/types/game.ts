export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type TargetType = 'enemy' | 'self' | 'all_enemies' | 'none';

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  gainEnergy?: number;
  applyVulnerable?: number;
  applyWeak?: number;
  applyExposed?: number;
  applySilenced?: number;
  applyConfused?: number;
  applyEvidence?: number;
  exhaust?: boolean;
  exhaustHand?: boolean;
  damagePerExhausted?: number;
  damageEqualToBlock?: boolean;
  doubleNextAttack?: boolean;
  extraCardNextTurn?: boolean;
  extraEnergyNextTurn?: boolean;
  chooseOne?: [CardEffect, CardEffect];
  chooseOneLabels?: [string, string];
  times?: number;
}

export interface CardDefinition {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  target: TargetType;
  effect: CardEffect;
  flavor: string;
  upgraded?: boolean;
}

export interface CardInstance extends CardDefinition {
  instanceId: string;
}

export type EnemyIntentType =
  | 'attack'
  | 'defend'
  | 'buff'
  | 'debuff'
  | 'special';

export interface EnemyIntent {
  type: EnemyIntentType;
  damage?: number;
  times?: number;
  block?: number;
  applyVulnerable?: number;
  applyWeak?: number;
  applyExposed?: number;
  applySilenced?: number;
  applyEvidence?: number;
  applyPublicOutrage?: number;
  label: string;
}

export interface EnemyDefinition {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  flavor: string;
  pattern: EnemyIntent[];
  isBoss?: boolean;
}

export interface StatusEffects {
  vulnerable: number;
  weak: number;
  exposed: number;
  silenced: number;
  confused: number;
  evidence: number;
  publicOutrage: number;
}

export interface CombatantState {
  hp: number;
  maxHp: number;
  block: number;
  status: StatusEffects;
}

export interface EnemyState extends CombatantState {
  definitionId: string;
  name: string;
  title: string;
  patternIndex: number;
  intent: EnemyIntent;
}

export interface PlayerState extends CombatantState {
  energy: number;
  maxEnergy: number;
  doubleNextAttack: boolean;
  extraCardNextTurn: boolean;
  extraEnergyNextTurn: boolean;
}

export interface CombatState {
  player: PlayerState;
  enemy: EnemyState;
  deck: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];
  turn: number;
  log: string[];
  phase: 'player_turn' | 'enemy_turn' | 'victory' | 'defeat';
  choiceCard: CardInstance | null;
  choiceCallbackIndex: 0 | 1 | null;
}

export type NodeType = 'combat' | 'elite' | 'boss' | 'rest' | 'event' | 'shop';

export interface MapNode {
  id: string;
  type: NodeType;
  enemyId?: string;
  floor: number;
  x: number;
  connections: string[];
  visited: boolean;
  available: boolean;
}

export interface MapState {
  nodes: MapNode[];
  currentNodeId: string | null;
  act: number;
  floor: number;
}

export type RelicEffect =
  | 'start_with_extra_energy'
  | 'draw_extra_card'
  | 'heal_on_kill'
  | 'first_attack_double'
  | 'gain_block_on_card_play';

export interface Relic {
  id: string;
  name: string;
  description: string;
  flavor: string;
  effect: RelicEffect;
}

export interface RunState {
  gold: number;
  hp: number;
  maxHp: number;
  deck: CardDefinition[];
  relics: Relic[];
  map: MapState;
  act: number;
  started: boolean;
}

export type Screen =
  | 'title'
  | 'map'
  | 'combat'
  | 'reward'
  | 'rest'
  | 'event'
  | 'shop'
  | 'gameover'
  | 'victory';
