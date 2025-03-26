"use client"

import { useEffect, useState } from "react";
import Search from "./components/Search";
import Image from "next/image";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";

export default function Home() {

  const pokeball = "/pokeball.png";
  const hoveredPokeball = "/pokeball-white.png";
  
  const darkmode = "/night-mode.png";
  const hoveredDarkmode = "/nightmode-hovered.png"
  
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [currentImageFav, setCurrentImageFav] = useState(pokeball);
  const [currentImageTheme, setCurrentImagetheme] = useState(darkmode);

  useEffect(() => {
    const storedColor = getLocalStorage("bgColor");
    if (storedColor) {
      setBgColor(storedColor || "bg-[#808080]");
    }
  }, []);
  
  const changeBgColor = () => {
    setBgColor((prevColor) => {
      const newColor = prevColor === 'bg-[#808080]' ? 'bg-[#2D3748]' : 'bg-[#808080]'
      setLocalStorage("bgColor", newColor)
      return newColor;
    });
  }

  if(!bgColor) return null;

  return (
    <div className={`${bgColor} w-full min-h-screen px-32 py-9`}>
      <nav>
        <p className="font-bold font-Inter text-md"> SAN-POKEDEX </p>
      </nav>

      <div className="mt-16 grid lg:grid-cols-2 gap-6 ">
        <div>
          <div>
            <Search />
          </div>
          <div className="bg-[#D9D9D940] rounded-xl mt-5 w-full h-[500px] relative">
            <div className="flex justify-center">
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> Test Image </p>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <p className="font-bold text-2xl"> Name </p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <button
              onMouseEnter={() => setCurrentImageFav(hoveredPokeball)}
              onMouseLeave={() => setCurrentImageFav(pokeball)}
              onMouseDown={() => setCurrentImageFav(pokeball)}
              onMouseUp={() => setCurrentImageFav(hoveredPokeball)}
              className="flex justify-center bg-white text-black rounded-md p-3 w-[60%] hover:bg-[#FF1F1F] active:bg-white transition duration-300 ease-in-out">
              <Image width={25} height={25} src={currentImageFav} alt={"Red Pokeball Icon"} />
            </button>
            <button
            onMouseEnter={() => setCurrentImagetheme(hoveredDarkmode)}
            onMouseLeave={() => setCurrentImagetheme(darkmode)}
            onMouseDown={() => setCurrentImagetheme(darkmode)}
            onMouseUp={() => setCurrentImagetheme(hoveredDarkmode)}
            onClick={changeBgColor}
            className="flex bg-white rounded-md p-3 w-[40%] justify-center hover:bg-black active:bg-white transition duration-300 ease-in-out">
              <Image width={25} height={25} src={currentImageTheme} alt={"Dark Mode Cresent Moon Icon"} />
            </button>
          </div>
          <div className="flex flex-col mt-5">
            <p className="font-bold text-xl"> Element Type: </p>
            <p className="font-bold text-xl"> Location: </p>
          </div>
          <div className="flex flex-col mt-10 gap-1">
            <button 
            className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"> Abilities </button>
            <button className="bg-white font-bold text-xl text-black rounded-md py-2.5 hover:bg-black hover:text-white active:text-black active:bg-white transition duration-300 ease-in-out"> Moves </button>
          </div>
          <div className="flex flex-col mt-15">
            <p className="font-bold text-xl"> Evolutions: </p>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-[#D9D9D940] rounded-md w-full h-[215px] relative">
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> Test </p>
              </div>
              <div className="bg-[#D9D9D940] rounded-md w-full h-[215px] relative">
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> Test </p>
              </div>
              <div className="bg-[#D9D9D940] rounded-md w-full h-[215px] relative">
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> Test </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
