"use client";

import { useEffect, useState } from "react";
import Search from "./components/Search";
import Image from "next/image";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";
import { getPokemon, getEvolutionChain } from "./utils/dataServices";
import Modal from "./components/Modal";

export default function Home() {
  const [pokemonName, setPokemonName] = useState("Mew");
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShiny, setIsShiny] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [evolutions, setEvolutions] = useState<any[]>([]);

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
    try {
      const data = await getPokemon(identifier);
      setPokemon(data);
      const speciesData = await getEvolutionChain(data.species.url);
      const evolutionData = await getEvolutionChain(
        speciesData.evolution_chain.url
      );
      const evolutions = [];
      let current = evolutionData.chain;
      while (current) {
        const pokemonData = await getPokemon(current.species.name);
        evolutions.push(pokemonData);
        current = current.evolves_to[0];
      }
      setEvolutions(evolutions);
      setError("");
    } catch (err) {
      setError("Error loading Pokémon data");
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
          <div className="bg-[#D9D9D940] rounded-xl mt-5 w-full h-[500px] relative">
            {pokemon && (
              <div className="flex justify-center">
                <img
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px]"
                  src={
                    isShiny
                      ? pokemon.sprites.front_shiny
                      : pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                />
                <div className="absolute bottom-0 left-0 transform translate-x-0 translate-y-0 flex flex-row items-center gap-3 p-6">
                  <button onClick={() => setIsShiny(!isShiny)}>
                    <img
                      className="w-[25px]"
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
          </div>
          <div className="flex justify-center mt-10">
            <p className="font-bold text-2xl">{pokemon?.name || "Name"}</p>
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

          <div className="flex flex-col mt-5">
            <p className="font-bold text-xl">
              Element Type:{" "}
              {pokemon?.types?.map((t: any) => t.type.name).join(", ")}
            </p>
            <p className="font-bold text-xl"> Location: N/A </p>
          </div>

          <div className="flex flex-col mt-10 gap-1">
            <button
              className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"
              onClick={() => setShowAbilities(true)}
            >
              Abilities
            </button>
            <button
              className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"
              onClick={() => setShowMoves(true)}
            >
              Moves
            </button>
          </div>

          <div className="flex flex-col mt-15">
            <p className="font-bold text-xl"> Evolutions: </p>
            <div className="grid grid-cols-3 gap-1">
              {evolutions.map((evo, index) => (
                <div
                  key={index}
                  className="bg-[#D9D9D940] rounded-md w-full h-[215px] relative"
                >
                  <img
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    src={evo.sprites.front_default}
                    alt={evo.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAbilities}
        onClose={() => setShowAbilities(false)}
        title="Abilities"
      >
        <p className="text-black text-xl">
          {pokemon?.abilities?.map((a: any) => a.ability.name).join(", ")}
        </p>
      </Modal>

      <Modal
        isOpen={showMoves}
        onClose={() => setShowMoves(false)}
        title="Moves"
      >
        <p className="text-black text-xl">
          {pokemon?.moves?.map((m: any) => m.move.name).join(", ")}
        </p>
      </Modal>

      <Modal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        title="Favorites"
      >
        <div className="space-y-4">
          {favorites.map((id) => (
            <div key={id} className="flex items-center justify-between">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt="Favorite"
                className="w-20 h-20 cursor-pointer"
                onClick={() => {
                  fetchPokemonData(id);
                  setShowFavorites(false);
                }}
              />
              <button
                onClick={() => handleRemoveFavorite(id)}
                className="text-red-500 hover:text-red-700"
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
          ))}
        </div>
      </Modal>
    </div>
  );
}
