import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  url_image?: string;
  title?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Estado para la URL de la imagen
  const maxDescriptionLength = 20;

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}`); // Ajusta la URL a la de tu API
        const data = await response.json();
        console.log(data);
        if (data.product.url_image) {
          setImageUrl(data.product.url_image);
        } else {
          setImageUrl("/path/to/default-image.jpg");
        }
      } catch (error) {
        console.error("Error al obtener la imagen del producto:", error);
        setImageUrl("/path/to/default-image.jpg");
      }
    };

    fetchImageUrl();
  }, [product.id]); // Solo se ejecuta cuando el componente se monta o cambia el `product.id`

  const altText = product.title || product.name || "Imagen del producto"; // Texto alternativo por defecto

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="text-customText bg-white border border-gray-100 rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] p-6 mb-5 hover:shadow-md hover:bg-gray-50 transition-shadow duration-300 text-center">
      <img
        src={product.url_image || "/path/to/default-image.jpg"} // Muestra la imagen de la API o una imagen predeterminada
        alt={altText}
        className="w-full h-48 object-contain rounded-lg max-w-full max-h-full "
      />
      <hr className="border-customBackground w-full" />
      <h2 className="text-customText text-lg font-semibold mt-4">{product.name}</h2>
          
      {/* Descripción del producto */}
      <p className="text-customText my-2 text-left">
        {showFullDescription
          ? product.description // Muestra toda la descripción si se hace clic en "Ver más"
          : `${product.description.slice(0, maxDescriptionLength)}...`} {/* Muestra solo los primeros 50 caracteres */}
        {product.description.length > maxDescriptionLength && (
          <button
            className="text-customPrice text-sm font-medium underline ml-2"
            onClick={toggleDescription}
          >
            {showFullDescription ? "Ver menos" : "Ver más"}
          </button>
        )}
      </p>

      <p className="text-customPrice text-lg font-semibold first-line text-left">
        <span className="mr-1">$</span>{product.price}
      </p>
    </div>
  );
};

export default ProductCard;