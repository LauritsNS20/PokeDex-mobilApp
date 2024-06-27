/*Imports: This code imports necessary modules and components from React, React Native,

useState: React hook for managing local state in functional components.

useEffect: React hook for handling side effects in functional components. */

import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*Constants: Define the base path and query parameters for making API requests to the PokeAPI*/ 
const pokePath = "https://pokeapi.co/api/v2/";
const pokeQuery = "pokemon?limit=151&offset=0";
const firstGenPokemonPath = `${pokePath}${pokeQuery}`;

export default function App() {
  const [firstGenPokemonDetails, setFirstGenPokemonDetails] = useState([]);
  const [favorites, setFavorites] = useState([]);

  /*// Fetch first generation Pokémon details from PokeAPI*/ 
  useEffect(() => {
    const fetchFirstGenPokemons = async () => {
      const firstGenPokemonIdsResponse = await fetch(firstGenPokemonPath);
      const firstGenPokemonIdsBody = await firstGenPokemonIdsResponse.json();

      const firstGenPokemonDetails = await Promise.all(
        firstGenPokemonIdsBody.results.map(async (p) => {
          const pDetails = await fetch(p.url);
          return await pDetails.json();
        })
      );
      /*firstGenPokemonDetails: Stores details of first-generation Pokémon fetched from the API */
      setFirstGenPokemonDetails(firstGenPokemonDetails);
    };

    /*Load favorites from AsyncStorage */
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Failed to load favorites.", error);
      }
    };

    /*Fetch Pokémon details on component mount and Load favorites on component mount */
    fetchFirstGenPokemons(); 
    loadFavorites();
  }, []);

  /*Function to add a Pokémon to favorites */
  const addFavorite = async (name) => {
    try {
      const newFavorites = [...favorites, name];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      Alert.alert("Success", `${name} added to favorites!`);
    } catch (error) {
      console.error("Failed to save favorite.", error);
    }
  };

  const viewFavorites = () => {
    Alert.alert("Favorites", favorites.join(', '));
  };

    /* Function to render each Pokémon item */
  const renderPokemon = ({ item }) => {
    return (
      <View style={styles.pokemonContainer}>
        <Text style={styles.pokemonTitle}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)} 
        </Text>
        <Image
          style={styles.pokemonSprite}
          source={{
            uri: item.sprites.front_default,
          }}
        />
        <View>
          <Button
            title="Add to favorites"
            onPress={() => addFavorite(item.name)}
            color="#00ff00"
          />
          <Button
            title="View your favorites"
            onPress={viewFavorites}
            color="#87cefa"
          />
        </View>
      </View>
    );
  };

  /*Return the component structure */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>First Gen Pokemons</Text>
      <FlatList data={firstGenPokemonDetails} renderItem={renderPokemon} keyExtractor={(item) => item.name} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 60,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 38,
    alignSelf: "center",
    marginBottom: 20,
  },
  pokemonContainer: { 
    backgroundColor: "#ff0000", 
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  pokemonTitle: {
    fontSize: 32,
    alignSelf: "center",
    marginTop: 10,
  },
  pokemonSprite: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});


/*This code fetches first-generation Pokémon data from an API, 
allows users to mark Pokémon as favorites (stored locally using AsyncStorage),

and provides a basic UI for interacting with Pokémon data (viewing details and adding to favorites). 
The structure leverages React and React Native components with hooks for state management and side effects.
 */