export interface Pokemon {
    id: number;
    name: string;
    types: Array<{ type: { name: string } }>;
    sprites: { front_default: string; front_shiny: string };
    abilities: Array<{ ability: { name: string } }>;
    moves: Array<{ move: { name: string } }>;
    species: { url: string };
    location_area_encounters: string;
}

export interface EvolutionChain {
    evolves_to: EvolutionChain[];
    species: { name: string; url: string };
}