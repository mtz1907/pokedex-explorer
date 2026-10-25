# PokéDex Explorer

Aplicación construida con React Native y Expo que consume la PokéAPI para mostrar una lista paginada de Pokémon y su ficha técnica detallada.

##  Árbol de Carpetas

Decidimos estructurar el proyecto creando una carpeta principal `src/` para separar el código fuente de los archivos de configuración de Expo, organizando su interior por responsabilidades:

pokedex-explorer/
├── App.js
└── src/
    ├── api/
    │   └── pokeApi.js
    └── screens/
        ├── PokemonListScreen.js
        └── PokemonDetailScreen.js

Responsabilidad de cada archivo

`App.js`: Actúa como el enrutador y contenedor principal de la aplicación. Gestiona el `SafeAreaView` para evitar superposiciones con el hardware del dispositivo y maneja el estado para alternar entre la vista de lista y la vista de detalle.
`src/api/pokeApi.js`: Archivo dedicado exclusivamente a la lógica de red. Contiene las funciones asíncronas (`fetchPokemonList` y `fetchPokemonDetail`) que hacen las peticiones a la PokéAPI, procesan los endpoints y manejan los errores (como los 404 en texto plano).
`src/screens/PokemonListScreen.js`: Maneja la interfaz de la pantalla principal. Controla el estado visual de la `FlatList`, el scroll infinito (paginación) y la barra de búsqueda, mostrando los distintos estados al usuario (cargando, error, sin resultados, éxito).
`src/screens/PokemonDetailScreen.js`: Renderiza la ficha técnica de un Pokémon específico. Recibe los datos crudos, realiza las transformaciones matemáticas requeridas (conversión a metros/kilogramos, cálculo del porcentaje de las estadísticas base) y aplica los estilos según los tipos.

## 🏗️ Justificación de la Arquitectura

Nuestra arquitectura se basa en el principio de **Separación de Responsabilidades**. 

Decidimos extraer toda la lógica de consumo de la API REST hacia el archivo `pokeApi.js` para cumplir con la regla de no mezclar llamadas de red con los estilos y el JSX de los componentes. 

De esta manera:
1. **Mantenibilidad:** Si la PokéAPI cambia sus URLs o su estructura, solo debemos modificar un único archivo (`pokeApi.js`) sin tocar el código de la interfaz.
2. **Limpieza visual:** Los archivos de las pantallas (`screens`) se mantienen más limpios y fáciles de leer, dedicándose exclusivamente a pintar la UI y manejar las interacciones del usuario.
3. **Reusabilidad:** Si en el futuro agregáramos otra pantalla que necesite pedir datos a la API, la función ya está modularizada y lista para ser importada sin tener que duplicar código `fetch`.