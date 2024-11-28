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
    <div className="text-customText bg-white border border-gray-100 rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] p-6 mb-5 hover:shadow-md hover:bg-gray-50 transition-shadow duration-300 text-center">
      <img src={imageUrl}alt={altText} className="w-full h-48 object-cover rounded-lg" />
      <hr className="border-customBackground w-full"/>
      <h2 className="text-customText text-lg font-semibold mt-4">{product.name}</h2>
      <p className="text-customText my-2 text-left">{product.description}</p>
      <p className="text-customPrice text-lg font-semibold first-line text-left"><span className="mr-1">$</span>{product.price}</p>
    </div>
  );
};
export default ProductCard;
