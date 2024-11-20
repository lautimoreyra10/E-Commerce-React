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
  
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      {product ? (
        <div className="container mx-auto max-w-screen-lg px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Imagen del Producto */}
            <div className="flex-1">
              <img
                src={product.imageUrl}  // Asegúrate de que 'imageUrl' es el campo correcto de la API
                alt={product.name}
                className="rounded-lg shadow-lg max-w-4xl object-cover"
              />
            </div>

            {/* Información del Producto */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6 text-xl">{product.description}</p> {/* Descripción */}
              <p className="text-2xl font-semibold text-blue-500 mb-6">
                ${product.price} USD {/* Precio */}
              </p>
              <p className="font-bold text-xl mb-6">{product.stock} unidades disponibles</p> {/* Stock */}
              <button
                id="add-to-cart"
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition w-full"
                data-product-id={product.id}
              >
                Agregar al Carrito
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
