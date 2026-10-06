"use client"
import { useState } from "react";
import Boton from "@/components/Boton";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [foto, setFoto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const Registro = () => {
    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: nombre,
        mail: mail,
        contraseña: contraseña,
        foto: foto
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

      <h1>Registrarse</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

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

      <input
        type="text"
        placeholder="Foto"
        value={foto}
        onChange={(e) => setFoto(e.target.value)}
      />

      <Boton
        onClick={Registro}
        texto="Registrarse"
      />

      <p>{mensaje}</p>

    </div>
  );
}