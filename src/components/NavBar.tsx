import React, { useState, useEffect } from "react";
/* import { useAuth0 } from '@auth0/auth0-react'; */
import { Link } from "react-router-dom";

type NavBarProps = {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  searchSuggestions: any[];  // Sugerencias de búsqueda
  onFilterCategory: (category: string) => void;
  onSortPrice: (order: "asc" | "desc") => void;
  categories: any[];
};

const NavBar: React.FC<NavBarProps> = ({
  onSearch,
  searchTerm,
  searchSuggestions,
}) => {
  const [inputValue, setInputValue] = useState(searchTerm); // Para controlar el valor del input

  useEffect(() => {
    setInputValue(searchTerm); // Sincroniza el valor del input con el searchTerm
  }, [searchTerm]);

  /* const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0(); // Hooks de Auth0 */

  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
      setInputValue(value);  // Actualizar el estado local del input
      if (value.length >= 4 || value === "") {
        onSearch(value);  // Llamar a la función de búsqueda con el valor actual
      }
}  // Llamar a la función de búsqueda que se pasa desde el Home
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if(event.key === 'Enter'){
        onSearch(inputValue);
      }
}
  // Maneja la selección de una sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);  // Establecer el término de búsqueda en el valor de la sugerencia seleccionada
    onSearch(suggestion);  // Llamar la función de búsqueda con la sugerencia seleccionada
  };

  // Renderizar el contenido de la navegación
  return (
    <nav className="bg-customBackground text-customText p-4 shadow-md ">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <a href="/" className="text-customText text-2xl font-bold hover:text-customPrice">eCommerce</a>
        
        {/* Barra de búsqueda */}
        <div className="relative w-1/3">
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={inputValue} // Vincula el valor del input con el estado local
            onChange={handleSearchChange} // Llama a la función handleSearchChange al escribir
            placeholder="Buscar productos..."
            className="w-full p-2 rounded text-black outline outline-1 outline-gray-300 focus:outline-2"
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
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/">Inicio</Link>
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/profile">Mi Cuenta</Link>
          <Link className="font-bold text-[#0e3541] hover:text-customPrice" to="/add-product">Agregar Producto</Link>

          {/* Lógica de Login/Logout con Auth0 */}
          {/* {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
          ) : (
            <div>
              <span>Bienvenido, {user?.name}</span>
              <button onClick={() => logout({ returnTo: window.location.origin })}>Cerrar sesión</button>
            </div>
          )} */}

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