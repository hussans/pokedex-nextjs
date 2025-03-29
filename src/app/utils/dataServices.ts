export const getPokemon = async (identifier: string | number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!response.ok) throw new Error("Pokémon not found");
    return response.json();
};

export const getEvolutionChain = async (url: string) => {
    const response = await fetch(url);
    return response.json();
};