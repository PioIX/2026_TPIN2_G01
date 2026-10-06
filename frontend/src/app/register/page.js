"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Boton from "@/components/Boton";
import Input from "@/components/Input";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [foto, setFoto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const Registro = () => {
    if (!nombre.trim() || !mail.trim() || !contraseña.trim()) {
      setMensaje("Completá nombre, mail y contraseña");
      return;
    }

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
        if (data.ok) {
          router.push("/login");
        }
      })
      .catch(error => {
        console.log(error);
        setMensaje("Error al conectar con el servidor");
      });
  };

  return (
    <div className="formulario">

      <h1>Registrarse</h1>

      <Input
        tipo="text"
        placeholder="Nombre"
        valor={nombre}
        onChange={setNombre}
      />

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

      <Input
        tipo="text"
        placeholder="Foto (URL o ruta, ej: /usuarios/guille.svg)"
        valor={foto}
        onChange={setFoto}
      />

      <Boton
        onClick={Registro}
        texto="Registrarse"
      />

      <p>{mensaje}</p>

      <p>¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link></p>

    </div>
  );
}
