import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetch(`https://commercial-api.vulktech.com/products/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener el producto');
          }
          return response.json();
        })
        .then(data => {
          setProduct(data.product);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar el producto');
          setLoading(false);
        });
    } else {
      setError('ID de producto no proporcionado');
      setLoading(false);
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cartJson = localStorage.getItem('cart');
    const storedCart = cartJson ? JSON.parse(cartJson) : [];
    const existingProductIndex = storedCart.findIndex((item: any) => item.id === product.id);

    if (existingProductIndex >= 0) {
      storedCart[existingProductIndex].quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));

    // Emitir evento para actualizar el ícono del carrito
    const cartUpdatedEvent = new Event('cartUpdated');
    window.dispatchEvent(cartUpdatedEvent);

    toast.success('¡Producto agregado al carrito! 🛒');
  };

  const cartRedirect = () => {
    addToCart();
    toast.info('Redirigiendo al carrito...', {
      onClose: () => (window.location.href = '/cart'),
    });
  };
  const deleteProduct = () => {
    if (!product) return;
  
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmDelete) return;
  
    fetch(`https://commercial-api.vulktech.com/products/${product.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          // Depuración de la respuesta
          return response.json().then(err => {
            console.error('Error al eliminar:', err);
            throw new Error('Error al eliminar el producto');
          });
        }
        toast.success('¡Producto eliminado con éxito!');
        // Redireccionar después de eliminar
        setTimeout(() => {
          window.location.href = '/';
        }, 2000); // Espera un poco antes de redireccionar
      })
      .catch((err) => {
        console.error('Error al intentar eliminar el producto:', err);
        toast.error('Error al eliminar el producto');
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar {...{ onSearch: () => {}, searchTerm: '', searchSuggestions: [], onFilterCategory: () => {}, onSortPrice: () => {}, categories: [], onInputChange: () => {} }} />
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
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <p className="text-2xl font-semibold mb-6">${product.price} USD</p>
              <button
                onClick={addToCart}
                className="px-6 py-3 bg-customText text-white font-bold rounded-lg hover:bg-customPrice transition w-full"
              >
                Agregar al Carrito
              </button>
              <button
                onClick={cartRedirect}
                className="mt-4 px-6 py-3 bg-customText text-white font-bold rounded-lg hover:bg-customPrice transition w-full"
              >
                Comprar Ahora
              </button>
              <button
                onClick={deleteProduct}
                className="px-6 py-3 mt-4 bg-customText text-white font-bold rounded-lg hover:bg-customPrice transition w-full"
              >
                Borrar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
