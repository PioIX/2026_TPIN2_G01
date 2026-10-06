"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Boton from "@/components/Boton";
import Input from "@/components/Input";

export default function LoginPage() {
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

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
        if (data.existe) {
          // Guardo el usuario logueado y voy a la lista de chats
          localStorage.setItem("usuarios", JSON.stringify(data.usuario));
          router.push("/");
        }
      })
      .catch(error => {
        console.log(error);
        setMensaje("Error al conectar con el servidor");
      });
  };

  return (
    <div className="formulario">
      <h1>Iniciar sesión</h1>

      <Input
        tipo="email"
        placeholder="Mail"
        valor={mail}
        onChange={setMail}
      />

      <Input
        tipo="password"
        placeholder="Contraseña"
        valor={contraseña}
        onChange={setContraseña}
      />

      <Boton
        onClick={Login}
        texto="Iniciar sesión"
      />

      <p>{mensaje}</p>

      <p>¿No tenés cuenta? <Link href="/register">Registrate</Link></p>

    </div>
  );
}
