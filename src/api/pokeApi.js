const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    // Concept: fetch
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Error en la red');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchPokemonDetail = async (query) => {
  try {
    // Los nombres deben ir en minúsculas y sin espacios al final
    const cleanQuery = String(query).trim().toLowerCase();
    
    // Concept: fetch
    const response = await fetch(`${BASE_URL}/pokemon/${cleanQuery}`);
    
    // Validar si existe antes de hacer el json() (evita el error 404 en texto plano)
    if (!response.ok) {
      throw new Error('Not Found');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};