import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const cartJson = localStorage.getItem("cart");
    const storedCart = cartJson ? JSON.parse(cartJson) : [];
    setCart(storedCart);
  }, []);

  // Actualizar el carrito en localStorage
  const updateCart = (newCart: Product[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Aumentar cantidad de un producto
  const increaseQuantity = (productId: number) => {
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  // Disminuir cantidad de un producto
  const decreaseQuantity = (productId: number) => {
    const newCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(newCart);
  };

  // Eliminar un producto del carrito
  const removeItem = (productId: number) => {
    const newCart = cart.filter((item) => item.id !== productId);
    updateCart(newCart);
  };

  // Calcular el precio total y la cantidad de productos
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const items = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(total);
    setTotalItems(items);
  }, [cart]);

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Lista de productos */}
            <div className="flex-1">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="border p-4 rounded-lg shadow-md flex items-center gap-4 mb-4"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p className="text-customPrice font-semibold">{product.price} USD</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="px-3 py-1 bg-white rounded hover:bg-customBackground"
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(product.id)}
                        className="px-3 py-1 bg-white rounded hover:bg-customBackground"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="px-3 py-1 bg-customWord text-white rounded hover:bg-customPrice transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen de compra */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3">
              <h2 className="font-bold text-xl mb-4">Resumen</h2>
              <p className="text-customText">Total de productos: {totalItems}</p>
              <p className="text-customText mb-4">Total a pagar: {totalPrice} USD</p>
              <button
                className="w-full px-4 py-2 bg-customText text-white rounded-lg font-bold hover:bg-customPrice transition"
              >
                Finalizar compra
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
