import React, { useState, ChangeEvent, FormEvent } from "react";
import NavBar from "../components/NavBar";

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
    stock: 1,
    imageUrl: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === "stock") {
      const stockValue = parseInt(value, 10);
      if (stockValue < 0) {
        setProductData({ ...productData, stock: 0 });
        return;
      }
    }
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
    <div>
      <NavBar/>
      <section className="w-full max-h-full p-4 bg-white">
      <h1 className="text-3xl font-bold p-4 text-center text-customText">Agregar Producto</h1>
      {message && <p>{message}</p>}
      <form className="flex flex-col justify-center items-center text-center" id="addProductForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id="name"
            type="text"
            placeholder="Nombre del producto"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full p-2 mb-6 mt-6 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <input
            id="description"
            placeholder="Descripción del producto"
            value={productData.description}
            onChange={handleInputChange}
            className=" p-2 mb-6 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <input
            id="price"
            type="number"
            placeholder="Precio del producto"
            value={productData.price}
            onChange={handleInputChange}
            className=" p-2 mb-6 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="form-group">
          <h2 className="mb-2">Stock</h2>
          <input
            id="stock"
            type="number"
            placeholder="stock"
            value={productData.stock}
            onChange={handleInputChange}
            className="p-2 mb-6 border border-gray-300 rounded"
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
            className=" p-2 mb-2 border border-gray-300 rounded"
          />
        </div> */}
        <div className="flex justify-center items-center text-center">
        <button
          type="submit"
          className="bg-customText text-white p-4 rounded hover:bg-customPrice mt-6"
        >
          Publicar Producto
        </button>
        </div>
      </form>
      </section>
    </div>
  );
};
export default AddProduct;