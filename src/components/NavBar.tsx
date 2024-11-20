import React, { useEffect, useState } from 'react';

const NavBar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Cargar el estado de autenticación desde el almacenamiento local
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(Boolean(token));
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      window.location.href = '/profile';
    } else {
      window.location.href = '/login';
    }
  };

  const handleCartClick = () => {
    window.location.href = '/cartpage';
  };

  return (
    <nav className="bg-gray-900 text-white px-12 py-3 flex items-center justify-between shadow-xl">
      <div className="text-2xl font-bold">eCommerce</div>
      <div className="w-1/3">
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Buscar..."
        />
      </div>
      <div className="flex gap-10">
        <a href="/">Inicio</a>
        <a href="/products">Productos</a>
        <a href="/about">Acerca de</a>
        <button
          id="user-icon-button"
          className="user-icon-button"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: 0 }}
          onClick={handleUserClick}
        >
          <i className="fas fa-user"></i>
        </button>
        <button
          id="cart-icon"
          onClick={handleCartClick}
        >
          <i className="fas fa-cart-plus"></i>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
