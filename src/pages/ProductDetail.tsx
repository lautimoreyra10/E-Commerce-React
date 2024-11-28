import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para acceder a los parámetros de la URL
import NavBar from '../components/NavBar';

const ProductDetail = () => {
  const { id } = useParams(); // Obtén el id del producto de la URL
  
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Efecto para obtener el producto por ID
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
          console.log("Producto recibido:", data);  // Verificar la respuesta
          setProduct(data.product); // Asigna el producto dentro de `product`
          setLoading(false);
        })
        .catch(err => {
          setError('Error al cargar el producto');
          setLoading(false);
          console.log(err);
        });
    } else {
      setError('ID de producto no proporcionado');
      setLoading(false);
    }
  }, [id]); // Dependiendo de 'id', vuelve a cargar el producto

  const addToCart = () => {
    if (!product) return;

    // Obtener el carrito actual desde localStorage
    const cartJson = localStorage.getItem('cart');
    const storedCart = cartJson ? JSON.parse(cartJson) : [];

    // Comprobar si el producto ya está en el carrito
    const existingProductIndex = storedCart.findIndex((item: any) => item.id === product.id);

    if (existingProductIndex >= 0) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      storedCart[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      storedCart.push({ ...product, quantity: 1 });
    }

    // Actualizar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(storedCart));

    // Opcional: Puedes mostrar un mensaje de éxito o alguna animación
    alert('Producto agregado al carrito');
  };
  const cartRedirect = () => {
    addToCart();
    window.location.href = '/cart';
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar/>
      {product ? (
        <div className="mt-6 container mx-auto max-w-screen-lg px-4 py-6 text-customText bg-white">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Imagen del Producto */}
            <div className="flex-1">
                <div className=''>
                  <img
                    src={product.imageUrl}  // Asegúrate de que 'imageUrl' es el campo correcto de la API
                    alt={product.name}
                    className='w-full h-full object-cover rounded-lg'
                  />
                </div>
            </div>

            {/* Información del Producto */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4 text-customText">{product.name}</h1>
              <p className="text-gray-600 mb-6 text-xl">{product.description}</p> {/* Descripción */}
              <p className="text-2xl font-semibold text-customPrice mb-6">
                ${product.price} USD {/* Precio */}
              </p>
              <p className="font-bold text-xl mb-6 text-customText">{product.stock} unidades disponibles</p> {/* Stock */}
              <button
                onClick={addToCart}
                className="px-6 py-3 bg-customText text-white font-bold rounded-lg hover:bg-customPrice transition w-full"
              >
                Agregar al Carrito
              </button>
              <button onClick={cartRedirect} className="mt-4 px-6 py-3 bg-customText text-white font-bold rounded-lg hover:bg-customPrice transition w-full">
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Producto no encontrado</p>
      )}
    </div>
  );
};

export default ProductDetail;
