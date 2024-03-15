import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  className?: string;
  onClick?: (e: React.FormEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const Search: React.FC<SearchProps> = ({ onChange, value }) => {
  return (
    <div className="search-container transition flex gap-2 items-center border-[2px] rounded-[10px] py-[8px] px-[20px]">
      <input
        className="search-input outline-none w-[150px] bg-transparent"
        type="text"
        placeholder="Поиск..."
        value={value}
        onChange={onChange} 
      />
      <FaSearch className="text-[16px] text-[#1C61D5]" />
    </div>
  );
};
