import React, { useState } from "react";
import { redirect } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async () => {
    let message = "";
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message = "Por favor, introduce un correo electrónico válido.";
      setMessage(message);
      return;
    }

    // Validación de contraseña
    if (password.length < 6) {
      message = 'La contraseña debe tener al menos 6 caracteres.';
      setMessage(message);
      return;
    }

    // Llamada a la API para registrar
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        message = "Registro exitoso. Redirigiendo...";
        setMessage(message);

        setTimeout(() => {
          redirect("/login"); // Redirige a la página de login después de 2 segundos
        }, 2000);
      } else {
        const error = await res.text();
        message = `Error: ${error}`;
        setMessage(message);
      }
    } catch (error) {
      message = "Error en la conexión";
      setMessage(message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <div className="header">
        <h1>Registrate</h1>
      </div>
      <form
        id="registerForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <input
          type="text"
          id="email"
          placeholder="Correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input mb-4"
        />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input mb-4"
        />
        <input
          type="submit"
          value="Registrar"
          id="registerButton"
          className="btn-submit"
        />
      </form>

      <div id="message" className="message">
        {message && <p>{message}</p>}
      </div>

      <p>
        ¿Ya tenés cuenta? <a href="/login">Ingresar aquí</a>
      </p>
    </div>
  );
};

export default RegisterPage;
