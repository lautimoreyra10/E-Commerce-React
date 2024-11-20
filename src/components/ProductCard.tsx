import React from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    image?: string;
    title?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.image || "/path/to/default-image.jpg"; // Imagen predeterminada
  const altText = product.title || product.name || "Imagen del producto"; // Texto alternativo por defecto

  return (
    <div className="border border-gray-100 rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] p-6 mb-5 hover:shadow-md transition-shadow duration-300 text-center">
      <img src={imageUrl}alt={altText} className="w-full h-48 object-cover rounded-lg" />
      <hr className="border-gray-200 w-full"/>
      <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-600 my-2 text-left">{product.description}</p>
      <p className="text-black-600 text-lg font-semibold first-line text-left">${product.price}</p>
    </div>
  );
};
export default ProductCard;
