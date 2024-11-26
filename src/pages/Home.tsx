import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
/* import { useAuth0 } from "@auth0/auth0-react"; */

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category: string;
};

type Category = {
  id: number;
  name: string;
};

const Home: React.FC = () => {
/*   const { loginWithRedirect, isAuthenticated } = useAuth0(); */
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`https://commercial-api.vulktech.com/products/`),
        fetch(`https://commercial-api.vulktech.com/categories/`),
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProducts(productsData.productList);
      setCategories(categoriesData.categoryList);
      setFilteredProducts(productsData.productList);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Este useEffect carga los datos cuando se monta el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Este useEffect maneja la autenticación
/*   useEffect(() => {
    if (!isAuthenticated) {
      console.log("No estás autenticado");
    }
  }, [isAuthenticated]); */ // Este useEffect solo se ejecutará cuando cambie el estado de autenticación

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSearch = async (searchProduct: string) => {
    try {
      if (!searchProduct.trim()) {
        setFilteredProducts(products);
        return;
      }

      const response = await fetch(
        `https://commercial-api.vulktech.com/products/search?searchProduct=${searchProduct}`
      );
      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        setFilteredProducts(data.products);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setFilteredProducts([]);
    }
  };

  const handleFilterCategory = (category: string) => {
    let filtered = category === "All" ? products : products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
  };

  const handleSortPrice = (order: "asc" | "desc") => {
    let sorted = [...filteredProducts].sort((a, b) => {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sorted);
  };

  return (
    <div className="font-sans text-gray-700">
      <NavBar
        onSearch={handleSearch}
        searchTerm={searchProduct}
        searchSuggestions={searchSuggestions}
        onFilterCategory={handleFilterCategory}
        onSortPrice={handleSortPrice}
        categories={categories}
      />
      <div className="max-w-screen-xl mx-auto px-4 mt-10 flex justify-between items-center">
        <div className="flex space-x-4">
          <select onChange={(e) => handleFilterCategory(e.target.value)}>
            <option value="All">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => handleSortPrice(e.target.value as "asc" | "desc")}>
            <option value="asc">Menor Precio</option>
            <option value="desc">Mayor Precio</option>
          </select>
        </div>
      </div>
      <div className="container mx-auto max-w-screen-xl px-4 mt-10">
        <div className="flex flex-wrap gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/4 p-4"
                onClick={() => handleProductClick(product.id)}
              >
                <ProductCard product={product} />
              </button>
            ))
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold">No se encontraron productos.</p>
            </div>
          )}
          </div>
        </div>
    </div> 
  
  ) 
 /*    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="rounded-lg shadow-lg p-12 bg-white">
        <p className="text-blue-300 text-center text-2xl font-bold">No estás autenticado.</p>
        <p className="m-4 text-center"> Inicia sesión para continuar.</p>
        <div className="text-center">
          <button
            className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => loginWithRedirect()}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div> */

};

export default Home;
