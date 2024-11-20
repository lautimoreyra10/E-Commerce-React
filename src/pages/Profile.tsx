import React, { useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
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
  const [redirect, setRedirect] = useState<boolean>(false);

  // Función para obtener el perfil del usuario
  const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRedirect(true);
      return;
    }

    try {
      const res = await fetch('https://commercial-api.vulktech.com/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Token inválido o expirado');

      const data = await res.json();
      setUserData(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      setRedirect(true);
    }
  };

  // Llama a la función para obtener los datos del usuario al montar el componente
  useEffect(() => {
    getUserProfile();
  }, []);

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
        setTimeout(() => {
          window.location.href = '/add-product'; // Redirige a otra página después de 5 segundos
        }, 5000);
      } else {
        setMessage(`Error al actualizar el perfil: ${await res.text()}`);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  if (redirect) {
    // Si el token no está presente o la autenticación falla, redirige
    window.location.href = '/login';
    return null; // No renderiza nada mientras redirige
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl mb-5">Perfil del Usuario</h1>
      {loading ? (
        <div>Cargando Perfil...</div>
      ) : (
        <form className="grid grid-cols-2 gap-5" id="profile-form" onSubmit={handleSaveChanges}>
          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              className="form-input"
              placeholder="Nombre"
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
            />
            {userData.imageUrl && (
              <img
                src={userData.imageUrl}
                alt="Foto de Perfil"
                className="profile-image"
              />
            )}
          </div>

          <div className="flex flex-col mb-3">
            <label className="text-sm mb-1 text-gray-700">Subir imagen de perfil</label>
            <input type="file" accept="image/*" id="image-upload" />
          </div>

          <button type="submit" className="save-button" id="submit-btn">
            Guardar Cambios
          </button>
        </form>
      )}

      {message && <p className="text-center text-green-600 mt-4">{message}</p>}
    </div>
  );
};

export default ProfilePage;
