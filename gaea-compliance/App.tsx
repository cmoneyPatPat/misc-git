import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from './src/store/gameStore';
import TitleScreen from './src/screens/TitleScreen';
import MapScreen from './src/screens/MapScreen';
import CombatScreen from './src/screens/CombatScreen';
import RewardScreen from './src/screens/RewardScreen';
import RestScreen from './src/screens/RestScreen';
import EventScreen from './src/screens/EventScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import VictoryScreen from './src/screens/VictoryScreen';
import { colors } from './src/styles/theme';

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.bg} />
      <View style={styles.root}>
        {screen === 'title' && <TitleScreen />}
        {screen === 'map' && <MapScreen />}
        {screen === 'combat' && <CombatScreen />}
        {screen === 'reward' && <RewardScreen />}
        {screen === 'rest' && <RestScreen />}
        {screen === 'event' && <EventScreen />}
        {screen === 'gameover' && <GameOverScreen />}
        {screen === 'victory' && <VictoryScreen />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
