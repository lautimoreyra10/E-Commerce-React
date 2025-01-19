import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";

interface ProductData {
  name: string;
  description: string;
  price: string;
  stock: number;
  Url_image: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export const AddProduct: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    stock: 1,
    Url_image: "",
    categoryId: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string>("");
  const [formErrors, setFormErrors] = useState<any>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://commercial-api.vulktech.com/categories");
        const data = await res.json();
        setCategories(data.categoryList);
      } catch (err) {
        toast.error("Error al cargar las categorías.");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (id === "categoryId" && value === "") {
      setCategoryError("Este campo es requerido");
    } else {
      setCategoryError("");
    }

    setFormErrors({
      ...formErrors,
      [id]: value.trim() === "" ? "Este campo es obligatorio" : "",
    });

    if (id === "categoryId") {
      setProductData({ ...productData, categoryId: Number(value) });
    } else if (id === "price" || id === "stock") {
      setProductData({ ...productData, [id]: Number(value) });
    } else {
      setProductData({ ...productData, [id]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de todos los campos
    const errors: any = {};

    if (!productData.name) errors.name = "El nombre del producto es obligatorio";
    if (!productData.description) errors.description = "La descripción es obligatoria";
    if (!productData.price) errors.price = "El precio es obligatorio";
    if (productData.stock <= 0) errors.stock = "El stock debe ser mayor a 0";
    if (!productData.categoryId) errors.categoryId = "La categoría es obligatoria";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://commercial-api.vulktech.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),  // El categoryId ya está en el objeto productData
      });

      if (response.ok) {
        toast.success("Producto agregado con éxito 🎉");
        setProductData({
          name: "",
          description: "",
          price: "",
          stock: 1,
          Url_image: "",
          categoryId: 0,
        });
        setFormErrors({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
        });
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
      <NavBar  {...{ onSearch: () => {}, searchTerm: '', searchSuggestions: [], onFilterCategory: () => {}, onSortPrice: () => {}, categories: [], onInputChange: () => {} }} />
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="w-full max-h-full p-4 bg-white">
        <h1 className="text-3xl font-bold p-4 text-center text-customText">Agregar Producto</h1>
        <form
          className="flex flex-col justify-center items-center text-center"
          id="addProductForm"
          onSubmit={handleSubmit}
        >
          <div className="w-full max-w-md flex flex-col items-start space-y-4">
            <div className="form-group w-full">
              <label htmlFor="categoryId" className="block font-medium text-left">Categoría</label>
              <select
                id="categoryId"
                value={productData.categoryId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoryError && <span className="text-red-500 text-sm">{categoryError}</span>}
              {formErrors.categoryId && <span className="text-red-500 text-sm">{formErrors.categoryId}</span>}
            </div>

            <div className="form-group w-full">
              <label htmlFor="name" className="block font-medium text-left">Nombre del producto</label>
              <input
                id="name"
                type="text"
                placeholder="Nombre del producto"
                value={productData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
            </div>

            <div className="form-group w-full">
              <label htmlFor="Url_image" className="block font-medium text-left">Imagen del producto</label>
              <input
                id="Url_image"
                type="text"
                placeholder="Imagen del producto"
                value={productData.Url_image}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
            </div>

            <div className="form-group w-full">
              <label htmlFor="description" className="block font-medium text-left">Descripción</label>
              <textarea
                id="description"
                placeholder="Descripción del producto"
                value={productData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.description && <span className="text-red-500 text-sm">{formErrors.description}</span>}
            </div>

            <div className="form-group w-full">
              <label htmlFor="price" className="block font-medium text-left">Precio</label>
              <input
                id="price"
                type="number"
                placeholder="Precio del producto"
                value={productData.price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.price && <span className="text-red-500 text-sm">{formErrors.price}</span>}
            </div>

            <div className="form-group w-full">
              <label htmlFor="stock" className="block font-medium text-left">Stock</label>
              <input
                id="stock"
                type="number"
                placeholder="Stock"
                value={productData.stock}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.stock && <span className="text-red-500 text-sm">{formErrors.stock}</span>}
            </div>

            <div className="w-full flex justify-center items-center">
              <button
                type="submit"
                className="bg-customText text-white w-full py-3 rounded hover:bg-customPrice mt-6"
              >
                Publicar Producto
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProduct;
