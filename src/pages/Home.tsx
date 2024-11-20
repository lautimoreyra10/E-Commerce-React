import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  title?: string;
};

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://commercial-api.vulktech.com/products/`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.productList); // Asignamos los productos al estado
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cargar productos cuando se monta el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    console.log("Producto clickeado:", productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="font-sans text-gray-700">
      <NavBar />
      <div className="container mx-auto max-w-screen-xl px-4 mt-10">
        <div className="flex flex-wrap gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <button
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/4 p-4"
                onClick={() => handleProductClick(product.id)} // Manejamos el clic en el botón
              >
                <ProductCard product={product} />
              </button>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
