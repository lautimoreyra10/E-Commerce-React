import React, { useState } from 'react';
import NavBar from '../components/NavBar';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://commercial-api.vulktech.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setMessage('Login exitoso');
        window.location.href = '/'; // Redirige a la página principal
      } else {
        const error = await res.text();
        setMessage(`Error: ${error}`);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1>Iniciar sesión</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Previene el envío por defecto del formulario
          handleLogin();
        }}
      >
        <input 
          className='m-4 p-2 border border-gray-300 rounded-md'
          type="text"
          id="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='m-4 p-2 border border-gray-300 rounded-md'
          type="password"
          id="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button className ='m-4 p-2 bg-blue-500 text-white rounded-md' type="submit">Iniciar sesión</button>
      {message && <p>{message}</p>} {/* Condicionalmente renderiza el mensaje */}
    </div>
  );
};

export default LoginPage;
