import { EnemyDefinition } from '../types/game';

export const ALL_ENEMIES: EnemyDefinition[] = [
  // ── ACT 1: DEPARTMENT OF COMPLIANCE ───────────────────────────
  {
    id: 'intern_whistleblower',
    name: 'Tyler',
    title: 'Intern Whistleblower',
    maxHp: 38,
    flavor: 'Joined GAEA to make a difference. Naive. Dangerous.',
    pattern: [
      { type: 'debuff', applyEvidence: 2, label: 'Gathers Evidence (2)' },
      { type: 'attack', damage: 7, label: 'Reports Findings' },
      { type: 'debuff', applyEvidence: 2, label: 'Gathers Evidence (2)' },
      { type: 'attack', damage: 10, label: 'Files Formal Report' },
    ],
  },
  {
    id: 'honest_bureaucrat',
    name: 'Harold',
    title: 'Honest Bureaucrat',
    maxHp: 44,
    flavor: '32 years of service. Never once looked the other way.',
    pattern: [
      { type: 'defend', block: 8, label: 'Follows Procedure' },
      { type: 'attack', damage: 8, label: 'Issues Citation' },
      { type: 'attack', damage: 8, label: 'Issues Citation' },
      { type: 'defend', block: 10, label: 'Escalates to Supervisor' },
      { type: 'attack', damage: 14, label: 'Formal Complaint Filed' },
    ],
  },
  {
    id: 'environmental_activist',
    name: 'Mx. Reyes',
    title: 'Environmental Activist',
    maxHp: 32,
    flavor: 'Has a megaphone, a livestream, and nothing to lose.',
    pattern: [
      { type: 'debuff', applyPublicOutrage: 2, label: 'Live on Social Media (+2 Outrage)' },
      { type: 'attack', damage: 9, label: 'Protest Action' },
      { type: 'debuff', applyPublicOutrage: 2, label: 'Goes Viral (+2 Outrage)' },
      { type: 'attack', damage: 12, label: 'Mass Mobilization' },
    ],
  },
  {
    id: 'foia_request',
    name: 'FOIA-7734',
    title: 'Automated Records Request',
    maxHp: 28,
    flavor: '"Pursuant to 5 U.S.C. § 552..."',
    pattern: [
      { type: 'debuff', applyExposed: 2, label: 'Requests All Records (2 Exposed)' },
      { type: 'debuff', applyExposed: 1, label: 'Follow-up Request (1 Exposed)' },
      { type: 'attack', damage: 6, label: 'Publishes Findings' },
      { type: 'debuff', applyExposed: 3, label: 'Broad Disclosure Order (3 Exposed)' },
      { type: 'attack', damage: 10, label: 'Front-page Story' },
    ],
  },
  {
    id: 'rogue_scientist',
    name: 'Dr. Kapoor',
    title: 'Rogue Agency Scientist',
    maxHp: 42,
    flavor: 'Her data is impeccable. Her memo is circulating. This is a problem.',
    pattern: [
      { type: 'buff', block: 4, label: 'Runs Statistical Models' },
      { type: 'debuff', applyEvidence: 3, label: 'Compiles Evidence (3)' },
      { type: 'attack', damage: 8, label: 'Preliminary Report' },
      { type: 'debuff', applyEvidence: 3, label: 'Peer Review Confirms (3)' },
      { type: 'attack', damage: 18, label: 'Final Report Released' },
    ],
  },
  {
    id: 'investigative_journalist',
    name: 'Ben Okafor',
    title: 'Investigative Journalist',
    maxHp: 36,
    flavor: '"I have a source inside the agency." He does.',
    pattern: [
      { type: 'debuff', applyPublicOutrage: 1, label: 'Makes Calls (+1 Outrage)' },
      { type: 'attack', damage: 7, label: 'Prints Story' },
      { type: 'debuff', applyPublicOutrage: 2, label: 'Story Goes National (+2 Outrage)' },
      { type: 'attack', damage: 11, label: 'Follow-up Exposé' },
      { type: 'debuff', applyPublicOutrage: 3, label: 'Book Deal (+3 Outrage)' },
    ],
  },
  {
    id: 'honest_senator',
    name: 'Sen. Waverly',
    title: 'Honest Senator',
    maxHp: 52,
    flavor: 'One of the last. Probably won\'t be re-elected.',
    pattern: [
      { type: 'attack', damage: 9, label: 'Opens Inquiry' },
      { type: 'attack', damage: 9, label: 'Questions Under Oath' },
      { type: 'debuff', applyExposed: 2, label: 'Subpoenas Records (2 Exposed)' },
      { type: 'attack', damage: 15, label: 'Bipartisan Vote' },
    ],
  },
  {
    id: 'ethics_officer',
    name: 'Ms. Brandt',
    title: 'Ethics Compliance Officer',
    maxHp: 48,
    flavor: 'She was brought in to fix the agency. Nobody warned her what was broken.',
    pattern: [
      { type: 'debuff', applyWeak: 2, label: 'Ethics Audit (2 Weak)' },
      { type: 'attack', damage: 8, label: 'Policy Violation Notice' },
      { type: 'debuff', applyWeak: 2, label: 'Expanded Investigation (2 Weak)' },
      { type: 'defend', block: 12, label: 'Shields Witnesses' },
      { type: 'attack', damage: 16, label: 'Referral to DOJ' },
    ],
  },

  // ── ELITE ENEMIES ─────────────────────────────────────────────
  {
    id: 'inspector_general',
    name: 'Inspector General',
    title: 'Office of the IG',
    maxHp: 68,
    flavor: 'Appointed for a reason. That reason is no longer operative.',
    pattern: [
      { type: 'debuff', applyExposed: 2, applyEvidence: 2, label: 'Opens Investigation' },
      { type: 'attack', damage: 12, label: 'Subpoena Issued' },
      { type: 'defend', block: 14, label: 'Witnesses Protected' },
      { type: 'attack', damage: 18, label: 'Report to Congress' },
      { type: 'debuff', applyExposed: 3, applyEvidence: 3, label: 'Escalates to Special Counsel' },
    ],
  },
  {
    id: 'oversight_board',
    name: 'The Board',
    title: 'Tri-Agency Oversight Board',
    maxHp: 72,
    flavor: 'Three agencies. Forty-seven lawyers. One very bad week for you.',
    pattern: [
      { type: 'attack', damage: 8, times: 2, label: 'Dual Investigation' },
      { type: 'debuff', applyVulnerable: 2, applyExposed: 2, label: 'Joint Audit' },
      { type: 'attack', damage: 14, label: 'Findings Shared' },
      { type: 'buff', block: 10, label: 'Legal Immunity Established' },
      { type: 'attack', damage: 20, label: 'Enforcement Action' },
    ],
  },

  // ── BOSSES ────────────────────────────────────────────────────
  {
    id: 'deputy_director',
    name: 'Deputy Director Chen',
    title: 'Act I Boss — Dept. of Oversight',
    maxHp: 120,
    flavor: 'She built this oversight division. She believes in it. Unfortunately, so do you.',
    isBoss: true,
    pattern: [
      { type: 'defend', block: 16, label: 'Activates Subcommittee Shield' },
      { type: 'attack', damage: 10, label: 'Opens Formal Inquiry' },
      { type: 'debuff', applyEvidence: 3, applyExposed: 2, label: 'Compels Testimony' },
      { type: 'attack', damage: 14, label: 'Cross-examination' },
      { type: 'attack', damage: 20, label: 'Judicial Referral' },
      { type: 'defend', block: 10, label: 'Congressional Shield' },
    ],
  },
  {
    id: 'secretary_gaea',
    name: 'Secretary Voss',
    title: 'Final Boss — Secretary of GAEA',
    maxHp: 200,
    flavor: 'She thought she was your boss. She was right. She just didn\'t know she worked for OmniCorp too.',
    isBoss: true,
    pattern: [
      { type: 'attack', damage: 12, label: 'Discovers the Memo' },
      { type: 'debuff', applyExposed: 3, applyEvidence: 3, label: 'Activates Emergency Protocol' },
      { type: 'attack', damage: 16, label: 'Emergency Hearing' },
      { type: 'defend', block: 20, label: 'Full Agency Mobilization' },
      { type: 'attack', damage: 24, label: 'Executive Override' },
      { type: 'debuff', applyPublicOutrage: 4, label: 'Goes Public' },
      { type: 'attack', damage: 30, label: 'FULL DISCLOSURE' },
    ],
  },
];

export function getEnemyById(id: string): EnemyDefinition | undefined {
  return ALL_ENEMIES.find((e) => e.id === id);
}

export const ACT1_ENEMIES = [
  'intern_whistleblower',
  'honest_bureaucrat',
  'environmental_activist',
  'foia_request',
];

export const ACT2_ENEMIES = [
  'rogue_scientist',
  'investigative_journalist',
  'honest_senator',
  'ethics_officer',
];

export const ELITE_ENEMIES = ['inspector_general', 'oversight_board'];
export const BOSS_ACT1 = 'deputy_director';
export const BOSS_FINAL = 'secretary_gaea';
