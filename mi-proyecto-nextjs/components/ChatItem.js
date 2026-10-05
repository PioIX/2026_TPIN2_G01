"use client";
import { useState } from "react";
import { DEFAULT_AVATAR } from "@/config";

// Se usa igual para contactos (chat individual) y para grupos.
export default function ChatItem({ chat, activo = false, onClick }) {
  const [fotoRota, setFotoRota] = useState(false);
  const src = !chat.foto || fotoRota ? DEFAULT_AVATAR : chat.foto;

  return (
    <li className={`chat-item ${activo ? "activo" : ""}`} onClick={onClick}>
      <img className="avatar" src={src} alt={chat.nombre || "Chat"} onError={() => setFotoRota(true)} />
      <div className="chat-info">
        <strong>{chat.nombre || "Sin nombre"}</strong>
        {chat.es_grupo ? <span className="badge">Grupo</span> : null}
        {chat.descripcion ? <small>{chat.descripcion}</small> : null}
      </div>
    </li>
  );
}