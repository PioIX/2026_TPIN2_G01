// Mismo componente para el mensaje enviado por uno mismo y para el recibido: cambia el estilo.
export default function Message({ texto, nombre, fecha, esMio }) {
  const hora = fecha
    ? new Date(fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`mensaje-fila ${esMio ? "enviado" : "recibido"}`}>
      <div className="burbuja">
        {!esMio && <strong className="autor">{nombre}</strong>}
        <p>{texto}</p>
        <small>{hora}</small>
      </div>
    </div>
  );
}
