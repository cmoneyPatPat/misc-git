import { MapNode, MapState, NodeType } from '../types/game';
import {
  ACT1_ENEMIES,
  ACT2_ENEMIES,
  ELITE_ENEMIES,
  BOSS_ACT1,
  BOSS_FINAL,
} from '../data/enemies';

function uuid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface FloorSpec {
  type: NodeType;
  enemyPool?: string[];
  fixedEnemy?: string;
}

function getAct1Floor(floor: number): FloorSpec {
  if (floor === 6) return { type: 'boss', fixedEnemy: BOSS_ACT1 };
  if (floor === 4 || floor === 5) return { type: 'elite', enemyPool: ELITE_ENEMIES };
  if (floor === 3) return { type: 'rest' };
  if (floor === 2 && Math.random() < 0.4) return { type: 'event' };
  return { type: 'combat', enemyPool: ACT1_ENEMIES };
}

function getAct2Floor(floor: number): FloorSpec {
  if (floor === 12) return { type: 'boss', fixedEnemy: BOSS_FINAL };
  if (floor === 10 || floor === 11) return { type: 'elite', enemyPool: ELITE_ENEMIES };
  if (floor === 9) return { type: 'rest' };
  if (floor === 7 && Math.random() < 0.4) return { type: 'event' };
  return { type: 'combat', enemyPool: ACT2_ENEMIES };
}

export function generateMap(act: number): MapState {
  const floors = act === 1 ? 6 : 6;
  const baseFloor = act === 1 ? 1 : 7;
  const nodes: MapNode[] = [];

  for (let floor = 0; floor < floors; floor++) {
    const absoluteFloor = baseFloor + floor;
    const spec = act === 1 ? getAct1Floor(absoluteFloor) : getAct2Floor(absoluteFloor);
    const countOnFloor = spec.type === 'boss' || spec.type === 'rest' ? 1 : Math.floor(Math.random() * 2) + 2;

    const floorNodes: MapNode[] = [];
    for (let i = 0; i < countOnFloor; i++) {
      const node: MapNode = {
        id: uuid(),
        type: spec.type,
        floor: absoluteFloor,
        x: i,
        connections: [],
        visited: false,
        available: floor === 0,
        enemyId: spec.fixedEnemy
          ? spec.fixedEnemy
          : spec.enemyPool
          ? pickRandom(spec.enemyPool)
          : undefined,
      };
      floorNodes.push(node);
    }
    nodes.push(...floorNodes);
  }

  const nodesByFloor: { [floor: number]: MapNode[] } = {};
  for (const n of nodes) {
    if (!nodesByFloor[n.floor]) nodesByFloor[n.floor] = [];
    nodesByFloor[n.floor].push(n);
  }

  const sortedFloors = Object.keys(nodesByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  for (let fi = 0; fi < sortedFloors.length - 1; fi++) {
    const current = nodesByFloor[sortedFloors[fi]];
    const next = nodesByFloor[sortedFloors[fi + 1]];

    for (const node of current) {
      const targetCount = Math.min(next.length, Math.floor(Math.random() * 2) + 1);
      const shuffled = [...next].sort(() => Math.random() - 0.5).slice(0, targetCount);
      node.connections = shuffled.map((n) => n.id);
    }
  }

  return {
    nodes,
    currentNodeId: null,
    act,
    floor: baseFloor,
  };
}
