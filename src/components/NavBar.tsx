import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "./LanguageContext";
import translations, { Language } from "../utils/translations"; // Importa el tipo 'Language'

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
  const { language } = useLanguage(); // Usa 'language' del contexto
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateCartItemsCount = () => {
    const cartJson = localStorage.getItem("cart");
    const storedCart = cartJson ? JSON.parse(cartJson) : [];
    const totalItems = storedCart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    setCartItemsCount(totalItems);
  };

  useEffect(() => {
    updateCartItemsCount();
    const handleStorageChange = () => updateCartItemsCount();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Asegúrate de que el idioma es válido
  const t = translations[language as Language];

  return (
    <nav className="bg-customBackground text-customText p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <LanguageSelector />
        <Link
          to="/"
          className="text-customText text-2xl font-bold hover:text-customPrice"
        >
          <span className="hidden md:block">eCommerce</span>
          <span className="block md:hidden">e</span>
        </Link>

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
            placeholder={t.searchPlaceholder} // Traducción del placeholder
            className="w-full p-2 rounded text-black outline outline-1 outline-gray-300 focus:outline-2"
          />
        </div>

        <div className="hidden md:flex gap-10">
          <Link
            className="font-bold text-[#0e3541] hover:text-customPrice"
            to="/"
          >
            {t.home} {/* Traducción de 'Inicio' */}
          </Link>
          <Link
            className="font-bold text-[#0e3541] hover:text-customPrice"
            to="/profile"
          >
            {t.profile} {/* Traducción de 'Mi Cuenta' */}
          </Link>
          <Link
            className="font-bold text-[#0e3541] hover:text-customPrice"
            to="/add-product"
          >
            {t.addProduct} {/* Traducción de 'Agregar Producto' */}
          </Link>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="relative"
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="font-bold text-[#0e3541] hover:text-customPrice"
            />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
