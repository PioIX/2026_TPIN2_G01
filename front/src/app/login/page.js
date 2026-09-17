"use client"

import { useState } from "react";

export default function LoginPage() {

  const [Validacion, setValidacion] = useState();

  const Vali = () => {
    fetch("http://localhost:4000/notas")
      .then(res => res.json())
      .then(data => setValidacion(data));
  };
  return (<>
    <p>{Validacion}</p>
  </>);
}