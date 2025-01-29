const translations = {
    en: {
      home: "Home",
      profile: "My Account",
      addProduct: "Add Product",
      searchPlaceholder: "Search products...",
      cart: "Cart",
    },
    es: {
      home: "Inicio",
      profile: "Mi Cuenta",
      addProduct: "Agregar Producto",
      searchPlaceholder: "Buscar productos...",
      cart: "Carrito",
    },
    // Otros idiomas...
  } as const;
  
  export default translations;
  
  export type Language = keyof typeof translations; // Tipo para manejar los idiomas
  