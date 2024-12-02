import React, { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      toast.error("Por favor, completa todos los campos obligatorios."); // Notificación de error
      return;
    }

    try {
      const response = await fetch("https://commercial-api.vulktech.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Producto agregado con éxito 🎉"); // Notificación de éxito
        setProductData({
          name: "",
          description: "",
          price: "",
          stock: 1,
          imageUrl: "",
        }); // Resetea el formulario
        window.location.href = "/";
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message || "Error al agregar el producto"}`);
      }
    } catch {
      toast.error("Error en la conexión.");
    }
  };

  return (
    <div>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="w-full max-h-full p-4 bg-white">
        <h1 className="text-3xl font-bold p-4 text-center text-customText">Agregar Producto</h1>
        <form
          className="flex flex-col justify-center items-center text-center"
          id="addProductForm"
          onSubmit={handleSubmit}
        >
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
              placeholder="Stock"
              value={productData.stock}
              onChange={handleInputChange}
              className="p-2 mb-6 border border-gray-300 rounded"
              required
            />
          </div>
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
