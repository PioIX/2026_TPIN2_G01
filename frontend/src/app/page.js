"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ChatList from "@/components/ChatList"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import styles from "./page.module.css"

const API = "http://localhost:4000";

function obtenerUsuarioActual() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuarios"));
    return usuario?.id_usuario || usuario?.id || null;
  } catch {
    return null;
  }
}

export default function Home() {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState(null);
  const [errorPopup, setErrorPopup] = useState("");
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mail, setMail] = useState("");
  const [grupoNombre, setGrupoNombre] = useState("");
  const [grupoMails, setGrupoMails] = useState("");
  const [grupoFoto, setGrupoFoto] = useState("");

  useEffect(() => {
    const id = obtenerUsuarioActual();
    setUsuarioId(id);

    if (id) {
      cargarChats(id);
    } else {
      // No hay usuario logueado: vuelvo al login
      router.push("/login");
    }
  }, []);

  async function cargarChats(id = usuarioId) {
    if (!id) return;

    try {
      const respuesta = await fetch(
        `${API}/listachats?usuario=${id}`
      );

      const datos = await respuesta.json();

      if (!respuesta.ok || datos.error) {
        setError(datos.error || "No se pudieron cargar los chats.");
        return;
      }

      setChats(datos);
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }

  async function crearChat() {
    setErrorPopup("");
    setMensaje("");

    if (!mail.trim()) {
      setErrorPopup("Ingresá un mail.");
      return;
    }

    try {
      const respuesta = await fetch(`${API}/crearChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuarioId,
          mail: mail.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok || datos.error) {
        setErrorPopup(datos.error || "No se pudo crear el chat.");
        return;
      }

      setMail("");
      setMensaje("Chat creado correctamente.");

      await cargarChats();
      return true;
    } catch {
      setErrorPopup("No se pudo conectar con el servidor.");
    }
  }

  async function crearGrupo() {
    setErrorPopup("");
    setMensaje("");

    const mails = grupoMails
      .split(/[\n,;]+/)
      .map((m) => m.trim())
      .filter(Boolean);

    if (!grupoNombre.trim()) {
      setErrorPopup("Ingresá un nombre para el grupo.");
      return;
    }

    if (mails.length === 0) {
      setErrorPopup("Ingresá al menos un mail.");
      return;
    }

    try {
      const respuesta = await fetch(`${API}/crearChatGrupal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuarioId,
          mails,
          nombre: grupoNombre.trim(),
          foto: grupoFoto.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok || datos.error) {
        setErrorPopup(datos.error || "No se pudo crear el grupo.");
        return;
      }

      setGrupoNombre("");
      setGrupoMails("");
      setGrupoFoto("");

      setMensaje("Grupo creado correctamente.");

      await cargarChats();
      return true;
    } catch {
      setErrorPopup("No se pudo conectar con el servidor.");
    }
  }

  function fotoChat(chat) {
    return chat.foto || "/default-chat.svg";
  }

  return (
    <main className={styles.contenedor}>
      <section className={styles.panel}>

        <header className={styles.header}>
          <div>
            <h1>Chats</h1>
            <p>Conversaciones asignadas a tu usuario</p>
          </div>

          <div className={styles.botones}>

            <Popup
              modal
              nested
              onOpen={() => { setErrorPopup(""); setMensaje(""); }}
              trigger={
                <button className={styles.boton}>
                  Nuevo chat
                </button>
              }
            >
              {(close) => (
                <div className={styles.popup}>

                  <h2>Nuevo chat</h2>

                  {errorPopup && <p className={styles.error}>{errorPopup}</p>}

                  <input
                    type="email"
                    placeholder="Mail del usuario"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />

                  <div className={styles.acciones}>
                    <button onClick={() => crearChat().then((ok) => ok && close())}>
                      Crear
                    </button>

                    <button
                      className={styles.cancelar}
                      onClick={close}
                    >
                      Cancelar
                    </button>
                  </div>

                </div>
              )}
            </Popup>

            <Popup
              modal
              nested
              onOpen={() => { setErrorPopup(""); setMensaje(""); }}
              trigger={
                <button className={styles.boton}>
                  Nuevo grupo
                </button>
              }
            >
              {(close) => (
                <div className={styles.popup}>

                  <h2>Nuevo grupo</h2>

                  {errorPopup && <p className={styles.error}>{errorPopup}</p>}

                  <input
                    type="text"
                    placeholder="Nombre del grupo"
                    value={grupoNombre}
                    onChange={(e) =>
                      setGrupoNombre(e.target.value)
                    }
                  />

                  <textarea
                    placeholder={
                      "Mails de los usuarios\n" +
                      "Ej: usuario1@mail.com, usuario2@mail.com"
                    }
                    value={grupoMails}
                    onChange={(e) =>
                      setGrupoMails(e.target.value)
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const archivo = e.target.files?.[0];

                      if (!archivo) {
                        setGrupoFoto("");
                        return;
                      }

                      const lector = new FileReader();

                      lector.onload = () =>
                        setGrupoFoto(lector.result);

                      lector.readAsDataURL(archivo);
                    }}
                  />

                  <div className={styles.acciones}>

                    <button onClick={() => crearGrupo().then((ok) => ok && close())}>
                      Crear grupo
                    </button>

                    <button
                      className={styles.cancelar}
                      onClick={close}
                    >
                      Cancelar
                    </button>

                  </div>

                </div>
              )}
            </Popup>

          </div>
        </header>


        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        {mensaje && (
          <p className={styles.mensaje}>
            {mensaje}
          </p>
        )}

        <div className={styles.lista}>
          <ChatList
            chats={chats}
            onSelect={(id) => router.push(`/chat?id_chat=${id}`)}
          />
        </div>
      </section>
    </main>
  );
}