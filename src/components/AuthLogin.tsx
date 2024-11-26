import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0();
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      // Mostrar la ventana emergente para iniciar sesión
      await loginWithPopup();
      // Carga de tokens y perfil
      const user = await loginWithRedirect();
      console.log("Usuario autenticado:", user);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }; 

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Iniciar sesión
      </button>
    </div>
  );
};

export default AuthLogin;
