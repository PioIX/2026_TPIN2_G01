export default function Boton({onClick, texto}) {
  return (
    <button onClick={onClick}>{texto}</button>
  );
}
