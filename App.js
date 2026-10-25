// Concept: useState
import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
// Concept: SafeArea View
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';

export default function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  return (
    <SafeAreaProvider>
      {/* Concept: SafeArea View */}
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        
        {selectedPokemonId ? (
          <PokemonDetailScreen 
            pokemonId={selectedPokemonId} 
            onBack={() => setSelectedPokemonId(null)} 
          />
        ) : (
          <PokemonListScreen 
            onSelectPokemon={setSelectedPokemonId} 
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Concept: StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
