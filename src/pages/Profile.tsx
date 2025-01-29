import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  roleId?: number;
  roleName?: string;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  
  // Usa navigate para redirigir al usuario cuando sea necesario
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://commercial-api.vulktech.com/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener el perfil del usuario');
      
      const { userList } = await res.json();
      const matchedUser = userList.find((u: UserData) => u.email === user?.email);

      if (matchedUser) {
        setUserData(matchedUser);
      } else {
        throw new Error('Usuario no encontrado en la base de datos');
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      setMessage('Error al cargar el perfil');
      navigate('/login'); // Navegar a login en caso de error
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserProfile();
      
      // Redireccionar después de 3 a 5 segundos si no se carga el perfil
      const timer = setTimeout(() => {
        if (!userData) {
          navigate('/login'); // Redirige al login si no hay perfil después de 3 segundos
        }
      }, 5000); // 5000 ms = 5 segundos

      setLoading(false);

      // Limpiar el temporizador cuando se desmonta el componente
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, userData, navigate]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://commercial-api.vulktech.com/users/${userData?.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setMessage('Perfil actualizado con éxito');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  if (isLoading || loading) {
    return <div className='text-center flex-wrap'>Cargando Perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl mb-5">Perfil del Usuario</h1>
      {isAuthenticated ? (
        userData ? (
          <form className="grid grid-cols-2 gap-5" id="profile-form" onSubmit={handleSaveChanges}>
            <div className="flex flex-col mb-3">
              <label className="text-sm mb-1 text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                className="form-input"
                placeholder="Nombre"
                disabled
              />
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm mb-1 text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                className="form-input"
                placeholder="Correo Electrónico"
                disabled
              />
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm mb-1 text-gray-700">Rol</label>
              <input
                type="text"
                name="roleName"
                value={userData.roleName}
                className="form-input"
                disabled
              />
            </div>

            <div className='flex flex-col mb-3' id="button-container">
              <button type="submit" className="save-button hover:text-green-500" id="submit-btn">
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <p>No se encontró el usuario.</p>
        )
      ) : (
        <p>No estás autenticado.</p>
      )}

      {message && <p className="text-center text-green-600 mt-4">{message}</p>}
    </div>
  );
};

export default ProfilePage;
