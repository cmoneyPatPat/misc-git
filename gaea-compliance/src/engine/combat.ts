import {
  CardInstance,
  CombatState,
  EnemyState,
  PlayerState,
  StatusEffects,
  CardEffect,
  EnemyIntent,
  Relic,
} from '../types/game';
import { EnemyDefinition } from '../types/game';

const BASE_STATUS: StatusEffects = {
  vulnerable: 0,
  weak: 0,
  exposed: 0,
  silenced: 0,
  confused: 0,
  evidence: 0,
  publicOutrage: 0,
};

export function createEnemyState(def: EnemyDefinition): EnemyState {
  return {
    definitionId: def.id,
    name: def.name,
    title: def.title,
    hp: def.maxHp,
    maxHp: def.maxHp,
    block: 0,
    status: { ...BASE_STATUS },
    patternIndex: 0,
    intent: def.pattern[0],
  };
}

export function createPlayerState(hp: number, maxHp: number, relics: Relic[]): PlayerState {
  const hasExtraEnergy = relics.some((r) => r.effect === 'start_with_extra_energy');
  return {
    hp,
    maxHp,
    block: 0,
    status: { ...BASE_STATUS },
    energy: hasExtraEnergy ? 4 : 3,
    maxEnergy: hasExtraEnergy ? 4 : 3,
    doubleNextAttack: false,
    extraCardNextTurn: false,
    extraEnergyNextTurn: false,
  };
}

function shuffleDeck(deck: CardInstance[]): CardInstance[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function drawCards(state: CombatState, count: number): CombatState {
  let { deck, hand, discardPile } = state;
  let drawn = 0;
  deck = [...deck];
  hand = [...hand];
  discardPile = [...discardPile];

  while (drawn < count) {
    if (deck.length === 0) {
      if (discardPile.length === 0) break;
      deck = shuffleDeck(discardPile);
      discardPile = [];
    }
    hand.push(deck.pop()!);
    drawn++;
  }
  return { ...state, deck, hand, discardPile };
}

export function initCombat(
  deckDefs: CardInstance[],
  enemyDef: EnemyDefinition,
  hp: number,
  maxHp: number,
  relics: Relic[],
): CombatState {
  const shuffled = shuffleDeck(deckDefs);
  const hasExtraDrawRelic = relics.some((r) => r.effect === 'draw_extra_card');
  const initialDraw = hasExtraDrawRelic ? 6 : 5;
  const playerState = createPlayerState(hp, maxHp, relics);

  let state: CombatState = {
    player: playerState,
    enemy: createEnemyState(enemyDef),
    deck: shuffled,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    turn: 1,
    log: [`Turn 1 — ${enemyDef.name} faces you across the conference table.`],
    phase: 'player_turn',
    choiceCard: null,
    choiceCallbackIndex: null,
  };

  state = drawCards(state, initialDraw);
  return state;
}

function applyDamageToEnemy(
  enemy: EnemyState,
  rawDamage: number,
  playerWeak: boolean,
  doubled: boolean,
): { enemy: EnemyState; log: string } {
  let dmg = rawDamage;
  if (doubled) dmg *= 2;
  if (playerWeak) dmg = Math.floor(dmg * 0.75);
  if (enemy.status.vulnerable > 0) dmg = Math.floor(dmg * 1.5);

  if (enemy.status.exposed > 0) {
    // Exposed: half the damage bypasses block
    const pierce = Math.floor(dmg * 0.5);
    const remainder = dmg - pierce;
    const blocked = Math.min(enemy.block, remainder);
    const hpDmg = pierce + (remainder - blocked);
    return {
      enemy: { ...enemy, block: Math.max(0, enemy.block - blocked), hp: Math.max(0, enemy.hp - hpDmg) },
      log: `Dealt ${hpDmg} damage (${pierce} pierced block). Enemy: ${Math.max(0, enemy.hp - hpDmg)}/${enemy.maxHp} HP`,
    };
  }

  const blocked = Math.min(enemy.block, dmg);
  const hpDmg = dmg - blocked;
  return {
    enemy: { ...enemy, block: enemy.block - blocked, hp: Math.max(0, enemy.hp - hpDmg) },
    log: `Dealt ${dmg} damage${blocked > 0 ? ` (${blocked} blocked)` : ''}. Enemy: ${Math.max(0, enemy.hp - hpDmg)}/${enemy.maxHp} HP`,
  };
}

function applyDamageToPlayer(
  player: PlayerState,
  rawDamage: number,
  enemyWeak: boolean,
): { player: PlayerState; log: string } {
  let dmg = rawDamage;
  if (enemyWeak) dmg = Math.floor(dmg * 0.75);
  if (player.status.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  if (player.status.publicOutrage > 0) dmg += player.status.publicOutrage * 2;

  const blocked = Math.min(player.block, dmg);
  const hpDmg = dmg - blocked;
  return {
    player: { ...player, block: player.block - blocked, hp: Math.max(0, player.hp - hpDmg) },
    log: `Enemy dealt ${dmg} damage${blocked > 0 ? ` (${blocked} blocked)` : ''}. Your HP: ${Math.max(0, player.hp - hpDmg)}/${player.maxHp}`,
  };
}

export function resolveCardEffect(
  state: CombatState,
  effect: CardEffect,
  relics: Relic[],
): CombatState {
  let { player, enemy, log } = state;
  let newLog = [...log];
  const gainBlockOnCardPlay = relics.some((r) => r.effect === 'gain_block_on_card_play');

  if (gainBlockOnCardPlay) {
    player = { ...player, block: player.block + 2 };
  }

  if (effect.block) {
    player = { ...player, block: player.block + effect.block };
    newLog.push(`Gained ${effect.block} block. Total: ${player.block}`);
  }

  if (effect.damage) {
    const times = effect.times ?? 1;
    for (let i = 0; i < times; i++) {
      const isDoubled = player.doubleNextAttack && i === 0;
      const result = applyDamageToEnemy(enemy, effect.damage!, player.status.weak > 0, isDoubled);
      enemy = result.enemy;
      newLog.push(result.log);
    }
    if (player.doubleNextAttack) player = { ...player, doubleNextAttack: false };
  }

  if (effect.damageEqualToBlock) {
    const dmg = player.block;
    const result = applyDamageToEnemy(enemy, dmg, player.status.weak > 0, player.doubleNextAttack);
    enemy = result.enemy;
    newLog.push(`Congressional Testimony: ${result.log}`);
    if (player.doubleNextAttack) player = { ...player, doubleNextAttack: false };
  }

  if (effect.applyVulnerable) {
    enemy = { ...enemy, status: { ...enemy.status, vulnerable: enemy.status.vulnerable + effect.applyVulnerable } };
    newLog.push(`Applied ${effect.applyVulnerable} Vulnerable to enemy.`);
  }
  if (effect.applyWeak) {
    enemy = { ...enemy, status: { ...enemy.status, weak: enemy.status.weak + effect.applyWeak } };
    newLog.push(`Applied ${effect.applyWeak} Weak to enemy.`);
  }
  if (effect.applyExposed) {
    enemy = { ...enemy, status: { ...enemy.status, exposed: enemy.status.exposed + effect.applyExposed } };
    newLog.push(`Applied ${effect.applyExposed} Exposed to enemy.`);
  }
  if (effect.applySilenced) {
    enemy = { ...enemy, status: { ...enemy.status, silenced: enemy.status.silenced + effect.applySilenced } };
    newLog.push(`Enemy silenced for ${effect.applySilenced} turns.`);
  }
  if (effect.applyConfused) {
    enemy = { ...enemy, status: { ...enemy.status, confused: enemy.status.confused + effect.applyConfused } };
    newLog.push(`Enemy confused for ${effect.applyConfused} turns.`);
  }
  if (effect.applyEvidence) {
    enemy = { ...enemy, status: { ...enemy.status, evidence: enemy.status.evidence + effect.applyEvidence } };
    newLog.push(`Applied ${effect.applyEvidence} Evidence to enemy.`);
  }
  if (effect.doubleNextAttack) {
    player = { ...player, doubleNextAttack: true };
    newLog.push('Next attack will deal double damage.');
  }
  if (effect.extraCardNextTurn) {
    player = { ...player, extraCardNextTurn: true };
    newLog.push('Will draw 1 extra card next turn.');
  }
  if (effect.extraEnergyNextTurn) {
    player = { ...player, extraEnergyNextTurn: true };
    newLog.push('Will gain 1 extra energy next turn.');
  }
  if (effect.gainEnergy) {
    player = { ...player, maxEnergy: player.maxEnergy + effect.gainEnergy, energy: player.energy + effect.gainEnergy };
    newLog.push(`Gained ${effect.gainEnergy} permanent energy.`);
  }

  let updatedState = { ...state, player, enemy, log: newLog };

  if (effect.draw) {
    updatedState = drawCards(updatedState, effect.draw);
    updatedState = { ...updatedState, log: [...updatedState.log, `Drew ${effect.draw} card(s).`] };
  }

  return updatedState;
}

export function playCard(
  state: CombatState,
  card: CardInstance,
  relics: Relic[],
  choiceIndex?: 0 | 1,
): CombatState {
  if (state.phase !== 'player_turn') return state;
  if (state.player.energy < card.cost) return state;

  let s: CombatState = {
    ...state,
    player: { ...state.player, energy: state.player.energy - card.cost },
    hand: state.hand.filter((c) => c.instanceId !== card.instanceId),
    log: [...state.log, `Played: ${card.name}`],
  };

  const effect = card.effect;

  if (effect.chooseOne && choiceIndex !== undefined) {
    s = resolveCardEffect(s, effect.chooseOne[choiceIndex], relics);
  } else {
    s = resolveCardEffect(s, effect, relics);
  }

  if (effect.exhaustHand) {
    const handCount = s.hand.length;
    if (effect.damagePerExhausted && handCount > 0) {
      for (let i = 0; i < handCount; i++) {
        const result = applyDamageToEnemy(s.enemy, effect.damagePerExhausted, s.player.status.weak > 0, false);
        s = { ...s, enemy: result.enemy, log: [...s.log, result.log] };
      }
    }
    s = {
      ...s,
      exhaustPile: [...s.exhaustPile, ...s.hand],
      hand: [],
      log: [...s.log, `Exhausted ${handCount} card(s).`],
    };
  }

  if (effect.exhaust) {
    s = { ...s, exhaustPile: [...s.exhaustPile, card] };
  } else {
    s = { ...s, discardPile: [...s.discardPile, card] };
  }

  return checkCombatEnd(s);
}

function tickDownStatus(status: StatusEffects): StatusEffects {
  return {
    vulnerable: Math.max(0, status.vulnerable - 1),
    weak: Math.max(0, status.weak - 1),
    exposed: Math.max(0, status.exposed - 1),
    silenced: Math.max(0, status.silenced - 1),
    confused: Math.max(0, status.confused - 1),
    evidence: status.evidence,
    publicOutrage: Math.max(0, status.publicOutrage - 1),
  };
}

function resolveEnemyAction(state: CombatState, _relics: Relic[]): CombatState {
  const { enemy } = state;
  const intent: EnemyIntent = enemy.intent;
  let s = state;

  if (enemy.status.silenced > 0) {
    return {
      ...s,
      enemy: { ...enemy, status: { ...enemy.status, silenced: enemy.status.silenced - 1 } },
      log: [...s.log, `${enemy.name} is silenced — cannot act this turn.`],
    };
  }

  if (intent.type === 'attack') {
    const rawDmg = intent.damage ?? 0;
    const times = intent.times ?? 1;

    if (enemy.status.confused > 0) {
      const totalSelfDmg = rawDmg * times;
      return {
        ...s,
        enemy: {
          ...enemy,
          hp: Math.max(0, enemy.hp - totalSelfDmg),
          status: { ...enemy.status, confused: enemy.status.confused - 1 },
        },
        log: [...s.log, `${enemy.name} is confused and attacks itself for ${totalSelfDmg}!`],
      };
    }

    let p = s.player;
    for (let i = 0; i < times; i++) {
      const result = applyDamageToPlayer(p, rawDmg, enemy.status.weak > 0);
      p = result.player;
      s = { ...s, log: [...s.log, result.log] };
    }
    s = { ...s, player: p };

  } else if (intent.type === 'defend' || intent.type === 'buff') {
    const block = intent.block ?? 0;
    s = {
      ...s,
      enemy: { ...enemy, block: enemy.block + block },
      log: [...s.log, `${enemy.name} gained ${block} block.`],
    };

  } else if (intent.type === 'debuff') {
    let p = s.player;
    const logLines: string[] = [];

    if (intent.applyVulnerable) {
      p = { ...p, status: { ...p.status, vulnerable: p.status.vulnerable + intent.applyVulnerable } };
      logLines.push(`You gained ${intent.applyVulnerable} Vulnerable.`);
    }
    if (intent.applyWeak) {
      p = { ...p, status: { ...p.status, weak: p.status.weak + intent.applyWeak } };
      logLines.push(`You gained ${intent.applyWeak} Weak.`);
    }
    if (intent.applyExposed) {
      p = { ...p, status: { ...p.status, exposed: p.status.exposed + intent.applyExposed } };
      logLines.push(`You gained ${intent.applyExposed} Exposed.`);
    }
    if (intent.applyPublicOutrage) {
      p = { ...p, status: { ...p.status, publicOutrage: p.status.publicOutrage + intent.applyPublicOutrage } };
      logLines.push(`Public Outrage +${intent.applyPublicOutrage} (${p.status.publicOutrage} total).`);
    }
    if (intent.applyEvidence) {
      const newEvidence = p.status.evidence + intent.applyEvidence;
      p = { ...p, status: { ...p.status, evidence: newEvidence } };
      logLines.push(`Evidence stacked to ${newEvidence}.`);

      if (newEvidence >= 8) {
        const hit = applyDamageToPlayer(p, 25, false);
        p = { ...hit.player, status: { ...hit.player.status, evidence: 0 } };
        logLines.push(`EVIDENCE THRESHOLD! ${hit.log} Evidence cleared.`);
      }
    }

    s = { ...s, player: p, log: [...s.log, ...logLines] };
  }

  return s;
}

function startPlayerTurn(state: CombatState, relics: Relic[]): CombatState {
  const hasExtraEnergy = relics.some((r) => r.effect === 'start_with_extra_energy');
  const baseEnergy = hasExtraEnergy ? 4 : 3;
  const bonusEnergy = state.player.extraEnergyNextTurn ? 1 : 0;
  const cardsToDraw = 5 + (state.player.extraCardNextTurn ? 1 : 0);

  let s: CombatState = {
    ...state,
    phase: 'player_turn',
    turn: state.turn + 1,
    player: {
      ...state.player,
      energy: baseEnergy + bonusEnergy,
      block: 0,
      extraEnergyNextTurn: false,
      extraCardNextTurn: false,
      status: tickDownStatus(state.player.status),
    },
    log: [...state.log, `--- Turn ${state.turn + 1} ---`],
  };

  return drawCards(s, cardsToDraw);
}

function advanceEnemyPattern(state: CombatState, pattern: EnemyIntent[]): CombatState {
  const nextIndex = (state.enemy.patternIndex + 1) % pattern.length;
  return {
    ...state,
    enemy: {
      ...state.enemy,
      patternIndex: nextIndex,
      intent: pattern[nextIndex],
      block: 0,
      status: tickDownStatus(state.enemy.status),
    },
  };
}

function checkCombatEnd(state: CombatState): CombatState {
  if (state.enemy.hp <= 0) {
    return { ...state, phase: 'victory', log: [...state.log, `${state.enemy.name} has been neutralized. Compliance restored.`] };
  }
  if (state.player.hp <= 0) {
    return { ...state, phase: 'defeat', log: [...state.log, 'Assignment terminated. Run failed.'] };
  }
  return state;
}

export function endPlayerTurnFull(
  state: CombatState,
  enemyPattern: EnemyIntent[],
  relics: Relic[],
): CombatState {
  if (state.phase !== 'player_turn') return state;

  let s: CombatState = {
    ...state,
    phase: 'enemy_turn',
    discardPile: [...state.discardPile, ...state.hand],
    hand: [],
    player: { ...state.player, block: 0 },
    log: [...state.log, `--- ${state.enemy.name}'s Turn ---`],
  };

  s = resolveEnemyAction(s, relics);
  s = checkCombatEnd(s);
  if (s.phase === 'defeat' || s.phase === 'victory') return s;

  s = advanceEnemyPattern(s, enemyPattern);
  s = startPlayerTurn(s, relics);
  return s;
}
