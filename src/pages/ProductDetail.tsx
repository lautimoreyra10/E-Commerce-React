import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importar FontAwesomeIcon
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // Corazón lleno
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // Corazón vacío
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // Estado para favoritos
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      fetch(`https://commercial-api.vulktech.com/products/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el producto");
          }
          return response.json();
        })
        .then((data) => {
          setProduct(data.product);
          setLoading(false);
        })
        .catch(() => {
          setError("Error al cargar el producto");
          setLoading(false);
        });
    } else {
      setError("ID de producto no proporcionado");
      setLoading(false);
    }
  }, [id]);

  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Cambiar el estado de favorito
    toast.success(
      isFavorite
        ? "Producto removido de favoritos"
        : "Producto agregado a favoritos"
    );
  };

  const addToCart = () => {
    if (!product) return;
    const cartJson = localStorage.getItem("cart");
    const storedCart = cartJson ? JSON.parse(cartJson) : [];
    const existingProductIndex = storedCart.findIndex(
      (item: any) => item.id === product.id
    );

    if (existingProductIndex >= 0) {
      storedCart[existingProductIndex].quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));

    const cartUpdatedEvent = new Event("cartUpdated");
    window.dispatchEvent(cartUpdatedEvent);

    toast.success("¡Producto agregado al carrito! 🛒");
  };

  const cartRedirect = () => {
    addToCart();
    toast.info("Redirigiendo al carrito...", {
      onClose: () => (window.location.href = "/cart"),
    });
  };

  const deleteProduct = () => {
    if (!product) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmDelete) return;

    fetch(`https://commercial-api.vulktech.com/products/${product.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            console.error("Error al eliminar:", err);
            throw new Error("Error al eliminar el producto");
          });
        }
        toast.success("¡Producto eliminado con éxito!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al intentar eliminar el producto:", err);
        toast.error("Error al eliminar el producto");
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleQuantityChange = (event: any) => {
    const value = event.target.value;
    setSelectedQuantity(value);
  };
  const renderQuantityOptions = () => {
    const options = [];
    for (let i = 1; i <= product.stock; i++) {
      options.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return options;
  };
  return (
    <div>
      <NavBar
        {...{
          onSearch: () => {},
          searchTerm: "",
          searchSuggestions: [],
          onFilterCategory: () => {},
          onSortPrice: () => {},
          categories: [],
          onInputChange: () => {},
        }}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      {product && (
        <div className="mt-6 container mx-auto max-w-screen-lg px-4 py-6 text-customText bg-white">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  <button
                    onClick={toggleFavorite}
                    className="ml-4 text-3xl mb-4"
                  >
                    {isFavorite ? (
                      <FontAwesomeIcon
                        icon={solidHeart}
                        className="text-customPrice"
                      /> // Corazón lleno si es favorito
                    ) : (
                      <FontAwesomeIcon
                        icon={regularHeart}
                        className="text-[#0e3541] hover:text-customPrice"
                      /> // Corazón vacío si no lo es
                    )}
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <p className="text-2xl font-semibold mb-6">
                  ${product.price} USD
                </p>
              </div>
              <div className="flex flex-col-reverse ">
                <div className="flex items-left flex-col mt-10">
                  <span className="text-1xl font-semibold mb-4 py-3">
                    Stock disponible:
                    <span className="p-1">{product.stock}</span>
                  </span>
                  <span className="w-1/3">
                    <FormControl fullWidth>
                      <InputLabel className="text-customText w-full" id="demo-simple-select-label">Cantidad</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedQuantity}
                        label="Quantity"
                        onChange={handleQuantityChange}
                      >
                        {renderQuantityOptions()}
                      </Select>
                    </FormControl>
                  </span>
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={addToCart}
                    className="px-6 py-3 bg-customText text-white font-bold rounded-lg hover:bg-secondary-Bg transition w-1/2"
                  >
                    Agregar al Carrito
                  </button>
                  <button
                    onClick={cartRedirect}
                    className="mt-4 px-6 py-3 bg-secondary-Bg text-white font-bold rounded-lg hover:bg-customText transition w-1/2"
                  >
                    Comprar Ahora
                  </button>
                  <button
                    onClick={deleteProduct}
                    className="px-6 py-3 mt-4 bg-secondary-Bg text-white font-bold rounded-lg hover:bg-customText transition w-1/2"
                  >
                    Borrar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
