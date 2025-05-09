import React, { useState } from "react";
import Image from "next/image";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onRandom: () => void;
}

const Search = ({ onSearch, onRandom }: SearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchImg, setSearchImg] = useState("/search.png");
  const [shuffleImg, setShuffleImg] = useState("/shuffle.png");

  return (
    <div className="flex gap-1">
      <input
        className="bg-white text-black rounded-md p-3 placeholder-gray-300 w-[100%]"
        type="text"
        placeholder="Search a Pokemon"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onMouseEnter={() => setSearchImg("/search-hovered.png")}
        onMouseLeave={() => setSearchImg("/search.png")}
        onMouseDown={() => setSearchImg("/search.png")}
        onMouseUp={() => setSearchImg("/search-hovered.png")}
        onClick={() => onSearch(inputValue)}
        className="bg-white rounded-md p-3 px-3.5 hover:bg-black active:bg-white transition duration-300 ease-in-out"
      >
        <Image width={25} height={25} src={searchImg} alt="Search" />
      </button>
      <button
        onMouseEnter={() => setShuffleImg("/shuffle-hovered.png")}
        onMouseLeave={() => setShuffleImg("/shuffle.png")}
        onMouseDown={() => setShuffleImg("/shuffle.png")}
        onMouseUp={() => setShuffleImg("/shuffle-hovered.png")}
        onClick={onRandom}
        className="bg-white rounded-md p-2 px-2.5 hover:bg-black active:bg-white transition duration-300 ease-in-out"
      >
        <Image width={35} height={35} src={shuffleImg} alt="Shuffle" />
      </button>
    </div>
  );
};

export default Search;