"use client";

import { useEffect, useState } from "react";
import Search from "./components/Search";
import Image from "next/image";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";
import { getPokemon, getEvolutionChain } from "./utils/dataServices";
import Modal from "./components/Modal";
import { Pokemon } from "./utils/types";

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShiny, setIsShiny] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [evolutions, setEvolutions] = useState<Pokemon[]>([]);

  const [imageContainerFav, setImageContainerFav] = useState(
    "/pokeball-white.png"
  );
  const [favoritesButtonFav, setFavoritesButtonFav] = useState("/pokeball.png");
  const [currentImageTheme, setCurrentImagetheme] = useState("/night-mode.png");

  const bgColor = getLocalStorage("bgColor") || "bg-[#808080]";

  useEffect(() => {
    const savedFavorites = JSON.parse(getLocalStorage("favorites") || "[]");
    setFavorites(savedFavorites);
    fetchPokemonData("mew");
  }, []);

  const fetchPokemonData = async (identifier: string | number) => {
    setLoading(true);
    setError("");
    setPokemon(null);
    setEvolutions([]);
    try {
      const data = await getPokemon(identifier);
      setPokemon(data);

      const speciesInfo = await fetch(data.species.url);
      if (!speciesInfo.ok) throw new Error(`Failed to fetch species data from ${data.species.url}`);
      const speciesData = await speciesInfo.json();

      const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
      if (!evolutionChainResponse.ok) throw new Error(`Failed to fetch evolution chain from ${speciesData.evolution_chain.url}`);
      const evolutionData = await evolutionChainResponse.json();

      const fetchedEvolutions: Pokemon[] = [];
      let currentEvolution = evolutionData.chain;

      while (currentEvolution) {
        try {
            const pokemonData = await getPokemon(currentEvolution.species.name);
            fetchedEvolutions.push(pokemonData);
            if (currentEvolution.evolves_to && currentEvolution.evolves_to.length > 0) {
                currentEvolution = currentEvolution.evolves_to[0];
            } else {
                currentEvolution = null;
            }
        } catch (evolutionError) {
            console.error("Failed to fetch evolution species data:", currentEvolution?.species?.name, evolutionError);
            if (currentEvolution?.evolves_to && currentEvolution.evolves_to.length > 0) {
                currentEvolution = currentEvolution.evolves_to[0];
            } else {
                currentEvolution = null;
            }
        }
      }
      setEvolutions(fetchedEvolutions);
    } catch (err: unknown) {
      console.error("Failed to fetch Pokémon data:", err);
      if (err instanceof Error) {
        setError(`Error loading Pokémon: ${err.message}`);
      } else if (typeof err === 'string') {
        setError(`Error loading Pokémon: ${err}`);
      } else {
        setError("An unknown error occurred while loading Pokémon data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (name: string) => {
    if (!name.trim()) return;
    fetchPokemonData(name.toLowerCase());
  };

  const handleRandom = () => {
    const randomId = Math.floor(Math.random() * 649) + 1;
    fetchPokemonData(randomId);
  };

  const toggleFavorite = () => {
    if (!pokemon) return;
    const newFavorites = favorites.includes(pokemon.id)
      ? favorites.filter((id) => id !== pokemon.id)
      : [...favorites, pokemon.id];
    setFavorites(newFavorites);
    setLocalStorage("favorites", JSON.stringify(newFavorites));
    setImageContainerFav(
      newFavorites.includes(pokemon.id)
        ? "/pokeball.png"
        : "/pokeball-white.png"
    );
  };

  const changeBgColor = () => {
    const newColor =
      bgColor === "bg-[#808080]" ? "bg-[#2D3748]" : "bg-[#808080]";
    setLocalStorage("bgColor", newColor);
    window.location.reload();
  };

  const handleRemoveFavorite = (id: number) => {
    const updated = favorites.filter((fId) => fId !== id);
    setFavorites(updated);
    setLocalStorage("favorites", JSON.stringify(updated));
  };

  return (
    <div className={`${bgColor} w-full min-h-screen px-32 py-9`}>
      <nav>
        <p className="font-bold font-Inter text-md"> SAN-POKEDEX </p>
      </nav>

      <div className="mt-16 grid lg:grid-cols-2 gap-6">
        <div>
          <div>
            <Search onSearch={handleSearch} onRandom={handleRandom} />
          </div>
          {loading && <p className="text-white mt-4">Loading Pokémon data...</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="bg-[#D9D9D940] rounded-xl mt-5 w-full h-[500px] relative">
            {pokemon && (
              <div className="flex justify-center">
                <Image
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  src={
                    isShiny
                      ? pokemon.sprites.front_shiny
                      : pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                  width={400}
                  height={400}
                  priority
                />
                <div className="absolute bottom-0 left-0 transform translate-x-0 translate-y-0 flex flex-row items-center gap-3 p-6">
                  <button onClick={() => setIsShiny(!isShiny)}>
                    <Image
                      width={25}
                      height={25}
                      src="/shinystar-icon.png"
                      alt="Shiny Toggle"
                    />
                  </button>
                  <button
                    onMouseEnter={() => setImageContainerFav("/pokeball.png")}
                    onMouseLeave={() =>
                      setImageContainerFav("/pokeball-white.png")
                    }
                    onClick={toggleFavorite}
                  >
                    <Image
                      width={25}
                      height={25}
                      src={
                        favorites.includes(pokemon.id)
                          ? "/pokeball.png"
                          : imageContainerFav
                      }
                      alt="Favorite"
                    />
                  </button>
                </div>
              </div>
            )}
            {!pokemon && !loading && !error && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-white text-xl">Search for a Pokémon or try a random one!</p>
                </div>
            )}
          </div>
          <div className="flex justify-center mt-10">
            <p className="font-bold text-2xl text-white">
              {pokemon?.name ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : "Name"}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1">
            <button
              onMouseEnter={() => setFavoritesButtonFav("/pokeball-white.png")}
              onMouseLeave={() => setFavoritesButtonFav("/pokeball.png")}
              onMouseDown={() => setFavoritesButtonFav("/pokeball.png")}
              onMouseUp={() => setFavoritesButtonFav("/pokeball-white.png")}
              onClick={() => setShowFavorites(true)}
              className="flex justify-center bg-white text-black rounded-md p-3 w-[60%] hover:bg-[#FF1F1F] active:bg-white transition duration-300 ease-in-out"
            >
              <Image
                width={25}
                height={25}
                src={favoritesButtonFav}
                alt="Favorites"
              />
            </button>
            <button
              onMouseEnter={() =>
                setCurrentImagetheme("/nightmode-hovered.png")
              }
              onMouseLeave={() => setCurrentImagetheme("/night-mode.png")}
              onMouseDown={() => setCurrentImagetheme("/night-mode.png")}
              onMouseUp={() => setCurrentImagetheme("/nightmode-hovered.png")}
              onClick={changeBgColor}
              className="flex bg-white rounded-md p-3 w-[40%] justify-center hover:bg-black active:bg-white transition duration-300 ease-in-out"
            >
              <Image
                width={25}
                height={25}
                src={currentImageTheme}
                alt="Theme Toggle"
              />
            </button>
          </div>

          <div className="flex flex-col mt-5 text-white">
            <p className="font-bold text-xl">
              Element Type:{" "}
              {pokemon?.types
                ?.map((t: { type: { name: string } }) => t.type.name)
                .join(", ")}
            </p>
            <p className="font-bold text-xl"> Location: N/A </p>
          </div>

          <div className="flex flex-col mt-10 gap-1">
            <button
              className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"
              onClick={() => setShowAbilities(true)}
              disabled={!pokemon}
            >
              Abilities
            </button>
            <button
              className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"
              onClick={() => setShowMoves(true)}
              disabled={!pokemon}
            >
              Moves
            </button>
          </div>

          <div className="flex flex-col mt-5 text-white">
            <p className="font-bold text-xl"> Evolutions: </p>
            {evolutions.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                {evolutions.map((evo) => (
                    <div
                    key={evo.id}
                    className="bg-[#D9D9D940] rounded-md w-full h-[150px] flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-[#FFFFFF50]"
                    onClick={() => fetchPokemonData(evo.id)}
                    >
                    <Image
                        src={evo.sprites.front_default}
                        alt={evo.name}
                        width={96}
                        height={96}
                    />
                    <p className="text-sm mt-1">{evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
                    </div>
                ))}
                </div>
            ) : (
                pokemon && !loading && <p className="text-sm mt-2">No further evolutions found or data unavailable.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAbilities}
        onClose={() => setShowAbilities(false)}
        title="Abilities"
      >
        <p className="text-black text-xl">
          {pokemon?.abilities
            ?.map((a: { ability: { name: string } }) => a.ability.name)
            .join(", ")}
        </p>
      </Modal>

      <Modal
        isOpen={showMoves}
        onClose={() => setShowMoves(false)}
        title="Moves"
      >
        <p className="text-black text-xl">
          {pokemon?.moves
            ?.map((m: { move: { name: string } }) => m.move.name)
            .join(", ")}
        </p>
      </Modal>

      <Modal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        title="Favorites"
      >
        <div className="space-y-4">
          {favorites.length > 0 ? (
            favorites.map((id) => (
              <div key={id} className="flex items-center justify-between p-2 rounded hover:bg-gray-200">
                <div className="flex items-center cursor-pointer" onClick={() => {
                    fetchPokemonData(id);
                    setShowFavorites(false);
                    }}>
                    <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                        alt={`Favorite Pokemon ${id}`}
                        width={60}
                        height={60}
                        className="mr-4"
                    />
                </div>
                <button
                  onClick={() => handleRemoveFavorite(id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  aria-label={`Remove favorite ${id}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-black text-center">No favorite Pokémon yet.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}