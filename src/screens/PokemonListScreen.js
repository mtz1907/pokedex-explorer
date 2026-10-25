// Concept: useState, useEffect
import React, { useState, useEffect } from 'react';
// Concept: View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { fetchPokemonList, fetchPokemonDetail } from '../api/pokeApi';

export default function PokemonListScreen({ onSelectPokemon }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Concept: useEffect (Array de dependencias vacío para ejecutar solo una vez)
  useEffect(() => {
    loadPokemon(0);
  }, []); // Cuidado con las dependencias para no repetir peticiones sin parar

  const loadPokemon = async (newOffset) => {
    if (isSearching) return; 
    
    if (newOffset === 0) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    
    try {
      const data = await fetchPokemonList(20, newOffset);
      if (newOffset === 0) {
        setPokemonList(data.results);
      } else {
        setPokemonList(prev => [...prev, ...data.results]);
      }
      setOffset(newOffset);
    } catch (err) {
      setError('Error al cargar la lista. Revisa tu conexión.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      loadPokemon(0);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    
    try {
      const data = await fetchPokemonDetail(searchQuery);
      // Adaptamos la respuesta de la ficha para que la FlatList la pueda leer igual que la lista paginada
      setPokemonList([{ name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.id}/` }]);
    } catch (err) {
      setPokemonList([]);
      setError('No se encontró ningún Pokémon con ese nombre o número.');
    } finally {
      setLoading(false);
    }
  };

  const getPokemonId = (url) => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  };

  const renderItem = ({ item }) => {
    const id = getPokemonId(item.url);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    // Formatear a 3 dígitos
    const paddedId = String(id).padStart(3, '0');

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectPokemon(id)}>
        {/* Concept: Image */}
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.idText}>#{paddedId}</Text>
        <Text style={styles.nameText}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // Concept: View
    <View style={styles.container}>
      {/* Concept: Text */}
      <Text style={styles.title}>PokéDex Explorer</Text>
      
      <View style={styles.searchContainer}>
        {/* Concept: TextInput */}
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Concept: Button */}
        <Button title="Buscar" onPress={handleSearch} />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#e3350d" />
          <Text>Cargando Pokémon...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={() => isSearching ? handleSearch() : loadPokemon(offset)} />
        </View>
      )}

      {!loading && !error && pokemonList.length === 0 && (
        <View style={styles.center}>
          <Text>No hay resultados.</Text>
        </View>
      )}

      {!loading && !error && pokemonList.length > 0 && (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={() => {
            if (!isSearching && !loadingMore) loadPokemon(offset + 20);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore && <ActivityIndicator size="large" color="#e3350d" style={{ marginVertical: 20 }} />}
        />
      )}
    </View>
  );
}

// Concept: StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  searchContainer: { flexDirection: 'row', marginBottom: 15, paddingHorizontal: 5 },
  input: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginRight: 10, height: 45 },
  card: { flex: 1, backgroundColor: '#fff', margin: 5, padding: 15, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  image: { width: 100, height: 100, resizeMode: 'contain' },
  idText: { color: '#888', marginTop: 8, fontSize: 12, fontWeight: '600' },
  nameText: { fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#e3350d', marginBottom: 15, fontSize: 16, textAlign: 'center' }
});