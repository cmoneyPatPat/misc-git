import { Relic } from '../types/game';

export const ALL_RELICS: Relic[] = [
  {
    id: 'omnidoc_lanyard',
    name: 'OmniCorp Lanyard',
    description: 'Start each combat with 1 extra energy.',
    flavor: '"Employee of the Month, Q3 2062" — never expires',
    effect: 'start_with_extra_energy',
  },
  {
    id: 'redacted_report',
    name: 'Redacted Report',
    description: 'Draw 1 extra card at the start of your first turn.',
    flavor: 'Most of it is blacked out. The rest is damning.',
    effect: 'draw_extra_card',
  },
  {
    id: 'carbon_offset_certificate',
    name: 'Carbon Offset Certificate',
    description: 'Heal 4 HP after each combat victory.',
    flavor: 'Certified by the Institute for Responsible Deregulation. Framed.',
    effect: 'heal_on_kill',
  },
  {
    id: 'executive_pen',
    name: "Executive's Pen",
    description: 'Your first attack each combat deals double damage.',
    flavor: '"The pen is mightier when it signs the right documents."',
    effect: 'first_attack_double',
  },
  {
    id: 'compliance_badge',
    name: 'Full Compliance Badge',
    description: 'Gain 2 block each time you play a card.',
    flavor: 'GAEA Form 1-A: Proof of Compliance. Ironically effective armor.',
    effect: 'gain_block_on_card_play',
  },
];

export function getRelicById(id: string): Relic | undefined {
  return ALL_RELICS.find((r) => r.id === id);
}
