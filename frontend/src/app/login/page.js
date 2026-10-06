"use client"

import { useState } from "react";
import Boton from "@/components/Boton";

export default function loginPage() {
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const Login = () => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mail: mail,
        contraseña: contraseña
      })
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message);
      })
      .catch(error => {
        console.log(error);
        setMensaje("Error al conectar con el servidor");
      });
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Mail"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
      />

      <Boton
        onClick={Login}
        texto="Iniciar sesión"
      />

      <p>{mensaje}</p>

    </div>
  );
}