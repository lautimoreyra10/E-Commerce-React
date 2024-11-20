import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type NavBarProps = {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  searchSuggestions: any[];
  onFilterCategory: (category: string) => void;
  onSortPrice: (order: "asc" | "desc") => void;
  categories: any[];
};

const NavBar: React.FC<NavBarProps> = ({
  onSearch,
  searchTerm,
  searchSuggestions,
  onFilterCategory,
  onSortPrice,
  categories,
}) => {
  const [inputValue, setInputValue] = useState<string>(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setInputValue(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">eCommerce</div>
        {/* Barra de búsqueda */}
        <div className="relative w-1/3">
          <input
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="Buscar productos..."
            className="w-full p-2 rounded text-black"
          />
          {inputValue && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border mt-2 max-h-60 overflow-y-auto z-10 text-black">
              {searchSuggestions.map((product) => (
                <div
                  key={product.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(product.name)} // Actualiza el término de búsqueda al seleccionar una sugerencia
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navegación y acciones */}
        <div className="flex gap-10">
          <Link to="/">Inicio</Link>
          <Link to="/products">Productos</Link>
          <Link to="/about">Acerca de</Link>
          <button
            id="user-icon-button"
            className="user-icon-button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              margin: 0,
            }}
          >
            <i className="fas fa-user"></i>
          </button>
          <button
            id="cart-icon"
            /* onClick={} */
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
