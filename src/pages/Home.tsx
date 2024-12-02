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
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleFilterCategory = (category: string) => {
    const filtered =
      category === "All"
        ? products
        : products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
    setShowCategoryDropdown(false);
  };

  const handleSortPrice = (order: "asc" | "desc") => {
    const sorted = [...filteredProducts].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted);
    setShowSortDropdown(false);
  };

  return (
    <div className="font-sans text-customText bg-white">
      <NavBar
        onSearch={() => {}}
        searchTerm={searchProduct}
        searchSuggestions={searchSuggestions}
        onFilterCategory={handleFilterCategory}
        onSortPrice={handleSortPrice}
        categories={categories}
      />
      <div className="max-w-screen-xl mx-auto px-4 mt-10 flex justify-between items-center">
      <div className="hidden md:flex space-x-4">
  {/* Categorías */}
  <div className="relative">
    <button
      className="bg-white text-customText px-4 py-2 w-52 cursor-pointer flex items-center justify-between"
      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
    >
      Todas las categorías
      <span className="ml-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-customText border-l-transparent border-r-transparent" />
    </button>
    {showCategoryDropdown && (
      <ul className="absolute left-0 top-full w-52 bg-white text-customText mt-1 shadow-lg z-10">
        <li
          className="px-4 py-2 hover:bg-customBackground cursor-pointer"
          onClick={() => handleFilterCategory("All")}
        >
          Todas
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className="px-4 py-2 hover:bg-customBackground cursor-pointer"
            onClick={() => handleFilterCategory(category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Ordenar por precio */}
  <div className="relative">
    <button
      className="bg-white text-customText px-4 py-2 w-52 cursor-pointer flex items-center justify-between"
      onClick={() => setShowSortDropdown(!showSortDropdown)}
    >
      Ordenar por precio
      <span className="ml-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-customText border-l-transparent border-r-transparent" />
    </button>
    {showSortDropdown && (
      <ul className="absolute left-0 top-full w-52 bg-white text-customText mt-1 shadow-lg z-10">
        <li
          className="px-4 py-2 hover:bg-customBackground cursor-pointer"
          onClick={() => handleSortPrice("asc")}
        >
          Menor Precio
        </li>
        <li
          className="px-4 py-2 hover:bg-customBackground cursor-pointer"
          onClick={() => handleSortPrice("desc")}
        >
          Mayor Precio
        </li>
      </ul>
    )}
  </div>
</div>

      </div>
      <div className="container mx-auto max-w-screen-xl px-4 mt-10">
        <div className="flex flex-wrap gap-0.75">
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
  );
};

export default Home;
