import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

type Category = {
  id: number;
  name: string;
};

type NavBarProps = {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  searchSuggestions: any[];
  onFilterCategory: (category: string) => void;
  onSortPrice: (order: "asc" | "desc") => void;
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NavBar: React.FC<NavBarProps> = ({
  onSearch,
  searchTerm,
  searchSuggestions,
  onInputChange,
}) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Actualizar la cantidad de productos del carrito cuando cambien
  const updateCartItemsCount = () => {
    const cartJson = localStorage.getItem("cart");
    const storedCart = cartJson ? JSON.parse(cartJson) : [];
    const totalItems = storedCart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    setCartItemsCount(totalItems);
  };

  // useEffect para actualizar la cantidad al montar el componente
  useEffect(() => {
    updateCartItemsCount();

    // Agregar un listener para actualizar la cantidad cuando cambie el carrito en localStorage
    const handleStorageChange = () => updateCartItemsCount();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-customBackground text-customText p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo responsive */}
        <Link to="/" className="text-customText text-2xl font-bold hover:text-customPrice">
          <span className="hidden md:block">eCommerce</span>
          <span className="block md:hidden">e</span>
        </Link>

        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-1/3 mx-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onInputChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch(searchTerm);
              }
            }}
            placeholder="Buscar productos..."
            className="w-full p-2 rounded text-black outline outline-1 outline-gray-300 focus:outline-2"
          />
          {searchTerm && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border mt-2 max-h-60 overflow-y-auto z-10 text-black">
              {searchSuggestions.map((product) => (
                <div
                  key={product.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => onSearch(product.name)}
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menú hamburguesa */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-customText hover:text-customPrice"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Menú normal (visible en pantallas grandes) */}
        <div className="hidden md:flex gap-10">
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/">
            Inicio
          </Link>
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/profile">
            Mi Cuenta
          </Link>
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/add-product">
            Agregar Producto
          </Link>
          <button onClick={() => window.location.href = "/cart"} className="relative">
            <FontAwesomeIcon icon={faShoppingCart} className="font-bold text-[#0e3541] hover:text-customPrice" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      <div
        className={`fixed top-0 right-0 min-h-3.5/6 w-2/4 max-w-xs bg-customBackground bg-opacity-90 text-customText shadow-md transition-transform transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transition: "transform 0.5s ease-in-out", // Suavidad en el deslizamiento
        }}
      >
        <button
          className="absolute top-4 right-4 text-customText hover:text-customPrice"
          onClick={() => setMenuOpen(false)}
        >
          Cerrar
        </button>
        <div className="flex flex-col mt-12 p-4">
          <Link
            to="/"
            className="py-2 text-customText hover:text-customPrice border-b border-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/profile"
            className="py-2 text-customText hover:text-customPrice border-b border-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Mi Cuenta
          </Link>
          <Link
            to="/add-product"
            className="py-2 text-customText hover:text-customPrice"
            onClick={() => setMenuOpen(false)}
          >
            Agregar Producto
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
