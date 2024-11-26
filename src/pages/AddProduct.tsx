import React, { useState, ChangeEvent, FormEvent } from "react";

interface ProductData {
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
}

export const AddProduct: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    stock: 0,
    imageUrl: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProductData({ ...productData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.stock
    ) {
      setMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

  /*   const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Debes iniciar sesión para agregar un producto.");
      return;
    } */

    try {
      const response = await fetch("https://commercial-api.vulktech.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setMessage("Producto publicado con éxito");
        window.location.href = "/";
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || "Error al agregar el producto"}`);
      }
    } catch {
      setMessage("Error en la conexión");
    }
  };

  return (
    <div className="container">
      <h2>Agregar Producto</h2>
      {message && <p>{message}</p>}
      <form className="flex flex-col" id="addProductForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre del producto"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            placeholder="Descripción del producto"
            value={productData.description}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            type="number"
            placeholder="Precio del producto"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="text"
            placeholder="stock"
            value={productData.stock}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="imageUrl">URL de la Imagen</label>
          <input
            id="imageUrl"
            type="text"
            placeholder="URL de la imagen del producto (opcional)"
            value={productData.imageUrl}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
        </div> */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600"
        >
          Publicar Producto
        </button>
      </form>
    </div>
  );
};
export default AddProduct;