"use client"

import { useState } from "react";

export default function LoginPage() {

  const [Validacion, setValidacion] = useState();

  const Vali = () => {
    fetch("http://localhost:4000/UsuariosW")
      .then(res => res.json())
      .then(data => setValidacion(data));
  };
  console.log(Validacion)
  return (<>
    <p>{Validacion}</p>
  </>);
}