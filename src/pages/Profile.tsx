import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useAuth0 } from "@auth0/auth0-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  document: string;
  card: string;
  imageUrl: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    document: '',
    card: '',
    imageUrl: '',
    role: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Simula cargar los datos adicionales del usuario desde tu API
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
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setUserData({
        ...userData,
        email: user?.email || '',
        imageUrl: user?.picture || '',
      });
      getUserProfile();
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setMessage('Perfil actualizado con éxito');
      } else {
        setMessage(`Error al actualizar el perfil: ${await res.text()}`);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  if (isLoading || loading) {
    return <div>Cargando Perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl mb-5">Perfil del Usuario</h1>
      {isAuthenticated ? (
        <form className="grid grid-cols-2 gap-5" id="profile-form" onSubmit={handleSaveChanges}>
          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              className="form-input"
              placeholder="Nombre"
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              className="form-input"
              placeholder="Apellido"
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
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
            <label className="text-sm mb-1 text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              className="form-input"
              placeholder="Dirección"
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Documento</label>
            <input
              type="text"
              name="document"
              value={userData.document}
              className="form-input"
              placeholder="Documento de Identidad"
              onChange={(e) => setUserData({ ...userData, document: e.target.value })}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Tarjeta</label>
            <input
              type="text"
              name="card"
              value={userData.card}
              className="form-input"
              placeholder="Número de Tarjeta"
              onChange={(e) => setUserData({ ...userData, card: e.target.value })}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">URL de la Imagen de Perfil</label>
            <input
              type="text"
              name="imageUrl"
              value={userData.imageUrl}
              className="form-input"
              placeholder="URL de Imagen de Perfil"
              onChange={(e) => setUserData({ ...userData, imageUrl: e.target.value })}
            />
            {userData.imageUrl && (
              <img
                src={userData.imageUrl}
                alt="Foto de Perfil"
                className="profile-image"
              />
            )}
          </div>
            <div className='flex flex-col mb-3' id="button-container">
              <button type="submit" className="save-button hover:text-green-500" id="submit-btn">
                Guardar Cambios
              </button>
            </div>
        </form>
      ) : (
        <p>No estás autenticado.</p>
      )}

      {message && <p className="text-center text-green-600 mt-4">{message}</p>}
    </div>
  );
};

export default ProfilePage;
