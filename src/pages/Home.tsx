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
  category: string;
};

type Category = {
  id: number;
  name: string;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
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

      setProducts(productsData.productList); // Asignamos los productos al estado
      setCategories(categoriesData.categoryList); // Asignamos las categorías
      setFilteredProducts(productsData.productList); // Inicialmente, mostrar todos los productos
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cargar productos y categorías cuando se monta el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Manejar clic en el producto
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Filtrar productos por búsqueda
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);

    // Filtrar sugerencias
    let suggestions = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchSuggestions(suggestions);
  };

  // Filtrar productos por categoría
  const handleFilterCategory = (category: string) => {
    let filtered = category === "All" ? products : products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
  };

  // Ordenar productos por precio
  const handleSortPrice = (order: 'asc' | 'desc') => {
    let sorted = [...filteredProducts].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sorted);
  };

  return (
    <div className="font-sans text-gray-700">
      <NavBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        searchSuggestions={searchSuggestions}
        onFilterCategory={handleFilterCategory}
        onSortPrice={handleSortPrice}
        categories={categories}
      />
      
      {/* Filtros y clasificación en la parte superior derecha */}
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

      {/* Productos */}
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
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
