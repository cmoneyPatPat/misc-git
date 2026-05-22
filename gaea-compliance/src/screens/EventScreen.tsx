import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { colors, fonts, spacing, radius } from '../styles/theme';

interface EventDef {
  id: string;
  title: string;
  description: string;
  options: { label: string; outcome: string; effect: 'heal' | 'gold' | 'damage' | 'card' | 'none' }[];
}

const EVENTS: EventDef[] = [
  {
    id: 'anonymous_tip',
    title: 'ANONYMOUS TIP',
    description:
      'An envelope slides under your office door at 3 AM.\n\n' +
      'Inside: documents implicating three OmniCorp subsidiaries ' +
      'in illegal dumping. Your name is in the margin in red ink.\n\n' +
      '"Insurance," someone has written. "For both of us."',
    options: [
      { label: 'File it. (Gain 20 gold — compliance bonus)', outcome: 'You shred the originals and submit a sanitized version. Bonus processed.', effect: 'gold' },
      { label: 'Ignore it. (Heal 10 HP — stress reduction)', outcome: 'What envelope? You never saw any envelope. Your wellness score improves.', effect: 'heal' },
      { label: 'Act on it. (Take 15 damage — bad for career)', outcome: 'You forward it to the Inspector General. Your badge is deactivated within the hour.', effect: 'damage' },
    ],
  },
  {
    id: 'performance_review',
    title: 'PERFORMANCE REVIEW',
    description:
      'Your supervisor — a pleasant hologram named DAVE-7 — ' +
      'has scheduled your Q3 review.\n\n' +
      '"Your compliance metrics are exceptional," it says. ' +
      '"However, we have noticed some... hesitation.\n\n' +
      '"The Board would like to offer a motivational intervention."',
    options: [
      { label: 'Accept the intervention. (Gain 30 gold)', outcome: '"Excellent. Your dedication to the mission is noted." +30 gold deposited.', effect: 'gold' },
      { label: 'Request reassignment. (Heal 15 HP)', outcome: 'You are temporarily moved to Forms Processing. Peaceful. Boring. Safe.', effect: 'heal' },
      { label: 'Raise concerns. (Take 12 damage)', outcome: 'DAVE-7 flags your file. "Concern noted. Concern archived. Concern closed."', effect: 'damage' },
    ],
  },
  {
    id: 'lobbying_conference',
    title: 'INDUSTRY SUMMIT',
    description:
      'OmniCorp has flown you business class to the ' +
      'Annual Environmental Stewardship Summit — sponsored by OmniCorp.\n\n' +
      'The keynote is: "Why Less Regulation IS More Regulation."\n\n' +
      'The catering is magnificent.',
    options: [
      { label: 'Network aggressively. (Gain 40 gold)', outcome: 'You collect fourteen business cards and three regulatory exemptions.', effect: 'gold' },
      { label: 'Skip the sessions. (Heal 20 HP)', outcome: 'You find a quiet corner and decompress. Nobody notices.', effect: 'heal' },
      { label: 'Ask hard questions. (Take 18 damage)', outcome: 'You are quietly removed from the attendee list. And the building.', effect: 'damage' },
    ],
  },
];

export default function EventScreen() {
  const run = useGameStore((s) => s.run);
  const goToMap = useGameStore((s) => s.goToMap);
  const [chosen, setChosen] = React.useState<string | null>(null);

  const event = useMemo(() => EVENTS[Math.floor(Math.random() * EVENTS.length)], []);

  if (!run) return null;

  const handleOption = (opt: EventDef['options'][0]) => {
    setChosen(opt.outcome);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>◈ INCIDENT REPORT</Text>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.card}>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {chosen ? (
          <View style={styles.outcomeBlock}>
            <Text style={styles.outcomeText}>{chosen}</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={goToMap}>
              <Text style={styles.continueBtnText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.options}>
            {event.options.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.optionBtn}
                onPress={() => handleOption(opt)}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    padding: spacing.xl,
    gap: spacing.lg,
    alignItems: 'center',
    minHeight: '100%',
    justifyContent: 'center',
  },
  label: {
    color: colors.blue,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 3,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xl,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.blue + '44',
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    maxWidth: 360,
  },
  description: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    lineHeight: 20,
  },
  options: {
    width: '100%',
    gap: spacing.sm,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.blue + '11',
  },
  optionText: {
    color: colors.blue,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    lineHeight: 18,
  },
  outcomeBlock: {
    gap: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  outcomeText: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  continueBtn: {
    backgroundColor: colors.greenMuted,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  continueBtnText: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});
