"use client"
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import Message from "@/components/Message";
import Input from "@/components/Input";
import Boton from "@/components/Boton";

function ChatInterno() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idChat = searchParams.get("id_chat");

  const { socket } = useSocket();

  const [usuario, setUsuario] = useState(null);
  const [nombreChat, setNombreChat] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const finRef = useRef(null);

  // Usuario logueado + historial desde la base de datos
  useEffect(() => {
    let u = null;
    try {
      u = JSON.parse(localStorage.getItem("usuarios"));
    } catch {}
    if (!u?.id_usuario) {
      router.push("/login");
      return;
    }
    setUsuario(u);

    fetch(`http://localhost:4000/historialMensajes?chat=${idChat}`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setMensajes(data); });

    fetch(`http://localhost:4000/listachats?usuario=${u.id_usuario}`)
      .then((res) => res.json())
      .then((data) => {
        const chat = Array.isArray(data) && data.find((c) => String(c.id_chat) === String(idChat));
        if (chat) setNombreChat(chat.nombre || "Chat");
      });
  }, [idChat]);

  // Me uno a la sala del chat y escucho los mensajes nuevos
  useEffect(() => {
    if (!socket) return;

    const unirse = () => socket.emit("unirseChat", idChat);
    const recibir = (mensaje) => {
      if (String(mensaje.id_chat) === String(idChat)) {
        setMensajes((actuales) => [...actuales, mensaje]);
      }
    };

    if (socket.connected) unirse();
    socket.on("connect", unirse);
    socket.on("nuevoMensaje", recibir);

    return () => {
      socket.emit("salirChat", idChat);
      socket.off("connect", unirse);
      socket.off("nuevoMensaje", recibir);
    };
  }, [socket, idChat]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (finRef.current) finRef.current.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function enviar() {
    if (!socket || !usuario || texto.trim() === "") return;
    socket.emit("enviarMensaje", {
      id_usuario: usuario.id_usuario,
      id_chat: idChat,
      texto: texto.trim(),
    });
    setTexto("");
  }

  function teclado(event) {
    if (event.key === "Enter") enviar();
  }

  return (
    <div className="pantalla-chat">
      <header className="chat-header">
        <Boton onClick={() => router.push("/")} texto="← Volver" />
        <h2>{nombreChat}</h2>
      </header>

      <div className="mensajes">
        {mensajes.map((m) => (
          <Message
            key={m.id_mensaje}
            texto={m.texto}
            nombre={m.nombre}
            fecha={m.fecha}
            esMio={String(m.id_usuario) === String(usuario?.id_usuario)}
          />
        ))}
        <div ref={finRef}></div>
      </div>

      <div className="barra-entrada">
        <Input
          tipo="text"
          placeholder="Escribí un mensaje"
          valor={texto}
          onChange={setTexto}
          onKeyDown={teclado}
        />
        <Boton onClick={enviar} texto="Enviar" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ChatInterno />
    </Suspense>
  );
}
