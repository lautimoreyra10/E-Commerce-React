import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import AuthLogin from './AuthLogin';  // Asegúrate de importar tu componente de login

const AuthProfile = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();

  // Notificación de inicio de sesión requerido
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast.warn("Necesitas iniciar sesión para acceder al perfil.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <span className="ml-2 text-lg font-bold">Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AuthLogin /> {/* Muestra el componente de login */}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <img src={user?.picture} alt={user?.name} className="rounded-full w-32 h-32" />
      <h2 className="text-2xl font-bold">{user?.name}</h2>
      <p className="text-gray-700">{user?.email}</p>
      <button
        onClick={() => logout({ returnTo: window.location.origin })}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Cerrar sesión
      </button>
      <ToastContainer />
    </div>
  );
};

export default AuthProfile;
