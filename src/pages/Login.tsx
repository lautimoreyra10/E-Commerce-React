import React, { useState } from 'react';

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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h1>Iniciar sesión</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Previene el envío por defecto del formulario
          handleLogin();
        }}
      >
        <input
          type="text"
          id="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
      </form>

      {message && <p>{message}</p>} {/* Condicionalmente renderiza el mensaje */}
    </div>
  );
};

export default LoginPage;
