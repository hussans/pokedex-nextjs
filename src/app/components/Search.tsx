import React, { useState } from "react";
import Image from "next/image";

const Search = () => {

  const search = "/search.png";
  const hoveredSearch = "/search-hovered.png"

  const shuffle = "/shuffle.png";
  const hoveredShuffle = "/shuffle-hovered.png";

  const [currentImageSearch, setCurrentImageSearch] = useState(search);
  const [currentImageShuffle, setCurrentImageShuffle] = useState(shuffle);
    
  return (
    <div>
      <search className="flex gap-1">
        <input
          className="bg-white text-black rounded-md p-3 placeholder-gray-300 w-[100%]"
          type="text"
          placeholder="Search a Pokemon"
        />
        <button 
        onMouseEnter={() => setCurrentImageSearch(hoveredSearch)}
        onMouseLeave={() => setCurrentImageSearch(search)}
        onMouseDown={() => setCurrentImageSearch(search)}
        onMouseUp={() => setCurrentImageSearch(hoveredSearch)}
        className="bg-white rounded-md p-3 px-3.5 hover:bg-black active:bg-white transition duration-300 ease-in-out">
          <Image width={25} height={25} src={currentImageSearch} alt="Search Magnifying Glass Icon" />
        </button>
        <button 
        onMouseEnter={() => setCurrentImageShuffle(hoveredShuffle)}
        onMouseLeave={() => setCurrentImageShuffle(shuffle)}
        onMouseDown={() => setCurrentImageShuffle(shuffle)}
        onMouseUp={() => setCurrentImageShuffle(hoveredShuffle)}
        className="bg-white rounded-md p-2 px-2.5 hover:bg-black active:bg-white transition duration-300 ease-in-out">
          <Image width={35} height={35} src={currentImageShuffle} alt={"Shuffle Icon"} />
        </button>
      </search>
    </div>
  );
};

export default Search;
