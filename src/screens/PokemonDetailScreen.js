// Concept: useState, useEffect
import React, { useState, useEffect } from 'react';
// Concept: View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { fetchPokemonDetail } from '../api/pokeApi';

// Paleta de colores propia para los tipos de Pokémon
const TYPE_COLORS = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
  flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
  ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
  fairy: '#EE99AC', normal: '#A8A878'
};

export default function PokemonDetailScreen({ pokemonId, onBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Concept: useEffect
  useEffect(() => {
    loadDetail();
  }, [pokemonId]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonDetail(pokemonId);
      setDetails(data);
    } catch (err) {
      setError('Error al cargar la ficha del Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  // Estado: Cargando
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e3350d" />
        <Text>Buscando datos en la PokéDex...</Text>
      </View>
    );
  }

  // Estado: Error
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={loadDetail} />
        <View style={{ marginTop: 20 }}>
            <Button title="Volver a la lista" onPress={onBack} color="#666" />
        </View>
      </View>
    );
  }

  // Número con ceros a la izquierda
  const paddedId = String(details.id).padStart(3, '0');
  const imageUrl = details.sprites.other['official-artwork'].front_default;
  
  // Transformación de unidades
  const heightMeters = (details.height / 10).toFixed(1);
  const weightKg = (details.weight / 10).toFixed(1);

  // Estado: Éxito
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Concept: Button */}
        <Button title="← Volver a la lista" onPress={onBack} color="#666" />
      </View>
      
      {/* Concept: Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {/* Concept: Text */}
      <Text style={styles.title}>{details.name.toUpperCase()} #{paddedId}</Text>
      
      <View style={styles.typesContainer}>
        {details.types.map((t) => (
          // Concept: View
          <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[t.type.name] || TYPE_COLORS.normal }]}>
            <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Altura: {heightMeters} m</Text>
        <Text style={styles.infoText}>Peso: {weightKg} kg</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas Base</Text>
        {details.stats.map(s => {
          // El ancho de la barra proporcional (255 es el máximo)
          const barWidth = (s.base_stat / 255) * 100;
          return (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{s.stat.name.toUpperCase()}</Text>
              <Text style={styles.statValue}>{s.base_stat}</Text>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${barWidth}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Concept: StyleSheet
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#fff', flexGrow: 1 },
  header: { width: '100%', alignItems: 'flex-start', marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 220, height: 220, resizeMode: 'contain', marginVertical: 10 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 15, color: '#333' },
  typesContainer: { flexDirection: 'row', marginBottom: 25 },
  typeBadge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginHorizontal: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1 },
  typeText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  infoBox: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 15, backgroundColor: '#f8f9fa', borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: '#e9ecef' },
  infoText: { fontSize: 16, fontWeight: '600', color: '#495057' },
  statsContainer: { width: '100%', backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef' },
  statsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, alignSelf: 'center', color: '#333' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statName: { width: 85, fontSize: 12, fontWeight: 'bold', color: '#6c757d' },
  statValue: { width: 35, fontSize: 14, textAlign: 'right', marginRight: 10, fontWeight: 'bold', color: '#495057' },
  barBackground: { flex: 1, height: 12, backgroundColor: '#e9ecef', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 6 },
  errorText: { color: '#e3350d', marginBottom: 15, fontSize: 16, textAlign: 'center' }
});