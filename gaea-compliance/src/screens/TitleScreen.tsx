import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function TitleScreen() {
  const startRun = useGameStore((s) => s.startRun);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.container}>
        {/* Header logo */}
        <View style={styles.logoBlock}>
          <Text style={styles.agency}>GLOBAL ATMOSPHERIC &</Text>
          <Text style={styles.agency}>ENVIRONMENTAL AGENCY</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>GAEA</Text>
          <Text style={styles.subtitle}>COMPLIANCE DIVISION</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>
            An OmniCorp™ Contracted Service
          </Text>
        </View>

        {/* Flavor */}
        <View style={styles.flavorBlock}>
          <Text style={styles.flavor}>
            Year 2064. The last meaningful regulator on Earth{'\n'}
            is now a wholly owned subsidiary.{'\n\n'}
            You have been assigned to orchestrate{'\n'}
            the Forever Green Initiative —{'\n'}
            the final, total transfer of environmental{'\n'}
            oversight to private interests.{'\n\n'}
            This is not corruption.{'\n'}
            This is <Text style={styles.flavorBold}>compliance</Text>.
          </Text>
        </View>

        {/* Start button */}
        <TouchableOpacity style={styles.button} onPress={startRun}>
          <Text style={styles.buttonText}>BEGIN ASSIGNMENT</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Form 1-A: Employee Consent Acknowledged © OmniCorp 2064
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  logoBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  agency: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    letterSpacing: 3,
    textAlign: 'center',
  },
  divider: {
    width: 200,
    height: 1,
    backgroundColor: colors.greenMuted,
    marginVertical: spacing.xs,
  },
  title: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 8,
    textShadowColor: colors.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: colors.greenDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.md,
    letterSpacing: 4,
  },
  tagline: {
    color: colors.grayDim,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    fontStyle: 'italic',
  },
  flavorBlock: {
    borderWidth: 1,
    borderColor: colors.greenMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    maxWidth: 340,
  },
  flavor: {
    color: colors.gray,
    fontFamily: fonts.mono,
    fontSize: fonts.size.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  flavorBold: {
    color: colors.green,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.greenMuted,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  buttonText: {
    color: colors.green,
    fontFamily: fonts.mono,
    fontSize: fonts.size.lg,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  footer: {
    color: colors.grayDark,
    fontFamily: fonts.mono,
    fontSize: fonts.size.xs,
    textAlign: 'center',
  },
});
